import { spawn, spawnSync } from "node:child_process";
import { mkdtempSync, renameSync, rmSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

const skill = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assets = resolve(skill, "../../assets");
const ffmpeg = process.env.FFMPEG || "ffmpeg";
const width = 1280;
const height = 720;
const fps = 48;
const bytesPerFrame = width * height * 3;
const photoSize = 512;
const extraFrames = 110;

// Source frame, pupil center x/y, horizontal iris radius in the 1280 × 720 plate.
const irisTrack = [
  [0, 625.5, 241, 4],
  [10, 630, 239, 4],
  [20, 625.5, 234, 4],
  [30, 621, 236, 4.2],
  [40, 615.5, 240, 4.3],
  [50, 612.5, 241, 4.5],
  [60, 619.5, 240.5, 4.5],
  [70, 629.5, 240, 4.5],
  [80, 628, 235.5, 4.7],
  [90, 623.5, 232.5, 4.7],
  [100, 617.5, 238.5, 4.8],
  [110, 611.5, 241.5, 5],
  [120, 613, 241, 5.2],
  [130, 627, 240, 5.6],
  [140, 633, 238, 5.8],
  [150, 628, 231, 6.2],
  [160, 620.5, 234.5, 6.6],
  [170, 612.5, 240.5, 7],
  [180, 607.5, 243.5, 7.1],
  [186, 611.5, 243.5, 7.2],
  [192, 622.5, 241.5, 7.2],
  [198, 631, 242, 7.6],
  [204, 635, 240, 8.1],
  [210, 633.5, 232.5, 8.8],
  [216, 629, 228, 9],
  [222, 623, 232.5, 9.2],
  [228, 616, 244, 10.1],
  [234, 607, 252, 10.6],
  [240, 600.5, 261, 10.8],
  [246, 602.5, 265.5, 11.5],
  [252, 612, 271, 12],
  [258, 633, 276, 13],
  [264, 644, 283, 14],
  [270, 646, 286, 15],
  [276, 639, 285, 16],
  [282, 638, 288, 18],
  [288, 635, 293, 19.5],
  [294, 633, 301, 23],
  [300, 636, 314, 27],
  [306, 636, 320, 33],
  [312, 640, 326, 43],
  [318, 640, 333, 50],
];

function smooth(start, end, value) {
  const t = Math.min(1, Math.max(0, (value - start) / (end - start)));
  return t * t * (3 - 2 * t);
}

function irisPosition(index) {
  const step = irisTrack.findIndex(([frame]) => frame > index) - 1;
  const a = irisTrack[Math.max(0, step - 1)];
  const b = irisTrack[step];
  const c = irisTrack[step + 1];
  const d = irisTrack[Math.min(irisTrack.length - 1, step + 2)];
  const span = c[0] - b[0];
  const t = (index - b[0]) / span;
  const curve = smooth(0, 1, t);

  return b.slice(1).map((value, offset) => {
    const key = offset + 1;
    const slopeIn = (c[key] - a[key]) / (c[0] - a[0]);
    const slopeOut = (d[key] - b[key]) / (d[0] - b[0]);
    return value + (c[key] - value) * curve
      + span * t * (1 - t) * ((1 - t) * slopeIn - t * slopeOut);
  });
}

function tintIris(frame, index) {
  const [centerX, centerY, radiusX] = irisPosition(index);
  const radiusY = radiusX * 0.94;
  const contribution = 1 - smooth(292, 318, index);

  for (let y = Math.floor(centerY - radiusY); y < centerY + radiusY; y++) {
    for (let x = Math.floor(centerX - radiusX); x < centerX + radiusX; x++) {
      const u = (x + 0.5 - centerX) / radiusX;
      const v = (y + 0.5 - centerY) / radiusY;
      const edge = 1 - smooth(0.68, 1, u * u + v * v);
      const pupil = smooth(0.12, 0.72, u * u * 3 + v * v * 9);
      const pixel = (y * width + x) * 3;
      const luma = Math.max(frame[pixel], frame[pixel + 1], frame[pixel + 2]);
      const dye = edge * (0.20 + 0.80 * pupil) * (1 - smooth(53, 142, luma)) * contribution;
      frame[pixel] = Math.min(255, frame[pixel] + 42 * dye);
      frame[pixel + 1] = frame[pixel + 1] * (1 - 0.15 * dye);
      frame[pixel + 2] = Math.min(255, frame[pixel + 2] + 79 * dye);
    }
  }
}

function reflectPhoto(frame, index, photo) {
  const reveal = smooth(375, 456, index);
  const settle = smooth(388, 466, index);
  const centerX = 653;
  const centerY = 344 + 3 * Math.sin(index / 33) * settle;
  const scaleX = 138 + 288 * reveal;
  const scaleY = 67 + 344 * reveal;
  const spill = 130 + 235 * reveal;
  const phase = (index - 375) * 0.035;

  for (let y = Math.floor(centerY - spill); y < Math.min(height, centerY + spill); y++) {
    if (y < 0) continue;
    const v = (y - centerY) / scaleY;
    for (let x = Math.floor(centerX - spill * 1.35); x < centerX + spill * 1.35; x++) {
      const u = (x - centerX) / scaleX;
      const radius = Math.sqrt(u * u + v * v);
      if (radius > 1.13) continue;

      const pixel = (y * width + x) * 3;
      const angular = Math.atan2(v, u);
      const wave = Math.sin(angular * 10 + radius * 8 - phase * 2);
      const focus = (1 - smooth(0.21, 1.05, radius)) * reveal;
      const caustic = Math.pow(Math.max(0, wave), 4) * (1 - smooth(0.64, 1.13, radius)) * (1 - focus) * reveal;
      const distortion = (1 - settle) * 0.028 * Math.sin(phase * 3 + v * 13);
      const lens = 1 + (1 - settle) * radius * 0.42;
      const photoX = Math.round((0.5 + (u + distortion) * lens) * (photoSize - 1));
      const photoY = Math.round((0.48 + (v - distortion * 0.7) * lens) * (photoSize - 1));
      let mix = 0;
      let level = 0;
      let sample = 0;

      if (photoX >= 0 && photoY >= 0 && photoX < photoSize && photoY < photoSize) {
        sample = (photoY * photoSize + photoX) * 3;
        level = smooth(28, 107, Math.max(photo[sample], photo[sample + 1], photo[sample + 2]));
        mix = reveal * (1 - smooth(0.28, 0.50, radius)) * (0.40 + 0.60 * level);
      }

      const shade = 1 - 0.84 * focus;
      frame[pixel] = Math.min(255, (frame[pixel] * shade + 22 * caustic) * (1 - mix) + photo[sample] * mix);
      frame[pixel + 1] = Math.min(255, (frame[pixel + 1] * shade + 7 * caustic) * (1 - mix) + photo[sample + 1] * mix);
      frame[pixel + 2] = Math.min(255, (frame[pixel + 2] * shade + 42 * caustic) * (1 - mix) + photo[sample + 2] * mix);
    }
  }
}

function run(args) {
  const result = spawnSync(ffmpeg, ["-hide_banner", "-loglevel", "error", ...args], { maxBuffer: 4 * 1024 * 1024 });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr.toString());
  return result.stdout;
}

