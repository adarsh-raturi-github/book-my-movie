import { api } from "../../../services";
import type { Theater } from "../../../interfaces";
import type { CreateTheaterPayload } from "./create-theater.api";

export type UpdateTheaterPayload = Partial<CreateTheaterPayload> & {
  status?: string;
};

export async function updateTheater(
  theaterId: string,
  payload: UpdateTheaterPayload,
): Promise<Theater> {
  const response = await api.patch<Theater>(
    `/api/theaters/${theaterId}`,
    payload,
  );
  return response.data;
}
