import { useState, useCallback } from "react";
import type { Seat, SeatBooking } from "../types/seat";
import {
  calculatePrice,
  validateSeatSelection,
  generateSeatLockId,
} from "../utils/seatUtils";

interface UseSeatSelectionOptions {
  movieId: string;
  screenId: string;
  maxSeats?: number;
}

export function useSeatSelection(options: UseSeatSelectionOptions) {
  const { movieId, screenId, maxSeats = 10 } = options;
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lockId, setLockId] = useState<string>("");

  const toggleSeat = useCallback(
    (seat: Seat) => {
      setError(null);

      setSelectedSeats((prev) => {
        const isSelected = prev.find((s) => s.id === seat.id);

        if (isSelected) {
          // Deselect
          return prev.filter((s) => s.id !== seat.id);
        } else {
          // Select
          if (prev.length >= maxSeats) {
            setError(`Maximum ${maxSeats} seats can be selected`);
            return prev;
          }
          return [...prev, seat];
        }
      });
    },
    [maxSeats],
  );

  const clearSelection = useCallback(() => {
    setSelectedSeats([]);
    setError(null);
    setLockId("");
  }, []);

  const processBooking = useCallback(async () => {
    if (!validateSeatSelection(selectedSeats, maxSeats)) {
      setError("Invalid seat selection");
      return null;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Simulate concurrent booking request
      // In production, this would be an actual API call
      const newLockId = generateSeatLockId();
      setLockId(newLockId);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const booking: SeatBooking = {
        id: `booking_${Date.now()}`,
        movieId,
        userId: "current_user", // Replace with actual user ID
        seats: selectedSeats,
        totalPrice: calculatePrice(selectedSeats),
        status: "pending",
        timestamp: new Date().toISOString(),
      };

      return booking;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed");
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [selectedSeats, movieId, maxSeats]);

  const getStats = useCallback(() => {
    return {
      selectedCount: selectedSeats.length,
      totalPrice: calculatePrice(selectedSeats),
      maxSeats,
    };
  }, [selectedSeats, maxSeats]);

  return {
    selectedSeats,
    toggleSeat,
    clearSelection,
    processBooking,
    getStats,
    isProcessing,
    error,
    lockId,
  };
}
