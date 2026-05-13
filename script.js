let videosData = {};
let allVideos = [];
let filteredVideos = [];

let displayed = 0;
const STEP = 12;

const grid = document.getElementById("grid");
const loadMoreBtn = document.getElementById("loadMoreBtn");

const featuredRow = document.getElementById("featuredRow");

const lightbox = document.getElementById("lightbox");
const player = document.getElementById("player");
const closeBtn = document.getElementById("closeBtn");

/* -------------------------
   HERO SOUND
-------------------------- */
document.getElementById("unmuteBtn").addEventListener("click", () => {
  const hero = document.getElementById("heroPlayer");
  hero.src = "https://www.youtube.com/embed/G3zP-RhcgAE?autoplay=1&mute=0&controls=1&rel=0";
});

/* -------------------------
   LIGHTBOX
-------------------------- */
function openVideo(id){
  lightbox.style.display = "flex";
  player.src = `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
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
   FEATURED (FIXE)
-------------------------- */
const FEATURED = [
  { id: "FT0frI2LMtY", title: "Bande annonce" },
  { id: "mps9I3NBjeQ", title: "Captation" },
  { id: "CELXcME_HkE", title: "Musique" },
  { id: "4c_jGWO1Bic", title: "Motion-Design" }
];

function renderFeatured(){
  FEATURED.forEach(v => {
    const div = document.createElement("div");
    div.className = "featured-card";

    div.innerHTML = `
      <div class="featured-thumb">
        <img src="https://img.youtube.com/vi/${v.id}/hqdefault.jpg">
      </div>
      <div class="featured-meta">
        <h3>${v.title}</h3>
      </div>
    `;

    div.onclick = () => openVideo(v.id);
    featuredRow.appendChild(div);
  });
}

/* -------------------------
   BUILD FROM JSON (FIX TOTAL)
-------------------------- */
function buildAllVideos(){

  allVideos = [];

  Object.entries(videosData).forEach(([category, videos]) => {

    videos.forEach(v => {
      allVideos.push({
        id: v.id,
        title: v.title,
        category: category
      });
    });

  });

  filteredVideos = allVideos;
}

/* -------------------------
   CARD (NETFLIX STYLE)
-------------------------- */
function createCard(video){
  const div = document.createElement("div");
  div.className = "card";

  div.innerHTML = `
    <div class="thumb">
      <img src="https://img.youtube.com/vi/${video.id}/hqdefault.jpg">
    </div>
    <div class="meta">
      <h3>${video.title}</h3>
    </div>
  `;

  let iframe;

  div.addEventListener("mouseenter", () => {
    const thumb = div.querySelector(".thumb");

    iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${video.id}?autoplay=1&mute=1&controls=0&rel=0`;
    iframe.className = "preview-frame";

    thumb.innerHTML = "";
    thumb.appendChild(iframe);
  });

  div.addEventListener("mouseleave", () => {
    const thumb = div.querySelector(".thumb");

    thumb.innerHTML = `
      <img src="https://img.youtube.com/vi/${video.id}/hqdefault.jpg">
    `;
  });

  div.addEventListener("click", () => openVideo(video.id));

  return div;
}

/* -------------------------
   RENDER
-------------------------- */
function render(){
  const slice = filteredVideos.slice(displayed, displayed + STEP);

  slice.forEach(v => grid.appendChild(createCard(v)));

  displayed += slice.length;

  if(displayed >= filteredVideos.length){
    loadMoreBtn.style.display = "none";
  } else {
    loadMoreBtn.style.display = "inline-flex";
  }
}

function reset(){
  grid.innerHTML = "";
  displayed = 0;
  render();
}

/* -------------------------
   FILTERS
-------------------------- */
document.querySelectorAll(".filter").forEach(btn => {
  btn.addEventListener("click", () => {

    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;

    if(filter === "all"){
      filteredVideos = allVideos;
    } else {
      filteredVideos = allVideos.filter(v => v.category === filter);
    }

    reset();
  });
});

/* -------------------------
   LOAD MORE
-------------------------- */
loadMoreBtn.addEventListener("click", render);

/* -------------------------
   SCROLL INFINITE
-------------------------- */
window.addEventListener("scroll", () => {
  const nearBottom = window.innerHeight + window.scrollY > document.body.offsetHeight - 400;
  if(nearBottom){
    render();
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
    reset();
  })
  .catch(err => {
    console.error(err);
    grid.innerHTML = "<p style='color:white'>Erreur chargement JSON</p>";
  });
