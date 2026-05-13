const featured = [
  { id: "FT0frI2LMtY", title: "Projet — Bande annonce" },
  { id: "fLNfS5OR8t4", title: "Projet — Clip" },
  { id: "3m3XVDgL7ww", title: "Projet — Captation" },
  { id: "nfFwveM2eLA", title: "Projet — Interview" }
];

const featuredRow = document.getElementById("featuredRow");
const lightbox = document.getElementById("lightbox");
const player = document.getElementById("player");
const closeBtn = document.getElementById("closeBtn");

document.getElementById("year").textContent = new Date().getFullYear();

/* LIGHTBOX */
function openVideo(id){
  lightbox.style.display = "flex";
  player.src = `https://www.youtube.com/embed/${id}?autoplay=1&mute=0&rel=0&modestbranding=1`;
}

function closeVideo(){
  lightbox.style.display = "none";
  player.src = "";
}

closeBtn.addEventListener("click", closeVideo);
lightbox.addEventListener("click", (e) => {
  if(e.target === lightbox) closeVideo();
});

/* FEATURED RENDER */
featured.forEach(v => {
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

/* HERO SOUND BUTTON */
document.getElementById("unmuteBtn").addEventListener("click", () => {
  // Recharge le player hero avec son (clic utilisateur autorise)
  const hero = document.getElementById("heroPlayer");
  hero.src = "https://www.youtube.com/embed/G3zP-RhcgAE?autoplay=1&mute=0&controls=1&loop=1&playlist=G3zP-RhcgAE&modestbranding=1&rel=0";
});
