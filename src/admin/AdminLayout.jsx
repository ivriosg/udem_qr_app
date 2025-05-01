import React, { useEffect, useState } from "react";
import AdminLogin from "./AdminLogin";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function AdminLayout({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = sessionStorage.getItem("adminUser");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("adminUser");
    navigate("/admin", { replace: true });
    setUser(null);
  };

  if (!user) {
    return <AdminLogin onLogin={setUser} />;
  }

  return (
    <div className="dark-mode-admin">
      <Navbar onReset={handleLogout} />
      <main className="flex-grow-1 container-fluid p-4">{children}</main>
    </div>
  );
}
