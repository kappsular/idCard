# Tarjeta de Presentación Digital e Interactiva (NFC & Quick Share)

Aplicación web móvil ultrarrápida, ligera y visualmente impactante, diseñada para operar como tarjeta de presentación digital profesional, optimizada para apertura instantánea mediante etiquetas físicas **NFC**, compartición por **Quick Share / AirDrop** o escaneo de **código QR**, con guardado de contacto nativo en un toque (**vCard .vcf**).

---

## 🚀 Características Principales

1. **Mobile-First & Modo Oscuro Elite:** Diseñado bajo estándares táctiles nativos (zonas de toque de más de 48px, micro-interacciones táctiles con feedback háptico).
2. **Perfil 100% Dinámico (`config.json`):** Toda la información de contacto, redes, biografía y enlaces se modifica desde un único archivo JSON sin recompilar código.
3. **Descarga Directa de vCard 3.0 (.vcf):** Generación en memoria en el cliente con codificación UTF-8 e importación automática a la agenda de Android y iPhone.
4. **Quick Share & Código QR Integrado:** Usa la Web Share API nativa (`navigator.share`) en smartphones, y fallback a ventana modal con código QR vectorial SVG offline y copiado rápido de enlace.
5. **Cero Dependencias Pesadas y Carga Inmediata:** Carga en sub-100ms con soporte de Service Worker (PWA) para funcionamiento incluso sin conexión o con señal débil.
6. **Seguridad Robusta:** Sanitización estricta de esquemas de URL para prevenir inyecciones XSS y renderizado DOM seguro.

---

## 📂 Estructura del Proyecto

```text
├── index.html              # Lienzo semántico accesible HTML5
├── config.json             # Fuente única de datos del perfil y enlaces
├── manifest.webmanifest    # Manifiesto PWA para instalación móvil
├── sw.js                   # Service Worker para caché offline
├── test_audit.js           # Suite de auditoría de seguridad y QA automatizada
├── css/
│   └── style.css           # Sistema de diseño, temas y micro-animaciones
└── js/
    ├── app.js              # Motor reactivo, sanitizador y generador vCard
    └── qrcode.min.js       # Generador autónomo de QR vectorial (offline)
```

---

## 📲 Guía de Grabación y Vinculación NFC

Para vincular esta tarjeta a una tarjeta física NFC, llavero, sticker o anillo (NTAG213, NTAG215 o NTAG216):

1. **Despliega la web:** Sube los archivos a tu hosting preferido (GitHub Pages, Cloudflare Pages, Vercel o Netlify) para obtener tu URL HTTPS (ej. `https://mi-tarjeta.dev` o `https://usuario.github.io/card`).
2. **Instala la app NFC Tools:** Disponible gratuitamente en Google Play Store (Android) y App Store (iOS).
3. **Escribe el enlace en la etiqueta:**
   - Abre **NFC Tools** y presiona **Write** (Escribir).
   - Selecciona **Add a record** (Añadir un registro) -> **URL / URI**.
   - Ingresa tu URL HTTPS completa (ejemplo: `https://mi-tarjeta.dev`).
   - Toca **Write / OK** y acerca la tarjeta física a la parte posterior del smartphone.
4. **Prueba de Campo:**
   - Bloquea y desbloquea el teléfono, acerca la tarjeta física NFC: se abrirá instantáneamente la tarjeta digital sin requerir ninguna app instalada.

---

## 🌐 Opciones de Despliegue Rápido (1 Minuto)

### Opción A: GitHub Pages
1. Sube este repositorio a GitHub.
2. En tu repositorio, ve a **Settings > Pages**.
3. En **Branch**, selecciona `main` y la carpeta `/ (root)`. Haz clic en **Save**.
4. En 30 segundos tu URL estará activa con certificado SSL gratuito.

### Opción B: Cloudflare Pages / Vercel / Netlify
1. Conecta tu repositorio o arrastra la carpeta completa a la consola de Vercel/Netlify.
2. El despliegue es estático e inmediato (Build Command: Ninguno, Output Directory: `./`).

---

## 🧪 Verificación y Auditoría
Para ejecutar la suite de pruebas unitarias y de seguridad:
```bash
node test_audit.js
```
