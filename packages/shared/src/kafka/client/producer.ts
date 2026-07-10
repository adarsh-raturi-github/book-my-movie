import { getKafkaConfig } from "../config";
import { getKafkaClient } from "./kafka";

const config = getKafkaConfig();
export const producer = getKafkaClient().producer({
  kafkaJS: {
    acks: -1, // means all
  },
  // if multiple producer   "transactional.id": "booking-service-${process.env.HOST_NAME}",
  "transactional.id": `${config.serviceName}-${config.clientId}`,

  "transaction.timeout.ms": 50000, //50seconds
  // # Batching, wait 20ms to collect more messages before sending
  "linger.ms": "20",
  //    Max batch size, send when batch reaches 32KB (even if linger.ms
  // hasn't expired)
  "batch.size": 32768,
  // # Total buffer memory for all batches: 32MB (if full, send() will get
  //. blocked till space created or max block time)
  "queue.buffering.max.kbytes": 32768,

  // #---------------COMPRESSION-------
  //# compresses entire batch before sending
  "compression.type": "snappy",
  // #---------------SENDER THREAD-------
  //# Retry on transient failures (network timeout, leader change, etc.)
  retries: 3,
  // # Max in-flight requests
  "max.in.flight.requests.per.connection": 5,
  "enable.idempotence": true,
  /**
   * When set to true, the producer will ensure that messages are successfully produced exactly once
   *  and in the original produce order.
   * The following configuration properties are adjusted automatically  (if not modified by the user)
   * when idempotence is enabled:
   * max.in.flight.requests.per.connection=5  (must be less than or equal to 5)
   * retries=INT32_MAX (must be greater than 0),
   * acks=all, queuing.strategy=fifo.
   * Producer instantation will fail if user-supplied configuration is incompatible.
   */ "queuing.strategy": "fifo",
});

// in js no serialization u have to convert using JSON.strigify(),or AVRO
