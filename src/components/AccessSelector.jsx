import React from "react";

const ACCESS_TYPES = [
  "Acceso Principal",
  "Acceso Secundario",
  "Invitado",
  "Hijo",
];

export default function AccessSelector({ onSelect }) {
  return (
    <div className="d-flex flex-column gap-2">
      {ACCESS_TYPES.map((type) => (
        <button
          key={type}
          className="btn btn-custom-yellow"
          onClick={() => onSelect(type)}
        >
          {type}
        </button>
      ))}
    </div>
  );
}
