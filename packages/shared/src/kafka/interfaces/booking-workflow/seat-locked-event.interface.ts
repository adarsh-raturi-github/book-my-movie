export enum SeatLockFailureReason {
  SEAT_ALREADY_BOOKED,
  SEAT_ALREADY_LOCKED,
  SEAT_NOT_FOUND,
  SHOW_NOT_FOUND,
}
export interface ISeatsLockedEventData {
  bookingId: string;
  showId: string;
  seatIds: string[];
  lockExpiresAt: string;
}

export interface ISeatsLockFailEventData {
  bookingId: string;
  showId: string;
  seatIds: string[];
  reason: SeatLockFailureReason;
}
