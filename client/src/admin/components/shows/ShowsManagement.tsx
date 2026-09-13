import { useState, type FormEvent } from "react";
import { AdminResourceForm } from "../AdminResourceForm";
import type { Show } from "../../../interfaces";

const initialShows: Show[] = [
  {
    id: "show-1",
    movie: "The Quantum Paradox",
    theater: "PVR Orion Mall",
    screen: "Screen 1",
    date: "Today",
    time: "7:00 PM",
  },
];

export function ShowsManagement() {
  const [shows, setShows] = useState(initialShows);

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const value = (name: string) => String(formData.get(name) ?? "");

    setShows((current) => [
      ...current,
      {
        id: `show-${Date.now()}`,
        movie: value("movie"),
        theater: value("theater"),
        screen: value("screen"),
        date: value("date"),
        time: value("time"),
      },
    ]);
    event.currentTarget.reset();
  };

  return (
    <section className="admin-content-section">
      <div className="admin-page-heading">
        <div>
          <span className="admin-kicker">Programming</span>
          <h2>Shows & screens</h2>
          <p>Assign movies to theater screens and publish show timings.</p>
        </div>
      </div>
      <div className="admin-workspace-grid">
        <AdminResourceForm resource="show" onSubmit={handleCreate} />
        <div className="admin-panel admin-list-panel">
          <div className="admin-panel-heading">
            <h3>Show schedule</h3>
            <span>{shows.length} scheduled</span>
          </div>
          {shows.map((show) => (
            <div className="admin-list-row" key={show.id}>
              <span className="admin-poster-mark">◷</span>
              <div>
                <strong>{show.movie}</strong>
                <small>
                  {show.theater} · {show.screen} · {show.date} {show.time}
                </small>
              </div>
              <button type="button">⋯</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
