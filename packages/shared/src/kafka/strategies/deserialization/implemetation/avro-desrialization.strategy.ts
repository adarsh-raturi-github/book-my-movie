import { KafkaTopic } from "../../../enums";
import { avroDeserializer } from "../../../registry";
import { IMessageDeserializationStrategy } from "../interfaces";

export class AvroDesrialization implements IMessageDeserializationStrategy {
  async deserialize(topic: KafkaTopic, message: Buffer) {
    return avroDeserializer.deserialize(topic, message);
  }
}
