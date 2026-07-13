import {
  EventEnvelope,
  IEventConsumer,
  IScreenUpdateEventData,
  KafkaEventTypes,
  KafkaTopic,
  NonRetryableError,
  RetryableError,
} from "@adarsh-tickets/shared";
import { prisma } from "../../../prisma.client";
import { PrismaErrorMapper } from "../../../services/prisma-error.mapper";
export class ScreenUpdatedConsumer implements IEventConsumer<IScreenUpdateEventData> {
  topic = KafkaTopic.THEATER_TOPIC;
  eventType = KafkaEventTypes.SCREEN_UPDATED;

  async onMessage(event: EventEnvelope<IScreenUpdateEventData>): Promise<void> {
    const { entityVersion, id, name, type, status } = event.payload;

    try {
      const screen = await prisma.screenProjection.findUnique({
        where: {
          id,
        },
      });
      if (!screen) {
        throw new RetryableError(
          `Screen ${id} not found. Waiting for SCREEN_CREATED event.`,
        );
      }
      // Handler contract:
      // - Return normally => message processed successfully; offset will be committed.
      // - Throw RetryableError => retry according to retry policy.
      // - Throw NonRetryableError => send to DLT and commit.
      // - Throw any other Error => considered unexpected; message is not committed.
      if (entityVersion <= screen.entityVersion) {
        return;
      }

      if (entityVersion !== screen.entityVersion + 1) {
        throw new RetryableError("Gap detected in event stream");
      }

      await prisma.screenProjection.update({
        data: {
          entityVersion,
          name,
          type,
          status,
        },
        where: {
          id,
          entityVersion: entityVersion - 1,
        },
      });
    } catch (err) {
      PrismaErrorMapper.map(err);
    }
  }
}
