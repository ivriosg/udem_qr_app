import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LogoUDEM from "../assets/logo_udem.png";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

toastr.options = {
  positionClass: "toast-bottom-full-width",
  timeOut: 3000,
  closeButton: true,
};

export default function Navbar({ onReset }) {
  const navigate = useNavigate();
  const location = useLocation();

  const user = sessionStorage.getItem("usuario");
  const admin = sessionStorage.getItem("adminUser");
  const isOnAdmin = location.pathname.startsWith("/admin");

  const handleLogoutAdmin = () => {
    sessionStorage.removeItem("adminUser");
    toastr.success("Sesión cerrada exitosamente");
    navigate("/", { replace: true });
  };

  const handleGoToAdmin = () => {
    navigate("/admin");
  };

  const handleGoToHome = () => {
    navigate("/");
  };

  const handleResetUser = () => {
    sessionStorage.removeItem("usuario");
    sessionStorage.removeItem("acceso");
    onReset();
  };

  return (
    <nav className="navbar navbar-dark bg-dark px-4 py-2 d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center">
        <img
          src={LogoUDEM}
          alt="UDEM"
          style={{ height: 70 }}
          className="me-2"
        />
      </div>

      <div className="d-flex gap-2">
        {user && !isOnAdmin && (
          <button
            className="btn btn-custom-yellow fw-semibold"
            onClick={handleResetUser}
          >
            Cambiar de usuario
          </button>
        )}

        {!isOnAdmin && (
          <button
            className="btn btn-outline-light fw-semibold"
            onClick={handleGoToAdmin}
          >
            Panel de administración
          </button>
        )}

        {isOnAdmin && admin && (
          <div className="d-flex gap-2">
            <button
              className="btn btn-custom-yellow fw-semibold"
              onClick={handleGoToHome}
            >
              Ver sistema
            </button>
            <button
              className="btn btn-outline-light fw-semibold"
              onClick={handleLogoutAdmin}
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
