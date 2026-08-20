# Portfolio Premium — Video Editor / Motion Designer / VFX Artist

Portfolio cinematográfico construido con Next.js 15, TypeScript, Tailwind CSS v4, Framer Motion, GSAP y Lenis. Incluye un panel de administración propio para gestionar proyectos, testimonios y textos del sitio sin tocar código.

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS v4** (tokens de diseño en `src/app/globals.css`)
- **Framer Motion** — reveals, parallax, cursor, modal, microinteracciones
- **GSAP + ScrollTrigger** — fondo animado (blobs morphing) y parallax de scroll
- **Lenis** — smooth scroll
- **React Icons** (marcas: Instagram, LinkedIn, YouTube, Behance) + **Lucide** (iconografía general)
- **Server Actions** de Next.js para el panel de administración (sin API REST adicional)

## Empezar

```bash
npm install
cp .env.example .env.local
```

Edita `.env.local` y define:

```
ADMIN_PASSWORD=tu-contraseña-segura
ADMIN_SESSION_SECRET=un-string-aleatorio-largo   # ej: openssl rand -hex 32
```

```bash
npm run dev
```

- Sitio público: [http://localhost:3000](http://localhost:3000)
- Panel de administración: [http://localhost:3000/admin](http://localhost:3000/admin) (pide la contraseña de `ADMIN_PASSWORD`)

## Panel de administración

Desde `/admin` puedes, **sin tocar código**:

- Crear, editar, eliminar y reordenar **proyectos** (título, cliente, categoría, software, duración, descripción, resultado, herramientas, miniatura, video, y las imágenes **Antes** / **Después** para el slider comparador).
- Publicar/ocultar un proyecto sin eliminarlo.
- Crear, editar y eliminar **clientes** (creadores/marcas con los que ha trabajado — foto, plataforma, seguidores) — aparecen en la franja "He trabajado con".
- Crear, editar y eliminar **testimonios** (con foto opcional).
- Editar los **textos del Hero, el Showreel y los datos de contacto** (correo, WhatsApp) desde "Ajustes".

Cada campo de imagen/video en el panel permite **subir**, **cambiar** o **eliminar** el archivo actual de forma independiente — si te equivocas al subir algo, puedes quitarlo sin tener que reemplazarlo por otro archivo.

Todo se guarda en `data/*.json` (proyectos, clientes, testimonios y ajustes) mediante Server Actions — el sitio público lee esos archivos en cada request, así que los cambios se reflejan de inmediato, sin rebuild.

Las imágenes/videos que subas desde el panel se guardan en `public/uploads/` y quedan disponibles automáticamente; al eliminar o reemplazar un archivo, el anterior se borra del disco.

> ⚠️ Este almacenamiento basado en archivos es perfecto para desarrollo local o un despliegue en un servidor persistente (VPS, Docker, Railway, Render, etc.). En plataformas *serverless* como Vercel el sistema de archivos es de solo lectura entre despliegues, así que las escrituras del panel no persistirán. Para producción en Vercel, sigue la guía de abajo para migrar el almacenamiento a Supabase — el esquema de datos (`src/lib/types.ts`) ya está listo para eso.

## Estructura de contenido

- `data/projects.json` — proyectos del portfolio.
- `data/clients.json` — clientes/creadores con los que ha trabajado (franja "He trabajado con").
- `data/testimonials.json` — testimonios.
- `data/settings.json` — hero, showreel, servicios, stats, redes sociales y contacto.

Puedes editar estos archivos a mano o usar el panel `/admin`.

### Reemplazar miniaturas, videos e imágenes Antes/Después por contenido real

Por defecto, cada proyecto muestra una "miniatura" generada (gradiente + nombre de categoría) para no depender de assets externos, y la sección Antes/Después usa un mock visual. Para usar tus propios archivos:

1. Desde `/admin/projects/[id]`, sube: miniatura, video, imagen "Antes" (la versión sin editar) e imagen "Después" (el resultado final) — se guardan en `public/uploads/` y reemplazan automáticamente el contenido generado. El slider de Antes/Después usa exactamente esas dos imágenes.
2. O edita `data/projects.json` y define `thumbnailUrl` / `videoUrl` / `beforeImageUrl` / `afterImageUrl` con una ruta bajo `/public` o una URL externa.

## Conectar Supabase (opcional, recomendado para producción serverless)

El código está desacoplado: toda la lectura/escritura pasa por `src/lib/data/*.ts`. Para migrar a Supabase:

1. Crea un proyecto en Supabase y las tablas `projects`, `testimonials`, `settings` siguiendo los tipos de `src/lib/types.ts`.
2. Crea un bucket de Storage para `thumbnails`/`videos`.
3. Reemplaza las funciones de `src/lib/data/projects.ts`, `testimonials.ts` y `settings.ts` por llamadas a `@supabase/supabase-js` (ya está en `package.json`).
4. Sustituye `src/lib/uploads.ts` por una subida a Supabase Storage.
5. Define `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY` en tus variables de entorno de producción.

El resto de la aplicación (secciones, panel admin, formularios) no necesita cambios porque ya consume esas funciones a través de una interfaz estable.

## Diseño

- Paleta: negro profundo `#050505`, grises oscuros, blanco hueso y **naranja `#FF6A00`** como único color de acento (úsalo con moderación: CTAs, hovers, detalles).
- Tipografía: `Inter` (texto) + `Bricolage Grotesque` (titulares).
- Fondo animado: blobs con morphing continuo (círculo → cuadrado redondeado → hexágono → blob orgánico) generados matemáticamente con una "superformula" e interpolados cuadro a cuadro con GSAP — sin dependencias de pago (sin MorphSVG).
- Cursor personalizado, botones magnéticos, scroll suave con Lenis, reveals con stagger y parallax con GSAP ScrollTrigger.
- Respeta `prefers-reduced-motion`: desactiva animaciones pesadas para quienes lo soliciten.

## Scripts

```bash
npm run dev     # desarrollo
npm run build   # build de producción
npm run start   # servir el build
npm run lint    # eslint
```

## Despliegue

- **VPS / Docker / Render / Railway**: `npm run build && npm run start`. El almacenamiento en `data/` y `public/uploads/` persiste entre reinicios si el disco es persistente.
- **Vercel**: funciona igual para el sitio y el panel, pero migra el almacenamiento a Supabase (ver arriba) para que los cambios del panel persistan entre despliegues.

## Seguridad del panel admin

- Autenticación simple por contraseña (`ADMIN_PASSWORD`) con cookie de sesión firmada (`ADMIN_SESSION_SECRET`), httpOnly, 12 horas de duración.
- Cambia `ADMIN_PASSWORD` antes de publicar el sitio y no compartas `.env.local`.
- Para un segundo usuario o autenticación más robusta (OAuth, múltiples roles), migra `src/lib/auth.ts` a Supabase Auth o similar.
