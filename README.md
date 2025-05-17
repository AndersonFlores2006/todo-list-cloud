# To-Do List Cloud ☁️

Aplicación web moderna de lista de tareas con frontend en **React** y backend en **Node.js (Express)**, usando **MongoDB** como base de datos. Incluye autenticación JWT, diseño profesional y CRUD de tareas.

---

## 🚀 Demo

¡Clona el repo y ejecútalo localmente! (ver instrucciones abajo)

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
└── render.yaml             # Configuración para Render

frontend/
├── public/                 # Archivos estáticos
├── src/
│   ├── components/         # Componentes reutilizables
│   ├── pages/              # Páginas principales (Login, Home, etc.)
│   ├── services/           # Lógica de conexión a API
│   ├── styles/             # Estilos globales
│   └── App.jsx, index.js
├── package.json
└── .gitignore
```

---

## 🛠️ Instalación y Ejecución Local

### 1. Clona el repositorio
```bash
git clone https://github.com/AndersonFlores2006/todo-list-cloud.git
cd todo-list-cloud
```

### 2. Configura el backend
```bash
cd backend
cp .env.example .env   # Crea tu archivo .env (ver ejemplo abajo)
npm install
npm run dev            # o npm start
```

#### Ejemplo de `.env` para backend:
```
MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/tododb?retryWrites=true&w=majority
JWT_SECRET=tu_clave_secreta
PORT=5000
```

### 3. Configura el frontend
```bash
cd ../frontend
npm install
npm start
```

La app estará disponible en [http://localhost:3000](http://localhost:3000)

---

## ✨ Funcionalidades
- Registro e inicio de sesión con JWT
- Crear, editar, eliminar y completar tareas
- Diseño responsivo y moderno (React + CSS)
- Sidebar con usuario y contador de tareas
- Confirmación al eliminar y cerrar sesión

---

## ☁️ Despliegue
- Backend listo para Render (`render.yaml`)
- Frontend puede desplegarse en Vercel, Netlify, etc.

---

## 📄 Licencia
MIT 