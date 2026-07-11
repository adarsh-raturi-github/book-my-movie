/**
 * Kafka Client Instance
 *
 * This file initializes and exports a singleton KafkaJS instance.
 *
 * The Kafka client is responsible for:
 * - Creating producers to send messages to Kafka topics
 * - Creating consumers to read messages from Kafka topics
 * - Connecting to the Kafka cluster via bootstrap brokers
 *
 * Why Singleton?
 *
 * Creating multiple Kafka instances is inefficient and can cause connection issues.
 * By exporting a single instance, we ensure:
 * - One persistent connection to the Kafka cluster
 * - Shared connection pool across producers and consumers
 * - Better resource management
 *
 * Example Usage:
 *
 * import { kaftka } from './kaftka/kaftka';
 * const producer = kaftka.producer();
 * const consumer = kaftka.consumer({ groupId: 'my-group' });
 */

import { KafkaJS } from "@confluentinc/kafka-javascript";
import { getKafkaConfig } from "../config";

/**
 * Kafka Instance
 *
 * Configuration Details:
 *
 * bootstrap.servers
 * ------------------
 * Comma-separated list of Kafka brokers.
 *
 * Example:
 * "localhost:9095,localhost:9096"
 *
 * The client uses these brokers to:
 * 1. Bootstrap and fetch cluster metadata
 * 2. Discover all brokers in the cluster
 * 3. Locate topic partitions and their leaders
 *
 * After connecting to any bootstrap broker, the client automatically
 * discovers all other brokers and topics in the cluster.
 *
 * ====================================================================
 * client.id
 * ---------
 * A unique identifier for this client application.
 *
 * Examples:
 * "order-service"
 * "payment-service"
 * "notification-service"
 *
 * Kafka uses this to:
 * - Track client connections for monitoring
 * - Log requests with client identification
 * - Apply client-specific quotas and ACLs
 * - Debug issues by identifying which application sent a request
 *
 * ====================================================================
 * Environment Variables:
 *
 * All configuration values come from environment variables (defined in kaftka.config.ts):
 * - KAFKA_BROKERS: Bootstrap server addresses
 * - KAFKA_CLIENT_ID: Your application's unique identifier
 * - KAFKA_TOPIC: Default topic for operations
 *
 * This design allows configuration changes without code modifications.
 */

/**
 * Important: This does NOT connect to Kafka.
 *
 * It simply creates a client object.
 *
 * Think of it like:
 *
 * const client = new Database();
 *
 * The database connection hasn't been established yet.
 *
 * The actual connection to Kafka happens when you call:
 * - producer.connect()
 * - consumer.connect()
 *
 * This separation of concerns allows you to:
 * 1. Create the client during app startup
 * 2. Defer actual connection until needed
 * 3. Handle connection failures gracefully
 */
let kafka: KafkaJS.Kafka;
export function getKafkaClient() {
  const config = getKafkaConfig();
  if (kafka) {
    return kafka;
  }
  kafka = new KafkaJS.Kafka({
    "bootstrap.servers": config.brokers.join(","),
    "client.id": config.clientId,
    // Refresh metadata every 5 minutes
    "metadata.max.age.ms": 300000,
  });
  return kafka;
}
