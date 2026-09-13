import type { SeatCategory } from "../types/seat";

interface SeatLegendProps {
  categories?: SeatCategory[];
}

export function SeatLegend(_props: SeatLegendProps) {
  const legendItems = [
    { status: "available", label: "Available", color: "#6366f1" },
    { status: "selected", label: "Selected", color: "#ec4899" },
    { status: "booked", label: "Booked", color: "#64748b" },
    { status: "blocked", label: "Blocked", color: "#991b1b" },
  ];

  return (
    <div className="seat-legend">
      <h3>Legend</h3>
      <div className="legend-items">
        {legendItems.map((item) => (
          <div key={item.status} className="legend-item">
            <div className={`legend-box seat-${item.status}`}></div>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
