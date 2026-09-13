import { useState, useMemo } from "react";
import type { Movie, MovieCategory } from "./components";
import {
  Header,
  HeroSection,
  SearchFilter,
  MoviesGrid,
  CTASection,
  Footer,
} from "./components";
import { SeatSelectionPage } from "./pages/SeatSelectionPage";
import { LoginPage } from "./auth/pages/LoginPage";
import "./App.css";
import { useLogout } from "./auth/hooks/useLogout";
import { AdminDashboard } from "./admin/pages/AdminDashboard";
import { Role } from "./auth/types/role";
import { Route, Routes } from "react-router-dom";
import { AdminOverview } from "./admin/components";
import { useNavigate } from "react-router-dom";
import { TheaterDetails } from "./admin/components/theater/TheaterDetails";
import { TheatersManagementPage } from "./admin/pages/theaters/TheaterManagementPage";
import { TheaterDetailsPage } from "./admin/pages/theaters/TheaterDetailsPage";
import { TheaterLayout } from "./admin/layouts/TheaterLayout";

function App() {
  const [currentPage, setCurrentPage] = useState<
    "home" | "seats" | "signin" | "admin"
  >("home");
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(localStorage.getItem("token")),
  );
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const { logout, loading: logoutLoading, error: logoutError } = useLogout();
  const navigate = useNavigate();
  // Mock data - in production, this would come from an API
  const movies: Movie[] = [
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

  const categories: MovieCategory[] = [
    { name: "Action", icon: "🎬" },
    { name: "Comedy", icon: "😂" },
    { name: "Drama", icon: "🎭" },
    { name: "Sci-Fi", icon: "🚀" },
    { name: "Thriller", icon: "😱" },
  ];

  // Filter movies based on search and genre
  const filteredMovies = useMemo(() => {
    return movies.filter((movie) => {
      const matchesSearch = movie.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesGenre =
        !selectedGenre || movie.genre.includes(selectedGenre);
      return matchesSearch && matchesGenre;
    });
  }, [searchQuery, selectedGenre]);

  const featuredMovie = movies.find((m) => m.featured);

  const handleBookMovie = (movieId: string) => {
    console.log(`Booking movie: ${movieId}`);
    setCurrentPage("seats");
  };

  const handleSubscribe = () => {
    console.log("Newsletter subscription");
    // In production: handle newsletter subscription
  };

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
    }
  };

  // // Keep all hooks above these page-specific returns so their order never changes.
  // if (currentPage === "seats") {
  //   return (
  //     <SeatSelectionPage
  //       movieId="1"
  //       movieTitle="The Quantum Paradox"
  //       screenId="screen_5"
  //       showTime="7:00 PM - 9:30 PM"
  //     />
  //   );
  // }

  return (
    <div className="app">
      <Header
      // onNavigate={(section) => console.log(`Navigating to ${section}`)}
      // onSignIn={() => setCurrentPage("signin")}
      // isAuthenticated={isAuthenticated}
      // isAdmin={isAdmin}
      // onLogout={handleLogout}
      // logoutLoading={logoutLoading}
      // logoutError={logoutError}
      />

      <Routes>
        {/* Admin */}
        <Route
          path="/admin"
          element={
            <AdminDashboard
              onLogout={() => {
                localStorage.removeItem("token");
                setIsAuthenticated(false);
                setIsAdmin(false);
                setCurrentPage("home");
              }}
            />
          }
        >
          <Route index element={<AdminOverview />} />
          {/* <Route path="movies" element={<AdminMovies />} /> */}

          <Route path="theaters" element={<TheaterLayout />}>
            <Route index element={<TheatersManagementPage />} />
            <Route path=":id" element={<TheaterDetailsPage />} />
          </Route>
        </Route>
        <Route
          path="/signin"
          element={
            <LoginPage
              onBack={() => setCurrentPage("home")}
              onSuccess={(role) => {
                setIsAuthenticated(true);
                setIsAdmin(role === Role.ADMIN);
                if (role === Role.ADMIN) {
                  navigate("/admin");
                } else {
                  navigate("/");
                }
              }}
            />
          }
        />
      </Routes>
      {/* {featuredMovie && (
        <HeroSection movie={featuredMovie} onBookClick={handleBookMovie} />
      )} */}

      {/* <SearchFilter
        searchQuery={searchQuery}
        selectedGenre={selectedGenre}
        categories={categories}
        onSearchChange={setSearchQuery}
        onGenreChange={setSelectedGenre}
      />

      <div style={{ border: "3px solid red" }}>
        <MoviesGrid
          movies={filteredMovies}
          selectedGenre={selectedGenre}
          onBookClick={handleBookMovie}
        />
      </div> */}

      <Footer />
    </div>
  );
}

export default App;
