import { consumer } from "../client";
import { KafkaTopic } from "../enums";
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
  constructor(private readonly deserializer: IMessageDeserializationStrategy) {}
  private readonly handlers = new Map<KafkaTopic, MessageHandler<any>>();
  /**
   * Connect to Kafka
   *
   * Establishes the consumer connection to the Kafka cluster.
   * Must be called before subscribing or consuming messages.
   */
  async initialize() {
    await consumer.connect();
  }

  /**
   * Disconnect from Kafka
   *
   * Gracefully closes the consumer connection.
   * Ensures any outstanding work is completed before shutdown.
   */
  async shutdown() {
    await consumer.disconnect();
  }

  /**
   * Subscribe to topics
   *
   * Tells Kafka which topics this consumer should read from.
   * Topics must be subscribed before calling `consume()`.
   */

  async register<T>(topic: KafkaTopic, handler: MessageHandler<T>) {
    this.handlers.set(topic, handler);
  }

  /**
   * Commit offsets for a consumed message.
   *
   * This marks the message as processed so the consumer will not re-read it
   * after a restart or rebalance.
   */
  async commit(topic: KafkaTopic, partition: number, offset: string) {
    return consumer.commitOffsets([
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
    await consumer.subscribe({
      topics: [...this.handlers.keys()],
    });
    await consumer.run({
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

        const handler = this.handlers.get(topic as KafkaTopic);
        if (!handler) {
          throw new Error(`No handler registered for topic ${topic}`);
        }
        try {
          await handler(event, {
            topic,
            partition,
            offset: message.offset,
            key: message.key?.toString(),
          });
          await this.commit(
            topic as KafkaTopic,
            partition,
            (Number(message.offset) + 1).toString(),
          );
        } catch (err) {
          if (err instanceof RetryableError) {
            throw err; // Let Kafka retry
          }

          if (err instanceof NonRetryableError) {
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
          throw err;
        }
      },
    });
  }
}
