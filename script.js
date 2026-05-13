/* ===========================
   WILLIAM DUCHENE — ARTE PRO
   Stable GitHub Pages Version
   =========================== */

const VIDEOS = [
  // SHOWREELS
  { id: "G3zP-RhcgAE", title: "Showreel 2025", category: "showreel" },

  // BANDES ANNONCES
  { id: "FT0frI2LMtY", title: "Bande annonce", category: "trailer" },

  // CLIPS / MUSIQUE
  { id: "fLNfS5OR8t4", title: "Clip", category: "clip" },

  // CAPTATIONS
  { id: "3m3XVDgL7ww", title: "Captation", category: "capture" },

  // INTERVIEWS
  { id: "nfFwveM2eLA", title: "Interview", category: "interview" }
];

/* ===========================
   DOM
   =========================== */
const grid = document.getElementById("grid");
const lightbox = document.getElementById("lightbox");
const player = document.getElementById("player");
const closeBtn = document.getElementById("closeBtn");
const year = document.getElementById("year");
const loadMoreBtn = document.getElementById("loadMoreBtn");

year.textContent = new Date().getFullYear();

/* ===========================
   LIGHTBOX
   =========================== */
function openVideo(videoId){
  player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0&modestbranding=1`;
  lightbox.style.display = "flex";
}

function closeVideo(){
  player.src = "";
  lightbox.style.display = "none";
}

closeBtn.addEventListener("click", closeVideo);

lightbox.addEventListener("click", (e) => {
  if(e.target === lightbox) closeVideo();
});

/* ===========================
   RENDER SYSTEM
   =========================== */
let currentFilter = "all";
let displayed = 0;
const STEP = 9;

function getFiltered(){
  if(currentFilter === "all") return VIDEOS;
  return VIDEOS.filter(v => v.category === currentFilter);
}

function createCard(video){
  const card = document.createElement("div");
  card.className = "card";

  const thumb = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;

  card.innerHTML = `
    <div class="thumb">
      <img src="${thumb}" alt="${video.title}">
    </div>
    <div class="meta">
      <h3>${video.title}</h3>
      <span>Regarder</span>
    </div>
  `;

  card.addEventListener("click", () => openVideo(video.id));
  return card;
}

function renderMore(){
  const list = getFiltered();
  const slice = list.slice(displayed, displayed + STEP);

  slice.forEach(v => grid.appendChild(createCard(v)));
  displayed += slice.length;

  if(displayed >= list.length){
    loadMoreBtn.style.display = "none";
  } else {
    loadMoreBtn.style.display = "inline-flex";
  }
}

function resetGrid(){
  grid.innerHTML = "";
  displayed = 0;
  renderMore();
}

/* ===========================
   FILTERS
   =========================== */
document.querySelectorAll(".filter").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    currentFilter = btn.getAttribute("data-filter");
    resetGrid();
  });
});

/* ===========================
   LOAD MORE BUTTON
   =========================== */
loadMoreBtn.addEventListener("click", renderMore);

/* ===========================
   INIT
   =========================== */
resetGrid();
