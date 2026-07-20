Manual de Usuario - Atalaya Studio
Versión: 1.0
Fecha: Julio 2026
Proyecto: Sitio Web que expone soluciones tecnologicas creativas especializada en diseño web, branding y estrategia digital potenciada con inteligencia artificial.

Tabla de Contenidos
1. Introducción
2. Requisitos del Sistema
3. Guía para el Visitante
3.1 Navegación del sitio
3.2 Modo Claro y Oscuro
3.3 Galería de Proyectos
3.4 Envío del Formulario de Contacto
4. Guía para el Administrador
4.1 Acceso a los mensajes recibidos
4.2 Lectura de la base de datos local
4.3 Límites de seguridad del formulario
5. Solución de Problemas Comunes

1. Introducción
Atalaya Studio es un sitio web que contiene:

  * Una catalogo digital para los clientes, donde pueden conocer los servicios, ver proyectos y ponerse en contacto.
  * Un sistema de gestión en el backend que recibe, valida y almacena de forma segura los mensajes de los usuarios finales.
  * 
2. Requisitos del Sistema

Para el usuario final

  *Un navegador web moderno (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari).
  *Conexión a internet.
  
Para el Administrador

  *Los mismos requisitos del visitante.
  *Acceso al repositorio de código (GitHub).
  *Cuenta en la plataforma de despliegue (Render) para ver los logs y mensajes.
  
3. Guía para el usuario final
   
3.1 Navegación del sitio

El sitio está compuesto por tres páginas principales accesibles desde el menú superior:

Inicio (index.html): Muestra el encabezado principal, un resumen de servicios, testimonios de clientes, una galería de proyectos y el formulario de contacto.
Nosotros (about.html): Detalla la misión, los valores y las estadísticas del estudio.
Servicios (services.html): Describe en profundidad cada servicio (Diseño Web, Desarrollo, SEO, Branding, IA, E-Commerce) y explica el proceso de trabajo.
En dispositivos móviles: El menú se oculta detrás de un botón con tres líneas (☰). Al presionarlo, se despliega un menú lateral. Para cerrarlo, puede hacer clic en la "X", en un enlace, o presionando la tecla Escape.

3.2 Modo Claro y Oscuro

El sitio se adapta a la preferencia del usuario mediante un botón con el ícono de la luna (🌙) o el sol (☀️), ubicado en el menú de navegación.

Haga clic en 🌙 para activar el modo oscuro.
Haga clic en ☀️ para volver al modo claro.

Nota: El sitio recordará su elección durante la sesión actual.

3.3 Galería de Proyectos

En la página de Inicio, debajo de los testimonios, se encuentra una cuadrícula de imágenes de proyectos.

Ver detalles: Pase el cursor sobre una imagen para ver el nombre del proyecto y la categoría.
Ampliar imagen (Lightbox): Haga clic en cualquier imagen para abrirla en pantalla completa sobre un fondo oscuro.
Navegar en el Lightbox: Use las flechas laterales (‹ ›), las teclas de flecha del teclado, o deslice el dedo en pantallas táctiles para cambiar de imagen.
Cerrar el Lightbox: Haga clic en el botón "X", presione la tecla Escape, o haga clic fuera de la imagen.

3.4 Envío del Formulario de Contacto

Al final de la página de Inicio, los usuarios pueden enviar un mensaje siguiendo estos pasos:

Nombre: Ingrese su nombre completo (mínimo 2 caracteres).
Correo Electrónico: Ingrese un email válido (ej: usuario@dominio.com).
Servicio de Interés: Seleccione de la lista desplegable el servicio sobre el que desea consultar (opcional).
Mensaje: Describa su proyecto o consulta (máximo 2000 caracteres).
Enviar: Presione el botón "Enviar Mensaje".

Indicadores del sistema:

Validación en tiempo real: Si un campo tiene un error (ej: email mal escrito), aparecerá un mensaje en rojo justo debajo del campo al salir de él.
Envío en proceso: Al presionar enviar, el botón mostrará un ícono de carga giratorio y se deshabilitará para evitar envíos duplicados.
Éxito: Si todo sale bien, aparecerá una notificación verde en la esquina superior derecha diciendo "Mensaje recibido correctamente" y el formulario se limpiará.
Error: Si hay un problema de conexión o de servidor, aparecerá una notificación roja indicando el fallo.

4. Guía para el Administrador
   
4.1 Acceso a los mensajes recibidos

Los mensajes de los clientes no se envían por correo electrónico, sino que se almacenan en el servidor.

Método 1: A través del navegador (Producción en Render)

Inicie sesión en Render y vaya a su servicio.
En la barra de direcciones de su navegador, añada /api/contacts al final de la URL de su web.
https://atalaya-studio-web.onrender.com/api/contacts
Verá una lista en formato JSON con todos los mensajes recibidos, ordenados del más reciente al más antiguo.

Método 2: A través de la terminal (Servidor local)Con el servidor encendido en su computadora, abra otra terminal y ejecute:
curl http://localhost:3000/api/contacts

4.2 Lectura de la base de datos local
Si está ejecutando el proyecto localmente, los mensajes se guardan en un archivo de texto plano:

Ruta: server/data/contacts.json
Puede abrir este archivo con cualquier editor de texto (VS Code, Bloc de notas) para leer los mensajes sin necesidad de encender el servidor.

Nota para producción: En Render, los datos se guardan en la memoria del servidor temporalmente. Si el servidor se reinicia, los datos se pierden. Para un sistema definitivo, se debe conectar una base de datos persistente como PostgreSQL.

4.3 Límites de seguridad del formulario
El sistema tiene protecciones automáticas para evitar spam:

Rate Limiting: Una misma dirección IP solo puede enviar 5 formularios por hora. Si un usuario supera este límite, recibirá un error 429 Too Many Requests.
Sanitización: Se eliminan automáticamente caracteres peligrosos (como <script>) para prevenir ataques XSS.
Límite de tamaño: Los campos tienen una longitud máxima (Nombre: 100, Email: 254, Mensaje: 2000 caracteres).

5. Solución de Problemas Comunes

| Problema | Causa probable | Solución |
|----------|----------------|----------|
| El formulario muestra "No se pudo conectar con el servidor" | El backend de Node.js no está encendido o Render está en estado "Sleep" | Encienda el servidor local (`node server.js`) o espere ~30 segundos a que Render despierte y recargue la página. |
| Aparece un error `429` al enviar | Se alcanzó el límite de 5 mensajes por hora desde su red | Espere una hora o reinicie su router para obtener una nueva IP (solo en entorno local). |
| Las imágenes de la galería no cargan | Sin conexión a internet (cargan desde Unsplash) o el enlace está caído | Verifique su conexión a internet. |
| La página se ve sin estilos en producción | Error de caché del navegador | Presione `Ctrl + Shift + R` (o `Cmd + Shift + R` en Mac) para forzar una recarga limpia. |
| El menú móvil no se cierra | Error de JavaScript | Asegúrese de que el archivo `js/main.js` se esté cargando correctamente abriendo la consola del navegador (F12 > Console). |
