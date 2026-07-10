import { KafkaTopic } from "../../../enums";
import { IMessageDeserializationStrategy } from "../interfaces";

export class JsonDesrialization implements IMessageDeserializationStrategy {
  deserialize(_topic: KafkaTopic, message: Buffer) {
    return JSON.parse(message?.toString());
  }
}
