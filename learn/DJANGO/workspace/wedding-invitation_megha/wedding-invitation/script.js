/* =========================================================
   WEDDING INVITATION  |  Kavin & Megha
   Edit the details below, everything else updates itself.
   ========================================================= */
const wedding = {
  groom: "Kavin",
  bride: "Meghaa",
  dateText: "November 12, 2026",
  dayText: "Thursday",
  timeText: "5:00 PM",
  dateISO: "2026-11-12T17:00:00+05:30",
  venue: "PSK MAHAL, Anthiyur Bhavani",
  mapEmbed: "https://maps.google.com/maps?q=PSK+MAHAL,+Anthiyur+Bhavani&t=&z=13&ie=UTF8&iwloc=&output=embed",
  mapLink: "https://www.google.com/maps/search/?api=1&query=PSK+MAHAL+Anthiyur+Bhavani",
  calendarLink: "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Kavin+%26+Megha+Wedding&dates=20261112T113000Z/20261112T153000Z&location=PSK+MAHAL,+Anthiyur+Bhavani",
  music: "audio/music.mp3",
  heroImage: "images/hero.jpg",
  storyImage: "images/story.jpg",
  gallery: [
    "images/gallery-1.jpg",
    "images/gallery-2.jpg",
    "images/gallery-4.jpg"
  ]
};

let opened = false;
let bgAudio = null;
let musicPlaying = false;
let countdownTimer = null;

/* ---------- Effects ---------- */
function confettiMini(){
  const colors = ["#c9758f", "#d9c4e8", "#7b4b94", "#c9a45c", "#fdf3f7", "#f3cfda"];
  for(let i = 0; i < 90; i++){
    const p = document.createElement("span");
    p.className = "confetti";
    p.style.left = Math.random() * 100 + "vw";
    p.style.animationDelay = Math.random() * 0.8 + "s";
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 3400);
  }
}

function addPetals(){
  const hero = document.querySelector(".hero");
  if(!hero) return;
  for(let i = 0; i < 8; i++){
    const p = document.createElement("span");
    p.className = "petal";
    p.style.left = Math.random() * 100 + "%";
    p.style.animationDuration = 8 + Math.random() * 7 + "s";
    p.style.animationDelay = Math.random() * 8 + "s";
    p.style.transform = "scale(" + (0.6 + Math.random() * 0.9) + ")";
    hero.appendChild(p);
  }
}

