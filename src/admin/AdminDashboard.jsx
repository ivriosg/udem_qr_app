import React from "react";

export default function AdminDashboard() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Dashboard</h2>
      <p>
        Accesos escaneados hoy: <strong>134</strong>
      </p>
      <p>
        Tipo más usado: <strong>Acceso Principal</strong>
      </p>
      <p>
        Usuarios activos: <strong>5</strong>
      </p>
      {/* Aquí podrías integrar gráficas reales con Chart.js o Recharts */}
    </div>
  );
}
