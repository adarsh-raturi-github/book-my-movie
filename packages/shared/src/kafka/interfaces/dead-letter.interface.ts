import { KafkaTopic } from "../enums";

export interface DeadLetterMessage {
  key: Buffer | null;
  value: Buffer | null;
  headers?: Record<string, Buffer>;
}

export interface DeadLetterPayload {
  originalTopic: KafkaTopic;
  originalKey?: string;
  originalPayload: Buffer | null;
  error: string;
  occurredAt: string;
}
