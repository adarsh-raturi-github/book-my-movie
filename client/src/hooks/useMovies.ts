import { useState, useEffect } from "react";
import type { Movie } from "../components/types";

interface UseMoviesOptions {
  searchQuery?: string;
  selectedGenre?: string | null;
}

export function useMovies(options: UseMoviesOptions = {}) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);

      try {
        // In production, this would be a real API call
        // const response = await fetch(`/api/movies?search=${options.searchQuery}&genre=${options.selectedGenre}`)
        // const data = await response.json()

        // Mock data for now
        const mockMovies: Movie[] = [
          {
            id: "1",
            title: "The Quantum Paradox",
            rating: 8.5,
            genre: ["Sci-Fi", "Thriller"],
            releaseDate: "2024-12-15",
            poster:
              "https://via.placeholder.com/200x300/6366f1/ffffff?text=Quantum",
            featured: true,
          },
          {
            id: "2",
            title: "Echoes of Tomorrow",
            rating: 7.9,
            genre: ["Drama", "Sci-Fi"],
            releaseDate: "2024-11-20",
            poster:
              "https://via.placeholder.com/200x300/8b5cf6/ffffff?text=Echoes",
          },
          {
            id: "3",
            title: "Midnight Chronicles",
            rating: 8.2,
            genre: ["Action", "Mystery"],
            releaseDate: "2024-10-10",
            poster:
              "https://via.placeholder.com/200x300/ec4899/ffffff?text=Midnight",
          },
          {
            id: "4",
            title: "Eternal Sunrise",
            rating: 7.6,
            genre: ["Romance", "Comedy"],
            releaseDate: "2024-09-05",
            poster:
              "https://via.placeholder.com/200x300/f59e0b/ffffff?text=Sunrise",
          },
          {
            id: "5",
            title: "Shadow Protocol",
            rating: 8.7,
            genre: ["Thriller", "Action"],
            releaseDate: "2024-12-01",
            poster:
              "https://via.placeholder.com/200x300/06b6d4/ffffff?text=Shadow",
          },
        ];

        setMovies(mockMovies);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch movies");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [options.searchQuery, options.selectedGenre]);

  return { movies, loading, error };
}
