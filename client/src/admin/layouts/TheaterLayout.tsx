import { Outlet } from "react-router-dom";
import { TheaterProvider } from "../context/TheaterContext";

export function TheaterLayout() {
  return (
    <TheaterProvider>
      <Outlet />
    </TheaterProvider>
  );
}
