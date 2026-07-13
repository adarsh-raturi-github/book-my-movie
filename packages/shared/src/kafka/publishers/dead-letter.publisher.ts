import { KafkaTopic } from "../enums";
import { DeadLetterMessage, DeadLetterPayload } from "../interfaces";
import { ProducerManager } from "../managers";

export class DeadLetterPublisher {
  constructor(private readonly producerManager: ProducerManager) {}
  private getTopic(topic: KafkaTopic) {
    return `${topic}-dlt`;
  }

  async publish(topic: KafkaTopic, message: DeadLetterMessage, error: Error) {
    const dltTopic = this.getTopic(topic);

    const payload: DeadLetterPayload = {
      originalTopic: topic,
      originalKey: message.key?.toString(),
      originalPayload: message.value,
      error: error.message,
      occurredAt: new Date().toISOString(),
    };
    await this.producerManager.publishRaw({
      topic: dltTopic,
      key: message.key,
      value: JSON.stringify(payload),
    });
  }
}
