import {
  createKafka,
  initializeKafka,
  JsonDeserialization,
  KafkaEventTypes,
  KafkaTopic,
  NotFoundError,
} from "@adarsh-tickets/shared";
import { app } from "./app";
import dotenv from "dotenv";
import { ScreenCreatedConsumer } from "./events/consumers/screen";
import { ScreenUpdatedConsumer } from "./events/consumers/screen/screen-updated.consumer";
import { ScreenDeletedConsumer } from "./events/consumers/screen/screen-deleted.consumer";

dotenv.config();
const start = async () => {
  try {
    if (!process.env.JWT_KEY) {
      throw new Error("JWT_KEY must be defined");
    }
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL must be defined");
    }

    if (!process.env.CLIENT_ID) {
      throw new Error("CLIENT_ID must be defined");
    }

    if (!process.env.KAFKA_BROKERS) {
      throw new Error("KAFKA_BROKERS must be defined");
    }

    if (!process.env.SERVICE_NAME) {
      throw new Error("SERVICE_NAME must be defined");
    }

    if (!process.env.KAFKA_GROUP_ID) {
      throw new Error("KAFKA_GROUP_ID must be defined");
    }

    await initializeKafka({
      clientId: process.env.CLIENT_ID,
      brokers: process.env.KAFKA_BROKERS.split(","),
      groupId: process.env.KAFKA_GROUP_ID,
      serviceName: process.env.SERVICE_NAME,
    });

    const kafka = await createKafka({
      deserializer: new JsonDeserialization(),
    });

    const consumer = kafka.consumer;
    await consumer.initialize();

    consumer.register(
      KafkaTopic.THEATER_TOPIC,
      KafkaEventTypes.SCREEN_CREATED,
      new ScreenCreatedConsumer().onMessage,
    );
    consumer.register(
      KafkaTopic.THEATER_TOPIC,
      KafkaEventTypes.SCREEN_UPDATED,
      new ScreenUpdatedConsumer().onMessage,
    );
    consumer.register(
      KafkaTopic.THEATER_TOPIC,
      KafkaEventTypes.SCREEN_DELETED,
      new ScreenDeletedConsumer().onMessage,
    );
    await consumer.start();
  } catch (e) {
    console.dir(e, { depth: null });
    throw new Error();
  }

  app.listen(3003, () => {
    console.log("Show Service started on 3003!!");
  });
};
start();
