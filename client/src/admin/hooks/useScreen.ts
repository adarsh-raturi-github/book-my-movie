import { useCallback, useEffect, useState } from "react";
import { Screen } from "../../interfaces";
import { createScreen, deleteScreen, listScreens } from "../apis/screen";
import {
  updateScreen,
  UpdateScreenPayload,
} from "../apis/screen/update-screen.api";
export function useScreen(theaterId: string | null) {
  const [screens, setScreens] = useState<Screen[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchScreens = useCallback(async (theaterId: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await listScreens(theaterId);
      setScreens(response);
    } catch {
      setError("Failed to load screens");
    } finally {
      setLoading(false);
    }
  }, []);

  const addScreen = async (theaterId: string, payload: Screen) => {
    try {
      setLoading(true);
      setError(null);

      const screen = await createScreen(theaterId, payload);
      setScreens((current) => [...current, screen]);
    } catch (requestError) {
      setError("Failed to create screen");
      throw requestError;
    } finally {
      setLoading(false);
    }
  };

  const editScreen = async (
    theaterId: string,
    screenId: string,
    payload: UpdateScreenPayload,
  ) => {
    try {
      setLoading(true);
      setError(null);

      const updatedScreen = await updateScreen(theaterId, screenId, payload);

      setScreens((current) =>
        current.map((screen) =>
          screen.id === screenId ? updatedScreen : screen,
        ),
      );
    } catch (requestError) {
      setError("Failed to update screen");
      throw requestError;
    } finally {
      setLoading(false);
    }
  };

  const removeScreen = async (theaterId: string, screenId: string) => {
    try {
      setLoading(true);
      setError(null);

      await deleteScreen(theaterId, screenId);

      setScreens((current) =>
        current.filter((screen) => screen.id !== screenId),
      );
    } catch (requestError) {
      setError("Failed to delete screen");
      throw requestError;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (theaterId) {
      void fetchScreens(theaterId);
    } else {
      setScreens([]);
    }
  }, [fetchScreens, theaterId]);

  return {
    screens,
    loading,
    error,
    fetchScreens,
    addScreen,
    editScreen,
    removeScreen,
  };
}
