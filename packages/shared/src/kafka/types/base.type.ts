export type MessageHandler<T> = (
  event: T,
  metadata: {
    topic: string;
    partition: number;
    offset: string;
    key?: string;
    headers?: Record<string, Buffer>;
  },
) => Promise<void>;
