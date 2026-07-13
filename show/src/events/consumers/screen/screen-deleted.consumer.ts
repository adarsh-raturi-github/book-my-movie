import {
  EventEnvelope,
  IEventConsumer,
  IScreenCreateEventData,
  IScreenDeleteEventData,
  KafkaEventTypes,
  KafkaTopic,
  RetryableError,
} from "@adarsh-tickets/shared";
import { prisma } from "../../../prisma.client";
import { PrismaErrorMapper } from "../../../services/prisma-error.mapper";
export class ScreenDeletedConsumer implements IEventConsumer<IScreenDeleteEventData> {
  topic = KafkaTopic.THEATER_TOPIC;
  eventType = KafkaEventTypes.SCREEN_DELETED;

  async onMessage(event: EventEnvelope<IScreenDeleteEventData>): Promise<void> {
    try {
      const { entityVersion, id } = event.payload;
      const screen = await prisma.screenProjection.findUnique({
        where: {
          id,
        },
      });
      if (!screen) {
        return;
      }

      if (entityVersion <= screen.entityVersion) {
        return;
      }
      if (entityVersion !== screen.entityVersion + 1) {
        throw new RetryableError(
          `Expected version ${screen.entityVersion + 1}, received ${entityVersion} for screen ${id}`,
        );
      }
      await prisma.screenProjection.delete({
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
