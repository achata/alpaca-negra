const intro = document.querySelector(".intro");
const portrait = document.querySelector(".portrait");
const portraitFilm = document.querySelector(".portrait-film");
const explore = document.querySelector(".explore");
const walkEnd = document.querySelector("#mirada");
const nextScene = document.querySelector(".next-scene");
const andes = document.querySelector(".andes");
const andesStage = document.querySelector(".andes-stage");
const andesFilm = document.querySelector(".andes-film");
const galleryItems = document.querySelectorAll(".gallery li");
const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
const portraitFps = 48;
let scrollFrame = 0;
let portraitProgress = -1;
let andesProgress = -1;
let walkPlaying = false;
let playbackScroll = 0;
let focusNextScene = false;

function fraction(value, start, end) {
  return Math.min(1, Math.max(0, (value - start) / (end - start)));
}

function loadFilm(film) {
  if (!film.hasAttribute("src")) {
    film.src = film.dataset.src;
  }
}

function scrubFilm(film, progress, fps) {
  if (film.error || film.readyState < HTMLMediaElement.HAVE_METADATA || film.seeking || !Number.isFinite(film.duration)) {
    return;
  }

  const last = Math.round(film.duration * fps) - 1;
  const frame = Math.round(progress * last);
  if (Math.min(last, Math.floor(film.currentTime * fps)) !== frame) {
    // Seek inside the frame to avoid landing on a boundary rounded by the decoder.
    film.currentTime = (frame + 0.25) / fps;
  }
}

function showPortrait(progress) {
  if (portraitProgress === progress) {
    return;
  }

  portraitProgress = progress;
  portrait.classList.toggle("has-frame", progress > 0);
  portrait.classList.toggle("hide-intro", progress >= 0.30);
  portrait.classList.toggle("is-near", progress > 0.47);
  portrait.classList.toggle("is-close", progress > 0.91);
  portrait.style.setProperty("--title-push", fraction(progress, 0.015, 0.67));
  portrait.style.setProperty("--title-opacity", 1 - fraction(progress, 0.42, 0.77));
  portrait.style.setProperty("--intro-opacity", 1 - fraction(progress, 0.06, 0.30));
  portrait.style.setProperty("--navigation-opacity", 1 - fraction(progress, 0.68, 0.89));
  portrait.style.setProperty("--wash-opacity", 1 - fraction(progress, 0.35, 0.84));
}

function updatePortrait() {
  const bounds = intro.getBoundingClientRect();
  if (!intro.classList.contains("has-motion") || bounds.bottom <= 0) {
    return;
  }

  const distance = walkEnd.offsetTop;
  if (!portraitFilm.seeking && portraitFilm.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
    const lastFrameTime = portraitFilm.duration - 1 / portraitFps;
    const progress = fraction(portraitFilm.currentTime, 0, lastFrameTime);
    showPortrait(progress);

    if (walkPlaying) {
      playbackScroll = Math.round(window.scrollY + bounds.top + distance * progress);
      if (Math.abs(window.scrollY - playbackScroll) >= 1) {
        window.scrollTo({ top: playbackScroll, behavior: "instant" });
      }
    }
  }

  if (!walkPlaying) {
    scrubFilm(portraitFilm, fraction(-bounds.top, 0, distance), portraitFps);
  }
}

function stopWalk() {
  if (!walkPlaying) {
    return;
  }

  walkPlaying = false;
  portraitFilm.pause();
  portrait.classList.remove("is-playing");
  requestScrollUpdate();
}

function updateAndes() {
  if (!andes.classList.contains("has-motion")) {
    return;
  }

  const bounds = andes.getBoundingClientRect();
  if (bounds.top < window.innerHeight + 420 && !andesFilm.error) {
    loadFilm(andesFilm);
  }

  const distance = bounds.height - andesStage.offsetHeight;
  const progress = distance > 0 ? fraction(-bounds.top, 0, distance) : 1;
  if (andesProgress !== progress) {
    andesProgress = progress;
    galleryItems.forEach((item, index) => {
      const start = 0.24 + index * 0.1;
      const reveal = fraction(progress, start, start + 0.3);
      item.style.setProperty("--card-reveal", reveal);
      item.style.setProperty("--card-pointer", reveal >= 0.6 ? "auto" : "none");
    });
  }

  if (!andesFilm.seeking) {
    const hasFrame = andesFilm.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA;
    andes.classList.toggle("has-frame", hasFrame);
    if (hasFrame) {
      andes.style.setProperty("--crossing", fraction(andesFilm.currentTime, 0, andesFilm.duration - 1 / 30));
    }
  }

  scrubFilm(andesFilm, fraction(progress, 0, 0.94), 30);
}

function requestScrollUpdate() {
  if (!scrollFrame) {
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      updatePortrait();
      updateAndes();
      if (walkPlaying) {
        requestScrollUpdate();
      }
    });
  }
}

function configureMotion() {
  const canAnimate = (film) => motion.matches && !film.error
    && Boolean(film.canPlayType('video/mp4; codecs="avc1.640028"'));
  const animatePortrait = canAnimate(portraitFilm);
  intro.classList.toggle("has-motion", animatePortrait);
  andes.classList.toggle("has-motion", canAnimate(andesFilm));
  explore.hash = animatePortrait ? "mirada" : "andes";
  explore.firstElementChild.textContent = animatePortrait ? "Ver marcha" : "Ver los Andes";

  if (animatePortrait) {
    loadFilm(portraitFilm);
  } else {
    stopWalk();
    showPortrait(0);
  }

  if (!andes.classList.contains("has-motion")) {
    andes.classList.remove("has-frame");
  }

  requestScrollUpdate();
}

for (const film of [portraitFilm, andesFilm]) {
  film.preload = "auto";
  film.addEventListener("loadedmetadata", requestScrollUpdate);
  film.addEventListener("loadeddata", requestScrollUpdate);
  film.addEventListener("canplay", requestScrollUpdate);
  film.addEventListener("seeked", requestScrollUpdate);
  film.addEventListener("error", configureMotion);
}

explore.addEventListener("click", (event) => {
  if (!intro.classList.contains("has-motion") || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }

  event.preventDefault();
  if (walkPlaying) {
    return;
  }

  walkPlaying = true;
  playbackScroll = window.scrollY;
  focusNextScene = event.detail === 0;
  portrait.classList.add("is-playing");
  portraitFilm.play().catch((error) => {
    if (walkPlaying && error.name !== "AbortError") {
      stopWalk();
      window.location.hash = "andes";
    }
  });
  requestScrollUpdate();
});

portraitFilm.addEventListener("ended", () => {
  if (walkPlaying) {
    updatePortrait();
    stopWalk();
    if (window.location.hash !== "#mirada") {
      window.history.pushState(null, "", "#mirada");
    }
    if (focusNextScene) {
      nextScene.focus({ preventScroll: true });
    }
  }
});

portrait.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (link && link !== explore) {
    stopWalk();
  }
});
window.addEventListener("wheel", stopWalk, { passive: true });
window.addEventListener("touchmove", stopWalk, { passive: true });
window.addEventListener("keydown", (event) => {
  if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) {
    stopWalk();
  }
});
window.addEventListener("scroll", () => {
  if (walkPlaying && Math.abs(window.scrollY - playbackScroll) > 2) {
    stopWalk();
  }
  requestScrollUpdate();
}, { passive: true });
window.addEventListener("resize", requestScrollUpdate);
motion.addEventListener("change", configureMotion);
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
