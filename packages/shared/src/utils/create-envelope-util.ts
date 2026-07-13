import { EventEnvelope, getKafkaConfig, KafkaEventDefinition } from "../kafka";
import { idGenerator } from "./id-generator.util";

export const createEnvelope = <T>(
  definition: KafkaEventDefinition,
  value: T,
  correlationId?: string,
): EventEnvelope<T> => {
  return {
    eventId: idGenerator(),
    eventType: definition.eventType,
    occurredAt: new Date().toISOString(),
    producer: definition.serviceName,
    correlationId,
    payload: value,
  };
};
