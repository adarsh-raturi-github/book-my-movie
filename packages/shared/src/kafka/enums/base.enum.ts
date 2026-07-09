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
  SHOW = "SHOW",
  SEAT = "SEAT",
}

export enum KafkaEventTypes {
  // MOVIE_CREATED = "movie-created",
  // MOVIE_UPDATED = "movie-updated",
  // MOVIE_DELETED = "movie-deleted",

  THEATER_CREATED = "theater-created",
  THEATER_UPDATED = "theater-updated",
  THEATER_DELETED = "theater-deleted",

  SCREEN_CREATED = "screen-created",
  SCREEN_UPDATED = "screen-updated",
  SCREEN_DELETED = "screen-deleted",

  // SHOW_CREATED = "show-created",
  // SHOW_UPDATED = "show-updated",
  // SHOW_DELETED = "show-deleted",

  SEAT_CREATED = "seat-created",
  SEAT_UPDATED = "seat-updated",
  SEAT_DELETED = "seat-deleted",

  /**
   * PAYMENT_INITIATED

PAYMENT_COMPLETED

PAYMENT_FAILED

PAYMENT_REFUNDED


BOOKING_CREATED

BOOKING_CONFIRMED

BOOKING_CANCELLED

BOOKING_EXPIRED



SHOW_CREATED

SHOW_UPDATED

SHOW_CANCELLED

SHOW_STARTED

SHOW_COMPLETED
   */
}
