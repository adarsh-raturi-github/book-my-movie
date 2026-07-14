export enum KafkaTopic {
  MOVIE_TOPIC = "movie-topic",
  THEATER_TOPIC = "theater-topic",
  SHOW_TOPIC = "show-topic",
  PAYMENT_TOPIC = "payment-topic",
  BOOKING_TOPIC = "booking-topic",
}

export enum KafkaAggregateType {
  MOVIE = "MOVIE",
  SCREEN = "SCREEN",
  THEATER = "THEATER",
  BOOKING = "BOOKING",
  SHOW = "SHOW",
  SEAT = "SEAT",
}

export enum KafkaEventTypes {
  MOVIE_CREATED = "movie-created",
  MOVIE_UPDATED = "movie-updated",
  MOVIE_DELETED = "movie-deleted",

  THEATER_CREATED = "theater-created",
  THEATER_UPDATED = "theater-updated",
  THEATER_DELETED = "theater-deleted",

  SCREEN_CREATED = "screen-created",
  SCREEN_UPDATED = "screen-updated",
  SCREEN_DELETED = "screen-deleted",

  SHOW_SEAT_CREATED = "show-seat-created",
  SHOW_SEAT_UPDATED = "show-seat-updated",
  SHOW_SEAT_DELETED = "show-seat-deleted",

  SEAT_CREATED = "seat-created",
  SEAT_UPDATED = "seat-updated",
  SEAT_DELETED = "seat-deleted",
}

export enum BookingEventTypes {
  /** -----------------these are saga related events------------------------- */
  SEAT_LOCKED = "seat-locked",
  SEAT_LOCK_FAILED = "seat-lock-failed",
  SEAT_DELETED = "seat-deleted",

  BOOKING_CREATED = "booking-created",
  BOOKING_CONFIRMED = "booking-confirmed",
  BOOKING_CANCELLED = "booking-cancelled",

  PAYMENT_STARTED = "payment-started",
  PAYMENT_SUCCEEDED = "payment-succeeded",
  PAYMENT_FAILED = "payment-failed",
  /** -------------------------------------------------------------------------- */
}
