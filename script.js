document.addEventListener('DOMContentLoaded', () => {
  const envelopeScreen = document.getElementById('envelope-screen');
  const envelopeVideo = document.getElementById('envelope-video');
  const videoTapTrigger = document.getElementById('video-tap-trigger');
  const mainContent = document.getElementById('main-content');
  const petalsBg = document.getElementById('petals-bg');
  const petalsFg = document.getElementById('petals-fg');
  const weddingAudio = document.getElementById('wedding-audio');
  const musicToggle = document.getElementById('music-toggle');
  const musicIcon = document.getElementById('music-icon');

  let isPlaying = false;
  let petalInterval = null;
  let videoStarted = false;
  let transitionStarted = false;

  // 1. Reveal Animations on Scroll
  function initScrollObserver() {
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));
  }

  // 2. 3D Off-White & Cream Silk Petals Engine
  const offWhitePetalColors = [
    { fill: '#FAF5EE', vein: 'rgba(194, 148, 75, 0.4)' },
    { fill: '#F5ECE1', vein: 'rgba(216, 186, 139, 0.45)' },
    { fill: '#F9F3EA', vein: 'rgba(185, 137, 61, 0.35)' }
  ];

  function createOffWhitePetalSVG(palette) {
    return `<svg viewBox="0 0 30 30" width="100%" height="100%" fill="none"><path d="M15 2 C22 2, 28 8, 28 15 C28 22, 22 28, 15 28 C8 28, 2 22, 2 15 C2 8, 8 2, 15 2 Z" fill="${palette.fill}"/><path d="M15 4 Q16 15 15 26" stroke="${palette.vein}" stroke-width="0.8" fill="none"/></svg>`;
  }

  function spawn3DPetal() {
    const isForeground = Math.random() > 0.45;
    const container = isForeground ? petalsFg : petalsBg;
    if (!container) return;

    const petal = document.createElement('div');
    petal.className = `falling-petal ${isForeground ? 'petal-depth-fg' : 'petal-depth-bg'}`;

    const size = isForeground ? (Math.random() * 12 + 18) : (Math.random() * 8 + 12);
    const left = Math.random() * 100;
    const duration = isForeground ? (Math.random() * 3 + 6) : (Math.random() * 4 + 8);
    const swayDuration = Math.random() * 2 + 2;
    const palette = offWhitePetalColors[Math.floor(Math.random() * offWhitePetalColors.length)];

    petal.style.width = `${size}px`;
    petal.style.height = `${size}px`;
    petal.style.left = `${left}vw`;
    petal.style.animationDuration = `${duration}s`;
    petal.innerHTML = createOffWhitePetalSVG(palette);

    const svg = petal.querySelector('svg');
    if (svg) svg.style.animationDuration = `${swayDuration}s`;

    container.appendChild(petal);
    setTimeout(() => petal.remove(), duration * 1000);
  }

  function startFallingPetals() {
    for (let i = 0; i < 8; i++) setTimeout(spawn3DPetal, i * 150);
    petalInterval = setInterval(spawn3DPetal, 450);
  }

  // 3. Triple Scratch-To-Reveal Logic (Warm Arabic Gold Foil)
  function initSingleScratchCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    grad.addColorStop(0, '#fcedc5');
    grad.addColorStop(0.35, '#caa061');
    grad.addColorStop(0.7, '#deb36e');
    grad.addColorStop(1, '#9e732c');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, rect.width, rect.height);

    let isDrawing = false, scratchedPixels = 0, isRevealed = false;

    function getPosition(e) {
      const cRect = canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return { x: clientX - cRect.left, y: clientY - cRect.top };
    }

    function scratch(e) {
      if (!isDrawing || isRevealed) return;
      e.preventDefault();
      const pos = getPosition(e);
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, 18, 0, Math.PI * 2);
      ctx.fill();

      scratchedPixels++;
      if (scratchedPixels > 14 && !isRevealed) {
        isRevealed = true;
        canvas.style.opacity = '0';
        setTimeout(() => (canvas.style.display = 'none'), 500);
      }
    }

    canvas.addEventListener('mousedown', (e) => { isDrawing = true; scratch(e); });
    canvas.addEventListener('mousemove', scratch);
    window.addEventListener('mouseup', () => (isDrawing = false));
    canvas.addEventListener('touchstart', (e) => { isDrawing = true; scratch(e); }, { passive: false });
    canvas.addEventListener('touchmove', scratch, { passive: false });
    window.addEventListener('touchend', () => (isDrawing = false));
  }

  function initTripleScratchCards() {
    initSingleScratchCanvas('scratch-canvas-day');
    initSingleScratchCanvas('scratch-canvas-month');
    initSingleScratchCanvas('scratch-canvas-year');
  }

  // 4. Audio Controller
  function startWeddingMusic() {
    if (weddingAudio) {
      weddingAudio.volume = 0.65;
      weddingAudio.play().then(() => {
        isPlaying = true;
        if (musicToggle) musicToggle.classList.remove('hidden');
      }).catch(err => console.log("Audio autoplay restricted:", err));
    }
  }

  if (musicToggle) {
    musicToggle.addEventListener('click', () => {
      if (!weddingAudio) return;
      if (isPlaying) {
        weddingAudio.pause();
        isPlaying = false;
        musicToggle.classList.add('music-paused');
      } else {
        weddingAudio.play();
        isPlaying = true;
        musicToggle.classList.remove('music-paused');
      }
    });
  }

  // 5. Seamless Cross-Fade from Video into Landing Page
  function transitionToInvitation() {
    if (transitionStarted) return;
    transitionStarted = true;

    mainContent.classList.remove('hidden');
    window.scrollTo({ top: 0 });

    requestAnimationFrame(() => {
      mainContent.classList.add('visible');
      envelopeScreen.classList.add('fading-out');
      startFallingPetals();
      initTripleScratchCards();
      initScrollObserver();
      startCountdown();
    });

    setTimeout(() => {
      envelopeScreen.classList.add('hidden');
    }, 1200);
  }

  // 6. Video Envelope Trigger & Timing
  if (videoTapTrigger && envelopeVideo) {
    videoTapTrigger.addEventListener('click', () => {
      if (videoStarted) return;
      videoStarted = true;

      videoTapTrigger.classList.add('overlay-hidden');
      startWeddingMusic();

      envelopeVideo.play().catch(err => {
        console.warn("Video playback error:", err);
        transitionToInvitation();
      });
    });

    envelopeVideo.addEventListener('timeupdate', () => {
      if (envelopeVideo.duration > 0) {
        const timeLeft = envelopeVideo.duration - envelopeVideo.currentTime;
        if (timeLeft <= 0.5 && !transitionStarted) {
          transitionToInvitation();
        }
      }
    });

    envelopeVideo.addEventListener('ended', () => {
      transitionToInvitation();
    });
  }

  // 7. Live Countdown (Target: Sunday, Sept 27, 2026, 19:00 IST)
  function startCountdown() {
    const targetDate = new Date('2026-09-27T19:00:00+05:30').getTime();

    function updateTimer() {
      const difference = targetDate - new Date().getTime();
      if (difference > 0) {
        document.getElementById('days').textContent = String(Math.floor(difference / (1000 * 60 * 60 * 24))).padStart(2, '0');
        document.getElementById('hours').textContent = String(Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0');
        document.getElementById('minutes').textContent = String(Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0');
        document.getElementById('seconds').textContent = String(Math.floor((difference % (1000 * 60)) / 1000)).padStart(2, '0');
      }
    }

    updateTimer();
    setInterval(updateTimer, 1000);
  }
});