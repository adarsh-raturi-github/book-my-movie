import type { Theater } from "../../../interfaces";

interface TheaterListProps {
  theaters: Theater[];
  loading: boolean;
  onSelect: (theater: Theater) => void;
  onEdit: (theater: Theater) => void;
  onDelete: (theater: Theater) => void;
}

export function TheaterList({
  theaters,
  loading,
  onSelect,
  onEdit,
  onDelete,
}: TheaterListProps) {
  return (
    <section className="admin-panel admin-list-panel">
      <div className="admin-panel-heading">
        <h3>Theater network</h3>
        <span>{theaters.length} locations</span>
      </div>
      {loading && <p className="admin-notice">Loading theaters...</p>}
      {!loading && theaters.length === 0 && (
        <p className="theater-empty-state">No theaters found.</p>
      )}
      {!loading && theaters.length > 0 && (
        <div className="theater-table" role="table" aria-label="Theaters">
          <div className="theater-table-row theater-table-header" role="row">
            <span>THEATER</span>
            <span>LOCATION</span>
            <span>SCREENS</span>
            <span>PHONE</span>
            <span>STATUS</span>
            <span aria-label="Actions" />
          </div>
          {theaters.map((theater) => (
            <div key={theater.id} role="row" onClick={() => onSelect(theater)}>
              <span className="theater-name-cell">
                <b>▣</b>
                {theater.name}
              </span>
              <span>
                {theater.city}
                {theater.state ? `, ${theater.state}` : ""}
              </span>
              <span>{theater.screens || 0} screens</span>
              <span>{theater.phoneNumber || "-"}</span>
              <span>
                <i className="theater-status-dot" />
                Active
              </span>
              <span className="theater-row-actions">
                <button
                  type="button"
                  aria-label={`Edit ${theater.name}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    onEdit(theater);
                  }}
                >
                  ✎
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${theater.name}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    onDelete(theater);
                  }}
                >
                  ▥
                </button>
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
