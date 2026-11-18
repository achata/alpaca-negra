const intro = document.querySelector(".intro");
const portrait = document.querySelector(".portrait");
const film = document.querySelector(".portrait-film");
const explore = document.querySelector(".explore");
const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
const framesPerSecond = 60;
let scrollFrame = 0;
let displayedFrame = -1;
let playPending = false;
let seekOnly = false;

function fraction(value, start, end) {
  return Math.min(1, Math.max(0, (value - start) / (end - start)));
}

function lastFilmFrame() {
  return Math.max(1, Math.round((film.duration || 0) * framesPerSecond) - 1);
}

function showPortrait(frame) {
  if (displayedFrame === frame) {
    return;
  }
  displayedFrame = frame;
  const progress = frame / lastFilmFrame();
  portrait.classList.toggle("has-frame", frame > 0);
  portrait.classList.toggle("hide-intro", progress >= 0.30);
  portrait.classList.toggle("is-near", progress > 0.47);
  portrait.classList.toggle("is-close", progress > 0.84);
  portrait.style.setProperty("--title-push", fraction(progress, 0.015, 0.67));
  portrait.style.setProperty("--title-opacity", 1 - fraction(progress, 0.42, 0.77));
  portrait.style.setProperty("--intro-opacity", 1 - fraction(progress, 0.06, 0.30));
  portrait.style.setProperty("--navigation-opacity", 1 - fraction(progress, 0.68, 0.89));
  portrait.style.setProperty("--wash-opacity", 1 - fraction(progress, 0.35, 0.84));
}

function updatePortrait() {
  scrollFrame = 0;
  if (document.hidden || !intro.classList.contains("has-motion") || film.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || film.seeking) {
    return;
  }

  const last = lastFilmFrame();
  const distance = intro.offsetHeight - portrait.offsetHeight;
  const bounds = intro.getBoundingClientRect();
  const target = Math.round(fraction(-bounds.top, 0, distance * 0.91) * last);
  const current = Math.min(last, Math.floor(film.currentTime * framesPerSecond));
  const difference = target - current;
  showPortrait(current);

  if (difference === 0) {
    film.pause();
    return;
  }

  // Forward playback lets the decoder present each footfall between wheel events.
  if (difference > 0 && !seekOnly && bounds.bottom > 0) {
    const maxRate = location.hash === "#mirada" && target === last ? 1 : 1.35;
    const rate = Math.min(maxRate, Math.max(0.65, difference / 18));
    if (film.playbackRate !== rate) {
      film.playbackRate = rate;
    }
    if (film.paused && !playPending) {
      playPending = true;
      film.play().catch(error => {
        if (error.name !== "AbortError") {
          seekOnly = true;
        }
      }).finally(() => {
        playPending = false;
        requestPortraitUpdate();
      });
    }
    requestPortraitUpdate();
    return;
  }

  film.pause();
  const step = Math.max(1, Math.ceil(Math.abs(difference) * 0.28));
  const next = bounds.bottom <= 0 ? target : current + Math.sign(difference) * step;
  film.currentTime = (next + 0.25) / framesPerSecond;
}

function requestPortraitUpdate() {
  if (!scrollFrame) {
    scrollFrame = requestAnimationFrame(updatePortrait);
  }
}

function configureMotion() {
  const enabled = motion.matches && !film.error && Boolean(film.canPlayType("video/mp4"));
  intro.classList.toggle("has-motion", enabled);
  explore.hash = enabled ? "mirada" : "andes";
  explore.firstElementChild.textContent = enabled ? "Ver marcha" : "Explorar";

  if (enabled) {
    if (!film.hasAttribute("src")) {
      film.preload = "auto";
      film.src = film.dataset.src;
    }
    window.addEventListener("scroll", requestPortraitUpdate, { passive: true });
    window.addEventListener("resize", requestPortraitUpdate);
  } else {
    film.pause();
    window.removeEventListener("scroll", requestPortraitUpdate);
    window.removeEventListener("resize", requestPortraitUpdate);
    showPortrait(0);
  }

  requestPortraitUpdate();
}

motion.addEventListener("change", configureMotion);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    film.pause();
  } else {
    requestPortraitUpdate();
  }
});
film.addEventListener("loadeddata", requestPortraitUpdate);
film.addEventListener("error", configureMotion);
film.addEventListener("seeked", requestPortraitUpdate);
film.addEventListener("canplay", requestPortraitUpdate);
configureMotion();

const viewer = document.querySelector("#visor");
const viewerPhoto = viewer.querySelector("img");
const viewerTitle = viewer.querySelector("figcaption");
const photographs = {
  mirada: ["La mirada", "Primer plano del iris morado eléctrico entre el vellón negro de la alpaca."],
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
