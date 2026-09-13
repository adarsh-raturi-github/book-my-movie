import type { Movie } from "./types";
import { MovieCard } from "./MovieCard";

interface MoviesGridProps {
  movies: Movie[];
  selectedGenre: string | null;
  onBookClick: (movieId: string) => void;
}

export function MoviesGrid({
  movies,
  selectedGenre,
  onBookClick,
}: MoviesGridProps) {
  return (
    <section className="movies-section">
      <div className="movies-container">
        <h2 className="section-title">
          {selectedGenre ? `${selectedGenre} Movies` : "Now Showing"}
          <span className="movie-count">({movies.length})</span>
        </h2>

        {movies.length > 0 ? (
          <div className="movies-grid">
            {movies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onBookClick={onBookClick}
              />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <p>No movies found matching your criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
}
