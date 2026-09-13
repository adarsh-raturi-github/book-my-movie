import { AdminSidebar } from "../components/AdminSidebar";
import { Outlet } from "react-router-dom";

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  return (
    <div className="admin-layout">
      <AdminSidebar onLogout={onLogout} />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
