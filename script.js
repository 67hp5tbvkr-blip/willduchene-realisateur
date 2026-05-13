/* ===========================
   WILLIAM DUCHENE — ARTE AUTO
   YouTube Playlists Sync (API)
   =========================== */

const API_KEY = "AIzaSyCQmVuqzvmeMmBthnrfvlULxsnGRd7vKQE";

/* PLAYLISTS */
const PLAYLISTS = [
  { id: "PLJpwSH_unsgIN3bCbNm-7RSkpsem3VbFM", category: "showreel", label: "Showreels" },
  { id: "PLJpwSH_unsgI39IXHReNTR9w0hScxuLki", category: "trailer", label: "Bandes annonces" },
  { id: "PLJpwSH_unsgJVCaxQdOiQ7UIJvl2SxKCV", category: "capture", label: "Captations" },
  { id: "PLJpwSH_unsgJBZNUqjH7zSsms_QcwmWNc", category: "clip", label: "Clips" },
  { id: "PLJpwSH_unsgIyofHxEz-kRSEgMPZia5DH", category: "interview", label: "Interviews" }
];

/* DOM */
const grid = document.getElementById("grid");
const lightbox = document.getElementById("lightbox");
const player = document.getElementById("player");
const closeBtn = document.getElementById("closeBtn");
const year = document.getElementById("year");
const loadMoreBtn = document.getElementById("loadMoreBtn");

year.textContent = new Date().getFullYear();

/* LIGHTBOX */
function openVideo(videoId){
  player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&rel=0&modestbranding=1`;
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

/* DATA */
let ALL_VIDEOS = [];
let currentFilter = "all";
let displayed = 0;
const STEP = 12;

/* FETCH PLAYLIST ITEMS WITH PAGINATION */
async function fetchPlaylistAll(playlistId){
  let items = [];
  let pageToken = "";

  while(true){
    const url =
      `https://www.googleapis.com/youtube/v3/playlistItems?` +
      `part=snippet&maxResults=50&playlistId=${playlistId}&key=${API_KEY}` +
      (pageToken ? `&pageToken=${pageToken}` : "");

    const res = await fetch(url);
    const data = await res.json();

    if(data.error){
      console.error("YouTube API Error:", data.error);
      return [];
    }

    if(!data.items) return [];

    items.push(...data.items);

    if(data.nextPageToken){
      pageToken = data.nextPageToken;
    } else {
      break;
    }
  }

  return items;
}

/* LOAD ALL PLAYLISTS */
async function loadAllVideos(){
  ALL_VIDEOS = [];
  grid.innerHTML = `<div style="color:rgba(255,255,255,0.6);padding:20px 0;">Chargement des playlists…</div>`;

  for(const p of PLAYLISTS){
    const items = await fetchPlaylistAll(p.id);

    const mapped = items
      .map(v => {
        const sn = v.snippet;
        if(!sn || !sn.resourceId) return null;

        return {
          id: sn.resourceId.videoId,
          title: sn.title || "Sans titre",
          category: p.category,
          categoryLabel: p.label,
          thumb: sn.thumbnails?.high?.url || sn.thumbnails?.medium?.url || ""
        };
      })
      .filter(Boolean)
      .filter(v => v.title.toLowerCase() !== "private video" && v.title.toLowerCase() !== "deleted video");

    ALL_VIDEOS.push(...mapped);
  }

  // Remove duplicates (if video appears in multiple playlists)
  const seen = new Set();
  ALL_VIDEOS = ALL_VIDEOS.filter(v => {
    if(seen.has(v.id))
