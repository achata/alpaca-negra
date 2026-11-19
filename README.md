# Alpaca Negra

Retrato interactivo de una alpaca negra en los Andes. **Ver marcha** reproduce el acercamiento completo y termina con el reflejo de NeuracX en el iris violeta. También puedes recorrer ambos planos con el desplazamiento y abrir las fotos de la galería.

## Tecnologías

| Tecnología | Uso |
| --- | --- |
| HTML5 y CSS | Página estática, composición adaptable, video, secciones fijas durante el desplazamiento y galería con `<dialog>`. |
| JavaScript nativo | Reproducción con `HTMLVideoElement`, sincronización con `requestAnimationFrame` y adaptación a la preferencia de movimiento reducido. |
| ImageGen | Retrato, recursos fotográficos y logo de Alpaca Negra. |
| Node.js y FFmpeg | Composición por fotogramas, exportación del MP4 H.264 y extracción de la portada WebP. El sitio utiliza los archivos exportados. |
| Bodoni Moda y DM Sans | Fuentes locales en WOFF2 con licencias incluidas en `assets/`. |
| Nginx y Docker | Servicio de los archivos estáticos y soporte de peticiones por rango para buscar fotogramas. |
| GitHub Actions, GHCR y Kubernetes | El flujo existente construye la imagen ARM64, la publica en el registro y despliega en el clúster. |

## Vista local

```bash
docker build -t alpaca-negra .
docker run --rm -p 8080:80 alpaca-negra
```

Abre `http://localhost:8080`. También puedes servir `index.html` y `assets/` con cualquier servidor estático que admita peticiones `Range`.

## Réplica exacta con un prompt

Desde Codex abierto en este repositorio, pega lo siguiente.

```text
Usa skills/replicar-alpaca-negra/SKILL.md para crear una réplica exacta de Alpaca Negra en ./replica-alpaca-negra y verifica que coincide con la página original.
```

La réplica reutiliza los mismos archivos del sitio, incluido el video terminado, las fotos, las fuentes y el logo. Puedes crearla directamente con `node skills/replicar-alpaca-negra/scripts/replicar.mjs ./replica-alpaca-negra`.

## Regenerar el video de la mirada

Con Node.js y FFmpeg disponibles, ejecuta el siguiente comando desde la raíz del repositorio.

```bash
node skills/replicar-alpaca-negra/scripts/render-mirada.mjs
```

El script recompone el video frontal de 500 fotogramas a 48 fps y extrae la portada y la miniatura de la mirada. Puedes indicar la ruta de FFmpeg con la variable `FFMPEG`. Consulta los prompts, las fuentes visuales y los detalles de la composición. [Documentación de generación](docs/alpaca-negra-prompt.md)
