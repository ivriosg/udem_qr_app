import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import AccessConfig from "./AccessConfig";
import AdminUserManager from "./AdminUserManager";
import AdminLayout from "./AdminLayout";
import "./dark-mode-admin.css";

export default function AdminRoutes() {
  return (
    <AdminLayout>
      <div className="container-fluid bg-dark text-white min-vh-100 p-4">
        <nav className="mb-4 d-flex flex-wrap gap-2 justify-content-start">
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `btn btn-sm fw-semibold ${
                isActive ? "btn-custom-yellow" : "btn-outline-light"
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/config"
            className={({ isActive }) =>
              `btn btn-sm fw-semibold ${
                isActive ? "btn-custom-yellow" : "btn-outline-light"
              }`
            }
          >
            Configurar Accesos
          </NavLink>
          <NavLink
            to="/admin/usuarios"
            className={({ isActive }) =>
              `btn btn-sm fw-semibold ${
                isActive ? "btn-custom-yellow" : "btn-outline-light"
              }`
            }
          >
            Gestión de Usuarios
          </NavLink>
        </nav>

        <div className="bg-dark border rounded p-3 shadow-sm">
          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="config" element={<AccessConfig />} />
            <Route path="usuarios" element={<AdminUserManager />} />
          </Routes>
        </div>
      </div>
    </AdminLayout>
  );
}
