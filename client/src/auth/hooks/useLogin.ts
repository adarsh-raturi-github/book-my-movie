import { useCallback } from "react";
import { useRequest } from "../../hooks/useRequest";
import { LoginResponse, loginUser, LoginPayload } from "../apis/login.api";

export function useLogin() {
  const request = useRequest<LoginResponse, LoginPayload>(loginUser);

  const login = useCallback(
    async (payload: LoginPayload) => {
      const result = await request.execute(payload);

      localStorage.setItem("token", result.token);

      return result;
    },
    [request],
  );

  return {
    login,
    data: request.data,
    loading: request.loading,
    error: request.error,
  };
}
