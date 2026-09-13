import { ScreenStatusEnum, ScreenTypeEnum } from "../enums";

export interface Screen {
  id: string;
  theaterId: string;
  name: string;
  capacity: number;
  description: string;
  type: ScreenTypeEnum;
  status: ScreenStatusEnum;
}
