# Food Store

Trabajo Práctico Integrador de Programación IV. Aplicación web para un negocio de comidas: los clientes recorren el catálogo, arman un carrito y confirman pedidos; el administrador gestiona categorías, productos, stock, pedidos y usuarios.

- **Alumno:** Martín Rotolo
- **Repositorio:** https://github.com/USUARIO/REPOSITORIO
- **Video de demostración:** https://LINK-DEL-VIDEO

## Estructura

```
backend/    API REST con FastAPI, SQLModel y PostgreSQL
frontend/   Aplicación React + TypeScript con Vite
```

## Requisitos

- Python 3.11, 3.12 o 3.13
- PostgreSQL 15 o superior
- Node.js 20.19 o superior
- pnpm 9 o superior

## Backend

### Instalación

```
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

En Linux o macOS, el entorno se activa con `source .venv/bin/activate`.

### Variables de entorno

Copiar `backend/.env.example` como `backend/.env` y completar los valores:

| Variable | Descripción | Ejemplo |
|---|---|---|
| `DATABASE_URL` | Conexión a PostgreSQL | `postgresql://postgres:tu_password@localhost:5432/foodstore_db` |
| `SECRET_KEY` | Clave para firmar el JWT, de al menos 32 caracteres | `cambiar-esta-clave-de-al-menos-32-caracteres` |
| `ALGORITHM` | Algoritmo del JWT | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Duración del token y de la cookie | `30` |
| `FRONTEND_ORIGIN` | Origen permitido por CORS | `http://localhost:5173` |

La base de datos indicada en `DATABASE_URL` (por defecto `foodstore_db`) tiene que existir en PostgreSQL antes de continuar. Para generar una `SECRET_KEY`:

```
python -c "import secrets; print(secrets.token_hex(32))"
```

### Carga inicial y ejecución

```
python -m app.db.seed
uvicorn app.main:app --reload
```

El seed crea las tablas y carga el usuario administrador, 4 categorías y 11 productos con stock. Se puede ejecutar varias veces sin duplicar datos.

| Usuario | Contraseña | Rol |
|---|---|---|
| `admin` | `Admin1234!` | admin |

Los clientes se crean desde la pantalla de registro.

- API: http://localhost:8000/api/v1
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

El archivo `backend/api.http` contiene las peticiones de prueba de todos los endpoints, con los códigos de respuesta esperados, para ejecutar en orden con la extensión REST Client de VS Code sobre una base recién cargada con el seed.

## Frontend

### Variables de entorno

Copiar `frontend/.env.example` como `frontend/.env`:

| Variable | Descripción | Ejemplo |
|---|---|---|
| `VITE_API_URL` | URL base de la API | `http://localhost:8000/api/v1` |

### Instalación y ejecución

Con el backend en ejecución:

```
cd frontend
pnpm install
pnpm build
pnpm dev
```

`pnpm build` verifica los tipos y genera la versión de producción. La aplicación queda disponible en http://localhost:5173

## Funcionalidades

**Cliente (rol `user`):** registro e inicio de sesión; catálogo paginado con búsqueda y filtro por categoría; carrito que se conserva al recargar la página; confirmación del pedido con dirección de entrega, forma de pago (efectivo o transferencia) y notas; listado de sus pedidos con el detalle y cancelación mientras están pendientes.

**Administrador (rol `admin`):** resumen con los indicadores del negocio; alta, edición y baja de categorías y productos; cambio de stock y disponibilidad; gestión de pedidos con filtro por estado y avance según la máquina de estados (`PENDIENTE` → `EN_PREPARACION` → `ENTREGADO`, con cancelación desde los estados no terminales); activación y desactivación de usuarios. También puede comprar como cualquier usuario.

**Reglas del sistema:** el pedido se crea en una sola transacción que valida y descuenta el stock de cada producto y copia su nombre y precio en las líneas; si una validación falla, no se guarda nada. Al cancelar un pedido, el stock se restituye en la misma transacción. Las bajas de categorías, productos y usuarios son lógicas.

## Arquitectura

**Backend:** módulos por dominio en `app/modules/` (`auth`, `usuarios`, `categorias`, `productos` y `pedidos`) con la cadena Router → Service → Unit of Work → Repository → Model. Los Routers obtienen el Service con `Depends` y traducen las excepciones de dominio a códigos HTTP; los Services abren el Unit of Work con `with self.uow as uow:` y devuelven los schemas de salida; el commit o el rollback ocurren en el `__exit__` del Unit of Work. La infraestructura compartida está en `app/core/`.

**Frontend:** organizado por features en `src/features/` (`auth`, `categorias`, `productos`, `usuarios` y `pedidos`), cada una con `pages`, `components`, `hooks`, `api` y `types`. Lo transversal está en `src/shared/` (cliente Axios, componentes de interfaz y layout), el estado del cliente en `src/store/` (`authStore` y `cartStore` con Zustand y `persist`) y las rutas en `src/routes/`. Los datos del servidor se manejan con TanStack Query, los formularios con TanStack Form y las tablas del panel con TanStack Table.

**Sesión:** el login entrega el JWT en la cookie HttpOnly `access_token`, que el navegador envía en cada petición (`withCredentials: true`). El frontend nunca lee ni guarda el token: `authStore` conserva solo los datos del usuario y los confirma con `GET /auth/me` al iniciar la aplicación.
