import type { Seat } from "../types/seat";

interface SeatSummaryProps {
  selectedSeats: Seat[];
  totalPrice: number;
  onConfirm: () => void;
  onClear: () => void;
  isLoading?: boolean;
}

export function SeatSummary({
  selectedSeats,
  totalPrice,
  onConfirm,
  onClear,
  isLoading,
}: SeatSummaryProps) {
  const maxSeats = 10;

  return (
    <div className="seat-summary">
      <div className="summary-content">
        <div className="summary-section">
          <h3>
            Selected Seats ({selectedSeats.length}/{maxSeats})
          </h3>
          {selectedSeats.length > 0 ? (
            <div className="selected-seats-list">
              {selectedSeats.map((seat) => (
                <span key={seat.id} className="seat-badge">
                  {seat.row}-{seat.number}
                  <span className="seat-price">₹{seat.price}</span>
                </span>
              ))}
            </div>
          ) : (
            <p className="no-selection">No seats selected</p>
          )}
        </div>

        <div className="summary-divider"></div>

        <div className="summary-section">
          <div className="summary-row">
            <span>Subtotal:</span>
            <span>₹{totalPrice}</span>
          </div>
          <div className="summary-row">
            <span>Convenience Fee:</span>
            <span>₹{Math.round(totalPrice * 0.05)}</span>
          </div>
          <div className="summary-row total">
            <span>Total Amount:</span>
            <span>₹{Math.round(totalPrice * 1.05)}</span>
          </div>
        </div>

        <div className="summary-actions">
          <button
            className="btn-clear"
            onClick={onClear}
            disabled={selectedSeats.length === 0 || isLoading}
          >
            Clear Selection
          </button>
          <button
            className="btn-confirm"
            onClick={onConfirm}
            disabled={selectedSeats.length === 0 || isLoading}
          >
            {isLoading ? "Processing..." : "Proceed to Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}
