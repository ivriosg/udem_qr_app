import React from "react";
import Navbar from "../components/Navbar";

export default function MainLayout({ children, onReset }) {
  return (
    <div className="bg-dark text-white min-vh-100 d-flex flex-column">
      <Navbar onReset={onReset} />
      <main className="flex-grow-1 d-flex align-items-center justify-content-center">
        <div className="container p-4" style={{ maxWidth: 600 }}>
          {children}
        </div>
      </main>
    </div>
  );
}
