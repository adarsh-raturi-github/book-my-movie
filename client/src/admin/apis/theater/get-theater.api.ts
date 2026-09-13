import { api } from "../../../services";
import type { Theater } from "../../../interfaces";

export async function getTheater(theaterId: string): Promise<Theater> {
  const response = await api.get<Theater>(`/api/theaters/${theaterId}`);
  return response.data;
}
