/**
 * Example: How to integrate Seat Selection into your app
 */

import { useState } from "react";
import { SeatSelectionPage } from "../pages/SeatSelectionPage";
import { OptimisticBookingHandler } from "../services/concurrentBookingHandler";

// Example 1: Standalone Seat Selection Route
export function BookingScreen() {
  return (
    <SeatSelectionPage
      movieId="movie_1"
      movieTitle="The Quantum Paradox"
      screenId="screen_5"
      showTime="7:00 PM - 9:30 PM"
    />
  );
}

// Example 2: With state management for navigation
export function BookingFlow() {
  const [currentStep] = useState<
    "movie" | "seats" | "payment" | "confirmation"
  >("movie");

  return (
    <div>
      {currentStep === "seats" && (
        <SeatSelectionPage
          movieId="movie_1"
          movieTitle="The Quantum Paradox"
          screenId="screen_5"
          showTime="7:00 PM - 9:30 PM"
        />
      )}
      <div>Example showing state management. Add other steps here.</div>
    </div>
  );
}

// Example 3: With concurrent booking handler
export function AdvancedBooking() {
  new OptimisticBookingHandler();

  return (
    <SeatSelectionPage
      movieId="movie_1"
      movieTitle="The Quantum Paradox"
      screenId="screen_5"
      showTime="7:00 PM - 9:30 PM"
    />
  );
}

// Example 4: Add to App Router (React Router)
export const seatSelectionRoutes = [
  {
    path: "/booking/:movieId/seats",
    element: <BookingScreen />,
    errorElement: <div>Error loading seat selection</div>,
  },
];

// Example 5: React Router integration (requires react-router-dom)
// To use: npm install react-router-dom
// Then uncomment and use in your App component:
//
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
//
// export function AppWithBooking() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/booking/:movieId/seats" element={<BookingScreen />} />
//       </Routes>
//     </Router>
//   )
// }