function start(args, stdio) {
  const child = spawn(ffmpeg, ["-hide_banner", "-loglevel", "error", ...args], { stdio });
  const done = new Promise((accept, reject) => {
    child.once("error", reject);
    child.once("close", (code) => code === 0 ? accept() : reject(new Error(`FFmpeg terminó con código ${code}`)));
  });
  return { child, done };
}

async function* compose(input, photo) {
  let frame = Buffer.allocUnsafe(bytesPerFrame);
  let last;
  let offset = 0;
  let index = 0;

  for await (const chunk of input) {
    let position = 0;
    while (position < chunk.length) {
      const length = Math.min(bytesPerFrame - offset, chunk.length - position);
      chunk.copy(frame, offset, position, position + length);
      position += length;
      offset += length;
      if (offset === bytesPerFrame) {
        if (index < 318) tintIris(frame, index);
        if (index >= 375) {
          last = Buffer.from(frame);
          reflectPhoto(frame, index, photo);
        }
        yield frame;
        index++;
        offset = 0;
        frame = Buffer.allocUnsafe(bytesPerFrame);
      }
    }
  }

  if (index !== 390 || offset !== 0) {
    throw new Error(`Se esperaban 390 fotogramas de origen, se recibieron ${index}`);
  }
  for (let extra = 0; extra < extraFrames; extra++) {
    const ending = Buffer.from(last);
    reflectPhoto(ending, index + extra, photo);
    yield ending;
  }
}

const photo = run([
  "-i", join(skill, "assets/neuracx.png"), "-vf", `scale=${photoSize}:${photoSize}:flags=lanczos`,
  "-frames:v", "1", "-c:v", "rawvideo", "-threads", "1", "-pix_fmt", "rgb24", "-f", "rawvideo", "pipe:1",
]);
const work = mkdtempSync(join(assets, ".render-"));
const movie = join(work, "marcha-y-neuracx.mp4");
const poster = join(work, "paso-andino-violeta.webp");
const thumbnail = join(work, "detalle-de-la-mirada.webp");

try {
  const input = start([
    "-threads", "2", "-i", join(assets, "pasos-y-mirada.mp4"), "-an", "-c:v", "rawvideo", "-threads", "1",
    "-pix_fmt", "rgb24", "-f", "rawvideo", "pipe:1",
  ], ["ignore", "pipe", "inherit"]);
  const output = start([
    "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", `${width}x${height}`, "-framerate", String(fps), "-i", "pipe:0",
    "-c:v", "libx264", "-threads", "4", "-profile:v", "high", "-level:v", "4.0", "-preset", "medium",
    "-crf", "18", "-pix_fmt", "yuv420p", "-g", "12", "-movflags", "+faststart", movie,
  ], ["pipe", "ignore", "inherit"]);

  try {
    await Promise.all([
      input.done, output.done,
      pipeline(Readable.from(compose(input.child.stdout, photo)), output.child.stdin),
    ]);
  } catch (error) {
    input.child.kill();
    output.child.kill();
    await Promise.allSettled([input.done, output.done]);
    throw error;
  }

  run(["-i", movie, "-frames:v", "1", "-c:v", "libwebp", "-quality", "91", poster]);
  run([
    "-ss", String(248 / fps), "-i", movie, "-vf", "crop=166:220:560:204",
    "-frames:v", "1", "-c:v", "libwebp", "-quality", "91", thumbnail,
  ]);
  renameSync(movie, join(assets, "marcha-y-neuracx.mp4"));
  renameSync(poster, join(assets, "paso-andino-violeta.webp"));
  renameSync(thumbnail, join(assets, "detalle-de-la-mirada.webp"));
} finally {
  rmSync(work, { recursive: true, force: true });
}
