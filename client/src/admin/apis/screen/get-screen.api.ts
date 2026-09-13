import { api } from "../../../services";
import { Screen } from "../../../interfaces";
export async function getScreen(
  theaterId: string,
  screenId: string,
): Promise<Screen> {
  const response = await api.get<Screen>(
    `/api/theaters/${theaterId}/screens/${screenId}`,
  );
  return response.data;
}
