import type { Movie } from "./types";

interface HeroSectionProps {
  movie: Movie;
  onBookClick: (movieId: string) => void;
}

export function HeroSection({ movie, onBookClick }: HeroSectionProps) {
  return (
    <section className="hero-section">
      <div
        className="hero-background"
        style={{ backgroundImage: `url(${movie.poster})` }}
      >
        <div className="hero-overlay"></div>
      </div>
      <div className="hero-content">
        <h2 className="hero-title">{movie.title}</h2>
        <div className="hero-meta">
          <span className="rating">⭐ {movie.rating}/10</span>
          <span className="genres">{movie.genre.join(" • ")}</span>
        </div>
        <p className="hero-description">
          Experience the extraordinary. Book your seats now and immerse yourself
          in an unforgettable cinematic journey.
        </p>
        <button className="btn-primary" onClick={() => onBookClick(movie.id)}>
          Book Now
        </button>
      </div>
    </section>
  );
}
