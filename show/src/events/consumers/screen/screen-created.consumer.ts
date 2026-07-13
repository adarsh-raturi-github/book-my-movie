import {
  EventEnvelope,
  IEventConsumer,
  IScreenCreateEventData,
  KafkaEventTypes,
  KafkaTopic,
  ScreenStatusEnum,
  ScreenTypeEnum,
} from "@adarsh-tickets/shared";
import { prisma } from "../../../prisma.client";
import { stat } from "node:fs";
import { PrismaErrorMapper } from "../../../services/prisma-error.mapper";
export class MovieCreatedConsumer implements IEventConsumer<IScreenCreateEventData> {
  topic = KafkaTopic.THEATER_TOPIC;
  eventType = KafkaEventTypes.SCREEN_CREATED;

  async onMessage(event: EventEnvelope<IScreenCreateEventData>): Promise<void> {
    try {
      const { entityVersion, id, theaterId, name, type, status } =
        event.payload;
      // find added what if consumer create project and before commit down
      const existing = await prisma.screenProjection.findUnique({
        where: { id },
      });

      if (existing) {
        return;
      }
      await prisma.screenProjection.create({
        data: {
          entityVersion,
          id,
          theaterId,
          name,
          type,
          status,
        },
      });
    } catch (err) {
      PrismaErrorMapper.map(err);
    }
  }
}
