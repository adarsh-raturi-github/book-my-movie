// src/hooks/useRequest.ts
import { useCallback, useState } from "react";

interface RequestState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useRequest<T, P>(requestFunction: (payload: P) => Promise<T>) {
  const [state, setState] = useState<RequestState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (payload?: P) => {
      setState({
        data: null,
        loading: true,
        error: null,
      });

      try {
        const data = await requestFunction(payload as P);

        setState({
          data,
          loading: false,
          error: null,
        });

        return data;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Request failed";

        setState({
          data: null,
          loading: false,
          error: message,
        });

        throw error;
      }
    },
    [requestFunction],
  );

  return {
    ...state,
    execute,
  };
}
