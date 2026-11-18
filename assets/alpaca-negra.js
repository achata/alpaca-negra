const intro = document.querySelector(".intro");
const portrait = document.querySelector(".portrait");
const motion = window.matchMedia("(prefers-reduced-motion: no-preference)");
const tallViewport = window.matchMedia("(min-height: 37rem)");
let scrollFrame = 0;

function updatePortrait() {
  scrollFrame = 0;
  const distance = intro.offsetHeight - portrait.offsetHeight;
  const progress = distance > 0 ? -intro.getBoundingClientRect().top / distance : 0;
  portrait.style.setProperty("--progress", Math.min(1, Math.max(0, progress)).toFixed(4));
}

function requestPortraitUpdate() {
  if (!scrollFrame) {
    scrollFrame = requestAnimationFrame(updatePortrait);
  }
}

function configureMotion() {
  const enabled = motion.matches && tallViewport.matches;
  intro.classList.toggle("has-motion", enabled);

  if (enabled) {
    window.addEventListener("scroll", requestPortraitUpdate, { passive: true });
    window.addEventListener("resize", requestPortraitUpdate);
  } else {
    window.removeEventListener("scroll", requestPortraitUpdate);
    window.removeEventListener("resize", requestPortraitUpdate);
  }

  requestPortraitUpdate();
}

motion.addEventListener("change", configureMotion);
tallViewport.addEventListener("change", configureMotion);
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
