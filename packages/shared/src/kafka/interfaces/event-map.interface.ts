import { KafkaEventTypes } from "../enums";
import {
  IScreenCreateEventData,
  IScreenDeleteEventData,
  IScreenUpdateEventData,
} from "./event-data.interface";

export interface TheaterTopicEventMap {
  [KafkaEventTypes.SCREEN_CREATED]: IScreenCreateEventData;
  [KafkaEventTypes.SCREEN_UPDATED]: IScreenUpdateEventData;
  [KafkaEventTypes.SCREEN_DELETED]: IScreenDeleteEventData;
}
