import { NavLink } from "react-router-dom";

interface AdminSidebarProps {
  onLogout: () => void;
}

const navigation = [
  { path: "/admin", label: "Overview", icon: "▦" },
  { path: "/admin/movies", label: "Movies", icon: "▶" },
  { path: "/admin/theaters", label: "Theaters", icon: "▤" },
  { path: "/admin/shows", label: "Shows & screens", icon: "◷" },
];

export function AdminSidebar({ onLogout }: AdminSidebarProps) {
  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <span className="admin-brand-icon">🎬</span>

        <div>
          <strong>BookMyMovie</strong>
          <span>Operations</span>
        </div>
      </div>

      <div className="admin-sidebar-label">Manage</div>

      <nav className="admin-nav" aria-label="Admin navigation">
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <span aria-hidden="true">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button className="admin-logout" type="button" onClick={onLogout}>
        <span aria-hidden="true">↪</span>
        Log out
      </button>
    </aside>
  );
}
