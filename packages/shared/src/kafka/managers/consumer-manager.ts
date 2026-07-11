import { Consumer } from "@confluentinc/kafka-javascript/types/kafkajs";
import { getKafkaClient } from "../client";
import { getKafkaConfig } from "../config";
import { KafkaEventTypes, KafkaTopic } from "../enums";
import { NonRetryableError, RetryableError } from "../errors";
import { deadLetterPublisher } from "../publishers";
import { IMessageDeserializationStrategy } from "../strategies/deserialization/interfaces";
import { MessageHandler } from "../types";

/**
 * ConsumerManager
 *
 * Wraps the low-level Kafka consumer from `consumer.ts` and provides a
 * higher-level lifecycle interface for connecting, subscribing, consuming,
 * pausing, resuming, committing offsets, and disconnecting.
 *
 * This manager adds:
 * - Explicit consumer lifecycle methods
 * - Consistent console logging for important events
 * - Documentation for common Kafka consumer patterns
 */
export class ConsumerManager {
  private consumer: Consumer;
  constructor(private readonly deserializer: IMessageDeserializationStrategy) {
    this.consumer = getKafkaClient().consumer({
      // by default auto commit
      kafkaJS: {
        groupId: getKafkaConfig().groupId, // Which group consumer needs to join
      },
      "bootstrap.servers": getKafkaConfig().brokers.join(","),
      "auto.offset.reset": "latest",
      "isolation.level": "read_committed",
      "auto.commit.enable": false,
    });
  }
  private readonly handlers = new Map<
    KafkaEventTypes,
    {
      topic: KafkaTopic;
      handler: MessageHandler<any>;
    }
  >();
  /**
   * Connect to Kafka
   *
   * Establishes the consumer connection to the Kafka cluster.
   * Must be called before subscribing or consuming messages.
   */
  async initialize() {
    await this.consumer.connect();
  }

  /**
   * Disconnect from Kafka
   *
   * Gracefully closes the consumer connection.
   * Ensures any outstanding work is completed before shutdown.
   */
  async shutdown() {
    await this.consumer.disconnect();
  }

  /**
   * Subscribe to topics
   *
   * Tells Kafka which topics this consumer should read from.
   * Topics must be subscribed before calling `consume()`.
   */

  async register<T>(
    topic: KafkaTopic,
    eventType: KafkaEventTypes,
    handler: MessageHandler<T>,
  ) {
    this.handlers.set(eventType, {
      topic,
      handler,
    });
  }

  /**
   * Commit offsets for a consumed message.
   *
   * This marks the message as processed so the consumer will not re-read it
   * after a restart or rebalance.
   */
  async commit(topic: KafkaTopic, partition: number, offset: string) {
    return this.consumer.commitOffsets([
      {
        topic,
        partition,
        offset,
      },
    ]);
  }

  /**
   * Start consuming messages.
   *
   * The handler is invoked for every message received from Kafka.
   */
  async start<T>() {
    const topics = [
      ...new Set([...this.handlers.values()].map((l) => l.topic)),
    ];
    await this.consumer.subscribe({
      topics,
    });
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        let event: T;

        try {
          event = await this.deserializer.deserialize(
            topic as KafkaTopic,
            message.value!,
          );
        } catch (err) {
          await deadLetterPublisher.publish(
            topic as KafkaTopic,
            {
              key: message.key,
              value: message.value,
            },
            err as Error,
          );
          await this.commit(
            topic as KafkaTopic,
            partition,
            (Number(message.offset) + 1).toString(),
          );
          return;
        }

        console.log(message);
        // const { handler } = this.handlers.get();
        // if (!handler) {
        //   throw new Error(`No handler registered for topic ${topic}`);
        // }
        // try {
        //   await handler(event, {
        //     topic,
        //     partition,
        //     offset: message.offset,
        //     key: message.key?.toString(),
        //   });
        //   await this.commit(
        //     topic as KafkaTopic,
        //     partition,
        //     (Number(message.offset) + 1).toString(),
        //   );
        // } catch (err) {
        //   if (err instanceof RetryableError) {
        //     throw err; // Let Kafka retry
        //   }

        //   if (err instanceof NonRetryableError) {
        //     await deadLetterPublisher.publish(
        //       topic as KafkaTopic,
        //       {
        //         key: message.key,
        //         value: message.value,
        //       },
        //       err as Error,
        //     );
        //     await this.commit(
        //       topic as KafkaTopic,
        //       partition,
        //       (Number(message.offset) + 1).toString(),
        //     );
        //     return;
        //   }
        //   throw err;
        // }
      },
    });
  }
}
