// src/auth/apis/login.api.ts
import { api } from "../../services/api";
import { Role } from "../types/role";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  email: string;
  phone: string;
  role: Role;
  permissions: string[];
  token: string;
}

export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>("/api/auth/signin", payload);

  return response.data;
}
