import { api } from "../../../services";
import type { Theater } from "../../../interfaces";

export interface CreateTheaterPayload {
  name: string;
  description?: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  timezone: string;
}

export async function createTheater(
  payload: CreateTheaterPayload,
): Promise<Theater> {
  const response = await api.post<Theater>("/api/theaters", payload);
  return response.data;
}
