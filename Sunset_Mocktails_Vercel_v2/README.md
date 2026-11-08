# Sunset Mocktails

Frontend estático en HTML, CSS y JavaScript. El archivo `index.html` está en la raíz del proyecto y puede abrirse en un navegador. No requiere instalar dependencias, compilación, base de datos ni variables de entorno.

## Entrega y despliegue en Vercel

1. Descomprimir el archivo ZIP completo.
2. Para revisar localmente, abrir `index.html` en un navegador. Si se prefiere un servidor local, ejecutar `python -m http.server 8000` en esta carpeta y visitar `http://localhost:8000`.
3. Subir el contenido de esta carpeta a un repositorio y conectarlo a Vercel, seleccionando el proyecto como sitio estático (sin framework, sin comando de compilación y con la carpeta raíz como directorio del proyecto).
4. Desplegar y probar el enlace generado en móvil y escritorio. El dominio asignado por Vercel o uno propio depende de la configuración de la cuenta y su disponibilidad.

## Contenido

- `index.html`: estructura y contenido de la página.
- `style.css`: estilos y presentación adaptable.
- `app.js`: navegación, personalizador, catálogo y formulario.
- `products.js`: datos editables de las seis bebidas.
- `assets/`: logotipo (con fondo transparente), imagen principal, imágenes del catálogo, ícono de la pestaña (`favicon-32.png`, `apple-touch-icon.png`) e imagen para compartir (`og-image.jpg`).
- `MATRIZ_RUBRICA.md` e `INNOVACION.md`: documentación académica de apoyo.

## Consideraciones

El formulario no está conectado a ningún servicio: al pulsar «Enviar mensaje» comunica que el servicio aún no está disponible y no envía ni guarda datos. No hay pagos ni pedidos activos. El proyecto es una propuesta académica; los precios no se han validado como precios comerciales.

La tarjeta de la institución en la sección de contacto usa una foto guardada dentro del proyecto (`assets/campus.webp`), aportada por el autor, y un enlace a Google Maps. La dirección corresponde a la institución educativa: https://encuentroliteratura.laasuncion.edu.ec/contacto/ . Las fuentes tipográficas también se cargan desde internet, con alternativas locales. `og:image` y `og:url` en `index.html` ya usan la dirección completa de `https://sunset-mocktails.vercel.app/` para que WhatsApp y redes muestren la vista previa; si el dominio cambia, hay que actualizarlas.

Los textos están adaptados a la Feria de Emprendimiento del colegio de forma general. Cuando se conozcan los detalles, basta con reemplazar «Por anunciar» (fecha, horario y stand) en la sección `#feria` de `index.html`; hay un comentario `<!-- FERIA: ... -->` justo encima.

En «Nuestros mocktails», el botón «Crear mi versión» del detalle de cada bebida abre «Crea tu Sunset» con los ingredientes más parecidos ya seleccionados.

La página se entrega para posterior publicación; el ZIP por sí mismo no la despliega. Los avisos de acceso y privacidad, las pruebas interactivas en navegadores y la configuración del dominio deben verificarse en el entorno de destino.
