import { api } from "../../../services";
import { Screen } from "../../../interfaces";
export async function createScreen(
  theaterId: string,
  payload: Screen,
): Promise<Screen> {
  const response = await api.post<Screen>(
    `/api/theaters/${theaterId}/screens`,
    payload,
  );
  return response.data;
}
