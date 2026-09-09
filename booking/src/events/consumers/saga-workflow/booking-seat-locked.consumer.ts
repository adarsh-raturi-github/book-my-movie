import {
  BookingEventTypes,
  EventEnvelope,
  IEventConsumer,
  IScreenCreateEventData,
  ISeatsLockedEventData,
  DomainEventTypes,
  KafkaTopic,
  ScreenStatusEnum,
  ScreenTypeEnum,
} from "@adarsh-tickets/shared";
import { prisma } from "../../../prisma.client";

export class SeatLockedConsumer implements IEventConsumer<ISeatsLockedEventData> {
  topic = KafkaTopic.BOOKING_TOPIC;
  eventType = BookingEventTypes.SEAT_LOCKED;

  async onMessage(event: EventEnvelope<ISeatsLockedEventData>): Promise<void> {
    // const { bookingId, showId, seatIds, lockExpiresAt } = event;
    try {
      // idempotency
      console.log("Seat locked");
    } catch (err) {
      // PrismaErrorMapper.map(err);
    }
  }
}
