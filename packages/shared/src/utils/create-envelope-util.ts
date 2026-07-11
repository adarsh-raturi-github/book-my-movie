import { EventEnvelope, getKafkaConfig, KafkaEventDefinition } from "../kafka";
import { idGenerator } from "./id-generator.util";

const config = ();
export const createEnvelope = <T>(
  definition: KafkaEventDefinition,
  value: T,
  correlationId?: string,
): EventEnvelope<T> => {
  return {
    eventId: idGenerator(),
    eventType: definition.eventType,
    occurredAt: new Date().toISOString(),
    producer: config.serviceName,
    correlationId,
    payload: value,
  };
};
