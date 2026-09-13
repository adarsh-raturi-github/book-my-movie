import { api } from "../../../services";
import type { Theater } from "../../../interfaces";

export interface ListTheatersParams {
  page?: number;
  pageSize?: number;
}

export interface ListTheatersResponse {
  data: Theater[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export async function listTheaters(
  params: ListTheatersParams = {},
): Promise<ListTheatersResponse> {
  const response = await api.get<ListTheatersResponse>("/api/theaters", {
    params,
  });
  return response.data;
}
