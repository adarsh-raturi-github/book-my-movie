import {
  ScreenStatusEnum,
  ScreenTypeEnum,
  SeatStatusEnum,
  SeatTypeEnum,
} from "../enums";

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

// -------------------------------- SEATS------------------------------

export interface ISeatCreateEventData {
  id: string;
  screenId: string;
  rowLabel: string;
  seatNumber: number;
  seatType: SeatTypeEnum;
  status: SeatStatusEnum;
  entityVersion: number;
}

export interface ISeatUpdateEventData {
  id: string;
  screenId: string;
  rowLabel: string;
  seatNumber: number;
  seatType: SeatTypeEnum;
  status: SeatStatusEnum;
  entityVersion: number;
}

export interface ISeatDeleteEventData {
  id: string;
  entityVersion: number;
}
