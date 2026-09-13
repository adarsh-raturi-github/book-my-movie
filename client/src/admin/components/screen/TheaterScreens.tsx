import { useState } from "react";
import type { Screen, Theater } from "../../../interfaces";
import { useScreen } from "../../hooks/useScreen";
import { ScreenDialog } from "./ScreenDialog";

interface TheaterScreensProps {
  theater: Theater;
}

export function TheaterScreens({ theater }: TheaterScreensProps) {
  const { screens, loading, error, addScreen, editScreen, removeScreen } =
    useScreen(theater.id);
  const [dialogScreen, setDialogScreen] = useState<Screen | null | undefined>(
    undefined,
  );

  const handleDelete = async (screen: Screen) => {
    if (!window.confirm(`Delete ${screen.name}?`)) return;
    await removeScreen(theater.id, screen.id);
  };

  return (
    <section className="admin-panel theater-screens-panel">
      <div className="admin-panel-heading">
        <div>
          <span className="admin-kicker">Screen inventory</span>
          <h3>{theater.name} screens</h3>
        </div>
        <button
          className="admin-primary-button"
          type="button"
          onClick={() => setDialogScreen(null)}
        >
          ＋ Add screen
        </button>
      </div>

      {error && (
        <p className="profile-error" role="alert">
          {error}
        </p>
      )}
      {loading && <p className="admin-notice">Loading screens...</p>}
      {!loading && screens.length === 0 && (
        <p className="theater-empty-state">
          No screens configured for this theater.
        </p>
      )}

      {screens.length > 0 && (
        <div
          className="screen-table"
          role="table"
          aria-label={`${theater.name} screens`}
        >
          <div className="screen-table-row screen-table-header" role="row">
            <span>SCREEN</span>
            <span>TYPE</span>
            <span>CAPACITY</span>
            <span>STATUS</span>
            <span />
          </div>
          {screens.map((screen) => (
            <div className="screen-table-row" key={screen.id} role="row">
              <span>
                <b>▦</b>
                {screen.name}
              </span>
              <span>{screen.type}</span>
              <span>{screen.capacity} seats</span>
              <span>
                <i className="theater-status-dot" />
                {screen.status}
              </span>
              <span className="theater-row-actions">
                <button
                  type="button"
                  aria-label={`Edit ${screen.name}`}
                  onClick={() => setDialogScreen(screen)}
                >
                  ✎
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${screen.name}`}
                  onClick={() => handleDelete(screen)}
                >
                  ▥
                </button>
              </span>
            </div>
          ))}
        </div>
      )}

      {dialogScreen !== undefined && (
        <ScreenDialog
          theaterId={theater.id}
          screen={dialogScreen}
          loading={loading}
          onClose={() => setDialogScreen(undefined)}
          onCreate={(payload) => addScreen(theater.id, payload)}
          onUpdate={(screenId, payload) =>
            editScreen(theater.id, screenId, payload)
          }
        />
      )}
    </section>
  );
}
