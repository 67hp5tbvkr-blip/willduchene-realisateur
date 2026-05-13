/* ===========================
   William Duchene — Catalogue
   JSON-driven (no API)
   Netflix hover preview + infinite scroll
   =========================== */

const FEATURED = [
  { id: "FT0frI2LMtY", title: "Bande annonce" },
  { id: "fLNfS5OR8t4", title: "Clip" },
  { id: "3m3XVDgL7ww", title: "Captation" },
  { id: "nfFwveM2eLA", title: "Interview" }
];

let videosData = {};
let allVideos = [];
let filteredVideos = [];

let currentFilter = "all";
let displayed = 0;
const STEP = 16;

const grid = document.getElementById("grid");
const loadMoreBtn = document.getElementById("loadMoreBtn");

const featuredRow = document.getElementById("featuredRow");

const lightbox = document.getElementById("lightbox");
const player = document.getElementById("player");
const closeBtn = document.getElementById("closeBtn");

document.getElementById("year").textContent = new Date().getFullYear();

/* -------------------------
   HERO SOUND BUTTON
-------------------------- */
document.getElementById("unmuteBtn").addEventListener("click", () => {
  const hero = document.getElementById("heroPlayer");
  hero.src = "https://www.youtube.com/embed/G3zP-RhcgAE?autoplay=1&mute=0&controls=1&loop=1&playlist=G3zP-RhcgAE&modestbranding=1&rel=0";
});

/* -------------------------
   LIGHTBOX
-------------------------- */
function openVideo(id){
  lightbox.style.display = "flex";
  player.src = `https://www.youtube.com/embed/${id}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1`;
}

function closeVideo(){
  lightbox.style.display = "none";
  player.src = "";
}

closeBtn.addEventListener("click", closeVideo);
lightbox.addEventListener("click", (e) => {
  if(e.target === lightbox) closeVideo();
});

/* -------------------------
   FEATURED RENDER
-------------------------- */
function renderFeatured(){
  FEATURED.forEach(v => {
    const div = document.createElement("div");
    div.className = "featured-card";

    div.innerHTML = `
      <div class="featured-thumb">
        <img src="https://img.youtube.com/vi/${v.id}/hqdefault.jpg" alt="${v.title}">
      </div>
      <div class="featured-meta">
        <h3>${v.title}</h3>
      </div>
    `;

    div.addEventListener("click", () => openVideo(v.id));
    featuredRow.appendChild(div);
  });
}

/* -------------------------
   BUILD LIST FROM JSON
-------------------------- */
function buildAllVideos(){
  allVideos = [];

  Object.keys(videosData).forEach(category => {
    videosData[category].forEach(v => {
      allVideos.push({
        id: v.id,
        title: v.title || "Sans titre",
        category: category
      });
    });
  });

  filteredVideos = allVideos;
}

/* -------------------------
   CREATE CARD WITH HOVER PREVIEW
-------------------------- */
function createCard(video){
  const div = document.createElement("div");
  div.className = "card";

  div.innerHTML = `
    <div class="thumb">
      <img src="https://img.youtube.com/vi/${video.id}/hqdefault.jpg" alt="${video.title}">
    </div>
    <div class="meta">
      <h3>${video.title}</h3>
    </div>
  `;

  let previewIframe = null;

  div.addEventListener("mouseenter", () => {
    const thumb = div.querySelector(".thumb");
    if(!thumb) return;

    previewIframe = document.createElement("iframe");
    previewIframe.className = "preview-frame";
    previewIframe.allow = "autoplay; encrypted-media";
    previewIframe.src = `https://www.youtube.com/embed/${video.id}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1`;

    thumb.innerHTML = "";
    thumb.appendChild(previewIframe);
  });

  div.addEventListener("mouseleave", () => {
    const thumb = div.querySelector(".thumb");
    if(!thumb) return;

    thumb.innerHTML = `
      <img src="https://img.youtube.com/vi/${video.id}/hqdefault.jpg" alt="${video.title}">
    `;
  });

  div.addEventListener("click", () => openVideo(video.id));
  return div;
}

/* -------------------------
   RENDER BATCH
-------------------------- */
function renderMore(){
  const slice = filteredVideos.slice(displayed, displayed + STEP);

  slice.forEach(video => {
    grid.appendChild(createCard(video));
  });

  displayed += slice.length;

  if(displayed >= filteredVideos.length){
    loadMoreBtn.style.display = "none";
  } else {
    loadMoreBtn.style.display = "inline-flex";
  }
}

/* -------------------------
   RESET GRID
-------------------------- */
function resetGrid(){
  grid.innerHTML = "";
  displayed = 0;
  renderMore();
}

/* -------------------------
   FILTERS
-------------------------- */
document.querySelectorAll(".filter").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    currentFilter = btn.getAttribute("data-filter");

    if(currentFilter === "all"){
      filteredVideos = allVideos;
    } else {
      filteredVideos = allVideos.filter(v => v.category === currentFilter);
    }

    resetGrid();
  });
});

/* -------------------------
   LOAD MORE BUTTON
-------------------------- */
loadMoreBtn.addEventListener("click", renderMore);

/* -------------------------
   INFINITE SCROLL
-------------------------- */
window.addEventListener("scroll", () => {
  if(loadMoreBtn.style.display === "none") return;

  const nearBottom = window.innerHeight + window.scrollY > document.body.offsetHeight - 600;
  if(nearBottom){
    renderMore();
  }
});

/* -------------------------
   INIT
-------------------------- */
renderFeatured();

fetch("videos.json")
  .then(res => res.json())
  .then(json => {
    videosData = json;
    buildAllVideos();
    resetGrid();
  })
  .catch(() => {
    grid.innerHTML = `
      <div style="color:rgba(255,255,255,0.65);padding:20px 0;">
        Erreur : fichier <b>videos.json</b> introuvable ou mal formaté.
      </div>
    `;
  });
  div.onclick = () => openVideo(video.id);
  return div;
}

// Lightbox player
function openVideo(id){
  player.src = `https://www.youtube.com/embed/${id}?autoplay=1&controls=1`;
  lightbox.style.display = "flex";
}

closeBtn.onclick = () => {
  player.src = "";
  lightbox.style.display = "none";
};

window.addEventListener("scroll", () => {
  if(window.innerHeight + window.scrollY > document.body.offsetHeight - 300){
    renderMore();
  }
});
