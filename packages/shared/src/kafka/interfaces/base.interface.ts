import { KafkaEventTypes, KafkaTopic } from "../enums";
import { IMessageDeserializationStrategy } from "../strategies";

export interface SharedKafkaConfig {
  clientId: string;
  brokers: string[];
  groupId: string;
  serviceName: string;
}
export interface KafkaEventDefinition {
  topic: KafkaTopic;
  eventType: KafkaEventTypes;
  serviceName: string;
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

export interface KafkaBootstrapOptions {
  deserializer: IMessageDeserializationStrategy;
}
