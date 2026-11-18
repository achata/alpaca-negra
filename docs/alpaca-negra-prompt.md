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

## Pasos y mirada

Las poses se generaron con `image_gen` a partir de `assets/alpaca-negra.png`. La primera se guarda en `assets/paso-andino.webp`. Las poses y el macro final se interpolaron por flujo óptico y se guardaron en `assets/pasos-y-mirada.mp4` como una secuencia silenciosa de 300 fotogramas a 60 fps. La posición del scroll elige el fotograma y el navegador puede omitir cuadros durante desplazamientos rápidos.

### Poses

```text
Create a high resolution cinematic VFX contact sheet, exactly 2 columns x 2 rows of FOUR perfectly edge-to-edge landscape 3:2 frames, no white gutters, borders, labels, writes, or spacing. Every frame depicts the EXACT SAME jet black curly alpaca in the supplied photograph, using the exact same Andean sunset scene, grading, soft mist and golden rim light from left. These are genuinely different consecutive body poses (NOT a camera zoom) from a FIXED LOW CAMERA with fixed focal length as the animal walks right up to the stationary lens. Keep distant mountain horizon and the lit left backdrop consistent throughout. In chronological order: TOP LEFT: almost the original framing, but the alpaca has taken a step, turns its shoulders more toward camera, its head is slightly LOWER and to the RIGHT with a little natural tilt, neck and chest shifted onto advancing leg; upright ears, same curls. TOP RIGHT: another distinct step with head bobbing higher and swaying slightly LEFT, alpaca head is about 1.35x larger than original, asymmetrical perspective, rim-lit wool in motion, nostrils visible. BOTTOM LEFT: face much closer 2.0x original, ears partially clipped above, naturally skewed perspective as it turns its head so the eye on the viewer's LEFT is near the horizontal center; dark eyes, alpaca muzzle angled to screen RIGHT. BOTTOM RIGHT: even closer, only its single viewer-left eye centered in the frame and large (about 20% of the frame width), black fleece and a little dark cheek to the right, no muzzle, no other eye, the iris shows a faint electric purple reflection. Photographic, lifelike animal, dramatic, precise four panels photography for animation source. The same black alpaca identity and curls across all four frames. No graphic elements, panel outlines, styling other than the photography.
```

### Iris

```text
Use the input as precise identity and light reference. Create a single photoreal LANDSCAPE 3:2 movie still of this same animal's RIGHT EYE (the eye on the left of the reference). Final extreme macro frame in which there is ONLY ONE eye, precisely CENTERED at x=50%, y=50%; the entire almond of this large luminous eye is visible, about 45% width, surrounded solely by rich, soft-textured black curly alpaca hair and black skin. No second eye, background, sunlight flare, whole head, muzzle or ears. Keep the real alpaca anatomy including naturally horizontal dark pupil (horizontal oval), catchlight reflected at upper left, slightly uneven eyelid with tiny hair, warm rim from left. Iris has electrifying SATURATED PURPLE / VIOLET radial fibers with very fine brighter lilac streaks, deep amethyst shading and subtle optical glow confined within iris. Iris is purple not blue, pupil nearly black. Film still, handcrafted editorial lighting, not an illustration. Dark brown-black fleece contains tactile golden warm highlights to link to input. No text, no logo, no digital overlays.
```