function setupReveal(){
  const items = document.querySelectorAll(".reveal");
  if(!("IntersectionObserver" in window)){
    items.forEach(el => el.classList.add("show"));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if(en.isIntersecting){
        en.target.classList.add("show");
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(el => io.observe(el));
}

/* ---------- Render ---------- */
function render(){
  const root = document.getElementById("root");

  if(!opened){
    root.innerHTML = `
      <main class="royal-cover">
        <div class="royal-line"></div>
        <div class="corner corner-top-left"></div>
        <div class="corner corner-top-right"></div>
        <div class="corner corner-bottom-left"></div>
        <div class="corner corner-bottom-right"></div>

        <div class="cover-top">WITH JOY WE INVITE YOU<span>to our wedding</span></div>

        <button class="seal-button" id="openBtn" aria-label="Open invitation">
          <div class="seal-letter">
            ${wedding.groom.charAt(0)}<span class="seal-amp">&amp;</span>${wedding.bride.charAt(0)}
          </div>
          <div class="seal-text">TAP TO OPEN</div>
        </button>
      </main>
    `;

    document.getElementById("openBtn").onclick = () => {
      opened = true;
      render();
      startMusic();
      setTimeout(confettiMini, 400);
    };
    return;
  }

  root.innerHTML = `
    <main class="page">
      <button class="music" id="musicBtn" aria-label="Toggle music">🔇</button>

      <section class="hero">
        <div class="card">
          <h1 class="script">${wedding.groom}<br><span class="amp">&amp;</span><br>${wedding.bride}</h1>
          <p>We're stepping into our forever and want our favorite people right next to us.</p>
          <div class="hero-date">${wedding.dateText.toUpperCase()}</div>
          <a class="btn" href="#invite">Open Invitation</a>
        </div>
      </section>

      <section id="invite" class="reveal">
        <h2 class="title">Love Blooms Here</h2>
        <div class="divider"></div>
        <p class="quote">Join us for love, laughter, and a night we’ll never forget.</p>

        <div class="scratchWrap">
          <div class="hiddenInvite">
            <div class="inviteCard">
              <div class="inviteTopLine"></div>
              <h3>You are invited!</h3>
              <div class="fancyLine"><span></span><b>${wedding.groom.charAt(0)} &amp; ${wedding.bride.charAt(0)}</b><span></span></div>
              <h4>${wedding.dateText}</h4>
              <p class="dayText">${wedding.dayText}</p>
              <div class="goldLine"></div>
              <h4 class="timeText">${wedding.timeText}</h4>
              <div class="fancyLine"><span></span><b>VENUE</b><span></span></div>
              <p class="venueText">${wedding.venue}</p>
            </div>
          </div>
          <canvas id="scratchCanvas"></canvas>
        </div>

        <div class="coupleBelowScratch">
          <p>We are getting married</p>
          <h2>${wedding.groom} <span>&amp;</span> ${wedding.bride}</h2>
          <div class="fancyLine coupleLine"><span></span><b>${wedding.groom.charAt(0)} &amp; ${wedding.bride.charAt(0)}</b><span></span></div>
        </div>
      </section>

      <section class="reveal">
        <h2 class="title">Our Wedding Day</h2>
        <div class="divider"></div>
        <img class="photo" src="${wedding.storyImage}" alt="Kavin and Megha">
        <div class="timeline">
          <div class="item"><div class="time"><span class="dot"></span>4:00 PM</div><div>Guest Arrival</div></div>
          
          <div class="item"><div class="time"><span class="dot"></span>7:00 PM</div><div>Dinner Reception</div></div>
        </div>
      </section>

      <section class="reveal">
        <h2 class="title">Counting Down to Forever</h2>
        <div class="dateBox">
          <div class="date">${wedding.dateText}</div>
          <p>${wedding.dayText} | ${wedding.timeText}</p>
          <div class="count" id="countdown"></div>
          <a class="btn ghost" href="${wedding.calendarLink}" target="_blank" rel="noopener">Add to Calendar</a>
        </div>
      </section>

      <section class="reveal">
        <h2 class="title">Memories</h2>
        <div class="divider"></div>
        <div class="gallery">
          ${wedding.gallery.map((src, i) => `<img src="${src}" alt="Gallery photo ${i + 1}" loading="lazy">`).join("")}
        </div>
      </section>

      <section class="reveal">
        <h2 class="title">Venue</h2>
        <div class="divider"></div>
        <p class="venue-name">${wedding.venue}</p>
        <iframe class="map" src="${wedding.mapEmbed}" loading="lazy" title="Venue map"></iframe>
        <div class="btn-row">
          <a class="btn" href="${wedding.mapLink}" target="_blank" rel="noopener">View on Google Maps</a>
        </div>
      </section>

      <div class="footer">
        <h2 class="script">Thank You</h2>
        <p>With love, ${wedding.groom} &amp; ${wedding.bride}</p>
        <small>${wedding.dateText.toUpperCase()}</small>
      </div>
    </main>

    <div class="lightbox" id="lightbox"><img alt="Enlarged photo"></div>
  `;

  addPetals();
  setupReveal();
  setupCountdown();
  setupScratch();
  setupMusic();
  setupGallery();
}

/* ---------- Countdown ---------- */
function setupCountdown(){
  const el = document.getElementById("countdown");
  if(countdownTimer) clearInterval(countdownTimer);

  function tick(){
    const diff = Math.max(new Date(wedding.dateISO) - new Date(), 0);
    if(diff === 0){
      el.innerHTML = `<div class="countdone">Today we celebrate!</div>`;
      clearInterval(countdownTimer);
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor(diff / 3600000) % 24;
    const m = Math.floor(diff / 60000) % 60;
    const s = Math.floor(diff / 1000) % 60;

    el.innerHTML = `
      <div><b>${d}</b><span>DAYS</span></div>
      <div><b>${h}</b><span>HOURS</span></div>
      <div><b>${m}</b><span>MINUTES</span></div>
      <div><b>${String(s).padStart(2, "0")}</b><span>SECONDS</span></div>
    `;
  }
  tick();
  countdownTimer = setInterval(tick, 1000);
}

/* ---------- Music ---------- */
function ensureAudio(){
  if(!bgAudio){
    bgAudio = new Audio(wedding.music);
    bgAudio.loop = true;
    bgAudio.volume = 0.6;
  }
  return bgAudio;
}

function updateMusicBtn(){
  const btn = document.getElementById("musicBtn");
  if(!btn) return;
  btn.textContent = musicPlaying ? "🔊" : "🔇";
  btn.classList.toggle("playing", musicPlaying);
}

function startMusic(){
  const a = ensureAudio();
  a.play().then(() => { musicPlaying = true; updateMusicBtn(); }).catch(() => {});
}

function setupMusic(){
  const btn = document.getElementById("musicBtn");
  ensureAudio();
  updateMusicBtn();

  btn.onclick = () => {
    if(musicPlaying){
      bgAudio.pause();
      musicPlaying = false;
      updateMusicBtn();
    } else {
      startMusic();
    }
  };
}

/* ---------- Gallery lightbox ---------- */
function setupGallery(){
  const box = document.getElementById("lightbox");
  const big = box.querySelector("img");
  document.querySelectorAll(".gallery img").forEach(img => {
    img.onclick = () => { big.src = img.src; box.classList.add("open"); };
  });
  box.onclick = () => box.classList.remove("open");
}

/* ---------- Scratch card ---------- */
function setupScratch(){
  const canvas = document.getElementById("scratchCanvas");
  const ctx = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  const dpr = 1;

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
  grad.addColorStop(0, "#5e2f66");
  grad.addColorStop(0.5, "#c9758f");
  grad.addColorStop(1, "#d9c4e8");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, rect.width, rect.height);

  // subtle sparkle pattern
  ctx.fillStyle = "rgba(255,255,255,.22)";
  for(let i = 0; i < 70; i++){
    ctx.beginPath();
    ctx.arc(Math.random() * rect.width, Math.random() * rect.height, Math.random() * 2.4 + 0.6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.strokeStyle = "rgba(236,217,168,.9)";
  ctx.lineWidth = 2;
  ctx.strokeRect(14, 14, rect.width - 28, rect.height - 28);

  ctx.fillStyle = "rgba(255,255,255,.95)";
  ctx.textAlign = "center";
  ctx.font = "600 17px Cinzel, Georgia, serif";
  ctx.fillText("SCRATCH TO REVEAL", rect.width / 2, rect.height / 2 - 6);
  ctx.font = "italic 30px 'Great Vibes', cursive";
  ctx.fillText("your invitation", rect.width / 2, rect.height / 2 + 32);

  let drawing = false;
  let completed = false;
  let moves = 0;

  const pos = e => {
    const r = canvas.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    return { x: p.clientX - r.left, y: p.clientY - r.top };
  };

  function scratch(e){
    if(!drawing) return;
    e.preventDefault();
    const p = pos(e);
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 26, 0, Math.PI * 2);
    ctx.fill();
    if(++moves % 12 === 0) check();
  }

  function check(){
    if(completed) return;
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let clear = 0, total = 0;
    for(let i = 3; i < img.length; i += 80){
      total++;
      if(img[i] === 0) clear++;
    }
    if(clear / total > 0.35){
      completed = true;
      canvas.style.transition = "opacity .6s";
      canvas.style.opacity = "0";
      setTimeout(() => canvas.style.display = "none", 600);
      confettiMini();
      if(!musicPlaying) startMusic();
    }
  }

  canvas.addEventListener("mousedown", () => drawing = true);
  window.addEventListener("mouseup", () => drawing = false);
  canvas.addEventListener("mousemove", scratch);
  canvas.addEventListener("touchstart", () => drawing = true, { passive: true });
  window.addEventListener("touchend", () => drawing = false);
  canvas.addEventListener("touchmove", scratch, { passive: false });
}

render();
