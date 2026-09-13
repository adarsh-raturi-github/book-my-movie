import type { MovieCategory } from "./types";

interface SearchFilterProps {
  searchQuery: string;
  selectedGenre: string | null;
  categories: MovieCategory[];
  onSearchChange: (query: string) => void;
  onGenreChange: (genre: string | null) => void;
}

export function SearchFilter({
  searchQuery,
  selectedGenre,
  categories,
  onSearchChange,
  onGenreChange,
}: SearchFilterProps) {
  return (
    <section className="search-section">
      <div className="search-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search movies..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="genre-filters">
          <button
            className={`genre-btn ${selectedGenre === null ? "active" : ""}`}
            onClick={() => onGenreChange(null)}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.name}
              className={`genre-btn ${selectedGenre === category.name ? "active" : ""}`}
              onClick={() => onGenreChange(category.name)}
            >
              <span>{category.icon}</span> {category.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
