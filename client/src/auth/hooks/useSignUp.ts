import { useCallback } from "react";
import { useRequest } from "../../hooks/useRequest";
import { SignUpPayload, SignUpResponse, signUpUser } from "../apis/signup.api";

export function useSignUp() {
  const request = useRequest<SignUpResponse, SignUpPayload>(signUpUser);

  const signup = useCallback(
    async (payload: SignUpPayload) => {
      const result = await request.execute(payload);

      localStorage.setItem("token", result.token);

      return result;
    },
    [request],
  );

  return {
    signup,
    data: request.data,
    loading: request.loading,
    error: request.error,
  };
}
