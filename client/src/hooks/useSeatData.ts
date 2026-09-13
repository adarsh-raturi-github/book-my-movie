import { useState, useEffect } from "react";
import type { Seat } from "../types/seat";
import { generateSeats } from "../utils/seatUtils";

export function useSeatData(
  screenId: string,
  rows: number = 9,
  seatsPerRow: number = 12,
) {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setLoading(true);
      // In production, fetch from API based on screenId
      const generatedSeats = generateSeats(rows, seatsPerRow);
      setSeats(generatedSeats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load seats");
    } finally {
      setLoading(false);
    }
  }, [screenId, rows, seatsPerRow]);

  return { seats, loading, error, setSeatStatus };

  function setSeatStatus(seatId: string, status: Seat["status"]) {
    setSeats((prev) =>
      prev.map((seat) => (seat.id === seatId ? { ...seat, status } : seat)),
    );
  }
}
