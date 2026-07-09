import { SharedKafkaConfig } from "../interfaces";

let kafkaConfig: SharedKafkaConfig | null = null;

export function initializeKafka(config: SharedKafkaConfig): void {
  kafkaConfig = config;
}

export function getKafkaConfig(): SharedKafkaConfig {
  if (!kafkaConfig) {
    throw new Error(
      "Kafka has not been initialized. Call initializeKafka() before using ProducerManager or ConsumerManager.",
    );
  }

  return kafkaConfig;
}
