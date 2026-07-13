import { createKafka, JsonDeserialization } from "@adarsh-tickets/shared";
import { app } from "./app";
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

    initializeKafka({
      clientId: process.env.CLIENT_ID,
      brokers: process.env.KAFKA_BROKERS.split(","),
      groupId: process.env.KAFKA_GROUP_ID!,
      serviceName: process.env.SERVICE_NAME,
    });

    const kafka = await createKafka({
      deserializer: new JsonDeserialization(),
    });
    const producer = kafka.producer;
    await producer.initialize();
  } catch (e) {
    throw new Error();
  }

  app.listen(3001, () => {
    console.log("Movie Service started on 3001!");
  });
};
start();
function initializeKafka(arg0: {
  clientId: string;
  brokers: string[];
  groupId: string;
  serviceName: string;
}) {
  throw new Error("Function not implemented.");
}
