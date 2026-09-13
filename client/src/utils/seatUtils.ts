import type { Seat, SeatStatus, SeatCategory } from "../types/seat";

export function generateSeats(rows: number, seatsPerRow: number): Seat[] {
  const seats: Seat[] = [];
  const categories: SeatCategory[] = ["premium", "standard", "economy"];
  const prices = { premium: 250, standard: 200, economy: 150 };

  for (let i = 0; i < rows; i++) {
    const row = String.fromCharCode(65 + i); // A, B, C, etc.

    for (let j = 1; j <= seatsPerRow; j++) {
      // Premium seats: middle rows, middle seats
      // Standard seats: outer rows, middle seats
      // Economy seats: all rows, outer seats
      let category: SeatCategory = "economy";

      if (j > 4 && j < seatsPerRow - 3) {
        if (i >= rows / 3 && i < (rows * 2) / 3) {
          category = "premium";
        } else {
          category = "standard";
        }
      }

      seats.push({
        id: `${row}-${j}`,
        row,
        number: j,
        status: Math.random() > 0.85 ? "booked" : "available",
        category,
        price: prices[category],
      });
    }
  }

  return seats;
}

export function groupSeatsByRow(seats: Seat[]): Map<string, Seat[]> {
  const grouped = new Map<string, Seat[]>();

  seats.forEach((seat) => {
    if (!grouped.has(seat.row)) {
      grouped.set(seat.row, []);
    }
    grouped.get(seat.row)?.push(seat);
  });

  // Sort by row
  const sortedMap = new Map(
    [...grouped].sort((a, b) => a[0].localeCompare(b[0])),
  );
  return sortedMap;
}

export function groupSeatsByCategory(seats: Seat[]): Map<SeatCategory, Seat[]> {
  const grouped = new Map<SeatCategory, Seat[]>();

  seats.forEach((seat) => {
    if (!grouped.has(seat.category)) {
      grouped.set(seat.category, []);
    }
    grouped.get(seat.category)?.push(seat);
  });

  return grouped;
}

export function calculatePrice(seats: Seat[]): number {
  return seats.reduce((total, seat) => total + seat.price, 0);
}

export function getAvailableSeatCount(seats: Seat[]): number {
  return seats.filter(
    (seat) => seat.status === "available" || seat.status === "selected",
  ).length;
}

export function getBookedSeatCount(seats: Seat[]): number {
  return seats.filter((seat) => seat.status === "booked").length;
}

export function validateSeatSelection(
  seats: Seat[],
  maxSeats: number = 10,
): boolean {
  return (
    seats.length > 0 &&
    seats.length <= maxSeats &&
    seats.every(
      (seat) => seat.status === "available" || seat.status === "selected",
    )
  );
}

export function getSeatStatusColor(status: SeatStatus): string {
  const colors: Record<SeatStatus, string> = {
    available: "#6366f1",
    selected: "#ec4899",
    booked: "#64748b",
    blocked: "#991b1b",
  };
  return colors[status];
}

export function getSeatCategoryLabel(category: SeatCategory): string {
  const labels: Record<SeatCategory, string> = {
    premium: "Premium - Best View",
    standard: "Standard - Good View",
    economy: "Economy - Regular View",
  };
  return labels[category];
}

export function generateSeatLockId(): string {
  return `lock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Concurrent booking utilities
export function simulateConcurrentBooking(
  seatId: string,
  userId: string,
): { success: boolean; message: string } {
  // In production, this would be a server-side operation
  // For demo: random success/failure
  const success = Math.random() > 0.1; // 90% success rate

  return {
    success,
    message: success
      ? `Seat ${seatId} booked for user ${userId}`
      : `Seat ${seatId} was just booked by another user`,
  };
}

export function getOptimisticSeatUpdate(
  seats: Seat[],
  selectedSeatIds: string[],
): Seat[] {
  return seats.map((seat) =>
    selectedSeatIds.includes(seat.id) && seat.status === "available"
      ? { ...seat, status: "selected" as const }
      : seat,
  );
}

export function rollbackSeatSelection(
  seats: Seat[],
  selectedSeatIds: string[],
): Seat[] {
  return seats.map((seat) =>
    selectedSeatIds.includes(seat.id) && seat.status === "selected"
      ? { ...seat, status: "available" as const }
      : seat,
  );
}
