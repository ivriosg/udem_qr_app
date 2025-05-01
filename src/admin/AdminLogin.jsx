import React, { useState } from "react";
import { loginWithGoogle } from "../firebase/auth";
import { useNavigate, useLocation } from "react-router-dom";

export default function AdminLogin({ onLogin }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async () => {
    setLoading(true);
    const user = await loginWithGoogle();
    setLoading(false);
    if (user) {
      sessionStorage.setItem("adminUser", JSON.stringify(user));
      onLogin(user);
      const from = location.state?.from?.pathname || "/admin";
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="dark-mode-admin d-flex flex-column justify-content-center align-items-center min-vh-100 text-center p-4">
      <h1 className="h3 fw-bold mb-4">Acceso administrativo</h1>
      <button
        onClick={handleLogin}
        disabled={loading}
        className="btn btn-custom-yellow px-4 py-2"
      >
        {loading ? "Cargando..." : "Iniciar sesión con Google"}
      </button>
    </div>
  );
}
