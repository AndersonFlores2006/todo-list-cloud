# To-Do List Cloud ☁️

Aplicación web moderna de lista de tareas con frontend en **React** y backend en **Node.js (Express)**, usando **MongoDB** como base de datos. Incluye autenticación JWT, login con Google OAuth, diseño profesional y CRUD de tareas.

---

## 🚀 Demo Rápida

1. Clona el repo y sigue los pasos de instalación abajo.
2. Accede a [http://localhost:3000](http://localhost:3000) tras levantar backend y frontend.

---

## 📋 Requisitos Previos

- Node.js >= 16.x
- npm >= 8.x
- MongoDB Atlas (o local)
- Cuenta de Google Cloud para OAuth (opcional, pero recomendado)

---

## 📁 Estructura del Proyecto

```
backend/
├── src/
│   ├── controllers/        # Lógica de negocio
│   ├── middleware/         # Middleware (auth, errores)
│   ├── models/             # Modelos de Mongoose
│   ├── routes/             # Rutas agrupadas
│   ├── config/             # Conexión a DB, JWT, etc.
│   ├── app.js              # App de Express
│   └── server.js           # Punto de entrada
├── .env                    # Variables de entorno (NO subir)
├── .gitignore
├── package.json
├── render.yaml             # Configuración para Render (opcional)
├── Dockerfile              # Dockerfile para la imagen del backend
└── .dockerignore           # Archivos a ignorar en la imagen Docker del backend

frontend/
├── public/                 # Archivos estáticos
├── src/
│   ├── components/         # Componentes reutilizables
│   ├── pages/              # Páginas principales (Login, Home, etc.)
│   ├── services/           # Lógica de conexión a API
│   ├── styles/             # Estilos globales
│   └── App.jsx, index.js
├── package.json
├── .gitignore
├── Dockerfile              # Dockerfile para la imagen del frontend
└── .dockerignore           # Archivos a ignorar en la imagen Docker del frontend

docker-compose.yml          # Para ejecutar ambos servicios localmente con Docker Compose
.github/                    # Carpeta de configuración de GitHub Actions
└── workflows/
    └── deploy-to-do-list.yml # Workflow de CI/CD para Google Cloud Run
```

---

## 🛠️ Instalación y Ejecución Local

Puedes ejecutar la aplicación localmente usando Docker Compose. Asegúrate de tener Docker instalado.

### 1. Clona el repositorio
```bash
git clone https://github.com/AndersonFlores2006/todo-list-cloud.git
cd todo-list-cloud
```

### 2. Configura las variables de entorno para el backend
Crea un archivo `.env` en la carpeta `backend/` basado en `.env.example`:
```bash
cp backend/.env.example backend/.env
```

#### Ejemplo de `.env` para backend:
```
MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/tododb?retryWrites=true&w=majority
JWT_SECRET=tu_clave_secreta
PORT=5000
GOOGLE_CLIENT_ID=tu_client_id_de_google
```

### 3. Ejecuta la aplicación con Docker Compose
Desde la raíz del proyecto, ejecuta:
```bash
docker-compose build   # Construye las imágenes Docker (solo la primera vez o si cambian los Dockerfiles)
docker-compose up      # Levanta el backend y el frontend
```
La app estará disponible en [http://localhost:3000](http://localhost:3000)

Para ejecutar en segundo plano:
```bash
docker-compose up -d
```
Para detener los servicios:
```bash
docker-compose down
```

---

## 🔐 Autenticación con Google OAuth

La app permite iniciar sesión con Google usando OAuth 2.0.

### Pasos para configurar Google OAuth:
1. Ve a [Google Cloud Console](https://console.cloud.google.com/).
2. Crea un proyecto o selecciona uno existente.
3. Habilita la API "Google Identity Services".
4. Ve a **APIs y servicios > Credenciales** y crea un **ID de cliente de OAuth** (tipo "Aplicación web").
5. Agrega los siguientes orígenes autorizados de JavaScript:
   - `http://localhost:3000`
6. Agrega los siguientes URIs de redirección autorizados:
   - `http://localhost:3000`
   - (Si usas rutas específicas, agrégalas también)
7. Copia el `client_id` y agrégalo a tu `.env` del backend como `GOOGLE_CLIENT_ID`.
8. **No subas el archivo JSON de credenciales a GitHub** (ya está en `.gitignore`).

### Seguridad
- **Nunca subas tu archivo `.env` ni archivos de credenciales a GitHub.**
- El archivo `.gitignore` ya está configurado para ignorar `.env` y archivos `client_secret_*.json`.
- Si despliegas la app, recuerda agregar la URL de producción en los orígenes autorizados de Google Cloud.

---

## ✨ Funcionalidades
- Registro e inicio de sesión con JWT y Google OAuth
- Crear, editar, eliminar y completar tareas
- Diseño responsivo y moderno (React + CSS)
- Sidebar con usuario y contador de tareas
- Confirmación al eliminar y cerrar sesión
- Soporte para múltiples listas de tareas
- Filtros por prioridad y tags
- Calendario integrado
- Cambio de tema (claro/oscuro)

---

## ⚠️ Errores Comunes y Soluciones

### 1. No se puede agregar tarea si no existe una lista
**Síntoma:** Al intentar agregar una tarea sin haber creado una lista, la app no responde o muestra error.

**Solución:**
- Desde la versión X.X.X, la app crea automáticamente una lista predeterminada "Personal" si no existen listas al iniciar.
- Si tienes una versión anterior, crea manualmente una lista antes de agregar tareas.

### 2. Error: `cancelEdit is not defined`
**Síntoma:** Al presionar "Cancelar" en el formulario de nueva tarea, aparece un error en consola.

**Solución:**
- Se agregó la función `cancelEdit` para limpiar el formulario y cerrar la edición correctamente.
- Si ves este error, actualiza tu código a la última versión.

### 3. Problemas de conexión con MongoDB
**Síntoma:** El backend no arranca o muestra error de conexión.

**Solución:**
- Verifica que tu cadena `MONGO_URI` en `.env` sea correcta.
- Si usas MongoDB Atlas, asegúrate de permitir conexiones desde tu IP.

### 4. Google OAuth no funciona
**Síntoma:** El login con Google no redirige o muestra error.

**Solución:**
- Verifica que el `GOOGLE_CLIENT_ID` esté bien configurado en el backend.
- Asegúrate de que los orígenes y redirecciones autorizados en Google Cloud incluyan tu URL local y de producción.

---

## 🧰 Comandos Útiles

### Backend
- `npm run dev` — Levanta el backend en modo desarrollo
- `npm start` — Levanta el backend en modo producción
- `npm test` — Ejecuta los tests (si existen)

### Frontend
- `npm start` — Levanta el frontend en modo desarrollo
- `npm run build` — Genera la versión de producción

---

## ☁️ Despliegue en Google Cloud Run con GitHub Actions

La aplicación está configurada para un despliegue continuo en Google Cloud Run utilizando GitHub Actions. El workflow `deploy-to-do-list.yml` se encarga de construir y desplegar tanto el backend como el frontend de forma independiente.

### Requisitos para el despliegue automático:

1.  **Proyecto de Google Cloud**: Asegúrate de tener un proyecto de Google Cloud configurado.
2.  **Cuenta de Servicio (Service Account)**: Crea una cuenta de servicio con los permisos necesarios para Cloud Build y Cloud Run.
3.  **Credenciales de GitHub Secrets**: Configura los siguientes secretos en tu repositorio de GitHub (`Settings > Secrets and variables > Actions`):
    *   `GCP_SA_KEY`: El contenido JSON de la clave de tu cuenta de servicio.
    *   `GCP_PROJECT_ID`: El ID de tu proyecto de Google Cloud.
    *   `BACKEND_ENV`: El contenido de tu archivo `.env` del backend (ej., `MONGO_URI`, `JWT_SECRET`).
    *   `FRONTEND_ENV`: (Opcional) Cualquier otra variable de entorno adicional para tu frontend. El workflow configurará automáticamente `REACT_APP_API_URL`.

### Proceso de Despliegue:

Cada vez que hagas un `push` a la rama `main`, el workflow realizará los siguientes pasos:
1.  Construirá y desplegará el servicio del **backend** en Google Cloud Run.
2.  Obtendrá la URL pública del backend desplegado.
3.  Construirá y desplegará el servicio del **frontend** en Google Cloud Run, inyectando la URL del backend como `REACT_APP_API_URL` en el entorno de build del frontend.

Puedes encontrar el estado de tus despliegues en la sección de "Actions" de tu repositorio de GitHub.

**Nota:** Asegúrate de que las URLs de producción de Cloud Run para el frontend y el backend estén añadidas a los "Orígenes de JavaScript autorizados" y "URIs de redirección autorizados" en la configuración de OAuth de tu proyecto de Google Cloud Console si usas Google OAuth.

---

## ❓ Preguntas Frecuentes (FAQ)

**¿Puedo usar MongoDB local?**
Sí, solo cambia la variable `MONGO_URI` en tu `.env` por la de tu instancia local.

**¿Puedo cambiar el nombre de la lista predeterminada?**
Sí, edítala desde la interfaz después de creada.

**¿Cómo reporto un bug?**
Abre un issue en GitHub o contacta al autor.

---

## 📄 Licencia
MIT 