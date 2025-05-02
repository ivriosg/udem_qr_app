import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

export default function AccessSelector({ onSelect }) {
  const [tipos, setTipos] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState("");

  useEffect(() => {
    const fetchTipos = async () => {
      const snapshot = await getDocs(collection(db, "tipos-acceso"));
      const data = snapshot.docs.map((doc) => doc.data());
      setTipos(data);
      const eventosUnicos = [...new Set(data.map((t) => t.evento))];
      setEventos(eventosUnicos);
    };
    fetchTipos();
  }, []);

  const accesosFiltrados = tipos.filter((t) => t.evento === eventoSeleccionado);

  return (
    <div className="d-flex flex-column gap-3">
      <div>
        <label className="form-label">Selecciona un evento</label>
        <select
          className="form-select"
          value={eventoSeleccionado}
          onChange={(e) => setEventoSeleccionado(e.target.value)}
        >
          <option value="">-- Selecciona --</option>
          {eventos.map((evento, i) => (
            <option key={i} value={evento}>
              {evento}
            </option>
          ))}
        </select>
      </div>

      {eventoSeleccionado && (
        <div>
          <label className="form-label">Selecciona tipo de acceso</label>
          <select
            className="form-select"
            onChange={(e) => onSelect(e.target.value)}
            defaultValue=""
          >
            <option value="">-- Selecciona --</option>
            {accesosFiltrados.map((tipo, i) => (
              <option key={i} value={tipo.nombre}>
                {tipo.nombre}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
