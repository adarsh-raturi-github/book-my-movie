import type { FormEvent } from "react";

interface AdminResourceFormProps {
  resource: "movie" | "screen" | "show";
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  theaterOptions?: string[];
}

export function AdminResourceForm({
  resource,
  onSubmit,
  theaterOptions = [],
}: AdminResourceFormProps) {
  if (resource === "movie") {
    return (
      <form className="admin-form" onSubmit={onSubmit}>
        <div className="admin-form-heading">
          <div>
            <span className="admin-kicker">Catalog</span>
            <h3>Add movie</h3>
          </div>
          <span className="admin-form-icon">▶</span>
        </div>
        <label>
          Movie title
          <input name="title" placeholder="e.g. The Quantum Paradox" required />
        </label>
        <div className="admin-form-row">
          <label>
            Certificate
            <select name="certificate" defaultValue="UA" required>
              <option value="U">U</option>
              <option value="UA">UA</option>
              <option value="A">A</option>
            </select>
          </label>
          <label>
            Duration
            <input name="duration" placeholder="2h 20m" required />
          </label>
        </div>
        <button className="admin-primary-button" type="submit">
          Add movie
        </button>
      </form>
    );
  }

  if (resource === "screen") {
    return (
      <form className="admin-form" onSubmit={onSubmit}>
        <div className="admin-form-heading">
          <div>
            <span className="admin-kicker">Inventory</span>
            <h3>Add screen</h3>
          </div>
          <span className="admin-form-icon">▦</span>
        </div>
        <label>
          Theater
          <select
            name="theater"
            defaultValue=""
            required
            disabled={theaterOptions.length === 0}
          >
            <option value="" disabled>
              {theaterOptions.length === 0
                ? "Create a theater first"
                : "Select theater"}
            </option>
            {theaterOptions.map((theater) => (
              <option key={theater} value={theater}>
                {theater}
              </option>
            ))}
          </select>
        </label>
        <div className="admin-form-row">
          <label>
            Screen name
            <input name="screenName" placeholder="Screen 1" required />
          </label>
          <label>
            Seat capacity
            <input
              name="capacity"
              type="number"
              min="1"
              placeholder="120"
              required
            />
          </label>
        </div>
        <button className="admin-primary-button" type="submit">
          Add screen
        </button>
      </form>
    );
  }

  return (
    <form className="admin-form" onSubmit={onSubmit}>
      <div className="admin-form-heading">
        <div>
          <span className="admin-kicker">Programming</span>
          <h3>Schedule show</h3>
        </div>
        <span className="admin-form-icon">◷</span>
      </div>
      <label>
        Movie
        <select name="movie" defaultValue="" required>
          <option value="" disabled>
            Select movie
          </option>
          <option>The Quantum Paradox</option>
          <option>Echoes of Tomorrow</option>
        </select>
      </label>
      <div className="admin-form-row">
        <label>
          Theater
          <select name="theater" defaultValue="" required>
            <option value="" disabled>
              Select theater
            </option>
            <option>PVR Orion Mall</option>
            <option>INOX Garuda Mall</option>
          </select>
        </label>
        <label>
          Screen
          <input name="screen" placeholder="Screen 1" required />
        </label>
      </div>
      <div className="admin-form-row">
        <label>
          Date
          <input name="date" type="date" required />
        </label>
        <label>
          Time
          <input name="time" type="time" required />
        </label>
      </div>
      <button className="admin-primary-button" type="submit">
        Schedule show
      </button>
    </form>
  );
}
