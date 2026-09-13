export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://book-my-movie.dev/";

export const ENDPOINTS = {
  MOVIES: "/movies",
  BOOKINGS: "/bookings",
  GENRES: "/genres",
  REVIEWS: "/reviews",
};

export const GENRES = [
  { name: "Action", icon: "🎬" },
  { name: "Comedy", icon: "😂" },
  { name: "Drama", icon: "🎭" },
  { name: "Sci-Fi", icon: "🚀" },
  { name: "Thriller", icon: "😱" },
  { name: "Romance", icon: "💕" },
  { name: "Horror", icon: "👻" },
  { name: "Animation", icon: "🎨" },
];

export const MOCK_MOVIES = [
  {
    id: "1",
    title: "The Quantum Paradox",
    rating: 8.5,
    genre: ["Sci-Fi", "Thriller"],
    releaseDate: "2024-12-15",
    poster: "https://via.placeholder.com/200x300/6366f1/ffffff?text=Quantum",
    featured: true,
  },
  {
    id: "2",
    title: "Echoes of Tomorrow",
    rating: 7.9,
    genre: ["Drama", "Sci-Fi"],
    releaseDate: "2024-11-20",
    poster: "https://via.placeholder.com/200x300/8b5cf6/ffffff?text=Echoes",
  },
  {
    id: "3",
    title: "Midnight Chronicles",
    rating: 8.2,
    genre: ["Action", "Mystery"],
    releaseDate: "2024-10-10",
    poster: "https://via.placeholder.com/200x300/ec4899/ffffff?text=Midnight",
  },
  {
    id: "4",
    title: "Eternal Sunrise",
    rating: 7.6,
    genre: ["Romance", "Comedy"],
    releaseDate: "2024-09-05",
    poster: "https://via.placeholder.com/200x300/f59e0b/ffffff?text=Sunrise",
  },
  {
    id: "5",
    title: "Shadow Protocol",
    rating: 8.7,
    genre: ["Thriller", "Action"],
    releaseDate: "2024-12-01",
    poster: "https://via.placeholder.com/200x300/06b6d4/ffffff?text=Shadow",
  },
];
