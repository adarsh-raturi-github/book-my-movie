import {
  BookingEventTypes,
  createEnvelope,
  EventEnvelope,
  IBookingCreatedEventData,
  IEventConsumer,
  ISeatsLockedEventData,
  ISeatsLockFailEventData,
  IShowSeatCreateEventData,
  IShowSeatUpdateEventData,
  KafkaAggregateType,
  DomainEventTypes,
  KafkaTopic,
  NonRetryableError,
  SeatLockFailureReason,
  SeatStatusEnum,
  ShowSeatStatusEnum,
} from "@adarsh-tickets/shared";
import { prisma } from "../../../prisma.client";
import { PrismaErrorMapper } from "../../../services/prisma-error.mapper";
import { Prisma, ShowSeat } from "@prisma/client";
import { EXPIRATION_WINDOW_SECONDS } from "../../../constants";
export class BookingCreatedConsumer implements IEventConsumer<IBookingCreatedEventData> {
  topic = KafkaTopic.BOOKING_TOPIC;
  eventType = BookingEventTypes.BOOKING_CREATED;

  async onMessage(
    event: EventEnvelope<IBookingCreatedEventData>,
  ): Promise<void> {
    try {
      const {
        bookingId,
        seatIds,
        showId,
        entityVersion,
        expiresAt,
        totalAmount,
        userId,
      } = event.payload;

      await prisma.$transaction(async (tx) => {
        let workflowEvent: EventEnvelope<
          ISeatsLockedEventData | ISeatsLockFailEventData
        >;
        const alreadyLockedSeats = await tx.showSeat.count({
          where: {
            bookingId: bookingId,
            showId: showId,
            seatId: {
              in: seatIds,
            },
            status: ShowSeatStatusEnum.LOCKED,
          },
        });

        // for idempotency if event comess
        if (alreadyLockedSeats === seatIds.length) {
          throw new NonRetryableError(
            ` Booking ${event.payload.bookingId} already processed. Ignoring duplicate event.`,
          );
        }

        // lock seats
        const showSeats = await tx.$queryRaw<
          ShowSeat[]
        >`select * from public.show_seats
         WHERE seatId =  ANY(${seatIds}) and deleted=false
        and showId=${showId} FOR UPDATE`;

        if (showSeats.length !== seatIds.length) {
          const workflowEvent = createEnvelope<ISeatsLockFailEventData>(
            {
              topic: KafkaTopic.BOOKING_TOPIC,
              eventType: BookingEventTypes.SEAT_LOCK_FAILED,
              serviceName: process.env.SERVICE_NAME!,
            },
            {
              bookingId,
              seatIds,
              showId,
              reason: SeatLockFailureReason.SEAT_NOT_FOUND,
            },
            bookingId,
          );
          await tx.outbox.create({
            data: {
              aggregateType: KafkaAggregateType.BOOKING,
              aggregateId: bookingId,
              topic: KafkaTopic.BOOKING_TOPIC,
              eventType: workflowEvent.eventType,
              eventVersion: entityVersion, // not using
              payload: workflowEvent as unknown as Prisma.InputJsonValue,
            },
          });
          return;
        }
        // validate
        const ifAllAvailable = showSeats.every(
          (seat) =>
            seat.status === ShowSeatStatusEnum.AVAILABLE ||
            (seat.status === ShowSeatStatusEnum.LOCKED &&
              seat?.lockExpiresAt! < new Date()),
        );

        if (ifAllAvailable) {
          const updatedShowSeats = await tx.showSeat.updateManyAndReturn({
            where: {
              showId,
              seatId: { in: seatIds },
              deleted: false,
            },
            data: {
              lockExpiresAt: expiresAt,
              bookingId,
              status: ShowSeatStatusEnum.LOCKED,
              version: { increment: 1 },
            },
          });
          workflowEvent = createEnvelope<ISeatsLockedEventData>(
            {
              topic: KafkaTopic.BOOKING_TOPIC,
              eventType: BookingEventTypes.SEAT_LOCKED,
              serviceName: process.env.SERVICE_NAME!,
            },
            {
              bookingId,
              seatIds,
              showId,
              lockExpiresAt: expiresAt,
            },
            bookingId,
          );
          await tx.outbox.createMany({
            data: updatedShowSeats.map((seat) => ({
              aggregateType: KafkaAggregateType.SHOW_SEAT,
              aggregateId: seat.id,
              topic: KafkaTopic.SHOW_TOPIC,
              eventType: DomainEventTypes.SHOW_SEAT_UPDATED,
              eventVersion: seat.version, // not using
              payload: createEnvelope<IShowSeatUpdateEventData>(
                {
                  topic: KafkaTopic.SHOW_TOPIC,
                  eventType: DomainEventTypes.SHOW_SEAT_UPDATED,
                  serviceName: process.env.SERVICE_NAME!,
                },
                {
                  id: seat.id,
                  showId,
                  seatId: seat.seatId,
                  price: +seat.price,
                  bookingId: bookingId,
                  status: seat.status as ShowSeatStatusEnum,
                  lockedUntil: seat.lockExpiresAt!.toISOString(),
                  entityVersion: seat.version,
                },
              ),
            })) as any,
          });
        } else {
          workflowEvent = createEnvelope<ISeatsLockFailEventData>(
            {
              topic: KafkaTopic.BOOKING_TOPIC,
              eventType: BookingEventTypes.SEAT_LOCK_FAILED,
              serviceName: process.env.SERVICE_NAME!,
            },
            {
              bookingId,
              seatIds,
              showId,
              reason: SeatLockFailureReason.SEAT_ALREADY_LOCKED,
            },
            bookingId,
          );
        }

        await tx.outbox.create({
          data: {
            aggregateType: KafkaAggregateType.BOOKING,
            aggregateId: bookingId,
            topic: KafkaTopic.BOOKING_TOPIC,
            eventType: workflowEvent.eventType,
            eventVersion: entityVersion, // not using
            payload: workflowEvent as unknown as Prisma.InputJsonValue,
          },
        });

        //
      });
    } catch (err) {
      PrismaErrorMapper.map(err);
    }
  }
}
