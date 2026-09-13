import type { Theater } from "../../../interfaces";

interface TheaterDetailsProps {
  theater: Theater;
  onEdit: () => void;
  onDelete: () => void;
}

export function TheaterDetails({
  theater,
  onEdit,
  onDelete,
}: TheaterDetailsProps) {
  console.log(theater);
  return (
    <div>
      <section className="admin-panel theater-details-panel">
        <div className="admin-panel-heading">
          <div>
            <span className="admin-kicker">Selected theater</span>
            <h3>{theater.name}</h3>
          </div>
          <span className="admin-screen-badge">Active</span>
        </div>
        <p className="theater-description">
          {theater.description || "No description provided."}
        </p>
        <div className="theater-details-grid">
          <div>
            <span>Phone</span>
            <strong>{theater.phoneNumber || "-"}</strong>
          </div>
          <div>
            <span>Timezone</span>
            <strong>{theater.timezone || "-"}</strong>
          </div>
          <div>
            <span>Address</span>
            <strong>
              {[theater.addressLine1, theater.addressLine2]
                .filter(Boolean)
                .join(", ") || "-"}
            </strong>
          </div>
          <div>
            <span>Location</span>
            <strong>
              {[
                theater.city,
                theater.state,
                theater.country,
                theater.postalCode,
              ]
                .filter(Boolean)
                .join(", ") || "-"}
            </strong>
          </div>
        </div>
        <div className="admin-form-actions">
          <button
            className="admin-secondary-button"
            type="button"
            onClick={onEdit}
          >
            Edit theater
          </button>
          <button
            className="admin-danger-button"
            type="button"
            onClick={onDelete}
          >
            Delete theater
          </button>
        </div>
      </section>
      <section>
        <div>Screen List</div>
      </section>
    </div>
  );
}
