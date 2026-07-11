import { KafkaTopic } from "../enums";
import { DeadLetterMessage, DeadLetterPayload } from "../interfaces";
import { producerManager } from "../managers";

export class DeadLetterPublisher {
  private producerManager = producerManager;

  private getTopic(topic: KafkaTopic) {
    return `${topic}-dlt`;
  }

  publish(topic: KafkaTopic, message: DeadLetterMessage, error: Error) {
    const dltTopic = this.getTopic(topic);

    const payload: DeadLetterPayload = {
      originalTopic: topic,
      originalKey: message.key?.toString(),
      originalPayload: message.value,
      error: error.message,
      occurredAt: new Date().toISOString(),
    };
    this.producerManager.publishRaw({
      topic: dltTopic,
      key: message.key,
      value: JSON.stringify(payload),
    });
  }
}

export const deadLetterPublisher = new DeadLetterPublisher();
