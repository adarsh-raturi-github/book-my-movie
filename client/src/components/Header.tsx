import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

interface HeaderProps {
  onNavigate?: (section: string) => void;
  onSignIn?: () => void;
  isAuthenticated?: boolean;
  isAdmin?: boolean;
  onLogout?: () => void | Promise<void>;
  logoutLoading?: boolean;
  logoutError?: string | null;
}

const navigations = [
  {
    path: "/signin",
  },
];
export function Header() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <span className="logo-icon">🎬</span>
          <h1>BookMyMovie</h1>
        </div>
        <nav className="nav-menu">
          {/* <a
            href="#home"
            className="nav-link active"
            onClick={() => onNavigate?.("home")}
          >
            Home
          </a> */}
          {/* <a
            href="#movies"
            className="nav-link"
            onClick={() => onNavigate?.("movies")}
          >
            Movies
          </a>
          <a
            href="#bookings"
            className="nav-link"
            onClick={() => onNavigate?.("bookings")}
          >
            My Bookings
          </a> */}
          <button className="btn-login" type="button">
            <NavLink to="/signin">Sign In</NavLink>
          </button>
        </nav>
      </div>
    </header>
  );
}
