import { useCallback } from "react";

interface BookingData {
  movieId: string;
  timestamp: string;
}

export function useBooking() {
  const bookMovie = useCallback((movieId: string) => {
    const bookingData: BookingData = {
      movieId,
      timestamp: new Date().toISOString(),
    };

    // In production, this would be an API call
    console.log("Booking movie:", bookingData);

    // Store in local storage for demo
    const bookings = JSON.parse(localStorage.getItem("bookings") || "[]");
    bookings.push(bookingData);
    localStorage.setItem("bookings", JSON.stringify(bookings));

    // Show success message
    alert(`Successfully booked movie ${movieId}!`);

    return bookingData;
  }, []);

  const getBookings = useCallback(() => {
    return JSON.parse(localStorage.getItem("bookings") || "[]");
  }, []);

  return { bookMovie, getBookings };
}
