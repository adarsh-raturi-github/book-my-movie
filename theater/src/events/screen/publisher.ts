import {
  IScreenCreateEventData,
  IScreenDeleteEventData,
  IScreenUpdateEventData,
  KafkaEventTypes,
  KafkaTopic,
  producerManager,
} from "@adarsh-tickets/shared";

class ScreenPublisher {
  constructor(private readonly producer = producerManager) {}

  created(data: IScreenCreateEventData) {
    return this.producer.publish({
      definition: {
        topic: KafkaTopic.THEATER_TOPIC,
        eventType: KafkaEventTypes.SCREEN_CREATED,
      },
      key: data.id,
      value: data,
    });
  }

  updated(data: IScreenUpdateEventData) {
    return this.producer.publish({
      definition: {
        topic: KafkaTopic.THEATER_TOPIC,
        eventType: KafkaEventTypes.SCREEN_UPDATED,
      },
      key: data.id,
      value: data,
    });
  }

  deleted(data: IScreenDeleteEventData) {
    return this.producer.publish({
      definition: {
        topic: KafkaTopic.THEATER_TOPIC,
        eventType: KafkaEventTypes.SCREEN_DELETED,
      },
      key: data.id,
      value: data,
    });
  }
}

export const screenPublisher = new ScreenPublisher();
