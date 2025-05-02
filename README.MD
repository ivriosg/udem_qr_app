UDEM QR App

Aplicación web desarrollada en React para escanear códigos QR y registrar accesos a eventos institucionales. Incluye validación, almacenamiento en Firebase y conexión con ManyChat para automatización de mensajes.

⸻

🚀 Funcionalidades principales
• Escaneo de QR desde cámara (mobile-first)
• Guardado en colección check-in de Firebase
• Registro de duplicados en colección qrDuplicado
• Delay de reescaneo para prevenir múltiples registros
• Identificación por tipo: qrGraduado, qrAcompananteUno, etc.
• Integración con ManyChat:
• Búsqueda por matrícula
• Asignación de etiqueta Check-in Commencement
• Funcionamiento offline con reenvío cuando se recupera conexión
• Interfaz responsiva y alertas visuales con Toastr
• Panel administrativo con control de accesos y usuarios

⸻

📦 Requisitos del entorno
• Node.js 18+
• Firebase project
• Cuenta ManyChat con API Token

⸻

🔧 Instalación y ejecución local 1. Clona el repositorio:

git clone https://github.com/ivriosg/udem_qr_app.git
cd udem_qr_app

    2.	Instala las dependencias:

npm install

    3.	Crea un archivo .env en la raíz con tus variables:

REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_AUTH_DOMAIN=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_FIREBASE_STORAGE_BUCKET=...
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
REACT_APP_FIREBASE_APP_ID=...
REACT_APP_MANYCHAT_TOKEN=...

    4.	Inicia el servidor local:

npm start

La app estará disponible en http://localhost:3000

⸻

☁️ Despliegue en producción 1. Subir a Firebase Hosting (SPA):

firebase init hosting
firebase deploy --only hosting

    2.	Usar Firebase Functions como proxy a ManyChat:

firebase init functions

Funciones sugeridas:
• /buscarUsuarioManychat
• /etiquetarUsuarioManychat

Configurar el token:

firebase functions:config:set manychat.token="TU_TOKEN"

⸻

💰 Estimación de costos Firebase

Ver documento detallado: estimacion_costos_firebase.md

Resumen:
• Hasta 2 millones de invocaciones gratis al mes
• Hasta 5 GB de salida de red gratis
• Con 10,000 escaneos/mes, no se generan costos

⸻

🧩 Tecnologías utilizadas
• React 18
• Firebase Firestore
• Firebase Hosting
• Firebase Functions
• ManyChat API
• Html5-qrcode
• Toastr
• Bootstrap 5

⸻

👤 Autor

Ivan Rios — Abril 2025
