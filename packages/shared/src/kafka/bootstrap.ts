import { ProducerManager } from "./managers/producer-manager";
import { ConsumerManager } from "./managers/consumer-manager";
import { DeadLetterPublisher } from "./publishers/dead-letter.publisher";
import { KafkaBootstrapOptions } from "./interfaces";

export async function createKafka(options: KafkaBootstrapOptions) {
  const producer = new ProducerManager();

  await producer.initialize();

  const dltPublisher = new DeadLetterPublisher(producer);

  const consumer = new ConsumerManager(options.deserializer, dltPublisher);

  await consumer.initialize();

  return {
    producer,
    consumer,
  };
}
