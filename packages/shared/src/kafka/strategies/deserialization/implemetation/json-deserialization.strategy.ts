import { KafkaTopic } from "../../../enums";
import { IMessageDeserializationStrategy } from "../interfaces";

export class JsonDesrialization implements IMessageDeserializationStrategy {
  deserialize(_topic: KafkaTopic, message: Buffer) {
    /** connector itself stringify one time extra so have to parse two times */
    return JSON.parse(JSON.parse(message?.toString()));
  }
}
