import { ShowSeatStatusEnum } from "../../enums";

export interface IShowSeatCreateEventData {
  id: string;
  showId: string;
  seatId: string;
  price: number;
  status: ShowSeatStatusEnum;
  bookingId: string | null;
  lockedUntil: string | null;
  entityVersion: number;
}

export interface IShowSeatUpdateEventData {
  id: string;
  showId: string;
  seatId: string;
  price: number;
  status: ShowSeatStatusEnum;
  bookingId: string | null;
  lockedUntil: string | null;
  entityVersion: number;
}

export interface IShowSeatDeleteEventData {
  id: string;
  entityVersion: number;
}
