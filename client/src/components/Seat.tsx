import type { Seat } from "../types/seat";

interface SeatProps {
  seat: Seat;
  onSelect: (seat: Seat) => void;
  isSelected: boolean;
}

export function Seat({ seat, onSelect, isSelected }: SeatProps) {
  const getStatusClass = () => {
    if (isSelected) return "selected";
    return seat.status;
  };

  const handleClick = () => {
    if (
      seat.status === "available" ||
      (seat.status === "selected" && isSelected)
    ) {
      onSelect(seat);
    }
  };

  const isClickable =
    seat.status === "available" || (seat.status === "selected" && isSelected);

  return (
    <button
      className={`seat seat-${getStatusClass()} ${isClickable ? "" : "seat-disabled"}`}
      onClick={handleClick}
      disabled={!isClickable}
      title={`${seat.row}-${seat.number} (${seat.category}) - ₹${seat.price}`}
      aria-label={`Seat ${seat.row}-${seat.number}, ${seat.status}`}
    >
      {seat.number}
    </button>
  );
}
