import type { Seat } from "../types/seat";
import { Seat as SeatComponent } from "./Seat";

interface SeatRowProps {
  row: string;
  seats: Seat[];
  selectedSeats: Seat[];
  onSeatSelect: (seat: Seat) => void;
}

export function SeatRow({
  row,
  seats,
  selectedSeats,
  onSeatSelect,
}: SeatRowProps) {
  const selectedIds = selectedSeats.map((s) => s.id);

  return (
    <div className="seat-row">
      <div className="seat-row-label">{row}</div>
      <div className="seat-row-seats">
        {seats.map((seat) => (
          <SeatComponent
            key={seat.id}
            seat={seat}
            onSelect={onSeatSelect}
            isSelected={selectedIds.includes(seat.id)}
          />
        ))}
      </div>
      <div className="seat-row-label">{row}</div>
    </div>
  );
}
