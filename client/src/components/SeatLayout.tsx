import type { Seat, SeatCategory } from "../types/seat";
import { SeatRow } from "./SeatRow";
import { groupSeatsByRow, getSeatCategoryLabel } from "../utils/seatUtils";

interface SeatLayoutProps {
  seats: Seat[];
  selectedSeats: Seat[];
  onSeatSelect: (seat: Seat) => void;
  category?: SeatCategory;
}

export function SeatLayout({
  seats,
  selectedSeats,
  onSeatSelect,
  category,
}: SeatLayoutProps) {
  // Filter seats by category if specified
  const filteredSeats = category
    ? seats.filter((s) => s.category === category)
    : seats;
  const rowsMap = groupSeatsByRow(filteredSeats);

  return (
    <div className="seat-layout">
      {category && (
        <h3 className="seat-layout-category">
          {getSeatCategoryLabel(category)}
        </h3>
      )}
      <div className="seat-grid">
        {Array.from(rowsMap.entries()).map(([row, rowSeats]) => (
          <SeatRow
            key={row}
            row={row}
            seats={rowSeats}
            selectedSeats={selectedSeats}
            onSeatSelect={onSeatSelect}
          />
        ))}
      </div>
    </div>
  );
}
