import {
  EventEnvelope,
  IEventConsumer,
  DomainEventTypes,
  KafkaTopic,
  IShowSeatCreateEventData,
  RetryableError,
  IShowSeatDeleteEventData,
} from "@adarsh-tickets/shared";
import { prisma } from "../../../prisma.client";

export class ShowSeatDeleteConsumer implements IEventConsumer<IShowSeatDeleteEventData> {
  topic = KafkaTopic.SHOW_TOPIC;
  eventType = DomainEventTypes.SHOW_SEAT_DELETED;

  async onMessage(
    event: EventEnvelope<IShowSeatDeleteEventData>,
  ): Promise<void> {
    const { id, entityVersion } = event.payload;
    try {
      // idempotency
      const existingShowSeat = await prisma.showSeatProjection.findUnique({
        where: {
          id,
        },
      });
      if (!existingShowSeat) {
        // Already projected. Treat duplicate delivery as success.
        return;
      }

      if (entityVersion <= existingShowSeat.entityVersion) {
        return;
      }

      if (entityVersion !== existingShowSeat.entityVersion + 1) {
        throw new RetryableError(
          `Expected version ${existingShowSeat.entityVersion + 1}, received ${entityVersion} for screen ${id}`,
        );
      }
      await prisma.showSeatProjection.delete({
        where: {
          id,
        },
      });
    } catch (err) {
      console.error(`Failed to delete ShowSeat projection: ${id}`, err);
      throw new RetryableError(`Failed to delete ShowSeat projection: ${id}`);
    }
  }
}
