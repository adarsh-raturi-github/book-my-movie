import { createContext, useCallback, useEffect, useState } from "react";
import { Theater } from "../../interfaces";
import {
  createTheater,
  CreateTheaterPayload,
  deleteTheater,
  listTheaters,
  updateTheater,
  UpdateTheaterPayload,
} from "../apis/theater";

interface TheaterContextValue {
  theaters: Theater[];
  loading: boolean;
  error: string | null;

  getTheaterById: (id: string) => Theater | undefined;
  refetchTheaters: () => Promise<void>;
  addTheater: (payload: CreateTheaterPayload) => Promise<void>;
  editTheater: (
    theaterId: string,
    payload: UpdateTheaterPayload,
  ) => Promise<void>;
  removeTheater: (theaterId: string) => Promise<void>;
}
export const TheaterContext = createContext<TheaterContextValue | undefined>(
  undefined,
);

interface TheaterProviderProps {
  children: React.ReactNode;
}

export function TheaterProvider({ children }: TheaterProviderProps) {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTheaters = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await listTheaters();
      setTheaters(response.data);
    } catch {
      setError("Failed to load theaters");
    } finally {
      setLoading(false);
    }
  }, []);

  const addTheater = async (payload: CreateTheaterPayload) => {
    try {
      setLoading(true);
      setError(null);

      const theater = await createTheater(payload);
      setTheaters((current) => [...current, theater]);
    } catch (requestError) {
      setError("Failed to create theater");
      throw requestError;
    } finally {
      setLoading(false);
    }
  };

  const editTheater = async (
    theaterId: string,
    payload: UpdateTheaterPayload,
  ) => {
    try {
      setLoading(true);
      setError(null);

      const updatedTheater = await updateTheater(theaterId, payload);

      setTheaters((current) =>
        current.map((theater) =>
          theater.id === theaterId ? updatedTheater : theater,
        ),
      );
    } catch (requestError) {
      setError("Failed to update theater");
      throw requestError;
    } finally {
      setLoading(false);
    }
  };

  const removeTheater = async (theaterId: string) => {
    try {
      setLoading(true);
      setError(null);

      await deleteTheater(theaterId);

      setTheaters((current) =>
        current.filter((theater) => theater.id !== theaterId),
      );
    } catch (requestError) {
      setError("Failed to delete theater");
      throw requestError;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchTheaters();
  }, [fetchTheaters]);

  const getTheaterById = useCallback(
    (id: string) => {
      return theaters.find((theater) => theater.id === id);
    },
    [theaters],
  );

  return (
    <TheaterContext.Provider
      value={{
        theaters,
        loading,
        error,
        getTheaterById,
        refetchTheaters: fetchTheaters,
        addTheater,
        removeTheater,
        editTheater,
      }}
    >
      {children}
    </TheaterContext.Provider>
  );
}
