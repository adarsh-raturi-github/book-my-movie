export function AdminOverview() {
  return (
    <>
      <div className="admin-page-heading">
        <div>
          <span className="admin-kicker">Control room</span>
          <h2>Good evening, Admin</h2>
          <p>Keep the movie catalog and show schedule moving.</p>
        </div>
        <span className="admin-status">
          <i /> All systems ready
        </span>
      </div>

      <div className="admin-stat-grid">
        <article>
          <span>Movies</span>
          <strong>Catalog</strong>
          <small>Manage titles</small>
        </article>
        <article>
          <span>Theaters</span>
          <strong>Locations</strong>
          <small>Manage screens</small>
        </article>
        <article>
          <span>Shows</span>
          <strong>Schedule</strong>
          <small>Publish timings</small>
        </article>
        <article>
          <span>Access</span>
          <strong>Admin</strong>
          <small>Workspace active</small>
        </article>
      </div>

      <div className="admin-overview-grid">
        <section className="admin-panel admin-quick-actions">
          <div className="admin-panel-heading">
            <div>
              <span className="admin-kicker">Shortcuts</span>
              <h3>What do you want to manage?</h3>
            </div>
          </div>
          <button type="button" onClick={() => {}}>
            <span>▶</span>
            <div>
              <strong>Add a movie</strong>
              <small>Update the cinema catalog</small>
            </div>
            <b>→</b>
          </button>
          <button type="button" onClick={() => {}}>
            <span>▤</span>
            <div>
              <strong>Add a theater or screen</strong>
              <small>Set up a new location</small>
            </div>
            <b>→</b>
          </button>
          <button type="button" onClick={() => {}}>
            <span>◷</span>
            <div>
              <strong>Schedule a show</strong>
              <small>Assign a movie to a screen</small>
            </div>
            <b>→</b>
          </button>
        </section>
        <section className="admin-panel admin-recent-panel">
          <div className="admin-panel-heading">
            <div>
              <span className="admin-kicker">Workflow</span>
              <h3>Recommended order</h3>
            </div>
          </div>
          <div className="admin-show-row">
            <span className="admin-show-time">01</span>
            <div>
              <strong>Create a movie</strong>
              <small>Add the title before scheduling.</small>
            </div>
            <span className="admin-live-dot" />
          </div>
          <div className="admin-show-row">
            <span className="admin-show-time">02</span>
            <div>
              <strong>Configure a screen</strong>
              <small>Attach the screen to a theater.</small>
            </div>
            <span className="admin-live-dot" />
          </div>
          <div className="admin-show-row">
            <span className="admin-show-time">03</span>
            <div>
              <strong>Schedule a show</strong>
              <small>Publish date and time.</small>
            </div>
            <span className="admin-live-dot" />
          </div>
        </section>
      </div>
    </>
  );
}
