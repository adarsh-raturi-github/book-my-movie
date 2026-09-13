import { api } from "../../services";
import { Role } from "../types/role";

export interface SignUpPayload {
  email: string;
  password: string;
  phone: string;
}

export interface SignUpResponse {
  id: string;
  email: string;
  phone: string;
  role: Role;
  permissions: string[];
  token: string;
}
export async function signUpUser(
  payload: SignUpPayload,
): Promise<SignUpResponse> {
  const response = await api.post<SignUpResponse>("/api/auth/signup", payload);

  return response.data;
}
