# To-Do List Web App (Node.js + MongoDB)

Este proyecto es una aplicación web de lista de tareas con frontend en React y backend en Node.js (Express), usando MongoDB como base de datos.

## Estructura del Backend

```
todo-app-backend/
│
├── src/
│   ├── controllers/               # Lógica de negocio
│   │   ├── authController.js
│   │   └── todoController.js
│   ├── middleware/                # Middleware (auth, errores)
│   │   └── authMiddleware.js
│   ├── models/                    # Modelos de Mongoose
│   │   ├── User.js
│   │   └── Todo.js
│   ├── routes/                    # Rutas agrupadas
│   │   ├── authRoutes.js
│   │   └── todoRoutes.js
│   ├── config/                    # Conexión a DB, JWT, etc.
│   │   └── db.js
│   ├── app.js                     # App de Express (importa rutas y middlewares)
│   └── server.js                  # Punto de entrada (levanta el servidor)
│
├── .env                           # Claves secretas y URI de MongoDB
├── .gitignore
├── package.json
├── README.md
└── render.yaml                    # Configuración para desplegar en Render
```

## Descripción

Permite a los usuarios crear, editar y eliminar tareas. Incluye autenticación JWT. El backend está listo para desplegarse en Render. 