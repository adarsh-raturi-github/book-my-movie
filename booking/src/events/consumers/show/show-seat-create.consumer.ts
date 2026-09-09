import {
  EventEnvelope,
  IEventConsumer,
  DomainEventTypes,
  KafkaTopic,
  IShowSeatCreateEventData,
  RetryableError,
} from "@adarsh-tickets/shared";
import { prisma } from "../../../prisma.client";

export class ShowSeatCreateConsumer implements IEventConsumer<IShowSeatCreateEventData> {
  topic = KafkaTopic.SHOW_TOPIC;
  eventType = DomainEventTypes.SHOW_SEAT_CREATED;

  async onMessage(
    event: EventEnvelope<IShowSeatCreateEventData>,
  ): Promise<void> {
    const {
      showId,
      id,
      seatId,
      price,
      status,
      bookingId,
      lockedUntil,
      entityVersion,
    } = event.payload;
    try {
      // idempotency
      const existing = await prisma.showSeatProjection.findUnique({
        where: {
          id,
        },
      });
      if (existing) {
        // Already projected. Treat duplicate delivery as success.
        return;
      }
      await prisma.showSeatProjection.create({
        data: {
          id,
          showId,
          seatId,
          price,
          status,
          bookingId,
          lockedUntil,
          entityVersion,
        },
      });
    } catch (err) {
      console.error(`Failed to create ShowSeat projection: ${id}`, err);

      throw new RetryableError(`Failed to create ShowSeat projection: ${id}`);
    }
  }
}
