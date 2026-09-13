import { api } from "../../services";

export async function logOutUser() {
  const response = await api.post("/api/auth/logout");

  return response.data;
}
