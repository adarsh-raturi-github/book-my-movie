import { useContext } from "react";

import { TheaterContext } from "../context/TheaterContext";

export function useTheater() {
  const context = useContext(TheaterContext);

  if (!context) {
    throw new Error("useTheaters must be used inside TheaterProvider");
  }

  return context;
}
