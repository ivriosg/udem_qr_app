import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import toastr from "toastr";
import "toastr/build/toastr.min.css";

toastr.options = {
  positionClass: "toast-bottom-full-width",
  timeOut: 3000,
  closeButton: true,
};

const QRScanner = ({ access }) => {
  const [loading, setLoading] = useState(true);
  const lastScanRef = useRef(0);
  const lastDuplicateRef = useRef({});
  const scannerRef = useRef(null);

  const calculateQrBox = () => {
    const width = window.innerWidth;
    if (width >= 768) return 450;
    if (width >= 480) return 300;
    return 250;
  };

  const syncOffline = async () => {
    const pendientes = JSON.parse(
      localStorage.getItem("checkin_pendientes") || "[]"
    );
    for (const item of pendientes) {
      await addDoc(collection(db, "check-in"), item);
    }
    localStorage.removeItem("checkin_pendientes");
  };

  useEffect(() => {
    let isCancelled = false;

    const tryStartScanner = async (retries = 10) => {
      const readerElement = document.getElementById("reader");
      if (!readerElement) {
        if (retries > 0) {
          setTimeout(() => tryStartScanner(retries - 1), 300);
        } else {
          toastr.error("No se pudo iniciar el escáner. Intenta recargar.");
        }
        return;
      }

      const scanner = new Html5Qrcode("reader");
      scannerRef.current = scanner;

      scanner
        .start(
          { facingMode: "environment" },
          { fps: 10, qrbox: calculateQrBox() },
          async (decodedText) => {
            const now = Date.now();
            if (now - lastScanRef.current < 3000) return;
            lastScanRef.current = now;

            let reiniciar = true;

            try {
              const decodedBase64 = atob(decodedText);
              let tipo = "desconocido",
                matricula = "",
                nombre = "";

              if (decodedBase64.trim().startsWith("{")) {
                const decoded = JSON.parse(decodedBase64);
                if (decoded.qrGraduado) {
                  tipo = "graduado";
                  matricula = decoded.qrGraduado.matricula;
                  nombre = decoded.qrGraduado.nombre;
                } else if (decoded.qrAcompananteUno) {
                  tipo = "acompanante1";
                  matricula = decoded.qrAcompananteUno.matricula;
                  nombre = decoded.qrAcompananteUno.nombre;
                } else if (decoded.qrAcompananteDos) {
                  tipo = "acompanante2";
                  matricula = decoded.qrAcompananteDos.matricula;
                  nombre = decoded.qrAcompananteDos.nombre;
                } else if (decoded.qrAcompananteTres) {
                  tipo = "acompanante3";
                  matricula = decoded.qrAcompananteTres.matricula;
                  nombre = decoded.qrAcompananteTres.nombre;
                }
              } else {
                const parts = decodedBase64.split("|");
                if (parts.length === 3) {
                  [matricula, nombre, tipo] = parts;
                } else {
                  throw new Error(
                    "Formato inválido: se esperaban 3 partes separadas por '|'"
                  );
                }
              }

              const registro = {
                matricula,
                nombre,
                tipo,
                timestamp: serverTimestamp(),
                acceso: access,
                fuente: "QR",
              };

              const checkQuery = query(
                collection(db, "check-in"),
                where("matricula", "==", matricula),
                where("tipo", "==", tipo)
              );
              const snapshot = await getDocs(checkQuery);
              const alreadyCheckedIn = !snapshot.empty;

              if (alreadyCheckedIn) {
                toastr.warning("Este QR ya fue utilizado por " + nombre);
                const key = `${matricula}-${tipo}`;
                const lastDupTime = lastDuplicateRef.current[key] || 0;

                if (Date.now() - lastDupTime > 5000) {
                  lastDuplicateRef.current[key] = Date.now();
                  await addDoc(collection(db, "qrDuplicado"), {
                    ...registro,
                    escaneoDuplicado: serverTimestamp(),
                  });
                }

                return;
              }

              if (tipo === "graduado") {
                try {
                  const res = await fetch(
                    `http://localhost:4000/manychat/buscar?matricula=${matricula}`
                  );
                  const userData = await res.json();
                  if (userData?.data?.id) {
                    await fetch("http://localhost:4000/manychat/etiquetar", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        subscriber_id: userData.data.id,
                        tag_name: "Check-in Commencement",
                      }),
                    });
                  }
                } catch (err) {
                  console.error("Error ManyChat:", err);
                }
              }

              if (navigator.onLine) {
                await addDoc(collection(db, "check-in"), registro);
              } else {
                const offline = JSON.parse(
                  localStorage.getItem("checkin_pendientes") || "[]"
                );
                offline.push(registro);
                localStorage.setItem(
                  "checkin_pendientes",
                  JSON.stringify(offline)
                );
              }

              toastr.success(`Registro exitoso para ${nombre} (${tipo})`);
            } catch (err) {
              reiniciar = false;
              toastr.error("QR inválido o incompleto.");
              console.error(err);
            } finally {
              if (!isCancelled && reiniciar) {
                await scanner.stop();
                setTimeout(() => tryStartScanner(), 1000);
              }
            }
          },
          (errorMessage) => {}
        )
        .then(() => {
          if (!isCancelled) setLoading(false);
        })
        .catch((err) => {
          if (!isCancelled) {
            console.error("No se pudo iniciar el escáner:", err);
            toastr.error("No se pudo iniciar la cámara.");
          }
        });
    };

    setTimeout(() => tryStartScanner(), 300);
    window.addEventListener("online", syncOffline);

    return () => {
      isCancelled = true;
      scannerRef.current?.stop().catch(() => {});
      window.removeEventListener("online", syncOffline);
    };
  }, []);

  return (
    <div
      className="position-relative d-flex justify-content-center align-items-center w-100"
      style={{ minHeight: 300 }}
    >
      {loading && (
        <div className="position-absolute w-100 h-100 d-flex flex-column justify-content-center align-items-center bg-dark bg-opacity-75 z-2">
          <div className="spinner-border text-warning mb-3" role="status">
            <span className="visually-hidden">Cargando escáner...</span>
          </div>
          <p className="text-white">Cargando escáner...</p>
        </div>
      )}
      <div
        id="reader"
        style={{
          width: "100%",
          maxWidth: "480px",
          aspectRatio: "1 / 1",
          opacity: loading ? 0.25 : 1,
          transition: "opacity 0.3s ease-in-out",
        }}
      />
    </div>
  );
};

export default QRScanner;
