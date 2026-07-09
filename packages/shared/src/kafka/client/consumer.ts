import { getKafkaConfig } from "../config";
import { kafka } from "./kafka";

export const consumer = kafka.consumer({
  // by default auto commit
  kafkaJS: {
    groupId: getKafkaConfig().groupId, // Which group consumer needs to join
  },
  "bootstrap.servers": getKafkaConfig().brokers.join(","),
  "auto.offset.reset": "latest",
  "isolation.level": "read_committed",
  "auto.commit.enable": false,
});
