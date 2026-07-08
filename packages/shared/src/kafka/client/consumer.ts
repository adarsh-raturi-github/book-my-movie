import { kafka } from "./kafka";

export const consumer = kafka.consumer({
  // by default auto commit
  kafkaJS: {
    groupId: process.env.KAFKA_GROUP_ID!, // Which group consumer needs to join
  },
  "bootstrap.servers": process.env.KAFKA_BROKERS,
  "auto.offset.reset": "latest",
  "isolation.level": "read_committed",
  "auto.commit.enable": false,
});
