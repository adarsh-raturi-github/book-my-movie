import { api } from "../../../services";
import { Screen } from "../../../interfaces";
export async function listScreens(theaterId: string): Promise<Screen[]> {
  const response = await api.get<Screen[]>(`/api/theaters/${theaterId}`);
  return response.data;
}
