import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import {
  BsPencilSquare,
  BsTrash3,
  BsCheckCircleFill,
  BsX,
} from "react-icons/bs";

toastr.options = {
  positionClass: "toast-bottom-full-width",
  timeOut: 3000,
  closeButton: true,
};

export default function AccessConfig() {
  const [types, setTypes] = useState([]);
  const [nuevoTipo, setNuevoTipo] = useState("");
  const [nombreEvento, setNombreEvento] = useState("");
  const [filtroEvento, setFiltroEvento] = useState("");
  const [loading, setLoading] = useState(true);
  const [editandoId, setEditandoId] = useState(null);
  const [editNombre, setEditNombre] = useState("");
  const [editEvento, setEditEvento] = useState("");

  const user = JSON.parse(sessionStorage.getItem("adminUser"));
  const email = user?.correo || "desconocido@udem.edu.mx";
  const tiposRef = collection(db, "tipos-acceso");

  useEffect(() => {
    const fetchAccessTypes = async () => {
      setLoading(true);
      const snapshot = await getDocs(tiposRef);
      const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTypes(lista);
      setLoading(false);
    };
    fetchAccessTypes();
  }, []);

  const addAccessType = async (e) => {
    e.preventDefault();
    if (!nuevoTipo || !nombreEvento)
      return toastr.warning("Completa todos los campos");

    const nuevo = {
      nombre: nuevoTipo,
      evento: nombreEvento,
      creador: email,
      creadoEn: serverTimestamp(),
    };

    try {
      const docRef = await addDoc(tiposRef, nuevo);
      setTypes([...types, { ...nuevo, id: docRef.id }]);
      setNuevoTipo("");
      setNombreEvento("");
      toastr.success("Tipo de acceso agregado exitosamente");
    } catch (error) {
      console.error("Error al guardar en Firestore:", error);
      toastr.error("Hubo un error al guardar el tipo de acceso");
    }
  };

  const removeType = async (id) => {
    try {
      await deleteDoc(doc(db, "tipos-acceso", id));
      setTypes(types.filter((t) => t.id !== id));
      toastr.success("Tipo de acceso eliminado exitosamente");
    } catch (error) {
      console.error("Error al eliminar:", error);
      toastr.error("No se pudo eliminar el tipo de acceso");
    }
  };

  const startEdit = (tipo) => {
    setEditandoId(tipo.id);
    setEditNombre(tipo.nombre);
    setEditEvento(tipo.evento);
  };

  const cancelEdit = () => {
    setEditandoId(null);
    setEditNombre("");
    setEditEvento("");
  };

  const saveEdit = async (id) => {
    try {
      const ref = doc(db, "tipos-acceso", id);
      await updateDoc(ref, { nombre: editNombre, evento: editEvento });
      setTypes(
        types.map((t) =>
          t.id === id ? { ...t, nombre: editNombre, evento: editEvento } : t
        )
      );
      setEditandoId(null);
      toastr.success("Tipo de acceso actualizado");
    } catch (error) {
      console.error("Error al actualizar:", error);
      toastr.error("No se pudo actualizar el tipo de acceso");
    }
  };

  const eventosUnicos = [...new Set(types.map((t) => t.evento))];
  const tiposFiltrados = filtroEvento
    ? types.filter((t) => t.evento === filtroEvento)
    : types;

  return (
    <div className="dark-mode-admin">
      <h2 className="h4 fw-bold mb-4">Gestionar Accesos</h2>

      <form
        onSubmit={addAccessType}
        className="mb-4 border rounded p-3 shadow-sm"
      >
        <div className="row g-3 align-items-end">
          <div className="col-md-4">
            <label className="form-label">Nombre del acceso</label>
            <input
              type="text"
              className="form-control"
              value={nuevoTipo}
              onChange={(e) => setNuevoTipo(e.target.value)}
              placeholder="Ej: Exalumnos, Prensa, VIP..."
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Nombre del evento</label>
            <input
              type="text"
              className="form-control"
              value={nombreEvento}
              onChange={(e) => setNombreEvento(e.target.value)}
              placeholder="Ej: Ceremonia de Graduación"
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Email del creador</label>
            <input
              type="email"
              className="form-control"
              value={email}
              disabled
            />
          </div>
          <div className="col-md-1 text-end">
            <button type="submit" className="btn btn-custom-yellow">
              Agregar
            </button>
          </div>
        </div>
      </form>

      <div className="mb-3">
        <label className="form-label">Filtrar por evento</label>
        <select
          className="form-select"
          value={filtroEvento}
          onChange={(e) => setFiltroEvento(e.target.value)}
        >
          <option value="">Todos los eventos</option>
          {eventosUnicos.map((evento, i) => (
            <option key={i} value={evento}>
              {evento}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning mb-3" role="status" />
          <p className="text-white">Cargando accesos...</p>
        </div>
      ) : (
        <ul className="list-group">
          {tiposFiltrados.map((tipo) => (
            <li
              key={tipo.id}
              className="list-group-item bg-dark text-white d-flex justify-content-between align-items-center"
            >
              {editandoId === tipo.id ? (
                <div className="w-100 me-3">
                  <input
                    className="form-control mb-2"
                    value={editNombre}
                    onChange={(e) => setEditNombre(e.target.value)}
                  />
                  <input
                    className="form-control mb-2"
                    value={editEvento}
                    onChange={(e) => setEditEvento(e.target.value)}
                  />
                </div>
              ) : (
                <div>
                  <strong>{tipo.nombre}</strong> <br />
                  <small>Evento: {tipo.evento}</small>
                  <br />
                  <small>Creador: {tipo.creador}</small>
                </div>
              )}

              <div className="d-flex gap-2">
                {editandoId === tipo.id ? (
                  <>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => saveEdit(tipo.id)}
                      title="Guardar"
                    >
                      <BsCheckCircleFill />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-light"
                      onClick={cancelEdit}
                      title="Cancelar"
                    >
                      <BsX />
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-sm btn-outline-warning"
                    onClick={() => startEdit(tipo)}
                    title="Editar"
                  >
                    <BsPencilSquare />
                  </button>
                )}
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => removeType(tipo.id)}
                  title="Eliminar"
                >
                  <BsTrash3 />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
