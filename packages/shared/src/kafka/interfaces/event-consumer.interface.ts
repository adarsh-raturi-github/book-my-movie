import { KafkaEventTypes, KafkaTopic } from "../enums";
import { EventEnvelope } from "./base.interface";

export interface IEventConsumer<T> {
  topic: KafkaTopic;
  eventType: KafkaEventTypes;
  onMessage(event: EventEnvelope<T>): Promise<void>;
}
