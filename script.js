let videosData = {};
let allItems = [];
let currentFilter = "all";
let loadedCount = 0;
const BATCH = 12;

const grid = document.getElementById("grid");
const lightbox = document.getElementById("lightbox");
const player = document.getElementById("player");
const closeBtn = document.getElementById("closeBtn");

// Load JSON
fetch("videos.json")
  .then(res => res.json())
  .then(json => {
    videosData = json;
    buildAllItems();
    renderMore();
  });

// Build flat list
function buildAllItems(){
  allItems = [];
  Object.keys(videosData).forEach(cat => {
    videosData[cat].forEach(v => {
      allItems.push({...v, category:cat});
    });
  });
}

// Render batch
function renderMore(){
  const list = currentFilter === "all" ? allItems : allItems.filter(v => v.category === currentFilter);
  const slice = list.slice(loadedCount, loadedCount + BATCH);
  slice.forEach(v => grid.appendChild(createCard(v)));
  loadedCount += slice.length;
}

// Create card with hover preview
function createCard(video){
  const div = document.createElement("div");
  div.className = "card";

  const thumb = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
  const preview = document.createElement("iframe");

  div.innerHTML = `
    <img src="${thumb}" class="thumb-img">
    <div class="meta"><h3>${video.title}</h3></div>
  `;

  // Hover preview
  div.onmouseover = () => {
    preview.src = `https://www.youtube.com/embed/${video.id}?autoplay=1&mute=1&controls=0`;
    preview.className = "hover-preview";
    div.replaceChild(preview, div.querySelector(".thumb-img"));
  };

  div.onmouseout = () => {
    div.replaceChild(document.createElement("img"), preview);
    div.querySelector("img").src = thumb;
    div.querySelector("img").className = "thumb-img";
  };

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
