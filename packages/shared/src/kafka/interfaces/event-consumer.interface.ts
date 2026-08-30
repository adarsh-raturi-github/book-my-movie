import { DomainEventTypes, KafkaTopic } from "../enums";
import { EventEnvelope } from "./base.interface";

export interface IEventConsumer<T> {
  topic: KafkaTopic;
  eventType: DomainEventTypes;
  onMessage(event: EventEnvelope<T>): Promise<void>;
}
