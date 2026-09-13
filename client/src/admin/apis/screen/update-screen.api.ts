import { ScreenStatusEnum, ScreenTypeEnum } from "../../../enums";
import { api } from "../../../services";
import { Screen } from "../../../interfaces";

export interface UpdateScreenPayload {
  name?: string;
  description?: string;
  type?: ScreenTypeEnum;
  status?: ScreenStatusEnum;
}
export async function updateScreen(
  theaterId: string,
  screenId: string,
  payload: UpdateScreenPayload,
): Promise<Screen> {
  const response = await api.patch<Screen>(
    `/api/theaters/${theaterId}/screens/${screenId}`,
    payload,
  );
  return response.data;
}
