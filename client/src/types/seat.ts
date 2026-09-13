export type SeatStatus = "available" | "selected" | "booked" | "blocked";

export interface Seat {
  id: string;
  row: string;
  number: number;
  status: SeatStatus;
  category: SeatCategory;
  price: number;
}

export type SeatCategory = "premium" | "standard" | "economy";

export interface SeatRow {
  row: string;
  seats: Seat[];
}

export interface SeatBooking {
  id: string;
  movieId: string;
  userId: string;
  seats: Seat[];
  totalPrice: number;
  status: "pending" | "confirmed" | "cancelled";
  timestamp: string;
}

export interface SeatLayoutProps {
  movieId: string;
  screenId: string;
  seats: Seat[];
  onSeatsSelect: (seats: Seat[]) => void;
  onBookingComplete?: (booking: SeatBooking) => void;
}

export interface ConcurrentBookingRequest {
  movieId: string;
  screenId: string;
  seatIds: string[];
  userId: string;
  lockDuration: number; // in seconds
}

export interface SeatLock {
  seatId: string;
  userId: string;
  lockedAt: string;
  expiresAt: string;
}
