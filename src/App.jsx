import React, { useEffect, useState } from "react";
import AccessSelector from "./components/AccessSelector";
import QRScanner from "./components/QRScanner";
import MainLayout from "./layouts/MainLayout";
import "./darkMode.css";

function App() {
  const [userName, setUserName] = useState(
    () => sessionStorage.getItem("usuario") || ""
  );
  const [access, setAccess] = useState(
    () => sessionStorage.getItem("acceso") || ""
  );
  const [isNameConfirmed, setIsNameConfirmed] = useState(
    () => !!sessionStorage.getItem("usuario")
  );

  useEffect(() => {
    const handleUnload = () => {
      sessionStorage.removeItem("usuario");
      sessionStorage.removeItem("acceso");
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (userName.trim() === "") {
      alert("Por favor ingresa tu nombre");
      return;
    }
    sessionStorage.setItem("usuario", userName);
    setIsNameConfirmed(true);
  };

  const handleAccessSelect = (option) => {
    sessionStorage.setItem("acceso", option);
    setAccess(option);
  };

  const handleResetSession = () => {
    sessionStorage.removeItem("usuario");
    sessionStorage.removeItem("acceso");
    setUserName("");
    setIsNameConfirmed(false);
    setAccess("");
  };

  return (
    <MainLayout onReset={handleResetSession}>
      <h1 className="mt-3 text-center">Control de Acceso</h1>

      {!isNameConfirmed ? (
        <form onSubmit={handleNameSubmit} className="mt-4">
          <input
            type="text"
            className="form-control"
            placeholder="Ingresa tu nombre"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <button
            type="submit"
            className={`btn btn-custom-yellow mt-3 w-100 ${
              userName.trim() !== "" ? "validated enabled" : ""
            }`}
            disabled={userName.trim() === ""}
          >
            Continuar
          </button>
        </form>
      ) : !access ? (
        <div className="mt-4 text-center">
          <p>
            Hola <strong>{userName}</strong>, <br />
            selecciona el acceso en el que te encuentras:
          </p>
          <AccessSelector onSelect={handleAccessSelect} />
        </div>
      ) : (
        <div className="mt-4 text-center">
          <p>
            Sesión activa: <strong>{userName}</strong> <br />
            <em>{access}</em>
          </p>
          <QRScanner access={access} />
        </div>
      )}
    </MainLayout>
  );
}

export default App;
