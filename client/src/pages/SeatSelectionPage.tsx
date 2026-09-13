import { useState, useEffect } from "react";
import { SeatLayout, SeatLegend, SeatSummary } from "../components";
import { useSeatSelection } from "../hooks/useSeatSelection";
import { useSeatData } from "../hooks/useSeatData";
import type { SeatCategory } from "../types/seat";
import "../styles/SeatSelection.css";

interface SeatSelectionPageProps {
  movieId: string;
  movieTitle: string;
  screenId: string;
  showTime: string;
}

export function SeatSelectionPage({
  movieId,
  movieTitle,
  screenId,
  showTime,
}: SeatSelectionPageProps) {
  const [activeCategory, setActiveCategory] = useState<SeatCategory | null>(
    null,
  );
  const { seats, loading, error: seatError } = useSeatData(screenId);
  const {
    selectedSeats,
    toggleSeat,
    clearSelection,
    processBooking,
    getStats,
    isProcessing,
    error: bookingError,
  } = useSeatSelection({ movieId, screenId });

  const stats = getStats();
  const error = seatError || bookingError;

  const handleSeatSelect = (seat: any) => {
    toggleSeat(seat);
  };

  const handleConfirmBooking = async () => {
    const booking = await processBooking();
    if (booking) {
      console.log("Booking confirmed:", booking);
      // Show success message or redirect
    }
  };

  const categories: SeatCategory[] = ["premium", "standard", "economy"];

  return (
    <div className="seat-selection-page">
      {/* Header */}
      <header className="seat-selection-header">
        <div className="seat-selection-header-content">
          <button className="btn-back">← Back</button>
          <div className="seat-selection-info">
            <h1>{movieTitle}</h1>
            <p>{showTime}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="seat-selection-container">
        <div className="seat-selection-main">
          {/* Screen Section */}
          <div className="screen-section">
            <div className="screen">Screen</div>
          </div>

          {/* Error Alert */}
          {error && <div className="alert alert-error">{error}</div>}

          {/* Loading State */}
          {loading ? (
            <div className="loading">Loading seats...</div>
          ) : (
            <>
              {/* Category Tabs */}
              <div className="category-tabs">
                <button
                  className={`category-tab ${activeCategory === null ? "active" : ""}`}
                  onClick={() => setActiveCategory(null)}
                >
                  All Seats
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`category-tab ${activeCategory === cat ? "active" : ""}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>

              {/* Seat Layout */}
              {activeCategory ? (
                <SeatLayout
                  seats={seats}
                  selectedSeats={selectedSeats}
                  onSeatSelect={handleSeatSelect}
                  category={activeCategory}
                />
              ) : (
                <>
                  {categories.map((category) => (
                    <SeatLayout
                      key={category}
                      seats={seats}
                      selectedSeats={selectedSeats}
                      onSeatSelect={handleSeatSelect}
                      category={category}
                    />
                  ))}
                </>
              )}

              {/* Legend */}
              <SeatLegend categories={categories} />
            </>
          )}
        </div>

        {/* Sidebar Summary */}
        <aside className="seat-selection-sidebar">
          <SeatSummary
            selectedSeats={selectedSeats}
            totalPrice={stats.totalPrice}
            onConfirm={handleConfirmBooking}
            onClear={clearSelection}
            isLoading={isProcessing}
          />
        </aside>
      </div>
    </div>
  );
}
