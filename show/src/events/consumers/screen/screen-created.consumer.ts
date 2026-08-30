import {
  EventEnvelope,
  IEventConsumer,
  IScreenCreateEventData,
  DomainEventTypes,
  KafkaTopic,
  ScreenStatusEnum,
  ScreenTypeEnum,
} from "@adarsh-tickets/shared";
import { prisma } from "../../../prisma.client";
import { PrismaErrorMapper } from "../../../services/prisma-error.mapper";
export class ScreenCreatedConsumer implements IEventConsumer<IScreenCreateEventData> {
  topic = KafkaTopic.THEATER_TOPIC;
  eventType = DomainEventTypes.SCREEN_CREATED;

  async onMessage(event: EventEnvelope<IScreenCreateEventData>): Promise<void> {
    console.log("Screen created Listener");

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
