# Banderas 🌍 — Juego de Banderas

Juego interactivo para adivinar banderas del mundo, diseñado especialmente para niños. Funciona sin conexión, es instalable como app (PWA) y no requiere ningún backend ni clave de API.

## Características

- 3 niveles de dificultad (Fácil, Medio, Difícil)
- Hasta 6 jugadores por turnos
- Temporizador opcional con bonus de velocidad
- Racha de aciertos con multiplicador de puntos
- Sonidos sintetizados (WebAudio, sin archivos de audio)
- Confeti en la pantalla de resultados
- Funciona offline (Service Worker / PWA)
- Instalable en el móvil como app nativa
- Imágenes de banderas de flagcdn.com (precacheadas para offline)
- Todo en español

## Requisitos

- Node.js 18 o superior
- npm 8 o superior

## Instalación y desarrollo

```bash
npm install
npm run dev
```

Abre http://localhost:4321 en tu navegador.

## Build de producción

```bash
npm run build
npm run preview   # opcional: previsualiza el build localmente
```

Los archivos listos para desplegar quedan en `dist/`.

## Desplegar en Vercel

### Paso a paso:

1. **Sube el código a GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/TU_USUARIO/flags-game.git
   git push -u origin main
   ```

2. **Importa en Vercel**:
   - Ve a [vercel.com](https://vercel.com) e inicia sesión.
   - Pulsa **"Add New Project"** → **"Import Git Repository"**.
   - Selecciona tu repositorio `flags-game`.

3. **Configuración automática**:
   - Vercel detecta Astro automáticamente.
   - Framework Preset: **Astro** (se configura solo).
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - **Sin variables de entorno necesarias**.

4. **Pulsa "Deploy"** y en 1-2 minutos tendrás la URL pública.

### Notas:
- No se necesita `vercel.json` (es una SPA de una sola página).
- Funciona offline gracias al Service Worker generado automáticamente.
- Las banderas se cachean en el dispositivo tras la primera visita.

## Tecnologías

| Tecnología | Uso |
|---|---|
| [Astro 6](https://astro.build) | Framework estático |
| [Preact](https://preactjs.com) | Isla interactiva (game) |
| [@vite-pwa/astro](https://vite-pwa-org.netlify.app) | PWA + Service Worker |
| [flagcdn.com](https://flagcdn.com) | Imágenes de banderas |
| [restcountries.com](https://restcountries.com) | Datos de países (build-time) |
| WebAudio API | Sonidos sintetizados |
| canvas-confetti | Animación de confeti |

## Changelog

### v1.3.3 — 2026-05-21
- **Test:** Verificación del sistema de actualización automática en 60 segundos.

### v1.3.2 — 2026-05-21
- **Fix:** El banner de actualización ahora se activa cuando la PWA instalada vuelve al primer plano (visibilitychange) y cada 60 segundos, en lugar de esperar solo a la navegación.

### v1.3.1 — 2026-05-21
- **Fix:** Revertido cambio de prueba del subtítulo (test de actualización PWA).

### v1.3.0 — 2026-05-20
- **Feat:** Detección de nuevas versiones en la PWA instalada. Cuando se publica una actualización, aparece un banner en la app con el botón "Actualizar" para recargar al instante.

### v1.2.0 — 2026-05-20
- **Feat:** Se añaden 6 países que faltaban para llegar a 195: Palestina, Kosovo, Taiwán, Islas Cook, Niue y Sahara Occidental.

### v1.1.0 — 2026-05-20
- **Fix:** Las banderas ya no se repiten hasta haber visto todas las disponibles en el pool. Se implementó un sistema de deck barajado sin reposición: el juego recorre todos los países en orden aleatorio y solo vuelve a barajar cuando los agota.

### v1.0.0 — 2025-05-13
- Versión inicial del juego.

## Estructura del proyecto

```
src/
  components/     # Componentes Preact (isla interactiva)
    Game.tsx       # Raíz de la isla, máquina de estados
    SetupScreen.tsx
    PlayersScreen.tsx
    PlayScreen.tsx
    ResultsScreen.tsx
    FlagCard.tsx
    Timer.tsx
    Confetti.tsx
  data/
    loadCountries.ts  # Fetch en build-time con fallback
    countries.json    # Fallback: 189 países con nombres en español
  lib/
    types.ts       # Tipos TypeScript
    game.ts        # Lógica del juego, puntuación, pools
    sound.ts       # Sonidos WebAudio (sin archivos de audio)
    storage.ts     # sessionStorage para reanudar partida
  layouts/
    Layout.astro
  pages/
    index.astro
  styles/
    global.css     # CSS variables, mobile-first, sin Tailwind
public/
  icons/           # Iconos PNG para PWA
```
