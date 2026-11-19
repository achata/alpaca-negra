---
name: replicar-alpaca-negra
description: Replica la página Alpaca Negra con los mismos archivos o vuelve a componer su video frontal con iris violeta y el reflejo de NeuracX. Úsala para repetir esta página o su proceso desde un solo prompt.
---

# Replicar Alpaca Negra

La raíz del proyecto está dos niveles por encima de esta carpeta. Contiene `index.html`, `assets/`, el `Dockerfile` y [los prompts y fuentes visuales](../../docs/alpaca-negra-prompt.md).

## Copiar la página

Para una réplica exacta, ejecuta `node skills/replicar-alpaca-negra/scripts/replicar.mjs <destino>` desde la raíz del proyecto. Si el prompt omite el destino, utiliza `./replica-alpaca-negra`. El destino debe estar vacío para que el resultado contenga solo los archivos de la réplica. Usa los medios y fuentes versionados para conservar el resultado píxel a píxel.

Compara `index.html` y `assets/` de la réplica con el origen. Si se solicita una vista local, usa el comando Docker del [README](../../README.md) o un servidor estático que admita peticiones `Range`.

## Volver a ejecutar el proceso visual

Para recomponer la mirada a partir de los archivos originales, ejecuta `node skills/replicar-alpaca-negra/scripts/render-mirada.mjs` en la copia. El script usa Node.js, FFmpeg con `libx264` y `libwebp`, el video `assets/pasos-y-mirada.mp4` y la foto incluida en `assets/neuracx.png` de esta skill. Si FFmpeg está en otra ruta, indica su ejecutable en `FFMPEG`. Mantén el logo y los demás activos finales de la réplica para reproducir fielmente el diseño.

Si el prompt solicita nuevas imágenes o una variante del sitio, usa las referencias y los prompts documentados. Un nuevo render generativo producirá variaciones. Si cambia el metraje frontal, mide de nuevo el centro y el radio del iris en los fotogramas de referencia y actualiza `irisTrack` en el script. Conserva el iris violeta desde el primer fotograma y la aparición gradual de NeuracX dentro de la pupila. Mantén `portraitFps` en el JavaScript al mismo valor que `fps` en el render.

Verifica la portada, el inicio y el final de **Ver marcha**, la duración cercana a 10,4 segundos, la exploración manual en ambas direcciones, el acceso a **Los Andes** y la variante de movimiento reducido. Revisa el cierre en una pantalla vertical para comprobar que se ve completa la figura de NeuracX.
