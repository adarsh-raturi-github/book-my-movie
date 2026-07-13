import {
  EventEnvelope,
  IEventConsumer,
  IScreenCreateEventData,
  KafkaEventTypes,
  KafkaTopic,
  ScreenStatusEnum,
  ScreenTypeEnum,
  SeatStatusEnum,
} from "@adarsh-tickets/shared";
import { prisma } from "../../../prisma.client";
import { stat } from "node:fs";
import { PrismaErrorMapper } from "../../../services/prisma-error.mapper";
import { SeatStatus } from "@prisma/client";
import { ShowSeatStatusEnum } from "../../../enums";
export class BookingCreatedConsumer implements IEventConsumer<IBookingCreateEventData> {
  topic = KafkaTopic.BOOKING_TOPIC;
  eventType = KafkaEventTypes.BOOKING_CREATED;

  async onMessage(
    event: EventEnvelope<IBookingCreateEventData>,
  ): Promise<void> {
    try {
      const {
        id,
        seatIds,
        showId,
        entityVersion,
        expiresAt,
        totalAmount,
        userId,
      } = event.payload;

      const alreadyLocked = await prisma.showSeat.count({
        where: {
          bookingId: event.payload.id,
          showId: event.payload.showId,
          seatId: {
            in: event.payload.seatIds,
          },
          status: ShowSeatStatusEnum.LOCKED,
        },
      });

      // for idempotency if event comess
      if (alreadyLocked === event.payload.seatIds.length) {
        console.log(
          `Booking ${event.payload.id} already processed. Ignoring duplicate event.`,
        );
        return;
      }

      await prisma.$transaction(async (tx) => {
        // do seats locking
      });
    } catch (err) {
      PrismaErrorMapper.map(err);
    }
  }
}
