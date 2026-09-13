import { useCallback } from "react";
import { useRequest } from "../../hooks/useRequest";
import { logOutUser } from "../apis/logout.api";

export function useLogout() {
  const request = useRequest<unknown, void>(logOutUser);

  const logout = useCallback(async () => {
    const result = await request.execute();
    return result;
  }, [request]);

  return {
    logout,
    data: request.data,
    loading: request.loading,
    error: request.error,
  };
}
