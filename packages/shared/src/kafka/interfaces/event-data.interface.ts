import { ScreenStatusEnum, ScreenTypeEnum } from "../enums";

export interface IScreenCreateEventData {
  id: string;
  theaterId: string;
  name: string;
  type: ScreenTypeEnum;
  status: ScreenStatusEnum;
  entityVersion: number;
}

export interface IScreenUpdateEventData {
  id: string;
  name: string;
  type: ScreenTypeEnum;
  status: ScreenStatusEnum;
  entityVersion: number;
}

export interface IScreenDeleteEventData {
  id: string;
  entityVersion: number;
}
