# MegaPrint — Guía de Instalación

## Requisitos del Sistema
- PHP 8.2+ con extensiones: `pdo_mysql`, `mbstring`, `openssl`, `gd`, `fileinfo`, `bcmath`
- Composer
- MySQL 8.0+
- Servidor web (Laragon, XAMPP, WAMP o Laravel Herd)
- Live Server (VSCode) o cualquier servidor HTTP estático

---

## 1. Configurar la Base de Datos

Abre tu gestor MySQL y crea la base de datos:
```sql
CREATE DATABASE megaprint CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## 2. Configurar el Backend Laravel

```bash
cd C:\megaprint\backend
```

### Editar `.env` con tus credenciales MySQL:
```
DB_DATABASE=megaprint
DB_USERNAME=root
DB_PASSWORD=tu_contraseña
```

### Instalar dependencias y configurar:
```bash
composer install
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve --port=8000
```

✅ El backend estará en: `http://localhost:8000`  
✅ Credenciales admin: `admin@megaprint.bo` / `password`

---

## 3. Iniciar el Frontend

Abre `C:\megaprint\frontend\` con **Live Server** (VSCode) o cualquier servidor HTTP.

### Con VSCode Live Server:
1. Abre la carpeta `frontend` en VSCode
2. Click derecho en `index.html` → "Open with Live Server"
3. Estará disponible en `http://127.0.0.1:5500`

### Con Python (alternativa):
```bash
cd C:\megaprint\frontend
python -m http.server 5500
```

---

## 4. Verificar Integración

1. Abre `http://127.0.0.1:5500` — verás el landing page
2. Los productos, trabajos y testimonios cargarán desde la API
3. Panel admin: `http://127.0.0.1:5500/admin.html`
   - Email: `admin@megaprint.bo`
   - Contraseña: `password`

---

## Estructura del Proyecto

```
C:\megaprint\
├── backend/           ← Laravel 11 (API REST)
│   ├── app/
│   │   ├── Http/Controllers/Api/
│   │   │   ├── AuthController.php
│   │   │   ├── ProductController.php
│   │   │   ├── CategoryController.php
│   │   │   ├── JobController.php
│   │   │   ├── TestimonialController.php
│   │   │   ├── ContactController.php
│   │   │   └── AboutSectionController.php
│   │   └── Models/
│   │       ├── Category.php
│   │       ├── Product.php
│   │       ├── ProductImage.php
│   │       ├── Job.php
│   │       ├── JobImage.php
│   │       ├── Testimonial.php
│   │       ├── Contact.php
│   │       └── AboutSection.php
│   ├── database/
│   │   ├── migrations/   ← 9 tablas
│   │   └── seeders/      ← datos de ejemplo
│   └── routes/api.php    ← todas las rutas API
│
└── frontend/          ← HTML5 + TailwindCSS + Vanilla JS
    ├── index.html          ← Landing page
    ├── products.html       ← Catálogo de productos
    ├── product-detail.html ← Detalle de producto
    ├── jobs.html           ← Portafolio de trabajos
    ├── testimonials.html   ← Testimonios
    ├── about.html          ← Nosotros
    ├── contact.html        ← Contacto + Mapa
    ├── admin.html          ← Panel administrador
    └── assets/
        ├── css/
        │   ├── main.css        ← Estilos globales
        │   └── animations.css  ← Animaciones
        └── js/
            ├── api.js          ← Módulo central de API
            ├── utils.js        ← Utilidades (Toast, Skeleton, etc.)
            ├── navbar.js       ← Navbar + Footer dinámico
            ├── products.js     ← Módulo de productos
            ├── jobs.js         ← Módulo de trabajos
            ├── testimonials.js ← Módulo de testimonios
            ├── contact.js      ← Formulario de contacto
            └── admin.js        ← Panel administrador
```

---

## Personalización

### Cambiar número de WhatsApp:
En `assets/js/navbar.js` línea 3:
```js
const WHATSAPP = '59177712345'; // Cambiar por tu número
```

### Cambiar URL del backend:
En `assets/js/api.js` línea 4:
```js
baseURL: 'http://localhost:8000/api', // Cambiar si el backend está en otro host
```

### Cambiar información de contacto:
Editar en `assets/js/navbar.js` (footer) las secciones de dirección, horario y teléfono.

---

## APIs Disponibles

| Método | Endpoint | Auth | Descripción |
|--------|----------|------|-------------|
| GET | `/api/products` | ❌ | Lista productos (paginado, filtrable) |
| GET | `/api/products/{id}` | ❌ | Detalle de producto |
| POST | `/api/products` | ✅ | Crear producto |
| PUT | `/api/products/{id}` | ✅ | Actualizar producto |
| DELETE | `/api/products/{id}` | ✅ | Eliminar producto |
| GET | `/api/categories` | ❌ | Lista categorías |
| GET | `/api/jobs` | ❌ | Lista trabajos |
| GET | `/api/testimonials` | ❌ | Lista testimonios aprobados |
| POST | `/api/testimonials` | ❌ | Enviar testimonio |
| POST | `/api/contacts` | ❌ | Enviar mensaje de contacto |
| GET | `/api/about` | ❌ | Secciones "Nosotros" |
| POST | `/api/auth/login` | ❌ | Login admin |
| POST | `/api/auth/logout` | ✅ | Logout |
