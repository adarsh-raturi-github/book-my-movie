import { useState, type FormEvent } from "react";
import { AdminResourceForm } from "../AdminResourceForm";
import type { Movie } from "../../../interfaces";

const initialMovies: Movie[] = [
  {
    id: "mov-1",
    title: "The Quantum Paradox",
    certificate: "UA",
    duration: "2h 20m",
  },
  {
    id: "mov-2",
    title: "Echoes of Tomorrow",
    certificate: "U",
    duration: "2h 05m",
  },
];

export function MoviesManagement() {
  const [movies, setMovies] = useState(initialMovies);

  const handleCreate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    setMovies((current) => [
      ...current,
      {
        id: `mov-${Date.now()}`,
        title: String(formData.get("title") ?? ""),
        certificate: String(formData.get("certificate") ?? ""),
        duration: String(formData.get("duration") ?? ""),
      },
    ]);
    event.currentTarget.reset();
  };

  return (
    <section className="admin-content-section">
      <div className="admin-page-heading">
        <div>
          <span className="admin-kicker">Catalog</span>
          <h2>Movies</h2>
          <p>Create and maintain the titles available for booking.</p>
        </div>
      </div>
      <div className="admin-workspace-grid">
        <AdminResourceForm resource="movie" onSubmit={handleCreate} />
        <div className="admin-panel admin-list-panel">
          <div className="admin-panel-heading">
            <h3>Movie catalog</h3>
            <span>{movies.length} titles</span>
          </div>
          {movies.map((movie) => (
            <div className="admin-list-row" key={movie.id}>
              <span className="admin-poster-mark">▶</span>
              <div>
                <strong>{movie.title}</strong>
                <small>
                  {movie.certificate} · {movie.duration}
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
