import { api } from "../../../services";

export async function deleteTheater(theaterId: string): Promise<void> {
  await api.delete(`/api/theaters/${theaterId}`);
}
