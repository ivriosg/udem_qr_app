import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import toastr from "toastr";
import "toastr/build/toastr.min.css";
import { BsPencilSquare, BsTrash3, BsX } from "react-icons/bs";

export default function AdminUserManager() {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    rol: "admin",
  });
  const [loading, setLoading] = useState(false);
  const [usuarios, setUsuarios] = useState([]);
  const [editId, setEditId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const fetchUsuarios = async () => {
    const snapshot = await getDocs(collection(db, "usuarios-admin"));
    const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setUsuarios(lista);
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nombre, correo, rol } = formData;
    if (!nombre || !correo)
      return toastr.warning("Todos los campos son obligatorios");
    setLoading(true);
    try {
      if (editId) {
        await updateDoc(doc(db, "usuarios-admin", editId), {
          nombre,
          correo,
          rol,
        });
        toastr.success("Usuario actualizado exitosamente");
      } else {
        await addDoc(collection(db, "usuarios-admin"), {
          nombre,
          correo,
          rol,
          creadoEn: serverTimestamp(),
        });
        toastr.success("Usuario creado exitosamente");
      }
      setFormData({ nombre: "", correo: "", rol: "admin" });
      setEditId(null);
      fetchUsuarios();
    } catch (error) {
      console.error("Error al guardar usuario:", error);
      toastr.error("No se pudo guardar el usuario");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("¿Deseas eliminar este usuario?");
    if (!confirm) return;
    try {
      await deleteDoc(doc(db, "usuarios-admin", id));
      toastr.success("Usuario eliminado exitosamente");
      fetchUsuarios();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      toastr.error("No se pudo eliminar el usuario");
    }
  };

  const handleEdit = (user) => {
    setFormData({ nombre: user.nombre, correo: user.correo, rol: user.rol });
    setEditId(user.id);
  };

  const handleCancelEdit = () => {
    setFormData({ nombre: "", correo: "", rol: "admin" });
    setEditId(null);
  };

  return (
    <div className="dark-mode-admin">
      <h2 className="h4 fw-bold mb-4">Gestión de Usuarios</h2>

      <form
        onSubmit={handleSubmit}
        className="border rounded p-4 shadow-sm mb-5"
      >
        <div className="row g-3 align-items-end">
          <div className="col-md-4">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              name="nombre"
              className="form-control"
              value={formData.nombre}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              name="correo"
              className="form-control"
              value={formData.correo}
              onChange={handleChange}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Rol</label>
            <select
              name="rol"
              className="form-select"
              value={formData.rol}
              onChange={handleChange}
            >
              <option value="admin">Administrador</option>
              <option value="editor">Editor</option>
              <option value="viewer">Visualizador</option>
            </select>
          </div>
          <div className="col-md-1 text-end">
            <button
              type="submit"
              className="btn btn-custom-yellow w-100"
              disabled={loading}
            >
              Crear
            </button>
          </div>
        </div>
      </form>

      <h5 className="fw-semibold mb-3">Usuarios registrados</h5>
      {usuarios.length === 0 ? (
        <div className="text-center text-white bg-dark py-4">
          No existen usuarios registrados.
        </div>
      ) : (
        <ul className="list-group">
          {usuarios.map((user) => (
            <li
              key={user.id}
              className="list-group-item bg-dark text-white d-flex justify-content-between align-items-center"
            >
              {editId === user.id ? (
                <div className="w-100 me-3">
                  <div className="row g-2">
                    <div className="col-md-3">
                      <input
                        type="text"
                        name="nombre"
                        className="form-control"
                        value={formData.nombre}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-4">
                      <input
                        type="email"
                        name="correo"
                        className="form-control"
                        value={formData.correo}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-md-3">
                      <select
                        name="rol"
                        className="form-select"
                        value={formData.rol}
                        onChange={handleChange}
                      >
                        <option value="admin">Administrador</option>
                        <option value="editor">Editor</option>
                        <option value="viewer">Visualizador</option>
                      </select>
                    </div>
                    <div className="col-md-2 d-flex gap-2">
                      <button
                        className="btn btn-sm btn-success"
                        onClick={handleSubmit}
                      >
                        <BsPencilSquare />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-light"
                        onClick={handleCancelEdit}
                      >
                        <BsX />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <strong>{user.nombre}</strong> <br />
                    <small>{user.correo}</small>
                    <br />
                    <span className="badge bg-secondary">{user.rol}</span>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-warning"
                      onClick={() => handleEdit(user)}
                      title="Editar"
                    >
                      <BsPencilSquare />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(user.id)}
                      title="Eliminar"
                    >
                      <BsTrash3 />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
