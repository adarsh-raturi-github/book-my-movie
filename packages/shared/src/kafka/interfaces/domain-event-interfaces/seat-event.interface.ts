import { SeatStatusEnum, SeatTypeEnum } from "../../enums";

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

