import { api } from "../../../services";

export async function deleteScreen(
  theaterId: string,
  screenId: string,
): Promise<void> {
  await api.delete(`/api/theaters/${theaterId}/screens/${screenId}`);
}
