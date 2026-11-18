const intro = document.querySelector(".intro");
const portrait = document.querySelector(".portrait");
const film = document.querySelector(".portrait-film");
const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
const framesPerSecond = 60;
let scrollFrame = 0;
let currentFrame = 0;
let requestedFrame = 0;

function fraction(value, start, end) {
  return Math.min(1, Math.max(0, (value - start) / (end - start)));
}

function lastFilmFrame() {
  return Math.max(1, Math.round((film.duration || 0) * framesPerSecond) - 1);
}

function showPortrait(frame) {
  const progress = frame / lastFilmFrame();
  portrait.classList.toggle("has-frame", frame > 0);
  portrait.classList.toggle("is-near", progress > 0.47);
  portrait.classList.toggle("is-close", progress > 0.84);
  portrait.style.setProperty("--title-push", fraction(progress, 0.02, 0.78));
  portrait.style.setProperty("--title-opacity", 1 - fraction(progress, 0.42, 0.77));
  portrait.style.setProperty("--intro-opacity", 1 - fraction(progress, 0.08, 0.44));
  portrait.style.setProperty("--navigation-opacity", 1 - fraction(progress, 0.68, 0.89));
  portrait.style.setProperty("--wash-opacity", 1 - fraction(progress, 0.35, 0.84));
}

function updatePortrait() {
  scrollFrame = 0;
  if (!intro.classList.contains("has-motion") || film.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || film.seeking) {
    return;
  }

  const distance = intro.offsetHeight - portrait.offsetHeight;
  const progress = fraction(-intro.getBoundingClientRect().top, 0, distance * 0.91);
  const target = Math.round(progress * lastFilmFrame());
  const difference = target - currentFrame;
  if (difference !== 0) {
    const step = Math.max(1, Math.round(Math.abs(difference) * 0.42));
    requestedFrame = currentFrame + Math.sign(difference) * step;
    film.currentTime = (requestedFrame + 0.25) / framesPerSecond;
  }
}

function requestPortraitUpdate() {
  if (!scrollFrame) {
    scrollFrame = requestAnimationFrame(updatePortrait);
  }
}

function configureMotion() {
  const enabled = motion.matches && !film.error && Boolean(film.canPlayType('video/mp4; codecs="avc1.640c20"'));
  intro.classList.toggle("has-motion", enabled);

  if (enabled) {
    if (!film.hasAttribute("src")) {
      film.preload = "auto";
      film.src = film.dataset.src;
    }
    window.addEventListener("scroll", requestPortraitUpdate, { passive: true });
    window.addEventListener("resize", requestPortraitUpdate);
    showPortrait(currentFrame);
  } else {
    window.removeEventListener("scroll", requestPortraitUpdate);
    window.removeEventListener("resize", requestPortraitUpdate);
    showPortrait(0);
  }

  requestPortraitUpdate();
}

motion.addEventListener("change", configureMotion);
film.addEventListener("loadeddata", requestPortraitUpdate);
film.addEventListener("error", configureMotion);
film.addEventListener("seeked", () => {
  currentFrame = requestedFrame;
  if (intro.classList.contains("has-motion")) {
    showPortrait(currentFrame);
    requestPortraitUpdate();
  }
});
configureMotion();

const viewer = document.querySelector("#visor");
const viewerPhoto = viewer.querySelector("img");
const viewerTitle = viewer.querySelector("figcaption");
const photographs = {
  mirada: ["La mirada", "Primer plano de los ojos y el hocico de la alpaca negra."],
  vellon: ["El vellón", "Detalle de la lana rizada de la alpaca negra."],
  paisaje: ["La cordillera", "La alpaca negra camina por una ladera andina entre neblina y luz de amanecer."],
};

if (typeof viewer.showModal === "function") {
  for (const link of document.querySelectorAll("[data-gallery]")) {
    link.setAttribute("aria-haspopup", "dialog");

    link.addEventListener("click", (event) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      event.preventDefault();
      const view = link.dataset.gallery;
      const [title, description] = photographs[view];

      viewer.dataset.gallery = view;
      viewerTitle.textContent = title;
      viewerPhoto.alt = description;
      viewerPhoto.src = link.href;
      viewer.showModal();
    });
  }

  viewer.addEventListener("click", (event) => {
    if (event.target === viewer) {
      const bounds = viewer.getBoundingClientRect();
      const inside = event.clientX >= bounds.left && event.clientX <= bounds.right
        && event.clientY >= bounds.top && event.clientY <= bounds.bottom;

      if (!inside) {
        viewer.close();
      }
    }
  });
}
