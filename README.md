Atalaya Studio
Empresa creativa digital especializada en diseño web, desarrollo a medida, consultoría SEO y estrategia digital potenciada con inteligencia artificial.

Estructura del proyecto
atalaya-studio/
│
├── index.html # Página principal
├── about.html # Página Nosotros
├── services.html # Página Servicios
├── README.md # Informción del proyecto
│
├── css/
│ ├── styles.css # Estilos principales (variables, componentes, responsive)
│ └── normalize.css # Reset consistente y accesibilidad base
│
├── js/
│ ├── main.js # Módulo principal (tema, menú, scroll, testimonios, toast)
│ ├── form.js # Validación y envío del formulario de contacto
│ └── storage.js # Abstracción de sessionStorage
│
├── img/
│ ├── logo.svg # Logotipo SVG del estudio
│ └── hero.webp # Imagen de fondo del hero (opcional)
│
├── assets/
│ └── icons/ # Iconos SVG reutilizables
│ ├── sun.svg
│ ├── moon.svg
│ └── arrow-up.svg
│
└── server/ # Backend Node.js
├── server.js # Servidor Express
├── db.js # Capa de datos (JSON)
├── package.json # Dependencias y scripts
├── .env.atalayastudio # Variables de entorno de ejemplo
└── data/
└── contacts.json # Base de datos de contactos (se crea automáticamente)


---

## Tecnologías

| Capa | Tecnología |
|------|------------|
| Frontend | HTML5, CSS3, JavaScript ES Modules |
| Tipografía | Google Fonts (Space Grotesk, DM Sans) |
| Iconos | SVG inline |
| Backend | Node.js + Express |
| Base de datos | Archivo JSON (sin dependencias nativas) |
| Seguridad | Helmet, CORS, Rate Limiting, sanitización de entrada |

---

## Requisitos previos

- [Node.js](https://nodejs.org) versión 18 o superior

---

## Instalación y ejecución

### 1. Clonar o descargar el proyecto

git clone https://tu-repo/atalaya-studio.git
cd atalaya-studio -- actualizar

### 2. Instalar dependencias del servidor

cd server
npm install


### 3. Configurar variables de entorno

copy .env.atalayastudio .env


Las variables por defecto funcionan sin cambios:

| Variable | Valor por defecto | Descripción |
|----------|-------------------|-------------|
| `PORT` | `3000` | Puerto del servidor |
| `NODE_ENV` | `development` | Entorno (development / production) |
| `RATE_LIMIT_MAX` | `5` | Máximo de envíos por hora por IP |
| `DB_PATH` | `./data/contacts.json` | Ruta de la base de datos |

### 4. Iniciar el servidor

npm run dev

### 5. Abrir en el navegador

http://localhost:3000


> **Nota:** No abras los archivos HTML directamente con doble clic. Siempre usa `http://localhost:3000` para que el formulario funcione con la API.

---

## Endpoints de la API

### POST `/api/contact`

Guarda un nuevo mensaje de contacto.

**Cuerpo de la petición:**

```json
{
  "nombre": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "servicio": "diseno-web",
  "mensaje": "Me interesa un rediseño web para mi empresa."
}

Respuesta exitosa (201):

{
  "message": "Mensaje recibido correctamente.",
  "data": {
    "id": 1,
    "nombre": "Juan Pérez",
    "email": "juan@ejemplo.com"
  }
}

Respuesta con error de validación (400):

{
  "error": "Datos de entrada inválidos",
  "details": ["El correo electrónico es obligatorio"]
}

Respuesta con rate limit (429):

{
  "error": "Demasiadas solicitudes. Intenta de nuevo más tarde."
}

GET /api/contacts

Devuelve la lista de contactos guardados.

Query params opcionales:

| Parámetro | Valor por defecto | Descripción |
|-----------|-------------------|-------------|
| `limit` | `50` | Máximo de registros a devolver |
| `offset` | `0` | Registros a saltar (paginación) |

Ejemplo:

GET /api/contacts?limit=10&offset=0

Buenas prácticas implementadas

Seguridad
Helmet: Cabeceras HTTP de seguridad automáticas
CORS: Restricción de orígenes permitidos
Rate Limiting: Protección contra spam en el formulario (5 envíos/hora por IP)
Sanitización: Se eliminan caracteres peligrosos (< > ' '' &) de todas las entradas
Límites: Tamaño máximo de payload (10KB) y longitud de campos

Validación
Doble validación: cliente (errores inline por campo) y servidor (respuesta estructurada)
Expresión regular para formato de email
Longitudes máximas por campo (nombre: 100, email: 254, mensaje: 2000)
Valores permitidos para el campo servicio (whitelist)

Accesibilidad
HTML semántico (header, main, section, footer, nav, article)
Atributos aria-label, aria-expanded, aria-controls, role
Navegación completa por teclado (Tab, Escape cierra menú)
Respeto a prefers-reduced-motion (deshabilita animaciones)
Clase .sr-only para texto solo de lectura por pantalla

Rendimiento
requestAnimationFrame para eventos de scroll
Listeners de scroll con { passive: true }
font-display: swap en Google Fonts
preconnect a dominios de fuentes
Skeleton loading mientras cargan los testimonios
Caché de archivos estáticos en producción

Código
Módulos ES (import/export) sin bundler
Separación de responsabilidades (storage.js, form.js, main.js)
JSDoc en todas las funciones exportadas
Nombres descriptivos en variables y funciones
Constantes de configuración agrupadas al inicio de cada archivo
Sin dependencias de frontend (vanilla JS puro)

UX
Notificaciones toast en vez de alert()
Errores de validación inline debajo de cada campo
Spinner de carga en el botón al enviar
Estado disabled en campos durante el envío
Limpieza automática del formulario tras éxito
Menú móvil con overlay y cierre por Escape
Botón "volver arriba" que aparece al hacer scroll

Servicios incluidos
Diseño Web
Desarrollo a Medida
Consultoría SEO
Branding e Identidad Visual
Estrategia Digital con IA
E-Commerce