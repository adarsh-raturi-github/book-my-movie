export interface IBookingCreatedEventData {
  bookingId: string;
  showId: string;
  seatIds: string[];
  userId: string;
  totalAmount: number;
  expiresAt: string; // ISO-8601
  entityVersion: number;
}

export interface IBookingConfirmedEventData {
  bookingId: string;
  userId: string;
  showId: string;
  seatIds: string[];
  entityVersion: number;
}

export interface IBookingCancelledEventData {
  bookingId: string;
  showId: string;
  seatIds: string[];
  entityVersion: number;
}
