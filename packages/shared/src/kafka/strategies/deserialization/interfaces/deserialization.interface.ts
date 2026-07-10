import { KafkaTopic } from "../../../enums";

export interface IMessageDeserializationStrategy {
  deserialize<T>(topic: KafkaTopic, message: Buffer): Promise<T>;
}
