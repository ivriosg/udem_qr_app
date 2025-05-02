🚀 Instrucciones de Deploy – UDEM QR App

Este documento detalla cómo desplegar el sistema en Firebase Hosting, de forma manual y cómo automatizarlo en el futuro con GitHub Actions.

⸻

🔧 Requisitos iniciales
• Node.js 18 o superior
• Firebase CLI instalado (npm install -g firebase-tools)
• Cuenta activa en Firebase + proyecto creado
• Acceso al repositorio: https://github.com/ivriosg/udem_qr_app.git

⸻

📦 Deploy Manual (recomendado por ahora)

1. Instalar dependencias

npm install

2. Compilar la aplicación React

npm run build

Esto generará la carpeta /build con el código optimizado.

3. Subir a Firebase Hosting

firebase deploy

Esto subirá el contenido de build/ a Firebase Hosting y te devolverá una URL pública.

⸻

🔁 Activar Deploy Automático con GitHub (opcional a futuro)

1. Ejecutar:

firebase init hosting:github

2. Elegir:
   • Proyecto existente
   • Rama a observar (por ejemplo: main)
   • Ruta pública: build
   • Confirmar configuración

3. Resultado

Esto crea un archivo:

.github/workflows/firebase-hosting.yml

Y cada git push hará automáticamente:
• npm install
• npm run build
• firebase deploy

⸻

🧪 Recomendaciones
• Para pruebas, usa deploy manual.
• Para producción, activa integración con GitHub.
• Nunca subas el archivo .env a GitHub 🚫
• Usa variables desde process.env.REACT*APP*\* y configúralas en Firebase Hosting.

⸻

¿Dudas o problemas? Consulta https://firebase.google.com/docs/hosting

⸻

Archivo generado automáticamente para facilitar el mantenimiento del sistema.
