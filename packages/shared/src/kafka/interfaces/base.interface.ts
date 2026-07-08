import { KafkaEventTypes, KafkaTopic } from "../enums";

export interface SharedKafkaConfig {
  clientId: string;
  brokers: string[];
}
export interface KafkaEventDefinition {
  topic: KafkaTopic;
  eventType: KafkaEventTypes;
}

export interface PublishEvent<T> {
  definition: KafkaEventDefinition;
  key?: string;
  value: T;
  headers?: Record<string, string>;
  correlationId?: string;
  partition?: number;
}

export interface EventEnvelope<T> {
  eventId: string;
  eventType: string;
  occurredAt: string;
  producer: string;
  correlationId?: string;
  payload: T;
}
