import type { Movie } from "./types";

interface MovieCardProps {
  movie: Movie;
  onBookClick: (movieId: string) => void;
}

export function MovieCard({ movie, onBookClick }: MovieCardProps) {
  return (
    <div className="movie-card">
      <div className="movie-poster">
        <img src={movie.poster} alt={movie.title} />
        <div className="movie-overlay">
          <button className="btn-book" onClick={() => onBookClick(movie.id)}>
            Book Tickets
          </button>
        </div>
      </div>
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <div className="movie-rating">
          <span className="stars">⭐ {movie.rating}</span>
          <span className="genre-tag">{movie.genre[0]}</span>
        </div>
        <p className="movie-date">
          {new Date(movie.releaseDate).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
