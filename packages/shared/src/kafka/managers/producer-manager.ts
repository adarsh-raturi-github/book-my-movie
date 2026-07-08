import { avroSerializer } from "../registry/avro-serializer";
import { producer } from "../client/producer";
import {
  EventEnvelope,
  KafkaEventDefinition,
  PublishEvent,
} from "../interfaces/base.interface";
import { Message } from "@confluentinc/kafka-javascript";
import { idGenerator } from "../../utils";
import { getKafkaConfig } from "../config";

const config = getKafkaConfig();
/**
 * ProducerManager
 *
 * Wraps the Confluent Kafka JS producer and provides a convenient interface
 * for publishing events to Kafka topics.
 *
 * It handles:
 * - Single message publishing
 * - Batch message publishing (optimized by topic)
 * - Connection lifecycle management
 * - Message serialization (JSON)
 * - Flushing pending messages
 *
 * Why a wrapper?
 *
 * The producer from kaftka.ts is a low-level client.
 * This manager adds:
 * - Type safety with generics
 * - Consistent error handling
 * - Batch optimization (group by topic)
 * - Clear semantics for publishing patterns
 *
 * Confluent Kafka JS Note:
 *
 * Unlike KafkaJS, Confluent's kafka-javascript uses librdkafka under the hood,
 * which is more performant and production-ready.
 * It supports async/await patterns for all producer operations.
 */
export class ProducerManager {
  /**
   * Connect to Kafka
   *
   * Establishes the producer connection to the Kafka cluster.
   * Must be called before any publishing operations.
   *
   * This internally:
   * 1. Resolves broker addresses from bootstrap servers
   * 2. Establishes network connections to brokers
   * 3. Initializes the producer buffers
   */
  async initialize() {
    return producer.connect();
  }

  /**
   * Disconnect from Kafka
   *
   * Gracefully closes the producer connection.
   * Should be called when shutting down the application.
   *
   * This ensures:
   * 1. All pending messages are flushed
   * 2. Connections are properly closed
   * 3. Resources are cleaned up
   */
  async shutdown() {
    return producer.disconnect();
  }
  private createEnvelope<T>(
    definition: KafkaEventDefinition,
    value: T,
    correlationId?: string,
  ): EventEnvelope<T> {
    return {
      eventId: idGenerator(),
      eventType: definition.eventType,
      occurredAt: new Date().toISOString(),
      producer: config.serviceName,
      correlationId,
      payload: value,
    };
  }

  /** for health checks and DLT messages */
  async publishRaw({
    topic,
    key,
    value,
    headers,
  }: {
    topic: string;
    key?: Buffer | string | null;
    value: Buffer | string;
    headers?: Record<string, string>;
  }) {
    await producer.send({
      topic,
      messages: [
        {
          key,
          value,
          headers,
        },
      ],
    });
  }
  /**
   * Publish a single event
   *
   * Sends a single message to the specified Kafka topic.
   *
   * @param topic - The target Kafka topic
   * @param key - Message key (for partitioning and ordering)
   * @param value - Message payload (will be AVRO serialized)
   * @param headers - Optional message headers (metadata)
   *
   * How it works:
   * 1. The message is serialized to JSON
   * 2. Sent to the specified topic
   * 3. Kafka partitions based on the key (if provided)
   * 4. Messages with the same key go to the same partition (ordering guarantee)
   *
   * Key points:
   * - If key is null, the message is sent to a random partition
   * - If key is provided, the message is sent to a consistent partition
   * - This ensures ordering for messages with the same key
   */
  async publish<T>(event: PublishEvent<T>) {
    return this.publishBatch([event]);
  }

  /**
   * Publish multiple events efficiently
   *
   * Sends multiple messages to Kafka in a single batch operation.
   * Messages are grouped by topic for optimized network usage.
   *
   * @param events - Array of events to publish
   *
   * Optimization strategy:
   * 1. Groups events by topic into a Map
   * 2. Sends all messages to the same topic in a single request
   * 3. Reduces network round-trips
   * 4. Improves throughput significantly
   *
   * Example:
   * Events to topics: [A, B, A, C, B, A]
   * Grouped as: { A: [msg1, msg3, msg5], B: [msg2, msg4], C: [msg6] }
   * Sent in one batch request
   *
   * Performance benefit:
   * Without batching: 6 network requests (one per message)
   * With batching: 3 network requests (one per topic)
   *
   * When to use:
   * - Publishing many events at once
   * - High-throughput scenarios
   * - When order within a topic partition is critical
   */
  async publishBatch<T>(events: PublishEvent<T>[]) {
    if (events.length === 0) {
      return;
    }

    const topicMessages = await Promise.all(
      events.map(async (event) => {
        const envelope = this.createEnvelope(
          event.definition,
          event.value,
          event.correlationId,
        );

        const payload = await avroSerializer.serialize(
          event.definition.topic,
          envelope,
        );

        return {
          topic: event.definition.topic,
          message: {
            key: event.key,
            value: payload,
            headers: event.headers,
          },
        };
      }),
    );

    const grouped = new Map<
      string,
      (typeof topicMessages)[number]["message"][]
    >();

    for (const item of topicMessages) {
      if (!grouped.has(item.topic)) {
        grouped.set(item.topic, []);
      }

      grouped.get(item.topic)!.push(item.message);
    }

    return producer.sendBatch({
      topicMessages: [...grouped.entries()].map(([topic, messages]) => ({
        topic,
        messages,
      })),
    });
  }
}
