# Alpaca negra: prompt de generación

Generada con la herramienta integrada `image_gen`; sin imágenes de referencia.
Imagen original: `assets/alpaca-negra.png`.

```text
Use case: photorealistic-natural.
Asset type: a large fine-art photographic hero image for the Alpaca Negra website, horizontal 3:2 composition.
Primary request: one magnificent BLACK ALPACA, profoundly realistic and highly artistic. The alpaca must be the overwhelmingly dominant subject, huge in the frame. A real black alpaca, with dense naturally curled jet-black fleece, a soft alpaca muzzle, small upright pointed ears, dark expressive eyes with tiny natural catchlights, anatomically accurate proportions. Head, ears, neck and upper body fully visible, with breathing room above the ears, photographed from a gently low angle. Center the alpaca in the composition, its face close to the upper central third, gazing calmly toward the camera.
Scene/backdrop: a remote Andean highland, monumental mountain silhouettes and low drifting mist, distant mountains softly out of focus. Atmospheric, timeless, quiet. No other animals or people.
Style/medium: extraordinarily photorealistic fine-art wildlife photography, museum-quality editorial portrait. Rich tangible individual black wool fibers with natural tonal separation and lifelike facial texture. Beautiful composition with restrained chiaroscuro, subtle film grain and deep atmospheric perspective. Camera realism, not a painting or CGI.
Lighting/mood: dramatic soft directional dawn light, a subtle warm rim on the dark wool, deep charcoal shadows with visible detail, a muted antique gold glow through fog. Rich blacks, smoke grey, desaturated stone and a touch of warm light. The eyes and muzzle must remain clearly readable. Artistic and cinematic, never cartoonish.
Composition/framing: landscape image, alpaca fills approximately 85 percent of the image height, fine-art photographic portrait with cinematic Andean surroundings. Keep both ears completely inside the frame. This image will be displayed very large in a minimal dark web page with the page heading outside the image.
Constraints: black fleece, one alpaca only, no text, no typography, no logos, no border, no watermark, no accessories, no halter, no saddle, no stylized anatomy, no illustration.
```

## Amanecer en los Andes

Generada con la herramienta integrada `image_gen` a partir del retrato original y guardada para la web en `assets/amanecer-en-los-andes.webp`.

```text
Create a new ultra-wide photorealistic fine-art wildlife establishing photograph for the next scene of the same editorial as the reference. The input portrait is a continuity reference for the recognizable jet-black curly alpaca, the Andean highlands, and the soft antique-gold dawn through mist. Wide landscape composition, as close to 16:9 as possible. Camera pulled far back and now viewing from a side angle, one and only one real black alpaca walking in profile to the right on a sloping highland ridge. Place the entire animal, including all ears, hooves and tail, centered at 65% of image width and 62% of image height, small within the scene, approximately a quarter of image width. Layers of monumental Andean mountains and banks of mist, sheltered warm grey skies, muted old gold coming in from the left, deep brown grays and mostly muted desaturated color. The left upper half stays softly misty as clean negative space and the foreground can darken naturally. Editorial film still, tactile grasses and wool, quiet and atmospheric, avoid fantasy and high saturation. Maintain the existing photographic world, now seen from afar. The output is only the photograph, no text, graphics, logos, humans, accessories or other animals.
```

## Marcha y mirada

La referencia de identidad es el retrato original `assets/alpaca-negra.png`. Para la animación se eligió luz difusa neutra que permite distinguir los rizos negros desde las orejas hasta las patas.

### Recursos de ImageGen

| Recurso | Indicación de generación |
| --- | --- |
| [Ocho fases de la marcha](fases-de-marcha.webp) | Una sola alpaca negra de cuerpo entero, caminando hacia cámara, con las cuatro patas visibles. Distribuir un ciclo en ocho celdas registradas sobre transparencia, en cuatro columnas y dos filas. Alternar apoyo, elevación, flexión y extensión de las patas, con luz neutra en todos los rizos. |
| Sendero | Recrear el paisaje andino del retrato con una cámara fija a la altura del animal. Abrir un sendero transitable de grava que llegue al centro del encuadre entre pastos, neblina y montañas. |
| [Detalle de la cabeza](../assets/retrato-andino.webp) | Restaurar a alta resolución la cabeza de la primera fase, conservando la silueta, las posiciones de los ojos, el hocico, las proporciones y el vellón negro de la referencia del ciclo. |
| [Macro del iris](../assets/iris-electrico.webp) | Encuadrar únicamente el ojo derecho de la alpaca, centrado y rodeado de pelo negro. Dar al iris fibras radiales moradas eléctricas con destellos lilas, una pupila ovalada oscura y un pequeño reflejo de luz natural. |

### Secuencia para el navegador

Se interpolaron las fases por flujo óptico y se compuso el animal sobre el sendero fijo. Cada ciclo combina el cambio de apoyo con el balanceo del pecho y de la cabeza. Los planos de detalle se registraron sobre el mismo ojo para seguirlo hasta el final.

El [video](../assets/pasos-y-mirada.mp4) contiene 390 fotogramas a 60 fps en 1280 × 720. La [portada](../assets/paso-andino.webp) corresponde al primer fotograma. El desplazamiento controla la posición del video y la separación del título.

## La marcha de perfil

La referencia de ritmo fue el [MP4 añadido al repositorio](../instagram_DaQLsDwloME.mp4). La marcha frontal termina en el iris y el segundo plano muestra a la alpaca atravesando la ladera mientras aparecen las tres tarjetas. La animación responde al desplazamiento en ambas direcciones.

Con la herramienta integrada ImageGen se generaron las poses y se limpió el fondo a partir de la foto de [Amanecer en los Andes](../assets/amanecer-en-los-andes.webp):

- **Poses:** «Generate eight poses of the same jet-black alpaca in strict side profile, facing right, walking naturally on a gently rising Andean trail. Use a transparent four-column, two-row sheet. Show the full animal and all four hooves in every cell. Match the reference's curly black fleece and warm rim light. Keep the camera, subject scale and hoof level consistent, and alternate contact, support, lift and extension in a looping walk. Only the eight silhouettes, without shadows, grids or text.»
- **Fondo:** «Remove only the small black alpaca from the grassy ridge at about 66% width, 64% height. Inpaint its silhouette with the matching fog, distant mountain and native grass immediately around it, continuing the existing slope naturally. Preserve the terrain profile, rocks, sunlight, upper sky, peaks, composition, muted amber coloring and realistic photographic textures.»

Se compusieron las poses sobre la ladera con FFmpeg. El [video de perfil](../assets/marcha-en-los-andes.mp4) dura 5,6 segundos, tiene un tamaño de 1280 × 720 y se muestrea a 30 fps. La foto original permanece disponible como fondo estático y en la galería.
