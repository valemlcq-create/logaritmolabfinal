# Logaritmos: comprender, explorar y aplicar

Aplicación educativa (React + Vite + Tailwind) para 5.º año de secundaria: diagnóstico,
módulos, laboratorio gráfico, seguimiento del progreso y un tutor guiado con IA (Gemini).

La aplicación **funciona completa sin IA**: si no se configura una clave de Gemini, el tutor
responde en *modo autónomo local* y los ejercicios salen del banco curado. La IA en línea es
un agregado opcional.

---

## 1. Publicar en Netlify

> ⚠️ **No uses "arrastrar y soltar la carpeta `dist`" (Netlify Drop).** Así solo se sube la
> parte estática y las funciones del tutor con IA no se publican. La app andaría igual, pero
> siempre en modo autónomo. Usá la opción A o la B.

### Opción A: desde GitHub (recomendada)

1. Creá un repositorio en GitHub y subí **todo el contenido de esta carpeta** (no hace falta subir
   `node_modules` ni `dist`).
2. En [app.netlify.com](https://app.netlify.com): **Add new site → Import an existing project →
   GitHub** y elegí el repositorio.
3. Netlify lee `netlify.toml` y completa todo solo:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`
   - Node 22
4. (Opcional, para activar la IA) **Site configuration → Environment variables → Add a variable**:
   - `GEMINI_API_KEY` = tu clave de [Google AI Studio](https://aistudio.google.com/apikey)
   - `GEMINI_MODEL` = (opcional) otro modelo; si no la ponés se usa `gemini-2.5-flash`
5. **Deploy site**. Si agregaste la clave después del primer deploy, hacé
   **Deploys → Trigger deploy → Deploy site** para que la tome.

Cada vez que subas cambios al repositorio, Netlify vuelve a publicar automáticamente.

### Opción B: desde la computadora con Netlify CLI

Requiere Node.js 22 o superior.

```bash
npm install
npx netlify-cli login
npx netlify-cli deploy --build          # versión de prueba (URL temporal)
npx netlify-cli deploy --build --prod   # versión definitiva
```

La primera vez te pregunta si querés crear un sitio nuevo. La clave `GEMINI_API_KEY` se carga
igual que en el paso 4 de la opción A (o con `npx netlify-cli env:set GEMINI_API_KEY tu_clave`).

### Comprobar que quedó bien

- Abrí `https://TU-SITIO.netlify.app/api/health`. Debe mostrar algo como
  `{"ok":true,"aiAvailable":true,"model":"gemini-2.5-flash"}`.
  - `aiAvailable: false` → falta la variable `GEMINI_API_KEY` (la app funciona en modo autónomo).
- Entrá a la pestaña **Tutor** y hacé una consulta.

---

## 2. Trabajar en la computadora (desarrollo)

```bash
npm install
cp .env.example .env      # y poné tu GEMINI_API_KEY (opcional)
npm run dev               # http://localhost:3000  (app + API de IA)
```

Otros comandos:

| Comando           | Qué hace                                               |
|-------------------|--------------------------------------------------------|
| `npm run dev`     | Servidor local con la app y los endpoints `/api/*`     |
| `npm run dev:vite`| Solo la interfaz (el tutor queda en modo autónomo)     |
| `npm run build`   | Genera la versión de producción en `dist/`             |
| `npm run preview` | Sirve `dist/` para revisarla                           |
| `npm run lint`    | Chequeo de tipos con TypeScript                        |

---

## 3. Estructura

```
├── index.html                 Punto de entrada HTML
├── netlify.toml               Configuración de Netlify (build, funciones, redirecciones)
├── netlify/
│   ├── functions/             Funciones serverless (endpoints de IA en producción)
│   │   ├── tutor.mts               POST /api/tutor
│   │   ├── generate-exercise.mts   POST /api/exercises/generate
│   │   └── health.mts              GET  /api/health
│   └── lib/                   Lógica compartida (Gemini, validación matemática)
├── server.ts                  Servidor Express SOLO para desarrollo local
├── public/                    Archivos estáticos (favicon)
├── src/
│   ├── App.tsx, main.tsx
│   ├── pages/                 Inicio, Diagnóstico, Módulos, Laboratorio, Progreso, Tutor
│   ├── components/            Ejercicios, visualizaciones, metacognición, navegación
│   ├── data/                  Banco de ejercicios, módulos, catálogo de errores, "Cerebro"
│   ├── services/              Motor adaptativo, validación, progreso, cliente de IA
│   └── prompts/               Instrucciones del tutor
└── docs/                      PDFs de referencia (NO se publican en el sitio)
```

El progreso de cada estudiante se guarda en el navegador (`localStorage`): no hay base de datos
ni cuentas. Si el estudiante cambia de dispositivo o borra los datos del navegador, empieza de cero.

---

## 4. Qué se corrigió respecto de la versión exportada de AI Studio

| Problema | Efecto | Corrección |
|---|---|---|
| Los endpoints de IA estaban en un servidor Express (`server.ts`), que Netlify no ejecuta. | En Netlify el tutor con IA y la generación de ejercicios nunca funcionaban. | Se crearon Netlify Functions (`netlify/functions/`) con la misma lógica, compartida con el servidor local (`netlify/lib/ai.ts`). |
| `public/_redirects` mandaba **todas** las rutas (incluidas `/api/*`) a `index.html`, y Netlify lo aplica antes que `netlify.toml`. | Las llamadas a la API recibían la página HTML en lugar de datos. | Se eliminó `_redirects`; todas las reglas están en `netlify.toml`, con `/api/*` antes de la regla de la SPA. |
| Modelo `gemini-4-hydrogen`, que no figura en la documentación de Gemini. | Error en cada consulta a la IA. | Modelo por defecto `gemini-2.5-flash`, configurable con `GEMINI_MODEL`. |
| Sin límite de tiempo en la llamada a Gemini. | Netlify corta las funciones a los ~10 s y devolvía un error genérico. | Tiempo máximo de 9 s en el servidor y de 15 s en el navegador; si se supera, la app pasa a modo autónomo. Se desactiva el "thinking" en 2.5 Flash para responder más rápido. |
| Sin versión de Node definida. | Vite 8 falla con Node < 20.19. | `NODE_VERSION = "22"` en `netlify.toml` y `engines` en `package.json`. |
| `esbuild@0.25` declarado sin uso, incompatible con la versión que pide Vite 8. | Posible error `ERESOLVE` al instalar con npm en Netlify. | Se quitaron dependencias sin uso (`esbuild`, `autoprefixer`, `motion`). Express y dotenv pasaron a desarrollo. |
| `bun.lock` desactualizado respecto de los cambios. | Netlify habría usado Bun con un lockfile inconsistente. | Se quitó; Netlify usa npm. Al hacer `npm install` se genera `package-lock.json`: conviene subirlo al repositorio. |
| PDFs internos (prompt maestro y corpus) dentro de `public/`. | Quedaban descargables por cualquiera que conociera la URL. | Movidos a `docs/` (no se publican). |
| El historial que se enviaba al tutor ya incluía la pregunta actual. | La IA recibía la consulta duplicada. | Se envía solo el historial previo. |
| Un progreso guardado con una versión anterior podía tener campos faltantes. | La app podía romperse al abrir. | Al cargar, se completan los campos faltantes con valores por defecto. |
| Sin límites de tamaño en los datos enviados a la API. | Uso abusivo de la clave de Gemini. | Se recortan pregunta, historial, instrucciones y tema. |

### Recomendación sobre la clave de Gemini

Los endpoints `/api/*` son públicos: cualquiera que conozca la URL del sitio puede usarlos y
consumir la cuota de tu clave. Usá una clave dedicada a este proyecto y revisá los límites de uso
en Google AI Studio.

`metadata.json` y algunos comentarios de `vite.config.ts` son propios de AI Studio. No afectan a
Netlify y se dejaron por si querés volver a abrir el proyecto allí.
