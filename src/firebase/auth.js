import { signInWithPopup } from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  query,
  limit,
} from "firebase/firestore";
import { auth, provider, db } from "./config";

const ADMIN_EMAIL = "gerardo.riosg@udem.edu.mx";

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    if (user.email !== ADMIN_EMAIL) {
      alert("Acceso denegado. Esta cuenta no está autorizada.");
      return null;
    }

    const adminCollectionRef = collection(db, "administradores");

    // Verificamos si la colección existe (al menos un documento)
    const snapshot = await getDocs(query(adminCollectionRef, limit(1)));

    // Si no hay ningún documento, creamos el primero
    if (snapshot.empty) {
      console.log("Colección 'administradores' no existía. Será creada.");
    }

    // Referencia y verificación del documento individual
    const adminRef = doc(db, "administradores", user.uid);
    const adminSnap = await getDoc(adminRef);

    if (!adminSnap.exists()) {
      await setDoc(adminRef, {
        uid: user.uid,
        nombre: user.displayName,
        correo: user.email,
        foto: user.photoURL,
        creadoEn: new Date().toISOString(),
      });
      console.log("Administrador autorizado registrado en Firestore");
    } else {
      console.log("Administrador ya registrado");
    }

    return {
      uid: user.uid,
      nombre: user.displayName,
      correo: user.email,
      foto: user.photoURL,
    };
  } catch (error) {
    console.error("Error de autenticación:", error);
    return null;
  }
};
