/**
 * BLOOM — Women's Health & Wellness
 * Main Application Script
 */

// =============================================
// STORAGE HELPERS
// =============================================
const load = (k, d) => { try { const v = localStorage.getItem(k); return v !== null ? JSON.parse(v) : d; } catch { return d; } };
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const today = () => new Date().toISOString().split('T')[0];
const nowStr = () => new Date().toLocaleString('en-US', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' });
const showMsg = (id, txt, type, ms = 3500) => {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = txt; el.className = `form-msg ${type}`;
  setTimeout(() => { el.textContent = ''; el.className = 'form-msg'; }, ms);
};

// =============================================
// PRELOADER
// =============================================
window.addEventListener('load', () => {
  setTimeout(() => {
    const pre = document.getElementById('preloader');
    if (pre) pre.classList.add('done');
  }, 1800);
});

// =============================================
// CUSTOM CURSOR
// =============================================
const cursorDot  = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX; mouseY = e.clientY;
  if (cursorDot) { cursorDot.style.left = mouseX + 'px'; cursorDot.style.top = mouseY + 'px'; }
});

// Smooth ring follow
function animateCursor() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  if (cursorRing) { cursorRing.style.left = ringX + 'px'; cursorRing.style.top = ringY + 'px'; }
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Scale cursor on hover
document.querySelectorAll('a, button, .mood-btn, .tab-btn, .blog-card').forEach(el => {
  el.addEventListener('mouseenter', () => { if (cursorRing) cursorRing.style.transform = 'translate(-50%,-50%) scale(1.8)'; });
  el.addEventListener('mouseleave', () => { if (cursorRing) cursorRing.style.transform = 'translate(-50%,-50%) scale(1)'; });
});

// =============================================
// NAVBAR SCROLL
// =============================================
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
});

// =============================================
// MOBILE MENU
// =============================================
function toggleMenu() {
  const links = document.getElementById('nav-links');
  const ham   = document.querySelector('.hamburger');
  if (!links) return;
  links.classList.toggle('open');
  // Animate hamburger to X
  const spans = ham?.querySelectorAll('span');
  if (spans) {
    const isOpen = links.classList.contains('open');
    if (spans[0]) spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px,5px)' : '';
    if (spans[1]) spans[1].style.opacity   = isOpen ? '0' : '1';
    if (spans[2]) spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px,-5px)' : '';
  }
}

function smoothNav(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  // Close mobile menu
  document.getElementById('nav-links')?.classList.remove('open');
  const spans = document.querySelectorAll('.hamburger span');
  spans.forEach(s => { s.style.transform = ''; s.style.opacity = '1'; });
  // Close all dropdowns
  document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('active'));
}

// ===== NAVBAR DROPDOWN MENU =====
function toggleDropdown(btn) {
  const dropdown = btn.closest('.nav-dropdown');
  if (!dropdown) return;
  
  // Close other dropdowns
  document.querySelectorAll('.nav-dropdown.active').forEach(d => {
    if (d !== dropdown) d.classList.remove('active');
  });
  
  dropdown.classList.toggle('active');
}

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.nav-dropdown')) {
    document.querySelectorAll('.nav-dropdown.active').forEach(d => d.classList.remove('active'));
  }
});

// =============================================
// DARK MODE
// =============================================
function toggleDark() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  save('darkMode', isDark);
  document.getElementById('dark-btn').textContent = isDark ? '☀️' : '🌙';
  drawFitnessChart(); drawDashboardChart();
}

function initDarkMode() {
  if (load('darkMode', false)) {
    document.body.classList.add('dark');
    const btn = document.getElementById('dark-btn');
    if (btn) btn.textContent = '☀️';
  }
}

// =============================================
// AUTHENTICATION & PROFILE
// =============================================
const lsGet = (k, d) => { try { const v = localStorage.getItem(k); return v !== null ? JSON.parse(v) : d; } catch { return d; } };
const lsSet = (k, v) => localStorage.setItem(k, JSON.stringify(v));

function updateAuthNavbar() {
  const session = lsGet('bloom_session', null);
  const guestSection = document.getElementById('nav-auth-guest');
  const userSection = document.getElementById('nav-auth-user');
  
  if (guestSection && userSection) {
    if (session && session.userId && !session.isGuest) {
      // User is logged in
      guestSection.classList.add('hidden');
      userSection.classList.remove('hidden');
      
      // Update profile name and avatar
      const nameEl = document.getElementById('profile-name-mini');
      if (nameEl) nameEl.textContent = session.name || 'User';
      
      // Load avatar if exists
      const avatar = lsGet('profile_avatar_' + session.userId, null);
      if (avatar) {
        const avatarEl = document.getElementById('profile-avatar-mini');
        if (avatarEl) avatarEl.style.backgroundImage = `url(${avatar})`;
      }
    } else {
      // User is not logged in
      userSection.classList.add('hidden');
      guestSection.classList.remove('hidden');
    }
  }
}

function toggleProfileMenu() {
  const menu = document.getElementById('profile-dropdown-menu');
  if (menu) menu.classList.toggle('show');
}

function doLogout(event) {
  if (event) event.preventDefault();
  if (!confirm('Are you sure you want to logout?')) return;
  localStorage.removeItem('bloom_session');
  location.reload();
}

// Close profile menu when clicking outside
document.addEventListener('click', (e) => {
  const profileDropdown = document.querySelector('.profile-dropdown');
  if (profileDropdown && !profileDropdown.contains(e.target)) {
    const menu = document.getElementById('profile-dropdown-menu');
    if (menu) menu.classList.remove('show');
  }
});

// =============================================
// POPUP / REMINDER
// =============================================
const reminders = [
  "You deserve to feel your best today. Take a moment for yourself.",
  "Your body is doing incredible things. Honor it with kindness.",
  "Small acts of self-care compound into extraordinary wellbeing.",
  "Drink water, breathe deeply, and remember how strong you are.",
  "Today is a new opportunity to nourish your mind, body, and soul."
];

function closePopup() {
  document.getElementById('reminder-popup')?.classList.add('hidden');
}

function showPopup() {
  const el = document.getElementById('reminder-text');
  if (el) el.textContent = reminders[Math.floor(Math.random() * reminders.length)];
  document.getElementById('reminder-popup')?.classList.remove('hidden');
}

// =============================================
// SCROLL REVEAL ANIMATIONS
// =============================================
function initReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-right').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 0.08}s`;
    observer.observe(el);
  });
}

// =============================================
// HERO PARTICLES
// =============================================
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const emojis = ['🌸', '✨', '💜', '🌿', '💕', '⭐'];
  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.cssText = `
      left:${Math.random() * 100}%;
      font-size:${0.8 + Math.random() * 1.2}rem;
      animation-duration:${8 + Math.random() * 12}s;
      animation-delay:${Math.random() * 8}s;
    `;
    container.appendChild(p);
  }
}

// =============================================
// COUNTER ANIMATION (Hero stats)
// =============================================
function animateCounters() {
  document.querySelectorAll('.trust-num').forEach(el => {
    const target = parseInt(el.dataset.target);
    let current = 0;
    const step = Math.ceil(target / 60);
    const interval = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current.toLocaleString();
      if (current >= target) clearInterval(interval);
    }, 25);
  });
}

// =============================================
// FITNESS TRACKER
// =============================================
function saveFitness() {
  const steps    = document.getElementById('steps')?.value.trim();
  const workout  = document.getElementById('workout-time')?.value.trim();
  const calories = document.getElementById('calories')?.value.trim();
  const type     = document.getElementById('activity-type')?.value;

  if (!steps && !workout && !calories) { showMsg('fitness-msg', 'Please fill in at least one field.', 'error'); return; }

  const data = { steps: parseInt(steps)||0, workoutTime: parseInt(workout)||0, calories: parseInt(calories)||0, type, date: today() };
  save('fitness', data);

  // Update weekly history
  const hist = load('fitnessHistory', []);
  const idx  = hist.findIndex(e => e.date === today());
  if (idx >= 0) hist[idx] = data; else hist.push(data);
  if (hist.length > 7) hist.shift();
  save('fitnessHistory', hist);

  updateFitnessRings();
  updateTrackerBars();
  updateHeroScore();
  drawFitnessChart();
  generateSuggestions();
  showMsg('fitness-msg', '✅ Activity saved! Keep moving, queen! 💪', 'success');
  // Award points & check badges
  if (typeof awardPoints === 'function') {
    awardPoints(15, 'Logged fitness activity');
    checkBadges();
  }
}

function updateFitnessRings() {
  const d = load('fitness', {});
  const steps = d.steps || 0, workout = d.workoutTime || 0, cal = d.calories || 0;

  // Ring circumferences: small r=50 → C=314, large r=68 → C=427
  setRingProgress('steps-ring',   steps,   10000, 314, 'steps-pct',   `${Math.round(steps/100)}%`);
  setRingProgress('workout-ring', workout, 60,    427, 'workout-pct', `${Math.round(workout/60*100)}%`);
  setRingProgress('cal-ring',     cal,     500,   314, 'cal-pct',     `${Math.round(cal/5)}%`);

  const el = id => document.getElementById(id);
  if (el('steps-val'))   el('steps-val').textContent   = steps.toLocaleString();
  if (el('workout-val')) el('workout-val').textContent = workout;
  if (el('cal-val'))     el('cal-val').textContent     = cal;
}

function setRingProgress(ringId, value, max, circumference, pctId, pctText) {
  const pct  = Math.min(value / max, 1);
  const ring = document.getElementById(ringId);
  if (ring) ring.setAttribute('stroke-dasharray', `${pct * circumference} ${circumference}`);
  const pctEl = document.getElementById(pctId);
  if (pctEl) pctEl.textContent = pctText;
}

// =============================================
// FITNESS CHART (Canvas)
// =============================================
function drawFitnessChart() {
  const canvas = document.getElementById('fitness-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width  = canvas.offsetWidth  || 500;
  canvas.height = canvas.offsetHeight || 220;

  const hist  = load('fitnessHistory', []);
  const days  = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const isDark = document.body.classList.contains('dark');
  const data  = days.map((_, i) => { const e = hist[hist.length - 7 + i]; return e ? e.steps : 0; });
  const maxVal = Math.max(...data, 5000);

  const W = canvas.width, H = canvas.height;
  const pL = 50, pR = 20, pT = 20, pB = 40;
  const cW = W - pL - pR, cH = H - pT - pB;
  const barW = (cW / days.length) * 0.55, gap = cW / days.length;

  ctx.clearRect(0, 0, W, H);
  const textColor = isDark ? '#c4b5d4' : '#6b5b7b';
  const gridColor = isDark ? '#2d1f45' : '#f0e6f6';

  // Grid lines
  for (let i = 0; i <= 4; i++) {
    const y = pT + (cH / 4) * i;
    ctx.strokeStyle = gridColor; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pL, y); ctx.lineTo(W - pR, y); ctx.stroke();
    ctx.fillStyle = textColor; ctx.font = '11px Inter,sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(Math.round(maxVal - (maxVal / 4) * i).toLocaleString(), pL - 6, y + 4);
  }

  // Bars with gradient
  data.forEach((val, i) => {
    const bH = (val / maxVal) * cH;
    const x  = pL + gap * i + (gap - barW) / 2;
    const y  = pT + cH - bH;
    const r  = Math.min(8, barW / 2, bH || 1);

    const grad = ctx.createLinearGradient(0, y, 0, y + bH);
    grad.addColorStop(0, '#ec4899');
    grad.addColorStop(1, '#a855f7');
    ctx.fillStyle = grad;

    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + barW - r, y);
    ctx.quadraticCurveTo(x + barW, y, x + barW, y + r);
    ctx.lineTo(x + barW, y + bH);
    ctx.lineTo(x, y + bH);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = textColor; ctx.font = '11px Inter,sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(days[i], x + barW / 2, H - pB + 18);
    if (val > 0) {
      ctx.fillStyle = isDark ? '#f5f0ff' : '#1e1b2e'; ctx.font = '9px Inter,sans-serif';
      ctx.fillText(val.toLocaleString(), x + barW / 2, y - 4);
    }
  });
}

// =============================================
// MOOD TRACKER
// =============================================
const moodEmojis = { Radiant:'🤩', Happy:'😊', Calm:'😌', Grateful:'🥰', Tired:'😴', Anxious:'😟', Stressed:'😰', Sad:'😢' };
const moodColors = { Radiant:'#f59e0b', Happy:'#ec4899', Calm:'#0ea5e9', Grateful:'#a855f7', Tired:'#8b5cf6', Anxious:'#f97316', Stressed:'#ef4444', Sad:'#6366f1' };

function logMood(mood) {
  const note = document.getElementById('mood-note')?.value.trim() || '';
  const hist = load('moodHistory', []);
  hist.push({ mood, note, emoji: moodEmojis[mood] || '😊', date: nowStr(), color: moodColors[mood] });
  save('moodHistory', hist);

  // Highlight selected button
  document.querySelectorAll('.mood-btn').forEach(b => b.classList.toggle('selected', b.dataset.mood === mood));

  if (document.getElementById('mood-note')) document.getElementById('mood-note').value = '';
  showMsg('mood-msg', `${moodEmojis[mood]} Mood logged: ${mood} — you're seen and valued. 💜`, 'success');

  renderMoodHistory();
  updateTrackerMood();
  generateSuggestions();
  if (typeof awardPoints === 'function') {
    awardPoints(8, `Logged mood: ${mood}`);
    checkBadges();
  }
}

function renderMoodHistory() {
  const hist = load('moodHistory', []);
  const el   = document.getElementById('mood-history');
  if (!el) return;
  if (!hist.length) { el.innerHTML = '<p style="font-size:0.82rem;color:var(--text-s);font-style:italic">No entries yet — log your first mood above.</p>'; return; }
  el.innerHTML = [...hist].reverse().slice(0, 8).map(e => `
    <div class="mood-entry">
      <div class="me-left">
        <span class="me-emoji">${e.emoji}</span>
        <span class="me-mood" style="color:${e.color||'var(--pink)'}">${e.mood}</span>
        ${e.note ? `<span class="me-note">${e.note}</span>` : ''}
      </div>
      <span class="me-date">${e.date}</span>
    </div>`).join('');
}

// =============================================
// BREATHING EXERCISE
// =============================================
let breathActive = false, breathTimer = null, breathCycles = 0;

function toggleBreathing() {
  if (breathActive) stopBreathing(); else startBreathing();
}

function startBreathing() {
  breathActive = true; breathCycles = 0;
  const btn = document.getElementById('breath-btn');
  if (btn) { btn.innerHTML = '<i class="fa-solid fa-stop"></i> Stop Exercise'; }
  document.getElementById('breath-cycles').textContent = '0';
  runPhase('inhale', 4);
}

function stopBreathing() {
  breathActive = false;
  clearTimeout(breathTimer);
  const ring = document.getElementById('breath-ring');
  if (ring) ring.className = 'breath-ring';
  const lbl = document.getElementById('breath-label');
  if (lbl) lbl.textContent = 'Ready';
  const num = document.getElementById('breath-num');
  if (num) num.textContent = '';
  const btn = document.getElementById('breath-btn');
  if (btn) btn.innerHTML = '<i class="fa-solid fa-play"></i> Begin Exercise';
}

function runPhase(phase, seconds) {
  if (!breathActive) return;
  const ring = document.getElementById('breath-ring');
  const lbl  = document.getElementById('breath-label');
  const num  = document.getElementById('breath-num');
  if (ring) ring.className = `breath-ring ${phase}`;
  const labels = { inhale: 'Inhale 🌬️', hold: 'Hold ⏸️', exhale: 'Exhale 💨' };
  if (lbl) lbl.textContent = labels[phase];
  let s = seconds;
  if (num) num.textContent = s;
  const tick = setInterval(() => {
    s--;
    if (num) num.textContent = s;
    if (s <= 0) {
      clearInterval(tick);
      if (!breathActive) return;
      if (phase === 'inhale')  runPhase('hold', 7);
      else if (phase === 'hold') runPhase('exhale', 8);
      else {
        breathCycles++;
        const cycleEl = document.getElementById('breath-cycles');
        if (cycleEl) cycleEl.textContent = breathCycles;
        if (breathCycles >= 4) {
          stopBreathing();
          if (lbl) lbl.textContent = 'Complete! 🌸';
          showMsg('mood-msg', '🌸 Breathing exercise complete! You should feel calmer now.', 'success');
          if (typeof trackBreathSession === 'function') trackBreathSession();
        } else {
          runPhase('inhale', 4);
        }
      }
    }
  }, 1000);
}

// =============================================
// ACCORDION
// =============================================
function toggleAcc(header) {
  const item = header.parentElement;
  const body = item.querySelector('.acc-body');
  const isOpen = body.classList.contains('open');

  // Close all
  document.querySelectorAll('.acc-body').forEach(b => b.classList.remove('open'));
  document.querySelectorAll('.acc-header').forEach(h => h.classList.remove('open'));

  if (!isOpen) { body.classList.add('open'); header.classList.add('open'); }
}

// =============================================
// TABS (Women's Health)
// =============================================
function showTab(id, btn) {
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`tab-${id}`)?.classList.add('active');
  btn.classList.add('active');
}

// =============================================
// NUTRITION TRACKER
// =============================================
function saveMeals() {
  const breakfast = document.getElementById('breakfast')?.value.trim();
  const lunch     = document.getElementById('lunch')?.value.trim();
  const dinner    = document.getElementById('dinner')?.value.trim();
  const snacks    = document.getElementById('snacks')?.value.trim();

  if (!breakfast && !lunch && !dinner) { showMsg('meal-msg', 'Please log at least one meal.', 'error'); return; }

  save('meals', { breakfast, lunch, dinner, snacks, date: today() });
  renderMealSummary();
  updateTrackerMeals();
  generateSuggestions();
  showMsg('meal-msg', '✅ Meals saved! Nourishing your body is an act of self-love. 🌿', 'success');
  if (typeof awardPoints === 'function') {
    const m = load('meals', {});
    const pts = [m.breakfast, m.lunch, m.dinner].filter(Boolean).length * 5;
    awardPoints(pts, 'Logged meals');
    // Track full meal days
    if (m.breakfast && m.lunch && m.dinner) {
      const fmd = load('fullMealDays', 0) + 1;
      save('fullMealDays', fmd);
    }
    checkBadges();
  }
}

function renderMealSummary() {
  const meals = load('meals', {});
  const el    = document.getElementById('meal-summary');
  if (!el) return;
  const entries = [
    { label: '🌅 Breakfast', val: meals.breakfast },
    { label: '☀️ Lunch',     val: meals.lunch },
    { label: '🌙 Dinner',    val: meals.dinner },
    { label: '🍎 Snacks',    val: meals.snacks }
  ].filter(e => e.val);

  if (!entries.length) { el.innerHTML = ''; return; }
  el.innerHTML = entries.map(e =>
    `<div class="ms-entry"><span class="ms-label">${e.label}</span><span>${e.val}</span></div>`
  ).join('');

  // Pre-fill inputs
  if (meals.breakfast) document.getElementById('breakfast').value = meals.breakfast;
  if (meals.lunch)     document.getElementById('lunch').value     = meals.lunch;
  if (meals.dinner)    document.getElementById('dinner').value    = meals.dinner;
  if (meals.snacks)    document.getElementById('snacks').value    = meals.snacks;
}

// =============================================
// WATER TRACKER
// =============================================
function updateWater(delta) {
  const w = Math.max(0, Math.min(20, load('water', 0) + delta));
  save('water', w);
  renderWater(w);
  updateTrackerBars();
  generateSuggestions();
  if (delta > 0 && typeof awardPoints === 'function') {
    awardPoints(2, 'Logged water intake');
    checkBadges();
  }
}

function renderWater(w) {
  const pct = Math.min(w / 8, 1) * 100;
  const el  = id => document.getElementById(id);

  if (el('water-count')) el('water-count').textContent = w;
  if (el('water-ml'))    el('water-ml').textContent    = `${w * 250} ml consumed`;
  if (el('wb-fill'))     el('wb-fill').style.height    = pct + '%';
  if (el('wb-label'))    el('wb-label').textContent    = Math.round(pct) + '%';

  // Glasses visual
  const glasses = el('water-glasses');
  if (glasses) glasses.innerHTML = Array.from({ length: w }, () => `<span class="wg">💧</span>`).join('');

  // Bubbles
  const bubbles = el('wb-bubbles');
  if (bubbles && w > 0) {
    bubbles.innerHTML = Array.from({ length: 4 }, (_, i) => `
      <div class="bubble" style="width:${4+i*2}px;height:${4+i*2}px;left:${20+i*15}%;bottom:${10+i*5}%;animation-delay:${i*0.5}s;animation-duration:${1.5+i*0.3}s"></div>
    `).join('');
  }
}

// =============================================
// TRACKER BARS UPDATE
// =============================================
function updateTrackerBars() {
  const f = load('fitness', {});
  const w = load('water', 0);
  const steps = f.steps || 0, workout = f.workoutTime || 0, cal = f.calories || 0;
  const setBar = (id, val, max, labelId, labelTxt) => {
    const bar = document.getElementById(id);
    if (bar) bar.style.width = Math.min(val / max * 100, 100) + '%';
    const lbl = document.getElementById(labelId);
    if (lbl) lbl.textContent = labelTxt;
  };
  setBar('t-steps-bar',   steps,   10000, 't-steps-label',   `${steps.toLocaleString()} / 10,000 steps`);
  setBar('t-workout-bar', workout, 60,    't-workout-label', `${workout} / 60 min workout`);
  setBar('t-water-bar',   w,       8,     't-water-label',   `${w} / 8 glasses`);
  setBar('t-cal-bar',     cal,     500,   't-cal-label',     `${cal} / 500 kcal burned`);
}

function updateTrackerMeals() {
  const meals = load('meals', {});
  const el = document.getElementById('tracker-meals');
  if (!el) return;
  const entries = [
    { label:'🌅', val: meals.breakfast },
    { label:'☀️', val: meals.lunch },
    { label:'🌙', val: meals.dinner },
    { label:'🍎', val: meals.snacks }
  ].filter(e => e.val);
  el.innerHTML = entries.length
    ? entries.map(e => `<div style="font-size:0.82rem;color:var(--text-m);padding:0.2rem 0">${e.label} ${e.val}</div>`).join('')
    : '<p class="empty-hint">Log your meals in the Nutrition section</p>';
}

function updateTrackerMood() {
  const hist = load('moodHistory', []);
  const el = document.getElementById('tracker-mood');
  if (!el) return;
  if (!hist.length) { el.innerHTML = '<p class="empty-hint">Log your mood in the Mental section</p>'; return; }
  const last = hist[hist.length - 1];
  el.innerHTML = `
    <div style="display:flex;align-items:center;gap:0.75rem;padding:0.5rem 0">
      <span style="font-size:2rem">${last.emoji}</span>
      <div>
        <div style="font-weight:700;color:${last.color||'var(--pink)'}">${last.mood}</div>
        <div style="font-size:0.75rem;color:var(--text-s)">${last.date}</div>
        ${last.note ? `<div style="font-size:0.78rem;color:var(--text-m);margin-top:0.2rem">${last.note}</div>` : ''}
      </div>
    </div>`;
}

// =============================================
// HEALTH SCORE
// =============================================
function calculateScore() {
  const f = load('fitness', {}), w = load('water', 0);
  const moods = load('moodHistory', []), meals = load('meals', {});
  const steps = f.steps || 0, workout = f.workoutTime || 0, cal = f.calories || 0;
  const lastMood = moods.length ? moods[moods.length - 1].mood : '';
  let score = 0;
  score += Math.min(25, (steps / 10000) * 25);
  score += Math.min(20, (workout / 60) * 20);
  score += Math.min(10, (cal / 500) * 10);
  score += Math.min(15, (w / 8) * 15);
  if (meals.breakfast) score += 5;
  if (meals.lunch)     score += 5;
  if (meals.dinner)    score += 5;
  const moodS = { Radiant:15, Happy:12, Calm:12, Grateful:14, Tired:5, Anxious:4, Stressed:3, Sad:3 };
  score += moodS[lastMood] || 0;
  return Math.round(Math.min(100, score));
}

function updateHeroScore() {
  const score = calculateScore();
  const el = document.getElementById('hero-score');
  if (el) el.textContent = score;
  const ring = document.getElementById('hero-ring');
  if (ring) { const c = 2 * Math.PI * 88; ring.setAttribute('stroke-dasharray', `${(score / 100) * c} ${c}`); }
}

// =============================================
// DASHBOARD
// =============================================
function refreshDashboard() {
  const f = load('fitness', {}), w = load('water', 0);
  const moods = load('moodHistory', []), meals = load('meals', {});
  const steps = f.steps || 0, workout = f.workoutTime || 0, cal = f.calories || 0;
  const lastMood = moods.length ? moods[moods.length - 1] : null;
  const mealCount = [meals.breakfast, meals.lunch, meals.dinner].filter(Boolean).length;
  const score = calculateScore();
  const el = id => document.getElementById(id);

  if (el('d-steps'))   el('d-steps').textContent   = steps ? steps.toLocaleString() : '--';
  if (el('d-mood'))    el('d-mood').textContent     = lastMood ? `${lastMood.emoji} ${lastMood.mood}` : '--';
  if (el('d-mood-time')) el('d-mood-time').textContent = lastMood ? lastMood.date : '--';
  if (el('d-water'))   el('d-water').textContent   = `${w} / 8 glasses`;
  if (el('d-calories'))el('d-calories').textContent = cal ? `${cal} kcal` : '--';
  if (el('d-meals'))   el('d-meals').textContent   = `${mealCount} / 3 meals`;
  if (el('d-workout')) el('d-workout').textContent = workout ? `${workout} min` : '--';

  // Progress fills
  const setFill = (id, val, max) => { const e = el(id); if (e) e.style.width = Math.min(val / max * 100, 100) + '%'; };
  setFill('d-steps-fill',   steps,   10000);
  setFill('d-water-fill',   w,       8);
  setFill('d-cal-fill',     cal,     500);
  setFill('d-workout-fill', workout, 60);

  // Score ring
  animateScoreRing(score);
  generateSuggestions();
  drawDashboardChart();
}

function animateScoreRing(target) {
  const numEl   = document.getElementById('health-score');
  const ringEl  = document.getElementById('score-ring');
  const gradeEl = document.getElementById('score-grade');
  const descEl  = document.getElementById('score-desc');
  const barsEl  = document.getElementById('sh-bars');
  let cur = 0;
  const step = Math.ceil(target / 50);
  const iv = setInterval(() => {
    cur = Math.min(cur + step, target);
    if (numEl) numEl.textContent = cur;
    if (ringEl) { const c = 2 * Math.PI * 95; ringEl.setAttribute('stroke-dasharray', `${(cur / 100) * c} ${c}`); }
    if (cur >= target) clearInterval(iv);
  }, 25);
  const grade = target >= 90 ? 'A+' : target >= 80 ? 'A' : target >= 70 ? 'B+' : target >= 60 ? 'B' : target >= 50 ? 'C' : 'D';
  if (gradeEl) gradeEl.textContent = grade;
  const desc = target >= 80 ? '🌟 Excellent! You\'re thriving, queen!' : target >= 60 ? '👍 Good progress — keep building!' : target >= 40 ? '💪 Getting there — every step counts!' : '🌱 Just starting — you\'ve got this!';
  if (descEl) descEl.textContent = desc;

  const f = load('fitness', {}), w = load('water', 0), meals = load('meals', {});
  const bars = [
    { l: 'Fitness',   v: Math.min(100, ((f.steps || 0) / 10000) * 100) },
    { l: 'Hydration', v: Math.min(100, (w / 8) * 100) },
    { l: 'Nutrition', v: Math.min(100, ([meals.breakfast, meals.lunch, meals.dinner].filter(Boolean).length / 3) * 100) },
    { l: 'Mindset',   v: Math.min(100, (() => { const m = load('moodHistory', []); const last = m.length ? m[m.length-1].mood : ''; const s = { Radiant:100, Happy:85, Calm:80, Grateful:90, Tired:40, Anxious:35, Stressed:25, Sad:20 }; return s[last] || 50; })()) }
  ];
  if (barsEl) barsEl.innerHTML = bars.map(b => `
    <div class="sh-bar-row">
      <span class="sh-bar-label">${b.l}</span>
      <div class="sh-bar-bg"><div class="sh-bar-fill" style="width:${b.v}%"></div></div>
      <span class="sh-bar-pct">${Math.round(b.v)}%</span>
    </div>`).join('');
}

function drawDashboardChart() {
  const canvas = document.getElementById('dashboard-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth || 600; canvas.height = canvas.offsetHeight || 220;
  const f = load('fitness', {}), w = load('water', 0), meals = load('meals', {});
  const isDark = document.body.classList.contains('dark');
  const metrics = [
    { label: 'Steps',    val: Math.min(100, ((f.steps || 0) / 10000) * 100),   color: '#ec4899' },
    { label: 'Workout',  val: Math.min(100, ((f.workoutTime || 0) / 60) * 100), color: '#a855f7' },
    { label: 'Calories', val: Math.min(100, ((f.calories || 0) / 500) * 100),   color: '#f59e0b' },
    { label: 'Water',    val: Math.min(100, (w / 8) * 100),                     color: '#60a5fa' },
    { label: 'Meals',    val: Math.min(100, ([meals.breakfast, meals.lunch, meals.dinner].filter(Boolean).length / 3) * 100), color: '#34d399' }
  ];
  const W = canvas.width, H = canvas.height;
  const pL = 80, pR = 40, pT = 20, pB = 20;
  const cW = W - pL - pR, cH = H - pT - pB;
  const barH = (cH / metrics.length) * 0.5, gap = cH / metrics.length;
  const textColor = isDark ? '#c4b5d4' : '#6b5b7b', bgColor = isDark ? '#2d1f45' : '#f0e6f6';
  ctx.clearRect(0, 0, W, H);
  metrics.forEach((m, i) => {
    const y = pT + gap * i + (gap - barH) / 2, bW = (m.val / 100) * cW;
    ctx.fillStyle = bgColor; ctx.beginPath(); ctx.roundRect(pL, y, cW, barH, barH / 2); ctx.fill();
    if (bW > 0) { ctx.fillStyle = m.color; ctx.beginPath(); ctx.roundRect(pL, y, Math.max(bW, barH), barH, barH / 2); ctx.fill(); }
    ctx.fillStyle = textColor; ctx.font = '12px Inter,sans-serif'; ctx.textAlign = 'right';
    ctx.fillText(m.label, pL - 8, y + barH / 2 + 4);
    ctx.fillStyle = isDark ? '#f5f0ff' : '#1e1b2e'; ctx.textAlign = 'left'; ctx.font = '11px Inter,sans-serif';
    ctx.fillText(`${Math.round(m.val)}%`, pL + cW + 6, y + barH / 2 + 4);
  });
}

// =============================================
// AI SUGGESTIONS (rule-based)
// =============================================
function generateSuggestions() {
  const f = load('fitness', {}), w = load('water', 0);
  const moods = load('moodHistory', []), meals = load('meals', {});
  const steps = f.steps || 0, workout = f.workoutTime || 0;
  const lastMood = moods.length ? moods[moods.length - 1].mood : null;
  const items = [];

  if (!steps)            items.push({ i: '🚶‍♀️', t: 'No steps logged yet — even a 10-minute walk boosts mood by 20%.' });
  else if (steps < 5000) items.push({ i: '🏃‍♀️', t: `${steps.toLocaleString()} steps done! Push for 10,000 — you're halfway there.` });
  else if (steps >= 10000) items.push({ i: '🎉', t: `Incredible! ${steps.toLocaleString()} steps today. Your heart thanks you!` });

  if (w < 4)  items.push({ i: '💧', t: 'Drink more water — dehydration causes fatigue and brain fog. Aim for 8 glasses.' });
  if (w >= 8) items.push({ i: '✅', t: 'Hydration goal achieved! Proper hydration improves skin, energy, and hormones.' });

  if (!workout) items.push({ i: '🧘‍♀️', t: 'No workout logged. Even 20 min of yoga reduces cortisol and improves sleep.' });

  if (lastMood === 'Stressed' || lastMood === 'Anxious')
    items.push({ i: '🌬️', t: 'Feeling stressed? Try the 4-7-8 breathing exercise in the Mental section right now.' });
  if (lastMood === 'Sad')
    items.push({ i: '🎵', t: 'Feeling sad? A short walk + uplifting music releases endorphins within 10 minutes.' });
  if (lastMood === 'Tired')
    items.push({ i: '😴', t: 'Feeling tired? Prioritize 7–9 hours tonight. Magnesium glycinate can improve sleep quality.' });
  if (lastMood === 'Radiant' || lastMood === 'Happy')
    items.push({ i: '💪', t: 'You\'re feeling great! Channel that energy into a workout or creative project today.' });

  if (!meals.breakfast) items.push({ i: '🌅', t: 'Skip breakfast? Eating within 1 hour of waking stabilizes blood sugar and cortisol.' });
  if (!meals.lunch && !meals.dinner) items.push({ i: '🥗', t: 'Log your meals to track nutrition. Food is your most powerful medicine.' });

  if (!items.length) items.push({ i: '🌸', t: 'You\'re doing amazing! Keep maintaining your healthy habits today.' });

  const list = document.getElementById('ai-suggestions');
  if (list) list.innerHTML = items.map(s => `<li class="ai-item"><span>${s.i}</span> ${s.t}</li>`).join('');
}

// =============================================
// QUOTES CAROUSEL
// =============================================
let currentSlide = 0;
function initCarousel() {
  const slides = document.querySelectorAll('.quote-slide');
  const dotsEl = document.getElementById('carousel-dots');
  if (!slides.length || !dotsEl) return;
  dotsEl.innerHTML = Array.from(slides).map((_, i) =>
    `<div class="cdot ${i === 0 ? 'active' : ''}" onclick="goSlide(${i})"></div>`
  ).join('');
  setInterval(nextSlide, 5000);
}

function goSlide(n) {
  const slides = document.querySelectorAll('.quote-slide');
  const dots   = document.querySelectorAll('.cdot');
  slides[currentSlide]?.classList.remove('active');
  dots[currentSlide]?.classList.remove('active');
  currentSlide = (n + slides.length) % slides.length;
  slides[currentSlide]?.classList.add('active');
  dots[currentSlide]?.classList.add('active');
}
const nextSlide = () => goSlide(currentSlide + 1);
const prevSlide = () => goSlide(currentSlide - 1);

// =============================================
// NEWSLETTER
// =============================================
function subscribeNewsletter(e) {
  e.preventDefault();
  const email = document.getElementById('newsletter-email')?.value;
  if (!email) return;
  showMsg('newsletter-msg', '🌸 Thank you! Your wellness journey begins now.', 'success');
  document.getElementById('newsletter-email').value = '';
}

// =============================================
// OPENAI API
// =============================================
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const getApiKey  = () => localStorage.getItem('bloom_api_key') || '';

function toggleApiSetup() {
  document.getElementById('api-setup-panel')?.classList.toggle('hidden');
}

function saveApiKey() {
  const key = document.getElementById('api-key-input')?.value.trim();
  if (!key || !key.startsWith('sk-')) {
    showMsg('api-key-msg', 'Please enter a valid OpenAI key (starts with sk-).', 'error'); return;
  }
  localStorage.setItem('bloom_api_key', key);
  updateAIStatus(true);
  toggleApiSetup();
  showMsg('api-key-msg', '✅ AI connected! Your wellness coach is ready.', 'success');
}

function updateAIStatus(connected) {
  const dot = document.getElementById('ai-status-dot');
  const msg = document.getElementById('ai-status-msg');
  const status = document.getElementById('chb-status');
  if (connected || getApiKey()) {
    if (dot) { dot.textContent = '🟢'; dot.className = 'ai-dot-online'; }
    if (msg) msg.textContent = 'AI connected — GPT-powered wellness coaching is active.';
    if (status) status.textContent = '● Online — GPT-powered';
  } else {
    if (dot) { dot.textContent = '⚪'; dot.className = 'ai-dot-offline'; }
    if (msg) msg.innerHTML = 'AI not connected — <button class="link-btn" onclick="toggleApiSetup()">add your OpenAI key</button> to unlock real GPT responses.';
  }
}

// =============================================
// AI CHAT
// =============================================
let chatHistory = [{
  role: 'system',
  content: `You are Bloom AI, a warm, knowledgeable women's wellness coach. You specialize in women's health including hormonal health, menstrual cycle, PCOS, pregnancy, menopause, fitness, nutrition, mental wellness, and self-care. Keep responses concise (3–5 sentences unless asked for a plan). Be empathetic, evidence-based, and empowering. Use occasional emojis. Never diagnose — always recommend consulting a healthcare provider for medical concerns.`
}];

async function sendChat() {
  const input   = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send-btn');
  const text    = input?.value.trim();
  if (!text) return;

  if (!getApiKey()) {
    appendChatMsg('ai', '⚠️ Please add your OpenAI API key first. Click "Setup AI" above to connect.');
    return;
  }

  appendChatMsg('user', text);
  input.value = '';
  sendBtn.disabled = true;
  document.getElementById('send-icon').textContent = '⏳';

  // Include user health context on first message
  const userContent = chatHistory.length <= 1
    ? `${text}\n\n[My health data: ${buildContext()}]`
    : text;
  chatHistory.push({ role: 'user', content: userContent });

  const aiEl     = createChatBubble('ai');
  const bubbleEl = aiEl.querySelector('.chat-bubble');

  try {
    const res = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getApiKey()}` },
      body: JSON.stringify({ model: 'gpt-3.5-turbo', messages: chatHistory, stream: true, max_tokens: 500, temperature: 0.75 })
    });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e.error?.message || `HTTP ${res.status}`); }

    const reader = res.body.getReader(), decoder = new TextDecoder();
    let full = '';
    bubbleEl.classList.add('typing-cursor'); bubbleEl.textContent = '';

    while (true) {
      const { done, value } = await reader.read(); if (done) break;
      const lines = decoder.decode(value, { stream: true }).split('\n').filter(l => l.startsWith('data: '));
      for (const line of lines) {
        const data = line.slice(6).trim(); if (data === '[DONE]') break;
        try { const t = JSON.parse(data).choices?.[0]?.delta?.content || ''; full += t; bubbleEl.textContent = full; document.getElementById('chat-messages').scrollTop = 99999; } catch {}
      }
    }
    bubbleEl.classList.remove('typing-cursor');
    chatHistory.push({ role: 'assistant', content: full });
    if (chatHistory.length > 21) chatHistory = [chatHistory[0], ...chatHistory.slice(-20)];
  } catch (err) {
    bubbleEl.classList.remove('typing-cursor');
    bubbleEl.textContent = `❌ Error: ${err.message}`;
  }
  sendBtn.disabled = false;
  document.getElementById('send-icon').textContent = '➤';
}

function buildContext() {
  const f = load('fitness', {}), w = load('water', 0);
  const moods = load('moodHistory', []), meals = load('meals', {});
  const last = moods.length ? moods[moods.length - 1].mood : 'unknown';
  return `Steps: ${f.steps||0}, Workout: ${f.workoutTime||0}min, Calories burned: ${f.calories||0}kcal, Water: ${w}/8 glasses, Mood: ${last}, Breakfast: ${meals.breakfast||'not logged'}, Lunch: ${meals.lunch||'not logged'}, Dinner: ${meals.dinner||'not logged'}`;
}

function appendChatMsg(role, text) { createChatBubble(role).querySelector('.chat-bubble').textContent = text; }

function createChatBubble(role) {
  const box = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = `chat-msg ${role === 'user' ? 'user-msg' : 'ai-msg'}`;
  div.innerHTML = `<span class="chat-av">${role === 'user' ? '👩' : '🌸'}</span><div class="chat-bubble"></div>`;
  box.appendChild(div); box.scrollTop = box.scrollHeight; return div;
}

function sendChip(text) { if (document.getElementById('chat-input')) document.getElementById('chat-input').value = text; sendChat(); }

function clearChat() {
  chatHistory = [chatHistory[0]];
  const box = document.getElementById('chat-messages');
  if (box) box.innerHTML = `<div class="chat-msg ai-msg"><span class="chat-av">🌸</span><div class="chat-bubble">Chat cleared! How can I support your wellness journey today? 💜</div></div>`;
}

// =============================================
// SOCIAL FEED DATA
// =============================================
const feedPosts = [
  { id:1, avatar:'🧘‍♀️', name:'Wellness with Maya', handle:'@wellnessmaya', platform:'instagram', time:'2 min ago',
    body:'Just finished my morning yoga flow and I feel INCREDIBLE ✨ Reminder: your morning routine sets the tone for your entire day. Even 10 minutes of movement changes everything. What\'s your morning ritual?',
    tags:['#MorningYoga','#WellnessRoutine','#SelfCare'], image:'🧘‍♀️', likes:847, comments:63 },
  { id:2, avatar:'🌿', name:'Hormone Health Hub', handle:'@hormonehub', platform:'twitter', time:'15 min ago',
    body:'THREAD: Why your energy crashes at 3pm every day 🧵\n\n1/ It\'s not laziness — it\'s your cortisol curve. Cortisol naturally dips in the afternoon, causing that familiar slump.\n\n2/ Solution: Eat a protein + fat snack at 2:30pm. This stabilizes blood sugar and prevents the crash.',
    tags:['#HormoneHealth','#EnergyTips','#WomensHealth'], likes:1243, comments:89 },
  { id:3, avatar:'💪', name:'Strong Women Collective', handle:'@strongwomen', platform:'instagram', time:'1 hr ago',
    body:'PSA: Strength training does NOT make you bulky. It makes you strong, confident, and metabolically healthy. Women have 10-30x less testosterone than men — building "too much muscle" is physiologically very difficult. Lift heavy, queen. 👑',
    tags:['#StrengthTraining','#WomenWhoLift','#FitnessMyths'], image:'💪', likes:2156, comments:134 },
  { id:4, avatar:'🌙', name:'Cycle Syncing Coach', handle:'@cyclecoach', platform:'tiktok', time:'2 hrs ago',
    body:'Your menstrual cycle is your SUPERPOWER 🌙 In your follicular phase (days 6-13), estrogen rises and you\'re naturally more creative, energetic, and social. This is the BEST time to schedule important meetings, start new projects, and try new workouts. Work WITH your hormones, not against them.',
    tags:['#CycleSyncing','#HormonalHealth','#PeriodPositive'], likes:5892, comments:312 },
  { id:5, avatar:'🥗', name:'Nourish & Thrive', handle:'@nourishthrive', platform:'pinterest', time:'3 hrs ago',
    body:'Anti-inflammatory meal prep Sunday 🥗 This week\'s menu is designed to support hormonal balance:\n• Breakfast: Turmeric golden oats with berries\n• Lunch: Salmon & quinoa power bowl\n• Dinner: Lentil curry with leafy greens\n• Snack: Walnuts + dark chocolate\n\nYour gut microbiome will thank you!',
    tags:['#MealPrep','#AntiInflammatory','#HormonalBalance'], image:'🥗', likes:3421, comments:198 },
  { id:6, avatar:'🧠', name:'Mind & Body Balance', handle:'@mindbalance', platform:'instagram', time:'4 hrs ago',
    body:'Anxiety tip that actually works: The 5-4-3-2-1 grounding technique 🌿\n\n5 things you can SEE\n4 things you can TOUCH\n3 things you can HEAR\n2 things you can SMELL\n1 thing you can TASTE\n\nThis activates your parasympathetic nervous system and stops the anxiety spiral within 60 seconds.',
    tags:['#AnxietyRelief','#MentalHealth','#Mindfulness'], likes:4567, comments:267 },
  { id:7, avatar:'💤', name:'Sleep Science for Women', handle:'@sleepscience', platform:'twitter', time:'5 hrs ago',
    body:'Women need 20 more minutes of sleep than men on average — and it\'s not laziness, it\'s biology. Our brains are more complex and require more recovery time. Stop apologizing for needing rest. Sleep is your most powerful health tool. 💤',
    tags:['#SleepHealth','#WomensWellness','#RestIsProductive'], likes:8934, comments:445 },
  { id:8, avatar:'🌸', name:'Self-Love Daily', handle:'@selflovedaily', platform:'instagram', time:'6 hrs ago',
    body:'Gentle reminder: You don\'t have to earn rest. You don\'t have to justify taking care of yourself. You don\'t have to be productive every moment. You are allowed to simply BE. 🌸 Your worth is not measured by your output.',
    tags:['#SelfLove','#MentalHealth','#YouAreEnough'], likes:12847, comments:892 }
];

let visiblePosts = 4;
const likedPosts = new Set(load('likedPosts', []));

function renderFeed() {
  const container = document.getElementById('social-feed');
  if (!container) return;
  const toShow = feedPosts.slice(0, visiblePosts);
  container.innerHTML = toShow.map(post => `
    <div class="feed-post" id="post-${post.id}">
      <div class="fp-header">
        <div class="fp-avatar" style="background:${getAvatarBg(post.platform)}">${post.avatar}</div>
        <div>
          <div class="fp-name">${post.name}</div>
          <div class="fp-handle">${post.handle}</div>
        </div>
        <div class="fp-platform ${post.platform}">
          <i class="fa-brands fa-${post.platform}"></i> ${post.platform}
        </div>
      </div>
      <div class="fp-body">${post.body.replace(/\n/g, '<br/>')}</div>
      ${post.image ? `<div class="fp-image">${post.image}</div>` : ''}
      <div class="fp-tags">${post.tags.map(t => `<span class="fp-tag">${t}</span>`).join('')}</div>
      <div class="fp-actions">
        <button class="fp-action-btn ${likedPosts.has(post.id) ? 'liked' : ''}" onclick="toggleLike(${post.id}, this)">
          <i class="fa-${likedPosts.has(post.id) ? 'solid' : 'regular'} fa-heart"></i>
          <span id="likes-${post.id}">${likedPosts.has(post.id) ? post.likes + 1 : post.likes}</span>
        </button>
        <button class="fp-action-btn"><i class="fa-regular fa-comment"></i> ${post.comments}</button>
        <button class="fp-action-btn" onclick="sharePost(${post.id})"><i class="fa-solid fa-share-nodes"></i> Share</button>
        <span class="fp-time">${post.time}</span>
      </div>
    </div>`).join('');
}

function getAvatarBg(platform) {
  const map = { instagram:'linear-gradient(135deg,#fce7f3,#ede9fe)', twitter:'linear-gradient(135deg,#eff6ff,#dbeafe)', tiktok:'linear-gradient(135deg,#f0fdf4,#dcfce7)', pinterest:'linear-gradient(135deg,#fff1f2,#fecdd3)' };
  return map[platform] || 'linear-gradient(135deg,var(--rose-l),var(--purple-l))';
}

function toggleLike(id, btn) {
  if (likedPosts.has(id)) { likedPosts.delete(id); btn.classList.remove('liked'); btn.querySelector('i').className = 'fa-regular fa-heart'; document.getElementById(`likes-${id}`).textContent = feedPosts.find(p => p.id === id).likes; }
  else { likedPosts.add(id); btn.classList.add('liked'); btn.querySelector('i').className = 'fa-solid fa-heart'; document.getElementById(`likes-${id}`).textContent = feedPosts.find(p => p.id === id).likes + 1; }
  save('likedPosts', [...likedPosts]);
}

function sharePost(id) {
  const post = feedPosts.find(p => p.id === id);
  if (navigator.share) { navigator.share({ title: post.name, text: post.body.slice(0, 100) + '...', url: window.location.href }); }
  else { navigator.clipboard?.writeText(post.body); alert('Post copied to clipboard! 🌸'); }
}

function loadMorePosts() {
  visiblePosts = Math.min(visiblePosts + 2, feedPosts.length);
  renderFeed();
  if (visiblePosts >= feedPosts.length) {
    const btn = document.querySelector('[onclick="loadMorePosts()"]');
    if (btn) btn.textContent = '✅ All posts loaded';
  }
}

// =============================================
// HEALTH NEWS
// =============================================
const healthNews = [
  { emoji:'🧬', cat:'Research', title:'New study: Intermittent fasting improves insulin sensitivity in women by 34%', time:'1 hr ago' },
  { emoji:'🌿', cat:'Nutrition', title:'Magnesium deficiency linked to PMS severity — are you getting enough?', time:'2 hrs ago' },
  { emoji:'🏃‍♀️', cat:'Fitness', title:'Walking 7,000 steps/day reduces all-cause mortality by 50%, new meta-analysis finds', time:'3 hrs ago' },
  { emoji:'🧠', cat:'Mental Health', title:'Mindfulness meditation shown to reduce anxiety as effectively as medication in new trial', time:'4 hrs ago' },
  { emoji:'🌙', cat:'Sleep', title:'Women who sleep less than 6 hours have 40% higher cortisol levels, study reveals', time:'5 hrs ago' },
  { emoji:'💊', cat:'Supplements', title:'Vitamin D + K2 combination significantly improves bone density in postmenopausal women', time:'6 hrs ago' },
  { emoji:'🔬', cat:'PCOS', title:'Inositol supplementation reduces PCOS symptoms in 73% of participants in 6-month trial', time:'8 hrs ago' },
  { emoji:'❤️', cat:'Heart Health', title:'Mediterranean diet reduces cardiovascular risk in women by 25% — new 10-year study', time:'10 hrs ago' },
  { emoji:'🤱', cat:'Fertility', title:'Acupuncture shown to improve IVF success rates by 15% in randomized controlled trial', time:'12 hrs ago' },
  { emoji:'🌸', cat:'Wellness', title:'Social connection as powerful as exercise for longevity — Harvard 80-year study confirms', time:'1 day ago' }
];

let newsIndex = 0;
function renderNews() {
  const el = document.getElementById('health-news');
  if (!el) return;
  const toShow = healthNews.slice(newsIndex, newsIndex + 5);
  el.innerHTML = toShow.map(n => `
    <div class="news-item" onclick="this.style.opacity='0.7'">
      <div class="ni-emoji">${n.emoji}</div>
      <div class="ni-content">
        <div class="ni-category">${n.cat}</div>
        <div class="ni-title">${n.title}</div>
        <div class="ni-meta">${n.time}</div>
      </div>
    </div>`).join('');
}

function refreshNews() {
  newsIndex = (newsIndex + 5) % healthNews.length;
  renderNews();
}

// =============================================
// DAILY TIP OF THE DAY
// =============================================
const dailyTips = [
  { emoji:'🌅', tip:'Start your morning with 500ml of water before coffee. Overnight dehydration affects cortisol and energy levels all day.' },
  { emoji:'🧘‍♀️', tip:'10 minutes of morning sunlight exposure regulates your circadian rhythm, boosts serotonin, and improves sleep quality tonight.' },
  { emoji:'🥦', tip:'Eat cruciferous vegetables (broccoli, cauliflower, kale) 3×/week to support estrogen metabolism and reduce cancer risk.' },
  { emoji:'💪', tip:'Strength training during your follicular phase (days 6-13) yields the best results — estrogen enhances muscle recovery.' },
  { emoji:'🌙', tip:'Set a consistent wake time — even on weekends. This single habit has the biggest impact on sleep quality and hormonal balance.' },
  { emoji:'🫁', tip:'Box breathing (4-4-4-4) for 5 minutes lowers blood pressure, reduces cortisol, and improves focus within minutes.' },
  { emoji:'🍫', tip:'Dark chocolate (70%+) contains magnesium, iron, and flavonoids that reduce PMS symptoms and improve mood.' },
  { emoji:'🚶‍♀️', tip:'A 10-minute walk after meals reduces blood sugar spikes by 30% and improves insulin sensitivity over time.' },
  { emoji:'📱', tip:'Phone-free first 30 minutes after waking reduces cortisol and anxiety. Use that time for movement, journaling, or quiet reflection.' },
  { emoji:'🌿', tip:'Ashwagandha (300-600mg) taken consistently for 8 weeks reduces cortisol by 30% and improves stress resilience.' },
  { emoji:'💤', tip:'Sleep in a cool room (65-68°F / 18-20°C). Body temperature drop triggers melatonin release and deepens sleep quality.' },
  { emoji:'🥗', tip:'Eating fermented foods (yogurt, kimchi, kefir) daily improves gut microbiome diversity, which directly impacts mood and immunity.' }
];

let tipIndex = 0;
function renderDailyTip() {
  const savedIdx = load('tipIndex', Math.floor(Math.random() * dailyTips.length));
  tipIndex = savedIdx;
  const tip = dailyTips[tipIndex];
  const el = id => document.getElementById(id);
  if (el('tod-emoji')) el('tod-emoji').textContent = tip.emoji;
  if (el('tod-tip'))   el('tod-tip').textContent   = tip.tip;
  if (el('tod-date'))  el('tod-date').textContent  = new Date().toLocaleDateString('en-US', { month:'short', day:'numeric' });
}

function newDailyTip() {
  tipIndex = (tipIndex + 1) % dailyTips.length;
  save('tipIndex', tipIndex);
  renderDailyTip();
}

// =============================================
// WELLNESS STREAK
// =============================================
function updateStreak() {
  const hist = load('fitnessHistory', []);
  const days = ['S','M','T','W','T','F','S'];
  let streak = 0;
  const todayDate = new Date();

  // Count consecutive days with any logged data
  for (let i = 0; i < 30; i++) {
    const d = new Date(todayDate); d.setDate(d.getDate() - i);
    const ds = d.toISOString().split('T')[0];
    const hasData = hist.find(e => e.date === ds) || (i === 0 && (load('fitness', {}).date === ds));
    if (hasData) streak++; else if (i > 0) break;
  }
  save('streak', streak);

  const el = id => document.getElementById(id);
  if (el('streak-num')) el('streak-num').textContent = streak;
  if (el('streak-msg')) el('streak-msg').textContent = streak === 0 ? 'Start logging daily to build your streak!' : streak < 3 ? `${streak} day streak — keep going! 🌱` : streak < 7 ? `${streak} day streak — you're building momentum! 💪` : `${streak} day streak — you're unstoppable! 🔥`;

  // Week dots
  const weekEl = el('streak-week');
  if (weekEl) {
    weekEl.innerHTML = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(todayDate); d.setDate(d.getDate() - (6 - i));
      const ds = d.toISOString().split('T')[0];
      const done = hist.find(e => e.date === ds);
      const isToday = ds === todayDate.toISOString().split('T')[0];
      return `<div class="sw-day ${done ? 'done' : ''} ${isToday && !done ? 'today' : ''}">${days[d.getDay()]}</div>`;
    }).join('');
  }
}

// =============================================
// WEEKLY STATS
// =============================================
function renderWeeklyStats() {
  const hist = load('fitnessHistory', []).slice(-7);
  const el = document.getElementById('weekly-stats');
  if (!el) return;
  const totalSteps   = hist.reduce((s, e) => s + (e.steps || 0), 0);
  const totalWorkout = hist.reduce((s, e) => s + (e.workoutTime || 0), 0);
  const totalCal     = hist.reduce((s, e) => s + (e.calories || 0), 0);
  const avgWater     = load('water', 0);
  const moodCount    = load('moodHistory', []).filter(m => {
    const d = new Date(); d.setDate(d.getDate() - 7);
    return new Date(m.date) > d;
  }).length;

  el.innerHTML = [
    { label: '🚶‍♀️ Total Steps',    val: totalSteps.toLocaleString() },
    { label: '💪 Workout Time',    val: `${totalWorkout} min` },
    { label: '🔥 Calories Burned', val: `${totalCal} kcal` },
    { label: '💧 Water Today',     val: `${avgWater} glasses` },
    { label: '😊 Mood Logs',       val: `${moodCount} entries` }
  ].map(s => `
    <div class="ws-item">
      <span class="ws-label">${s.label}</span>
      <span class="ws-val">${s.val}</span>
    </div>`).join('');
}

// =============================================
// DAILY CHECK-IN SUMMARY
// =============================================
function renderDailyCheckIn() {
  const f = load('fitness', {}), w = load('water', 0);
  const moods = load('moodHistory', []), meals = load('meals', {});
  const el = id => document.getElementById(id);

  if (el('dci-time')) el('dci-time').textContent = new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' });

  const summary = el('dci-summary');
  if (!summary) return;

  const steps = f.steps || 0, workout = f.workoutTime || 0;
  const lastMood = moods.length ? moods[moods.length - 1] : null;
  const mealCount = [meals.breakfast, meals.lunch, meals.dinner].filter(Boolean).length;
  const score = calculateScore();

  if (!steps && !w && !lastMood && !mealCount) {
    summary.innerHTML = '<p>Complete your daily tracking to see your wellness summary here. 🌸</p>'; return;
  }

  summary.innerHTML = `
    <p>Here's your wellness snapshot for today — you're doing great! 🌸</p>
    <div class="dci-stat-row">
      ${steps ? `<div class="dci-stat">🚶‍♀️ ${steps.toLocaleString()} steps</div>` : ''}
      ${workout ? `<div class="dci-stat">💪 ${workout} min workout</div>` : ''}
      ${w ? `<div class="dci-stat">💧 ${w}/8 glasses</div>` : ''}
      ${lastMood ? `<div class="dci-stat">${lastMood.emoji} ${lastMood.mood}</div>` : ''}
      ${mealCount ? `<div class="dci-stat">🍽️ ${mealCount}/3 meals</div>` : ''}
      <div class="dci-stat" style="background:linear-gradient(135deg,rgba(249,168,212,0.2),rgba(221,214,254,0.2));border-color:var(--pink-l)">⭐ Score: ${score}/100</div>
    </div>`;
}

function shareDailyUpdate() {
  const score = calculateScore();
  const text = `My Bloom wellness score today: ${score}/100 🌸 Tracking my health journey one day at a time! #BloomWellness #WomensHealth`;
  if (navigator.share) { navigator.share({ title: 'My Bloom Wellness Update', text }); }
  else { navigator.clipboard?.writeText(text); alert('Update copied! Share it anywhere 🌸'); }
}

// =============================================
// INIT — Run everything on page load
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  updateAuthNavbar();
  initReveal();
  createParticles();
  initCarousel();
  updateAIStatus(false);

  // Load persisted data
  updateFitnessRings();
  updateTrackerBars();
  updateTrackerMeals();
  updateTrackerMood();
  renderMoodHistory();
  renderMealSummary();
  renderWater(load('water', 0));
  generateSuggestions();
  updateHeroScore();

  // Feed & news
  renderFeed();
  renderNews();
  renderDailyTip();
  updateStreak();
  renderWeeklyStats();
  renderDailyCheckIn();

  // Counter animation when hero is visible
  const heroObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) { animateCounters(); heroObserver.disconnect(); }
  }, { threshold: 0.3 });
  const hero = document.getElementById('hero');
  if (hero) heroObserver.observe(hero);

  // Show popup after delay
  setTimeout(showPopup, 1200);

  // Redraw charts on resize
  window.addEventListener('resize', () => { drawFitnessChart(); drawDashboardChart(); });

  // Refresh dashboard when scrolled into view
  const dashObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) refreshDashboard();
  }, { threshold: 0.1 });
  const dash = document.getElementById('dashboard');
  if (dash) dashObserver.observe(dash);
});

// =============================================
// FAQ DATA
// =============================================
const faqs = [
  {
    cat: 'getting-started',
    icon: '🚀', iconBg: '#fce7f3',
    q: 'What is Bloom and who is it for?',
    a: `Bloom is a free women's health and wellness platform designed to help you track your physical health, mental wellness, nutrition, and hormonal health — all in one place. It's built for women of all ages, from teens learning about their cycle to women navigating menopause. No prior wellness knowledge is needed.`,
    tip: '💡 Start with the Daily Tracker section to log your first activity, mood, or meal.'
  },
  {
    cat: 'getting-started',
    icon: '📱', iconBg: '#ede9fe',
    q: 'Do I need to create an account?',
    a: `No account needed! Bloom works entirely in your browser. All your data is saved locally on your device using localStorage — nothing is sent to any server (except when you use the AI Coach, which connects directly to OpenAI). This means your data is completely private and only accessible on your device.`,
    tip: '💡 Since data is stored locally, clearing your browser data will erase your Bloom history. Consider exporting your data periodically.'
  },
  {
    cat: 'getting-started',
    icon: '🌸', iconBg: '#fdf4ff',
    q: 'How do I get the most out of Bloom?',
    a: `The best results come from consistent daily use. Here's a simple routine:`,
    list: ['Morning: Log your mood and set your daily intention', 'After activity: Log your steps, workout, and calories', 'Meals: Log breakfast, lunch, and dinner as you eat', 'Evening: Check your dashboard score and AI suggestions', 'Weekly: Review your streak and weekly stats in the Feed section']
  },
  {
    cat: 'tracking',
    icon: '📊', iconBg: '#f0fdf4',
    q: 'How do I track my fitness activity?',
    a: `Go to the Fitness section and fill in your daily steps, workout duration (in minutes), calories burned, and activity type. Click "Save Activity" and your progress rings will update instantly. Your data is also saved to the weekly chart so you can see your 7-day trend.`,
    tip: '💡 You can use a fitness tracker or phone pedometer to get your step count, then manually enter it here.'
  },
  {
    cat: 'tracking',
    icon: '😊', iconBg: '#fce7f3',
    q: 'How does the mood tracker work?',
    a: `In the Mental Wellness section, tap any of the 8 mood buttons that best describes how you're feeling. You can also add an optional note for context. Your mood is saved with a timestamp and appears in your mood history. The AI Coach uses your mood history to give personalized mental wellness advice.`,
    tip: '💡 Try logging your mood at the same time each day (e.g., morning and evening) to spot patterns over time.'
  },
  {
    cat: 'tracking',
    icon: '💧', iconBg: '#eff6ff',
    q: 'How do I track water intake?',
    a: `In the Nutrition section, use the "+ Add Glass" button to log each glass of water (250ml each). The animated water bottle fills up as you log. Your goal is 8 glasses (2L) per day. The AI will remind you to drink more if you're falling behind.`,
    tip: '💡 Women who exercise or live in hot climates may need 10–12 glasses. Adjust your personal goal accordingly.'
  },
  {
    cat: 'tracking',
    icon: '🔥', iconBg: '#fff7ed',
    q: 'What is the Wellness Score and how is it calculated?',
    a: `Your Wellness Score (0–100) is calculated from five areas:`,
    list: ['Fitness (40 pts): Steps, workout time, and calories burned', 'Hydration (15 pts): Daily water intake vs. 8-glass goal', 'Nutrition (15 pts): Number of meals logged', 'Mood (15 pts): Your latest mood entry', 'Consistency (15 pts): Streak and daily logging habits'],
    tip: '💡 A score of 70+ is excellent. Focus on the areas with the lowest contribution to improve your overall score.'
  },
  {
    cat: 'ai',
    icon: '🤖', iconBg: '#ede9fe',
    q: 'How do I set up the AI Coach?',
    a: `The AI Coach uses OpenAI's GPT-3.5-turbo. To enable it: 1) Go to the AI Coach section, 2) Click "Setup AI", 3) Enter your OpenAI API key (starts with sk-), 4) Click "Save Key". Your key is stored only in your browser and sent directly to OpenAI — Bloom never sees or stores it.`,
    tip: '💡 Get a free API key at platform.openai.com/api-keys. New accounts get free credits to start.'
  },
  {
    cat: 'ai',
    icon: '💬', iconBg: '#fdf4ff',
    q: 'What can I ask the AI Coach?',
    a: `The AI Coach is trained as a women's wellness specialist. You can ask about:`,
    list: ['Personalized workout plans for your fitness level', 'Nutrition advice for hormonal balance, PCOS, or weight management', 'Mental health strategies for stress, anxiety, or low mood', 'Sleep optimization and circadian rhythm tips', 'Cycle syncing — aligning your lifestyle with your menstrual phases', 'Supplement guidance and evidence-based wellness practices'],
    tip: '💡 The AI automatically receives your health data (steps, mood, meals, water) to give personalized advice.'
  },
  {
    cat: 'ai',
    icon: '⚡', iconBg: '#fce7f3',
    q: 'Why is the AI not responding?',
    a: `If the AI isn't responding, check these common issues:`,
    list: ['API key not set — click "Setup AI" and enter your OpenAI key', 'Invalid API key — make sure it starts with "sk-" and has no extra spaces', 'Expired credits — check your OpenAI account for remaining credits', 'Network issue — check your internet connection', 'Rate limit — OpenAI limits requests per minute; wait 30 seconds and try again'],
    tip: '💡 Without an API key, Bloom still works fully — you just get rule-based suggestions instead of GPT responses.'
  },
  {
    cat: 'health',
    icon: '🌙', iconBg: '#fdf4ff',
    q: 'Can Bloom help me track my menstrual cycle?',
    a: `Bloom provides detailed education about the four phases of your menstrual cycle (Menstrual, Follicular, Ovulation, Luteal) in the Women's Health section. You can use the mood tracker to log how you feel throughout your cycle and identify patterns. The AI Coach can also give personalized cycle-syncing advice based on your current phase.`,
    tip: '💡 For dedicated cycle tracking with period prediction, consider pairing Bloom with a dedicated period tracking app.'
  },
  {
    cat: 'health',
    icon: '🔬', iconBg: '#fff1f2',
    q: 'Is the health information on Bloom medically accurate?',
    a: `All health information on Bloom is based on peer-reviewed research and evidence-based guidelines from reputable sources including WHO, NHS, and published medical journals. However, Bloom is an educational platform — not a medical service. Always consult a qualified healthcare provider for personal medical advice, diagnosis, or treatment.`
  },
  {
    cat: 'privacy',
    icon: '🔒', iconBg: '#f0fdf4',
    q: 'Is my health data private and secure?',
    a: `Yes — completely. All your data (fitness logs, mood entries, meals, water intake) is stored exclusively in your browser's localStorage. It never leaves your device and is never sent to any server. The only external connection Bloom makes is when you use the AI Coach, which sends your message directly to OpenAI using your own API key.`,
    tip: '💡 To delete all your data, go to your browser settings and clear localStorage for this site.'
  },
  {
    cat: 'privacy',
    icon: '🗑️', iconBg: '#fce7f3',
    q: 'How do I delete my data?',
    a: `Since all data is stored locally in your browser, you can delete it by:`,
    list: ['Chrome/Edge: Settings → Privacy → Clear browsing data → Cookies and site data', 'Firefox: Settings → Privacy → Clear Data → Cookies and Site Data', 'Safari: Preferences → Privacy → Manage Website Data', 'Or open browser DevTools → Application → Local Storage → Clear all'],
    tip: '💡 This will permanently delete all your Bloom data including fitness history, mood logs, and meal records.'
  }
];

// =============================================
// FAQ RENDERING & FILTERING
// =============================================
function renderFAQ(items) {
  const list = document.getElementById('faq-list');
  if (!list) return;
  if (!items.length) {
    list.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--text-s);font-style:italic">No results found. Try a different search term.</div>';
    return;
  }
  list.innerHTML = items.map((faq, i) => `
    <div class="faq-item" data-cat="${faq.cat}" id="faq-${i}">
      <button class="faq-q" onclick="toggleFAQ(${i})">
        <div class="faq-q-left">
          <div class="faq-q-icon" style="background:${faq.iconBg}">${faq.icon}</div>
          <span>${faq.q}</span>
        </div>
        <i class="fa-solid fa-chevron-down"></i>
      </button>
      <div class="faq-a" id="faq-a-${i}">
        <p>${faq.a}</p>
        ${faq.list ? `<ul>${faq.list.map(l => `<li>${l}</li>`).join('')}</ul>` : ''}
        ${faq.tip ? `<div class="faq-tip">${faq.tip}</div>` : ''}
      </div>
    </div>`).join('');
}

function toggleFAQ(i) {
  const btn  = document.querySelector(`#faq-${i} .faq-q`);
  const body = document.getElementById(`faq-a-${i}`);
  const isOpen = body.classList.contains('open');
  // Close all
  document.querySelectorAll('.faq-a').forEach(a => a.classList.remove('open'));
  document.querySelectorAll('.faq-q').forEach(b => b.classList.remove('open'));
  if (!isOpen) { body.classList.add('open'); btn.classList.add('open'); }
}

function filterFAQ(cat, btn) {
  document.querySelectorAll('.faq-cat-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('hd-search').value = '';
  const filtered = cat === 'all' ? faqs : faqs.filter(f => f.cat === cat);
  renderFAQ(filtered);
}

function searchFAQ(query) {
  const q = query.toLowerCase().trim();
  if (!q) { renderFAQ(faqs); return; }
  const filtered = faqs.filter(f =>
    f.q.toLowerCase().includes(q) ||
    f.a.toLowerCase().includes(q) ||
    (f.list || []).some(l => l.toLowerCase().includes(q))
  );
  renderFAQ(filtered);
  // Reset category buttons
  document.querySelectorAll('.faq-cat-btn').forEach(b => b.classList.remove('active'));
  document.querySelector('.faq-cat-btn')?.classList.add('active');
}

// =============================================
// HELP DESK TICKET SYSTEM
// =============================================
function submitHelpTicket(e) {
  e.preventDefault();
  const name    = document.getElementById('hd-name')?.value.trim();
  const email   = document.getElementById('hd-email')?.value.trim();
  const topic   = document.getElementById('hd-topic')?.value;
  const message = document.getElementById('hd-message')?.value.trim();
  const priority = document.querySelector('input[name="priority"]:checked')?.value || 'low';

  if (!name || !email || !topic || !message) {
    showMsg('hd-form-msg', 'Please fill in all required fields.', 'error'); return;
  }

  const ticket = {
    id: `BLM-${Date.now().toString().slice(-6)}`,
    name, email, topic, message, priority,
    status: 'open',
    date: new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }),
    time: nowStr()
  };

  const tickets = load('helpTickets', []);
  tickets.unshift(ticket);
  if (tickets.length > 10) tickets.pop();
  save('helpTickets', tickets);

  renderTicketHistory();
  showMsg('hd-form-msg', `✅ Ticket ${ticket.id} submitted! We'll respond to ${email} within 24 hours. 💜`, 'success', 6000);

  // Reset form
  e.target.reset();
}

function renderTicketHistory() {
  const tickets = load('helpTickets', []);
  const el = document.getElementById('ticket-history');
  if (!el) return;
  if (!tickets.length) { el.innerHTML = '<p class="empty-hint">No tickets submitted yet.</p>'; return; }
  el.innerHTML = tickets.map(t => `
    <div class="ticket-item">
      <div class="ti-header">
        <span class="ti-id">${t.id}</span>
        <span class="ti-status ${t.status}">${t.status === 'open' ? '🟡 Open' : '✅ Resolved'}</span>
      </div>
      <div class="ti-topic">${t.topic}</div>
      <div class="ti-date">${t.date} · ${t.priority} priority</div>
    </div>`).join('');
}

// =============================================
// UPDATED INIT — add new section inits
// =============================================
// Patch the existing DOMContentLoaded to also init new features
document.addEventListener('DOMContentLoaded', () => {
  renderFAQ(faqs);
  renderTicketHistory();
});

// =============================================
// FEEDBACK FORM
// =============================================

let fbRating  = 0;   // star rating 1-5
let fbNPS     = 0;   // NPS score 1-10
let fbCat     = '';  // selected category

const ratingLabels = {
  0: 'Tap to rate',
  1: '😞 Poor — we\'re sorry to hear that',
  2: '😕 Fair — we can do better',
  3: '😊 Good — thanks for the feedback',
  4: '😄 Great — glad you\'re enjoying Bloom!',
  5: '🤩 Excellent — you made our day!'
};

/** Set star rating and update UI */
function setRating(val) {
  fbRating = val;
  document.querySelectorAll('.star-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i < val);
    btn.classList.toggle('glow', i < val);
  });
  const lbl = document.getElementById('rating-label');
  if (lbl) lbl.textContent = ratingLabels[val];
}

/** Hover preview for stars */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.star-btn').forEach((btn, i) => {
    btn.addEventListener('mouseenter', () => {
      document.querySelectorAll('.star-btn').forEach((b, j) => b.classList.toggle('active', j <= i));
    });
    btn.addEventListener('mouseleave', () => {
      document.querySelectorAll('.star-btn').forEach((b, j) => b.classList.toggle('active', j < fbRating));
    });
  });
});

/** Select feedback category */
function selectCat(btn) {
  document.querySelectorAll('.fb-cat-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  fbCat = btn.dataset.cat;
}

/** Set NPS score with color coding */
function setNPS(val) {
  fbNPS = val;
  document.querySelectorAll('.nps-btn').forEach(btn => {
    btn.classList.remove('selected', 'promoter', 'passive', 'detractor');
    if (parseInt(btn.dataset.val) === val) {
      btn.classList.add('selected');
      if (val >= 9)      btn.classList.add('promoter');
      else if (val >= 7) btn.classList.add('passive');
      else               btn.classList.add('detractor');
    }
  });
}

/** Live character counter */
function updateCharCount(textarea) {
  const len  = textarea.value.length;
  const max  = 500;
  const el   = document.getElementById('fb-char-count');
  const warn = document.getElementById('fb-char-warn');
  if (el) el.textContent = `${len} / ${max}`;
  if (warn) warn.classList.toggle('hidden', len < 420);
  if (len > max) textarea.value = textarea.value.slice(0, max);
}

/** Collect wishlist selections */
function getWishlist() {
  return [...document.querySelectorAll('.wish-item input:checked')].map(cb => cb.value);
}

/** Submit feedback — saves to localStorage */
function submitFeedback() {
  const message = document.getElementById('fb-message')?.value.trim();
  const msgEl   = document.getElementById('fb-msg');
  const btn     = document.getElementById('fb-submit-btn');

  // Validation
  if (!message) {
    showMsg('fb-msg', '⚠️ Please write your feedback before submitting.', 'error'); return;
  }
  if (!fbRating) {
    showMsg('fb-msg', '⚠️ Please give a star rating.', 'error'); return;
  }

  const fbType = document.querySelector('input[name="fb-type"]:checked')?.value || 'suggestion';
  const name   = document.getElementById('fb-name')?.value.trim() || 'Anonymous';
  const email  = document.getElementById('fb-email')?.value.trim() || '';

  const entry = {
    id:        `FB-${Date.now().toString().slice(-7)}`,
    name,
    email,
    rating:    fbRating,
    nps:       fbNPS,
    category:  fbCat || 'Overall App',
    type:      fbType,
    message,
    wishlist:  getWishlist(),
    date:      new Date().toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric' }),
    timestamp: Date.now()
  };

  // Save
  const all = load('feedbackEntries', []);
  all.unshift(entry);
  save('feedbackEntries', all);

  // Update UI
  renderFeedbackStats();
  renderRecentFeedback();
  resetFeedbackForm();

  // Success message
  if (btn) {
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Feedback Submitted!';
    btn.style.background = 'linear-gradient(135deg,#10b981,#059669)';
    setTimeout(() => {
      btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Submit Feedback';
      btn.style.background = '';
    }, 3000);
  }
  showMsg('fb-msg', `✅ Thank you${name !== 'Anonymous' ? ', ' + name : ''}! Your feedback (${entry.id}) has been saved. 💜`, 'success', 5000);
}

/** Reset form after submission */
function resetFeedbackForm() {
  fbRating = 0; fbNPS = 0; fbCat = '';
  document.querySelectorAll('.star-btn').forEach(b => b.classList.remove('active','glow'));
  document.querySelectorAll('.fb-cat-btn').forEach(b => b.classList.remove('selected'));
  document.querySelectorAll('.nps-btn').forEach(b => b.classList.remove('selected','promoter','passive','detractor'));
  document.querySelectorAll('.wish-item input').forEach(cb => cb.checked = false);
  const ids = ['fb-name','fb-email','fb-message'];
  ids.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  const lbl = document.getElementById('rating-label');
  if (lbl) lbl.textContent = ratingLabels[0];
  const charEl = document.getElementById('fb-char-count');
  if (charEl) charEl.textContent = '0 / 500';
  // Reset radio to suggestion
  const radio = document.querySelector('input[name="fb-type"][value="suggestion"]');
  if (radio) radio.checked = true;
}

/** Render feedback stats (avg rating, count, recommend %) */
function renderFeedbackStats() {
  const all = load('feedbackEntries', []);

  // Seed with some demo data if empty so stats look populated
  const entries = all.length ? all : getDemoFeedback();

  const count   = entries.length;
  const avgRaw  = entries.reduce((s, e) => s + (e.rating || 0), 0) / count;
  const avg     = avgRaw.toFixed(1);
  const recPct  = Math.round(entries.filter(e => (e.nps || 0) >= 9).length / count * 100);

  const el = id => document.getElementById(id);
  if (el('total-feedback-count')) el('total-feedback-count').textContent = count;
  if (el('avg-rating-display'))   el('avg-rating-display').textContent   = `${avg}★`;
  if (el('recommend-pct'))        el('recommend-pct').textContent        = `${recPct}%`;

  // Rating breakdown bars
  const breakdown = document.getElementById('rating-breakdown');
  if (breakdown) {
    breakdown.innerHTML = [5,4,3,2,1].map(star => {
      const cnt = entries.filter(e => e.rating === star).length;
      const pct = count ? Math.round(cnt / count * 100) : 0;
      return `
        <div class="rb-row">
          <span class="rb-stars">${star}★</span>
          <div class="rb-bar-bg"><div class="rb-bar-fill" style="width:${pct}%"></div></div>
          <span class="rb-count">${cnt}</span>
        </div>`;
    }).join('');
  }
}

/** Render recent feedback cards */
function renderRecentFeedback() {
  const all     = load('feedbackEntries', []);
  const entries = all.length ? all : getDemoFeedback();
  const el      = document.getElementById('recent-feedback-list');
  if (!el) return;

  el.innerHTML = entries.slice(0, 5).map(e => `
    <div class="rfb-item">
      <div class="rfb-header">
        <span class="rfb-name">${e.name || 'Anonymous'}</span>
        <span class="rfb-stars">${'★'.repeat(e.rating || 0)}${'☆'.repeat(5 - (e.rating || 0))}</span>
      </div>
      <div style="margin-bottom:0.4rem">
        <span class="rfb-cat">${e.category || 'Overall App'}</span>
      </div>
      <div class="rfb-text">"${e.message.length > 120 ? e.message.slice(0, 120) + '...' : e.message}"</div>
      <div class="rfb-date">${e.date}</div>
    </div>`).join('');
}

/** Demo feedback entries to pre-populate stats */
function getDemoFeedback() {
  return [
    { name:'Sarah M.',    rating:5, nps:10, category:'AI Coach',       message:'The AI Coach is incredible! It gave me personalized advice about my PCOS that actually helped. Bloom has changed how I think about my health.', date:'Mar 25, 2026' },
    { name:'Priya K.',    rating:5, nps:9,  category:'Overall App',    message:'I love how everything is in one place. The cycle syncing information in the Women\'s Health section is so educational. Finally an app that treats women\'s health seriously!', date:'Mar 24, 2026' },
    { name:'Emma L.',     rating:4, nps:8,  category:'Mental Wellness', message:'The breathing exercise and mood tracker have become part of my daily routine. Would love to see a meditation library added next!', date:'Mar 23, 2026' },
    { name:'Aisha T.',    rating:5, nps:10, category:'Nutrition',       message:'The nutrition tips are evidence-based and actually practical. The water tracker with the animated bottle is so satisfying to fill up!', date:'Mar 22, 2026' },
    { name:'Jessica R.',  rating:4, nps:9,  category:'Fitness Tracker', message:'Love the progress rings — they make me want to hit my goals every day. The weekly chart is a great motivator. Keep up the amazing work!', date:'Mar 21, 2026' }
  ];
}

// Init feedback on page load
document.addEventListener('DOMContentLoaded', () => {
  renderFeedbackStats();
  renderRecentFeedback();
});

// =============================================
// ANIMATIONS.JS — Scroll progress, stagger,
// tilt, ripple, page transitions
// =============================================

// ---- Scroll progress bar ----
window.addEventListener('scroll', () => {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  const scrolled = window.scrollY;
  const total    = document.documentElement.scrollHeight - window.innerHeight;
  bar.style.width = (scrolled / total * 100) + '%';
}, { passive: true });

// ---- Stagger children observer ----
const staggerObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      staggerObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.stagger-children, .reveal-scale, .reveal-left').forEach(el => {
  staggerObs.observe(el);
});

// ---- Tilt effect on cards (desktop only) ----
function initTilt() {
  if (window.matchMedia('(hover: none)').matches) return; // skip touch
  document.querySelectorAll('.bloom-card, .wif-card, .blog-card, .dash-stat-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const x      = e.clientX - rect.left;
      const y      = e.clientY - rect.top;
      const cx     = rect.width  / 2;
      const cy     = rect.height / 2;
      const rotX   = ((y - cy) / cy) * -5;
      const rotY   = ((x - cx) / cx) *  5;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ---- Ripple on buttons ----
function initRipple() {
  document.querySelectorAll('.btn-bloom, .btn-auth').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect   = this.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height);
      ripple.style.cssText = `
        position:absolute;
        width:${size}px;height:${size}px;
        left:${e.clientX - rect.left - size/2}px;
        top:${e.clientY - rect.top  - size/2}px;
        background:rgba(255,255,255,0.3);
        border-radius:50%;
        transform:scale(0);
        animation:ripple 0.55s ease-out forwards;
        pointer-events:none;
      `;
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

// ---- Smooth number counter for stats ----
function animateNumber(el, target, duration = 1200, suffix = '') {
  const start = performance.now();
  const from  = parseInt(el.textContent) || 0;
  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(from + (target - from) * eased) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// ---- Gradient text on section titles ----
function upgradeHeadings() {
  document.querySelectorAll('.section-title em').forEach(em => {
    em.classList.add('grad-text-flow');
  });
}

// ---- Add glass class to hero cards ----
function upgradeHeroCards() {
  document.querySelectorAll('.hero-card-float').forEach(card => {
    card.classList.add('glass');
  });
}

// ---- Page enter animation ----
function pageEnter() {
  document.body.classList.add('page-enter');
  setTimeout(() => document.body.classList.remove('page-enter'), 600);
}

// ---- Smooth link transitions ----
function initPageTransitions() {
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript')) return;
    link.addEventListener('click', e => {
      e.preventDefault();
      document.body.style.opacity = '0';
      document.body.style.transition = 'opacity 0.25s ease';
      setTimeout(() => { window.location.href = href; }, 260);
    });
  });
}

// ---- Magnetic effect on FAB ----
function initMagneticFAB() {
  const fab = document.querySelector('.fab');
  if (!fab || window.matchMedia('(hover: none)').matches) return;
  fab.addEventListener('mousemove', e => {
    const rect = fab.getBoundingClientRect();
    const dx   = e.clientX - (rect.left + rect.width  / 2);
    const dy   = e.clientY - (rect.top  + rect.height / 2);
    fab.style.transform = `translate(${dx * 0.3}px, ${dy * 0.3}px) scale(1.12)`;
  });
  fab.addEventListener('mouseleave', () => {
    fab.style.transform = '';
  });
}

// ---- Particle burst on mood log ----
function burstParticles(x, y) {
  const emojis = ['🌸','✨','💜','💕','⭐'];
  for (let i = 0; i < 8; i++) {
    const p = document.createElement('div');
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    const angle = (i / 8) * 360;
    const dist  = 60 + Math.random() * 40;
    const dx    = Math.cos(angle * Math.PI / 180) * dist;
    const dy    = Math.sin(angle * Math.PI / 180) * dist;
    p.style.cssText = `
      position:fixed;left:${x}px;top:${y}px;
      font-size:${0.9 + Math.random() * 0.6}rem;
      pointer-events:none;z-index:9999;
      transition:transform 0.7s ease-out,opacity 0.7s ease-out;
      transform:translate(0,0);opacity:1;
    `;
    document.body.appendChild(p);
    requestAnimationFrame(() => {
      p.style.transform = `translate(${dx}px,${dy}px)`;
      p.style.opacity   = '0';
    });
    setTimeout(() => p.remove(), 750);
  }
}

// Patch logMood to trigger burst
const _origLogMood = typeof logMood === 'function' ? logMood : null;
if (_origLogMood) {
  window.logMood = function(mood) {
    _origLogMood(mood);
    const btn = document.querySelector(`.mood-btn[data-mood="${mood}"], .mood-btn-enhanced[data-mood="${mood}"]`);
    if (btn) {
      const r = btn.getBoundingClientRect();
      burstParticles(r.left + r.width / 2, r.top + r.height / 2);
    }
  };
}

// ---- Init all on DOM ready ----
document.addEventListener('DOMContentLoaded', () => {
  pageEnter();
  initTilt();
  initRipple();
  upgradeHeadings();
  upgradeHeroCards();
  initMagneticFAB();
  // Don't init page transitions — causes issues with onclick handlers
  // initPageTransitions();
});
/**
 * BLOOM — Auth Script (login.html & signup.html)
 * All auth stored in localStorage (no backend)
 */

// =============================================
// STORAGE HELPERS
// =============================================

// =============================================
// SIMPLE HASH (not cryptographic — localStorage only)
// =============================================
function hashPassword(pw) {
  let hash = 0;
  for (let i = 0; i < pw.length; i++) {
    hash = ((hash << 5) - hash) + pw.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString(36) + pw.length.toString(36) + pw.slice(-2);
}

// =============================================
// ROTATING QUOTES (login page)
// =============================================
const quotes = [
  '"She believed she could, so she did."',
  '"Your body is your home — take care of it."',
  '"Self-care is not selfish. You cannot pour from an empty cup."',
  '"Health is the greatest gift you can give yourself."',
  '"Strong women lift each other up."',
  '"The most courageous act is still to think for yourself. Aloud." — Coco Chanel',
  '"Caring for myself is not self-indulgence, it is self-preservation." — Audre Lorde'
];
let qIdx = 0;
function rotateQuote() {
  const el = document.getElementById('rotating-quote');
  if (!el) return;
  el.style.opacity = '0';
  setTimeout(() => {
    qIdx = (qIdx + 1) % quotes.length;
    el.textContent = quotes[qIdx];
    el.style.opacity = '1';
  }, 400);
}
if (document.getElementById('rotating-quote')) {
  setInterval(rotateQuote, 5000);
}

// =============================================
// PARTICLES
// =============================================
function createParticles() {
  const c = document.getElementById('particles');
  if (!c) return;
  const emojis = ['🌸', '✨', '💜', '🌿', '💕'];
  for (let i = 0; i < 14; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.cssText = `left:${Math.random()*100}%;font-size:${0.7+Math.random()*1}rem;animation-duration:${10+Math.random()*12}s;animation-delay:${Math.random()*8}s`;
    c.appendChild(p);
  }
}
createParticles();

// =============================================
// PASSWORD EYE TOGGLE
// =============================================
function toggleEye(inputId, btn) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const isText = input.type === 'text';
  input.type = isText ? 'password' : 'text';
  btn.querySelector('i').className = isText ? 'fa-regular fa-eye' : 'fa-regular fa-eye-slash';
}

// =============================================
// TERMS MODAL
// =============================================
function showTermsModal(e) {
  if (e) e.preventDefault();
  document.getElementById('terms-modal')?.classList.remove('hidden');
}
function hideTermsModal() {
  document.getElementById('terms-modal')?.classList.add('hidden');
}

// =============================================
// FIELD VALIDATION HELPERS
// =============================================
function setErr(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}
function clearErr(id) { setErr(id, ''); }

function markField(inputId, valid) {
  const el = document.getElementById(inputId);
  if (!el) return;
  el.classList.toggle('valid',   valid);
  el.classList.toggle('invalid', !valid);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// =============================================
// LOGIN
// =============================================
function doLogin(e) {
  if (e) e.preventDefault();

  const email    = document.getElementById('email')?.value.trim();
  const password = document.getElementById('password')?.value;
  const remember = document.getElementById('remember')?.checked;

  // Clear previous errors
  clearErr('email-err'); clearErr('password-err');
  hideAlert('login-error'); hideAlert('login-success');

  let valid = true;

  if (!email || !validateEmail(email)) {
    setErr('email-err', 'Please enter a valid email address.');
    markField('email', false); valid = false;
  } else { markField('email', true); }

  if (!password) {
    setErr('password-err', 'Please enter your password.');
    markField('password', false); valid = false;
  } else { markField('password', true); }

  if (!valid) return;

  // Show loading
  setLoading('login-btn', 'login-btn-text', 'login-spinner', true);

  setTimeout(() => {
    const users = lsGet('bloom_users', []);
    const user  = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user || user.passwordHash !== hashPassword(password)) {
      setLoading('login-btn', 'login-btn-text', 'login-spinner', false);
      showAlert('login-error', 'login-error-msg', 'Incorrect email or password. Please try again.');
      markField('password', false);
      return;
    }

    // Success — create session
    const session = {
      userId:    user.id,
      name:      user.fname,
      email:     user.email,
      goal:      user.goal,
      ageGroup:  user.ageGroup,
      loginTime: Date.now(),
      remember
    };
    lsSet('bloom_session', session);
    if (remember) lsSet('bloom_remember_email', email);

    showAlert('login-success');
    setTimeout(() => { window.location.href = 'index.html'; }, 1200);
  }, 900);
}

// =============================================
// DEMO & GUEST LOGIN
// =============================================
function demoLogin() {
  // Create or reuse demo account
  const users = lsGet('bloom_users', []);
  let demo = users.find(u => u.email === 'demo@bloomwellness.app');
  if (!demo) {
    demo = {
      id: 'demo-001', fname: 'Demo', lname: 'User',
      email: 'demo@bloomwellness.app',
      passwordHash: hashPassword('Demo@1234'),
      goal: 'General self-care', ageGroup: '25-34',
      createdAt: Date.now()
    };
    users.push(demo);
    lsSet('bloom_users', users);
  }
  lsSet('bloom_session', { userId: demo.id, name: 'Demo', email: demo.email, goal: demo.goal, loginTime: Date.now() });
  showAlert('login-success');
  setTimeout(() => { window.location.href = 'index.html'; }, 900);
}

function guestLogin() {
  lsSet('bloom_session', { userId: 'guest', name: 'Guest', email: '', goal: '', loginTime: Date.now(), isGuest: true });
  window.location.href = 'index.html';
}

// =============================================
// SIGNUP — MULTI-STEP
// =============================================
let currentStep = 1;
let selectedGoal = '';

function selectGoal(btn) {
  document.querySelectorAll('.goal-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  selectedGoal = btn.dataset.val;
  clearErr('goal-err');
}

function nextStep(from) {
  if (from === 1 && !validateStep1()) return;
  if (from === 2 && !validateStep2()) return;

  document.getElementById(`step-${from}`)?.classList.add('hidden');
  document.getElementById(`step-${from + 1}`)?.classList.remove('hidden');
  currentStep = from + 1;
  updateProgress(currentStep);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function prevStep(from) {
  document.getElementById(`step-${from}`)?.classList.add('hidden');
  document.getElementById(`step-${from - 1}`)?.classList.remove('hidden');
  currentStep = from - 1;
  updateProgress(currentStep);
}

function updateProgress(step) {
  [1, 2, 3].forEach(n => {
    const el = document.getElementById(`sp-${n}`);
    if (!el) return;
    el.classList.remove('active', 'done');
    if (n < step)  el.classList.add('done');
    if (n === step) el.classList.add('active');
  });
}

function validateStep1() {
  const fname = document.getElementById('fname')?.value.trim();
  const lname = document.getElementById('lname')?.value.trim();
  const email = document.getElementById('su-email')?.value.trim();
  const age   = document.getElementById('age-group')?.value;
  let ok = true;

  clearErr('fname-err'); clearErr('lname-err'); clearErr('su-email-err'); clearErr('age-err');

  if (!fname) { setErr('fname-err', 'First name is required.'); markField('fname', false); ok = false; }
  else { markField('fname', true); }

  if (!lname) { setErr('lname-err', 'Last name is required.'); markField('lname', false); ok = false; }
  else { markField('lname', true); }

  if (!email || !validateEmail(email)) {
    setErr('su-email-err', 'Please enter a valid email address.'); markField('su-email', false); ok = false;
  } else {
    // Check if email already exists
    const users = lsGet('bloom_users', []);
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      setErr('su-email-err', 'An account with this email already exists.'); markField('su-email', false); ok = false;
    } else { markField('su-email', true); }
  }

  if (!age) { setErr('age-err', 'Please select your age group.'); ok = false; }

  return ok;
}

function validateStep2() {
  const activity = document.getElementById('activity-level')?.value;
  let ok = true;
  clearErr('goal-err'); clearErr('activity-err');

  if (!selectedGoal) { setErr('goal-err', 'Please select your primary wellness goal.'); ok = false; }
  if (!activity)     { setErr('activity-err', 'Please select your activity level.'); ok = false; }

  return ok;
}

function doSignup(e) {
  if (e) e.preventDefault();

  const pw      = document.getElementById('su-password')?.value;
  const confirm = document.getElementById('su-confirm')?.value;
  const terms   = document.getElementById('agree-terms')?.checked;

  clearErr('su-pw-err'); clearErr('confirm-err'); clearErr('terms-err');
  hideAlert('signup-error'); hideAlert('signup-success');

  let ok = true;

  if (!pw || pw.length < 8) {
    setErr('su-pw-err', 'Password must be at least 8 characters.'); markField('su-password', false); ok = false;
  } else { markField('su-password', true); }

  if (pw !== confirm) {
    setErr('confirm-err', 'Passwords do not match.'); markField('su-confirm', false); ok = false;
  } else if (confirm) { markField('su-confirm', true); }

  if (!terms) { setErr('terms-err', 'You must agree to the Terms of Service.'); ok = false; }

  if (!ok) return;

  setLoading('signup-btn', 'signup-btn-text', 'signup-spinner', true);

  setTimeout(() => {
    const fname    = document.getElementById('fname')?.value.trim();
    const lname    = document.getElementById('lname')?.value.trim();
    const email    = document.getElementById('su-email')?.value.trim();
    const ageGroup = document.getElementById('age-group')?.value;
    const activity = document.getElementById('activity-level')?.value;
    const conditions = document.getElementById('health-conditions')?.value.trim() || '';
    const marketing  = document.getElementById('marketing-opt')?.checked || false;

    const newUser = {
      id:           `user-${Date.now()}`,
      fname, lname, email,
      passwordHash: hashPassword(pw),
      goal:         selectedGoal,
      ageGroup, activity, conditions, marketing,
      createdAt:    Date.now()
    };

    const users = lsGet('bloom_users', []);
    users.push(newUser);
    lsSet('bloom_users', users);

    // Auto-login
    lsSet('bloom_session', {
      userId: newUser.id, name: fname, email,
      goal: selectedGoal, ageGroup, loginTime: Date.now()
    });

    showAlert('signup-success');
    setTimeout(() => { window.location.href = 'index.html'; }, 1200);
  }, 1000);
}

// =============================================
// PASSWORD STRENGTH CHECKER
// =============================================
function checkStrength(pw) {
  const rules = {
    len:     pw.length >= 8,
    upper:   /[A-Z]/.test(pw),
    num:     /[0-9]/.test(pw),
    special: /[^A-Za-z0-9]/.test(pw)
  };

  // Update rule indicators
  const ruleMap = { len: 'rule-len', upper: 'rule-upper', num: 'rule-num', special: 'rule-special' };
  Object.entries(ruleMap).forEach(([key, id]) => {
    document.getElementById(id)?.classList.toggle('pass', rules[key]);
  });

  const score = Object.values(rules).filter(Boolean).length;
  const segs  = ['seg1','seg2','seg3','seg4'];
  const colors = ['', 'weak', 'fair', 'good', 'strong'];
  const labels = ['Enter a password', 'Weak', 'Fair', 'Good', 'Strong 💪'];

  segs.forEach((id, i) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.className = 'pw-seg';
    if (i < score) el.classList.add(colors[score]);
  });

  const lbl = document.getElementById('pw-strength-label');
  if (lbl) lbl.textContent = pw.length ? labels[score] : labels[0];
}

function checkMatch() {
  const pw  = document.getElementById('su-password')?.value;
  const con = document.getElementById('su-confirm')?.value;
  if (!con) return;
  if (pw === con) { markField('su-confirm', true); clearErr('confirm-err'); }
  else            { markField('su-confirm', false); setErr('confirm-err', 'Passwords do not match.'); }
}

// =============================================
// UI HELPERS
// =============================================
function setLoading(btnId, textId, spinnerId, loading) {
  const btn     = document.getElementById(btnId);
  const textEl  = document.getElementById(textId);
  const spinner = document.getElementById(spinnerId);
  if (btn)     btn.disabled = loading;
  if (textEl)  textEl.style.opacity = loading ? '0' : '1';
  if (spinner) spinner.classList.toggle('hidden', !loading);
}

function showAlert(id, msgId, msg) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.remove('hidden');
  if (msgId && msg) {
    const msgEl = document.getElementById(msgId);
    if (msgEl) msgEl.textContent = msg;
  }
}

function hideAlert(id) {
  document.getElementById(id)?.classList.add('hidden');
}

// =============================================
// FORGOT PASSWORD (simple localStorage reset)
// =============================================
function doForgot() {
  const email = document.getElementById('forgot-email')?.value.trim();
  const msgEl = document.getElementById('forgot-msg');
  if (!email || !validateEmail(email)) {
    if (msgEl) { msgEl.textContent = 'Please enter a valid email address.'; msgEl.className = 'auth-alert auth-alert-error'; msgEl.classList.remove('hidden'); }
    return;
  }
  const users = lsGet('bloom_users', []);
  const user  = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  // Always show success (security best practice — don't reveal if email exists)
  if (msgEl) {
    msgEl.textContent = `If an account exists for ${email}, a reset link has been sent. (Demo: since this is localStorage-based, use the Demo Account to access the app.)`;
    msgEl.className = 'auth-alert auth-alert-success';
    msgEl.classList.remove('hidden');
  }
}

// =============================================
// SESSION CHECK — called from index.html
// =============================================
function checkSession() {
  const session = lsGet('bloom_session', null);
  if (!session) {
    window.location.href = 'login.html';
    return null;
  }
  // Session expires after 7 days (unless remember me)
  const maxAge = session.remember ? 7 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  if (Date.now() - session.loginTime > maxAge) {
    localStorage.removeItem('bloom_session');
    window.location.href = 'login.html';
    return null;
  }
  return session;
}

function logout() {
  localStorage.removeItem('bloom_session');
  window.location.href = 'login.html';
}

function getSession() {
  return lsGet('bloom_session', null);
}
/**
 * BLOOM — Badges, Achievements & Points System
 * badges.js — loaded after script.js
 */

// =============================================
// BADGES DEFINITION ARRAY
// Each badge: id, name, icon, desc, cat,
//   rarity, points, condition(data) → boolean
// =============================================
const BADGES = [

  // ── FITNESS ──────────────────────────────
  {
    id: 'first-steps', name: 'First Steps', icon: '👟',
    desc: 'Log your first activity', cat: 'fitness', rarity: 'common', points: 10,
    condition: d => (d.fitness.steps || 0) > 0
  },
  {
    id: 'step-queen', name: 'Step Queen', icon: '👑',
    desc: 'Hit 10,000 steps in a day', cat: 'fitness', rarity: 'rare', points: 50,
    condition: d => (d.fitness.steps || 0) >= 10000
  },
  {
    id: 'marathon-walker', name: 'Marathon Walker', icon: '🏅',
    desc: 'Log 50,000 total steps', cat: 'fitness', rarity: 'epic', points: 150,
    condition: d => d.totalSteps >= 50000
  },
  {
    id: 'workout-warrior', name: 'Workout Warrior', icon: '💪',
    desc: 'Complete a 60-minute workout', cat: 'fitness', rarity: 'rare', points: 40,
    condition: d => (d.fitness.workoutTime || 0) >= 60
  },
  {
    id: 'calorie-crusher', name: 'Calorie Crusher', icon: '🔥',
    desc: 'Burn 500+ calories in one day', cat: 'fitness', rarity: 'rare', points: 45,
    condition: d => (d.fitness.calories || 0) >= 500
  },
  {
    id: 'yoga-goddess', name: 'Yoga Goddess', icon: '🧘‍♀️',
    desc: 'Log Yoga as your workout type', cat: 'fitness', rarity: 'common', points: 20,
    condition: d => d.fitness.type === 'Yoga'
  },
  {
    id: 'dancer', name: 'Dancing Queen', icon: '💃',
    desc: 'Log Dance as your workout type', cat: 'fitness', rarity: 'common', points: 20,
    condition: d => d.fitness.type === 'Dance'
  },
  {
    id: 'swimmer', name: 'Mermaid Mode', icon: '🏊‍♀️',
    desc: 'Log Swimming as your workout', cat: 'fitness', rarity: 'rare', points: 35,
    condition: d => d.fitness.type === 'Swimming'
  },
  {
    id: 'hiit-hero', name: 'HIIT Hero', icon: '⚡',
    desc: 'Complete a HIIT workout', cat: 'fitness', rarity: 'rare', points: 40,
    condition: d => d.fitness.type === 'HIIT'
  },
  {
    id: 'fitness-legend', name: 'Fitness Legend', icon: '🌟',
    desc: 'Log activity for 30 days total', cat: 'fitness', rarity: 'legendary', points: 300,
    condition: d => d.fitnessHistory.length >= 30
  },

  // ── MENTAL WELLNESS ───────────────────────
  {
    id: 'mood-logger', name: 'Mood Logger', icon: '😊',
    desc: 'Log your first mood', cat: 'mental', rarity: 'common', points: 10,
    condition: d => d.moodHistory.length >= 1
  },
  {
    id: 'emotional-explorer', name: 'Emotional Explorer', icon: '🌈',
    desc: 'Log 5 different moods', cat: 'mental', rarity: 'rare', points: 40,
    condition: d => new Set(d.moodHistory.map(m => m.mood)).size >= 5
  },
  {
    id: 'radiant-soul', name: 'Radiant Soul', icon: '🤩',
    desc: 'Log "Radiant" mood 3 times', cat: 'mental', rarity: 'rare', points: 50,
    condition: d => d.moodHistory.filter(m => m.mood === 'Radiant').length >= 3
  },
  {
    id: 'grateful-heart', name: 'Grateful Heart', icon: '🥰',
    desc: 'Log "Grateful" mood 5 times', cat: 'mental', rarity: 'epic', points: 80,
    condition: d => d.moodHistory.filter(m => m.mood === 'Grateful').length >= 5
  },
  {
    id: 'calm-queen', name: 'Calm Queen', icon: '😌',
    desc: 'Log "Calm" mood 7 times', cat: 'mental', rarity: 'epic', points: 90,
    condition: d => d.moodHistory.filter(m => m.mood === 'Calm').length >= 7
  },
  {
    id: 'resilient', name: 'Resilient', icon: '🌿',
    desc: 'Log mood for 14 consecutive days', cat: 'mental', rarity: 'legendary', points: 200,
    condition: d => d.moodHistory.length >= 14
  },
  {
    id: 'breath-master', name: 'Breath Master', icon: '🌬️',
    desc: 'Complete 4 breathing cycles', cat: 'mental', rarity: 'rare', points: 30,
    condition: d => (d.breathCycles || 0) >= 4
  },
  {
    id: 'mindful-warrior', name: 'Mindful Warrior', icon: '🧠',
    desc: 'Complete 10 breathing sessions', cat: 'mental', rarity: 'epic', points: 100,
    condition: d => (d.totalBreathSessions || 0) >= 10
  },

  // ── NUTRITION ─────────────────────────────
  {
    id: 'first-meal', name: 'First Bite', icon: '🍽️',
    desc: 'Log your first meal', cat: 'nutrition', rarity: 'common', points: 10,
    condition: d => !!(d.meals.breakfast || d.meals.lunch || d.meals.dinner)
  },
  {
    id: 'full-day', name: 'Full Day Nourished', icon: '🥗',
    desc: 'Log all 3 meals in one day', cat: 'nutrition', rarity: 'rare', points: 40,
    condition: d => !!(d.meals.breakfast && d.meals.lunch && d.meals.dinner)
  },
  {
    id: 'hydration-hero', name: 'Hydration Hero', icon: '💧',
    desc: 'Drink 8 glasses of water', cat: 'nutrition', rarity: 'rare', points: 35,
    condition: d => (d.water || 0) >= 8
  },
  {
    id: 'super-hydrated', name: 'Super Hydrated', icon: '🌊',
    desc: 'Drink 10+ glasses of water', cat: 'nutrition', rarity: 'epic', points: 70,
    condition: d => (d.water || 0) >= 10
  },
  {
    id: 'snack-smart', name: 'Snack Smart', icon: '🍎',
    desc: 'Log a healthy snack', cat: 'nutrition', rarity: 'common', points: 15,
    condition: d => !!d.meals.snacks
  },
  {
    id: 'nutrition-queen', name: 'Nutrition Queen', icon: '👸',
    desc: 'Log all meals for 7 days', cat: 'nutrition', rarity: 'legendary', points: 250,
    condition: d => d.fullMealDays >= 7
  },

  // ── STREAKS ───────────────────────────────
  {
    id: 'streak-3', name: '3-Day Streak', icon: '🔥',
    desc: 'Log activity 3 days in a row', cat: 'streak', rarity: 'common', points: 30,
    condition: d => (d.streak || 0) >= 3
  },
  {
    id: 'streak-7', name: 'Week Warrior', icon: '🗓️',
    desc: 'Log activity 7 days in a row', cat: 'streak', rarity: 'rare', points: 75,
    condition: d => (d.streak || 0) >= 7
  },
  {
    id: 'streak-14', name: 'Fortnight Force', icon: '⚡',
    desc: 'Log activity 14 days in a row', cat: 'streak', rarity: 'epic', points: 150,
    condition: d => (d.streak || 0) >= 14
  },
  {
    id: 'streak-30', name: 'Monthly Maven', icon: '🌙',
    desc: 'Log activity 30 days in a row', cat: 'streak', rarity: 'legendary', points: 400,
    condition: d => (d.streak || 0) >= 30
  },
  {
    id: 'comeback-queen', name: 'Comeback Queen', icon: '💫',
    desc: 'Return after a 3+ day break', cat: 'streak', rarity: 'rare', points: 50,
    condition: d => (d.comebackCount || 0) >= 1
  },

  // ── SPECIAL ───────────────────────────────
  {
    id: 'early-bird', name: 'Early Bird', icon: '🌅',
    desc: 'Log activity before 8 AM', cat: 'special', rarity: 'rare', points: 40,
    condition: d => (d.earlyLogs || 0) >= 1
  },
  {
    id: 'night-owl', name: 'Night Owl', icon: '🦉',
    desc: 'Log mood after 10 PM', cat: 'special', rarity: 'rare', points: 35,
    condition: d => (d.nightLogs || 0) >= 1
  },
  {
    id: 'perfect-score', name: 'Perfect Score', icon: '💯',
    desc: 'Achieve a wellness score of 90+', cat: 'special', rarity: 'epic', points: 120,
    condition: d => (d.maxScore || 0) >= 90
  },
  {
    id: 'bloom-legend', name: 'Bloom Legend', icon: '🌸',
    desc: 'Earn 1000 total points', cat: 'special', rarity: 'legendary', points: 500,
    condition: d => (d.totalPoints || 0) >= 1000
  },
  {
    id: 'ai-explorer', name: 'AI Explorer', icon: '🤖',
    desc: 'Send your first AI Coach message', cat: 'special', rarity: 'common', points: 20,
    condition: d => (d.aiMessages || 0) >= 1
  },
  {
    id: 'feedback-giver', name: 'Voice of Bloom', icon: '💬',
    desc: 'Submit your first feedback', cat: 'special', rarity: 'common', points: 25,
    condition: d => (d.feedbackCount || 0) >= 1
  }
];

// =============================================
// LEVELS DEFINITION
// =============================================
const LEVELS = [
  { level: 1,  title: 'Seedling 🌱',      min: 0    },
  { level: 2,  title: 'Sprout 🌿',         min: 100  },
  { level: 3,  title: 'Blossom 🌸',        min: 250  },
  { level: 4,  title: 'Bloom 🌺',          min: 500  },
  { level: 5,  title: 'Radiant 🌟',        min: 900  },
  { level: 6,  title: 'Goddess 👸',        min: 1400 },
  { level: 7,  title: 'Champion 🏆',       min: 2000 },
  { level: 8,  title: 'Legend 💫',         min: 3000 },
  { level: 9,  title: 'Immortal 🌙',       min: 4500 },
  { level: 10, title: 'Bloom Legend 🌸✨', min: 6500 }
];

// =============================================
// BUILD DATA SNAPSHOT for condition checks
// =============================================
function buildAchievementData() {
  const fitness      = load('fitness', {});
  const fitnessHist  = load('fitnessHistory', []);
  const moodHistory  = load('moodHistory', []);
  const meals        = load('meals', {});
  const water        = load('water', 0);
  const streak       = load('streak', 0);
  const totalPoints  = load('totalPoints', 0);
  const maxScore     = load('maxScore', 0);
  const aiMessages   = load('aiMessages', 0);
  const feedbackCount = load('feedbackEntries', []).length;
  const breathCycles = load('totalBreathCycles', 0);
  const totalBreathSessions = load('totalBreathSessions', 0);
  const earlyLogs    = load('earlyLogs', 0);
  const nightLogs    = load('nightLogs', 0);
  const comebackCount = load('comebackCount', 0);

  // Total steps across all history
  const totalSteps = fitnessHist.reduce((s, e) => s + (parseInt(e.steps) || 0), 0);

  // Days with all 3 meals logged
  const fullMealDays = load('fullMealDays', 0);

  return {
    fitness, fitnessHistory: fitnessHist,
    moodHistory, meals, water, streak,
    totalPoints, maxScore, aiMessages, feedbackCount,
    breathCycles, totalBreathSessions,
    earlyLogs, nightLogs, comebackCount,
    totalSteps, fullMealDays
  };
}

// =============================================
// CHECK & AWARD BADGES
// =============================================
function checkBadges(silent = false) {
  const data    = buildAchievementData();
  const earned  = load('earnedBadges', []);
  const newOnes = [];

  BADGES.forEach(badge => {
    if (earned.includes(badge.id)) return; // already earned
    try {
      if (badge.condition(data)) {
        earned.push(badge.id);
        newOnes.push(badge);
        awardPoints(badge.points, `Earned badge: ${badge.name}`);
      }
    } catch { /* skip if data missing */ }
  });

  if (newOnes.length) {
    save('earnedBadges', earned);
    if (!silent) {
      // Show toast for each new badge (staggered)
      newOnes.forEach((badge, i) => {
        setTimeout(() => showAchievementToast(badge), i * 1800);
      });
    }
  }

  renderBadgesGrid();
  renderAchievementStats();
  return newOnes;
}

// =============================================
// POINTS SYSTEM
// =============================================
function awardPoints(pts, reason = '') {
  const current = load('totalPoints', 0);
  const newTotal = current + pts;
  save('totalPoints', newTotal);

  // Track max score
  const score = calculateScore ? calculateScore() : 0;
  if (score > load('maxScore', 0)) save('maxScore', score);

  // Add to points history
  const hist = load('pointsHistory', []);
  hist.unshift({
    pts, reason,
    date: new Date().toLocaleDateString('en-US', { month:'short', day:'numeric' }),
    time: new Date().toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' })
  });
  if (hist.length > 50) hist.pop();
  save('pointsHistory', hist);

  renderPointsHistory();
  renderAchievementStats();
  updateLevelProgress();
}

function getLevel(points) {
  let current = LEVELS[0];
  for (const lvl of LEVELS) {
    if (points >= lvl.min) current = lvl;
    else break;
  }
  return current;
}

function getNextLevel(points) {
  for (const lvl of LEVELS) {
    if (points < lvl.min) return lvl;
  }
  return null;
}

// =============================================
// RENDER BADGES GRID
// =============================================
function renderBadgesGrid(filter = 'all') {
  const grid   = document.getElementById('badges-grid');
  if (!grid) return;
  const earned = load('earnedBadges', []);
  const data   = buildAchievementData();

  const filtered = filter === 'all'    ? BADGES :
                   filter === 'earned' ? BADGES.filter(b => earned.includes(b.id)) :
                   BADGES.filter(b => b.cat === filter);

  if (!filtered.length) {
    grid.innerHTML = `<div class="empty-state-enhanced" style="grid-column:1/-1">
      <div class="ese-icon">🔍</div>
      <div class="ese-title">No badges in this category yet</div>
      <div class="ese-desc">Keep logging your wellness data to unlock badges!</div>
    </div>`;
    return;
  }

  grid.innerHTML = filtered.map(badge => {
    const isEarned = earned.includes(badge.id);
    let progress = 0, progressLabel = '';

    // Calculate progress for locked badges
    if (!isEarned) {
      try {
        // Simple progress estimation
        if (badge.id === 'step-queen')      { progress = Math.min(100, ((data.fitness.steps||0)/10000)*100); progressLabel = `${data.fitness.steps||0}/10,000 steps`; }
        else if (badge.id === 'streak-7')   { progress = Math.min(100, ((data.streak||0)/7)*100); progressLabel = `${data.streak||0}/7 days`; }
        else if (badge.id === 'streak-14')  { progress = Math.min(100, ((data.streak||0)/14)*100); progressLabel = `${data.streak||0}/14 days`; }
        else if (badge.id === 'streak-30')  { progress = Math.min(100, ((data.streak||0)/30)*100); progressLabel = `${data.streak||0}/30 days`; }
        else if (badge.id === 'resilient')  { progress = Math.min(100, (data.moodHistory.length/14)*100); progressLabel = `${data.moodHistory.length}/14 days`; }
        else if (badge.id === 'marathon-walker') { progress = Math.min(100, (data.totalSteps/50000)*100); progressLabel = `${data.totalSteps.toLocaleString()}/50,000`; }
        else if (badge.id === 'bloom-legend')    { progress = Math.min(100, ((data.totalPoints||0)/1000)*100); progressLabel = `${data.totalPoints||0}/1,000 pts`; }
        else if (badge.id === 'fitness-legend')  { progress = Math.min(100, (data.fitnessHistory.length/30)*100); progressLabel = `${data.fitnessHistory.length}/30 days`; }
        else if (badge.id === 'nutrition-queen') { progress = Math.min(100, ((data.fullMealDays||0)/7)*100); progressLabel = `${data.fullMealDays||0}/7 days`; }
        else if (badge.id === 'emotional-explorer') { progress = Math.min(100, (new Set(data.moodHistory.map(m=>m.mood)).size/5)*100); progressLabel = `${new Set(data.moodHistory.map(m=>m.mood)).size}/5 moods`; }
      } catch {}
    }

    const rarityColors = { common:'#166534,#f0fdf4', rare:'#1d4ed8,#eff6ff', epic:'#7c3aed,#ede9fe', legendary:'#92400e,#fef9c3' };
    const [rc, rbg] = (rarityColors[badge.rarity] || '').split(',');

    return `
    <div class="badge-card badge-cat-${badge.cat} ${isEarned ? '' : 'locked'} ${badge.rarity === 'legendary' ? 'legendary-card' : ''}"
         onclick="showBadgeDetail('${badge.id}')"
         title="${badge.name}: ${badge.desc}">
      <span class="badge-rarity" style="color:${rc};background:${rbg}">${badge.rarity}</span>
      <div class="badge-icon-wrap">
        <span class="badge-icon">${badge.icon}</span>
        <div class="badge-shine"></div>
        ${!isEarned ? '<div class="badge-lock">🔒</div>' : ''}
      </div>
      <div class="badge-name">${badge.name}</div>
      <div class="badge-desc">${badge.desc}</div>
      ${isEarned
        ? `<div class="badge-earned-date">✅ Earned! +${badge.points}pts</div>`
        : progress > 0
          ? `<div class="badge-progress-mini"><div class="badge-progress-fill" style="width:${progress}%"></div></div>
             <div class="badge-progress-label">${progressLabel}</div>`
          : `<div class="badge-progress-label">${badge.points} pts reward</div>`
      }
    </div>`;
  }).join('');
}

function filterBadges(cat, btn) {
  document.querySelectorAll('.ach-filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderBadgesGrid(cat);
}

// =============================================
// BADGE DETAIL MODAL (simple alert for now)
// =============================================
function showBadgeDetail(id) {
  const badge  = BADGES.find(b => b.id === id);
  if (!badge) return;
  const earned = load('earnedBadges', []).includes(id);
  const status = earned ? '✅ You\'ve earned this badge!' : '🔒 Not yet earned — keep going!';
  // Could be replaced with a proper modal
  alert(`${badge.icon} ${badge.name}\n\n${badge.desc}\n\nRarity: ${badge.rarity}\nPoints: +${badge.points}\n\n${status}`);
}

// =============================================
// ACHIEVEMENT STATS
// =============================================
function renderAchievementStats() {
  const earned = load('earnedBadges', []);
  const points = load('totalPoints', 0);
  const streak = load('streak', 0);
  const level  = getLevel(points);

  const el = id => document.getElementById(id);
  if (el('total-points'))      el('total-points').textContent      = points.toLocaleString();
  if (el('badges-earned'))     el('badges-earned').textContent     = earned.length;
  if (el('current-level'))     el('current-level').textContent     = level.level;
  if (el('current-streak-ach'))el('current-streak-ach').textContent = streak;

  updateLevelProgress();
}

function updateLevelProgress() {
  const points  = load('totalPoints', 0);
  const current = getLevel(points);
  const next    = getNextLevel(points);
  const el      = id => document.getElementById(id);

  if (el('lpc-level-label')) el('lpc-level-label').textContent = `Level ${current.level} — ${current.title}`;
  if (el('lpc-next-label'))  el('lpc-next-label').textContent  = next ? `Next: Level ${next.level}` : 'Max Level!';

  const pct = next
    ? Math.min(100, ((points - current.min) / (next.min - current.min)) * 100)
    : 100;

  const fill = el('lpc-fill');
  if (fill) fill.style.width = pct + '%';

  if (el('lpc-current-pts')) el('lpc-current-pts').textContent = `${points.toLocaleString()} pts`;
  if (el('lpc-next-pts'))    el('lpc-next-pts').textContent    = next
    ? `${(next.min - points).toLocaleString()} pts to Level ${next.level}`
    : '🎉 Maximum level reached!';
}

// =============================================
// POINTS HISTORY
// =============================================
function renderPointsHistory() {
  const hist = load('pointsHistory', []);
  const el   = document.getElementById('points-history');
  if (!el) return;
  if (!hist.length) { el.innerHTML = '<p class="empty-hint">Start logging to earn points!</p>'; return; }
  el.innerHTML = hist.slice(0, 20).map(h => `
    <div class="ph-item">
      <div class="ph-left">
        <span class="ph-icon">⭐</span>
        <div>
          <div class="ph-action">${h.reason}</div>
          <div class="ph-date">${h.date} · ${h.time || ''}</div>
        </div>
      </div>
      <span class="ph-pts ${h.pts < 0 ? 'negative' : ''}">
        ${h.pts > 0 ? '+' : ''}${h.pts} pts
      </span>
    </div>`).join('');
}

// =============================================
// ACHIEVEMENT TOAST
// =============================================
function showAchievementToast(badge) {
  const toast = document.getElementById('ach-toast');
  if (!toast) return;
  document.getElementById('ach-toast-icon').textContent = badge.icon;
  document.getElementById('ach-toast-name').textContent = badge.name;
  document.getElementById('ach-toast-desc').textContent = `+${badge.points} pts — ${badge.desc}`;
  toast.classList.remove('hidden', 'hiding');
  // Ring the bell in navbar if present
  const bell = document.querySelector('.notif-pulse');
  if (bell) bell.classList.add('bell-ring');
  setTimeout(() => {
    toast.classList.add('hiding');
    setTimeout(() => toast.classList.add('hidden'), 400);
  }, 4000);
}

// =============================================
// DAILY POINTS — award on key actions
// =============================================
function awardDailyPoints() {
  const today   = new Date().toISOString().split('T')[0];
  const lastDay = load('lastPointsDay', '');
  if (lastDay === today) return; // already awarded today
  save('lastPointsDay', today);
  awardPoints(5, 'Daily login bonus');
}

// =============================================
// TRACK AI MESSAGES
// =============================================
function trackAIMessage() {
  const count = load('aiMessages', 0) + 1;
  save('aiMessages', count);
  if (count === 1) awardPoints(20, 'First AI Coach message');
  checkBadges();
}

// =============================================
// TRACK BREATH SESSIONS
// =============================================
function trackBreathSession() {
  const sessions = load('totalBreathSessions', 0) + 1;
  save('totalBreathSessions', sessions);
  const cycles = load('totalBreathCycles', 0) + 4;
  save('totalBreathCycles', cycles);
  awardPoints(10, 'Completed breathing exercise');
  checkBadges();
}

// =============================================
// INIT ACHIEVEMENTS
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  awardDailyPoints();
  checkBadges(true); // silent on load
  renderBadgesGrid();
  renderAchievementStats();
  renderPointsHistory();
});
const fs = require('fs');
let c = fs.readFileSync('style.css', 'utf8');

const oldStr = '.chc-task.done .chc-task-check{background:linear-gradient(135deg,var(--pink),var(--purple));bor\r\nder-color:transparent;color:#fff}\r\n';

const newStr = `.chc-task.done .chc-task-check{background:linear-gradient(135deg,var(--pink),var(--purple));border-color:transparent;color:#fff}
.chc-task-text{flex:1}
.chc-task-label{font-size:0.88rem;font-weight:600;color:var(--text);display:block}
.chc-task-pts{font-size:0.72rem;color:var(--text-s)}
.chc-task.done .chc-task-label{text-decoration:line-through;color:var(--text-s)}

.chc-progress-wrap{margin-bottom:1.5rem}
.chc-progress-label{display:flex;justify-content:space-between;font-size:0.82rem;color:var(--text-m);margin-bottom:0.5rem}
.chc-progress-bar{height:12px;background:var(--border);border-radius:999px;overflow:hidden}
.chc-progress-fill{height:100%;border-radius:999px;background:linear-gradient(90deg,var(--pink),var(--purple));transition:width 0.8s cubic-bezier(0.4,0,0.2,1)}

.chc-points-display{display:flex;align-items:center;justify-content:center;gap:0.5rem;padding:1rem;background:linear-gradient(135deg,rgba(249,168,212,0.1),rgba(221,214,254,0.1));border-radius:var(--r-sm);border:1px solid var(--pink-l);margin-bottom:1rem}
.chc-pts-num{font-size:2rem;font-weight:900;background:linear-gradient(135deg,var(--pink),var(--purple));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.chc-pts-label{font-size:0.82rem;color:var(--text-m)}

/* Past challenges */
.past-challenge-item{display:flex;align-items:center;gap:0.85rem;padding:0.75rem;background:var(--bg-alt);border-radius:var(--r-sm);border:1px solid var(--border);margin-bottom:0.5rem}
.pci-icon{font-size:1.5rem;flex-shrink:0}
.pci-name{font-size:0.85rem;font-weight:700;color:var(--text)}
.pci-result{font-size:0.75rem;color:var(--text-m)}
.pci-badge{margin-left:auto;font-size:0.72rem;font-weight:700;padding:0.2rem 0.6rem;border-radius:20px;background:linear-gradient(135deg,var(--pink),var(--purple));color:#fff}

/* =============================================
   CALENDAR VIEW
   ============================================= */
.calendar-wrap{background:var(--bg-card);border-radius:var(--r-lg);overflow:hidden;box-shadow:0 4px 24px var(--shadow);border:1px solid var(--border)}
.cal-header{display:flex;align-items:center;justify-content:space-between;padding:1.25rem 1.5rem;border-bottom:1px solid var(--border);background:linear-gradient(135deg,rgba(249,168,212,0.08),rgba(221,214,254,0.08))}
.cal-title{font-size:1.1rem;font-weight:700;color:var(--text)}
.cal-nav{display:flex;gap:0.5rem}
.cal-nav-btn{width:34px;height:34px;border-radius:50%;border:1.5px solid var(--border);background:var(--bg);color:var(--text-m);display:flex;align-items:center;justify-content:center;font-size:0.85rem;cursor:pointer;transition:all var(--t)}
.cal-nav-btn:hover{border-color:var(--pink);color:var(--pink);background:var(--rose-l)}
.cal-today-btn{padding:0.35rem 0.85rem;border-radius:20px;border:1.5px solid var(--border);background:var(--bg);color:var(--text-m);font-size:0.78rem;font-weight:600;cursor:pointer;transition:all var(--t)}
.cal-today-btn:hover{border-color:var(--pink);color:var(--pink)}

.cal-grid{display:grid;grid-template-columns:repeat(7,1fr)}
.cal-day-header{padding:0.6rem;text-align:center;font-size:0.72rem;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-s);border-bottom:1px solid var(--border)}
.cal-day{min-height:80px;padding:0.5rem;border-right:1px solid var(--border);border-bottom:1px solid var(--border);cursor:pointer;transition:background var(--t);position:relative}
.cal-day:nth-child(7n){border-right:none}
.cal-day:hover{background:var(--bg-alt)}
.cal-day.other-month{opacity:0.35}
.cal-day.today .cal-day-num{background:linear-gradient(135deg,var(--pink),var(--purple));color:#fff;border-radius:50%;width:26px;height:26px;display:flex;align-items:center;justify-content:center}
.cal-day.has-data{background:linear-gradient(135deg,rgba(249,168,212,0.06),rgba(221,214,254,0.06))}
.cal-day-num{font-size:0.82rem;font-weight:600;color:var(--text);margin-bottom:0.3rem;width:26px;height:26px;display:flex;align-items:center;justify-content:center}
.cal-day-dots{display:flex;gap:2px;flex-wrap:wrap}
.cal-dot{width:6px;height:6px;border-radius:50%}
.cal-dot-steps{background:#ec4899}
.cal-dot-mood{background:#a855f7}
.cal-dot-water{background:#60a5fa}
.cal-dot-meal{background:#10b981}

.cal-detail-panel{padding:1.5rem;border-top:1px solid var(--border);background:var(--bg-alt);min-height:120px}
.cdp-date{font-size:0.82rem;font-weight:700;color:var(--pink);margin-bottom:0.75rem}
.cdp-items{display:flex;flex-direction:column;gap:0.4rem}
.cdp-item{display:flex;align-items:center;gap:0.6rem;font-size:0.85rem;color:var(--text-m)}
.cdp-item-icon{font-size:1rem;flex-shrink:0}
.cdp-empty{font-size:0.85rem;color:var(--text-s);font-style:italic}

/* =============================================
   BROWSER NOTIFICATIONS
   ============================================= */
.notif-section{}
.notif-layout{display:grid;grid-template-columns:1fr 1fr;gap:1.5rem}
.notif-status-card{border-left:4px solid var(--pink)}
.notif-status-row{display:flex;align-items:center;justify-content:space-between;padding:0.85rem 1rem;background:var(--bg-alt);border-radius:var(--r-sm);border:1px solid var(--border);margin-bottom:0.75rem}
.nsr-left{display:flex;align-items:center;gap:0.75rem}
.nsr-icon{font-size:1.3rem}
.nsr-label{font-size:0.88rem;font-weight:600;color:var(--text)}
.nsr-sub{font-size:0.75rem;color:var(--text-s)}
.toggle-switch{position:relative;width:44px;height:24px;flex-shrink:0}
.toggle-switch input{opacity:0;width:0;height:0}
.toggle-slider{position:absolute;inset:0;background:var(--border);border-radius:999px;cursor:pointer;transition:all var(--t)}
.toggle-slider::before{content:'';position:absolute;width:18px;height:18px;left:3px;top:3px;background:#fff;border-radius:50%;transition:all var(--t)}
.toggle-switch input:checked + .toggle-slider{background:linear-gradient(135deg,var(--pink),var(--purple))}
.toggle-switch input:checked + .toggle-slider::before{transform:translateX(20px)}

.notif-schedule{display:flex;flex-direction:column;gap:0.6rem}
.ns-item{display:flex;align-items:center;gap:0.75rem;padding:0.75rem 1rem;background:var(--bg-alt);border-radius:var(--r-sm);border:1px solid var(--border)}
.ns-time{font-size:0.82rem;font-weight:700;color:var(--pink);min-width:50px}
.ns-label{font-size:0.85rem;color:var(--text);flex:1}
.ns-remove{background:none;border:none;color:var(--text-s);cursor:pointer;font-size:0.85rem;padding:0.2rem;border-radius:4px;transition:all var(--t)}
.ns-remove:hover{color:var(--rose);background:var(--rose-l)}

.notif-history{display:flex;flex-direction:column;gap:0.5rem;max-height:280px;overflow-y:auto}
.nh-item{display:flex;align-items:flex-start;gap:0.75rem;padding:0.75rem;background:var(--bg-alt);border-radius:var(--r-sm);border:1px solid var(--border);font-size:0.85rem}
.nh-icon{font-size:1.1rem;flex-shrink:0}
.nh-text{flex:1;color:var(--text-m);line-height:1.5}
.nh-time{font-size:0.72rem;color:var(--text-s);white-space:nowrap}
.nh-item.unread{background:linear-gradient(135deg,rgba(249,168,212,0.08),rgba(221,214,254,0.08));border-color:var(--pink-l)}

/* =============================================
   ACHIEVEMENTS & BADGES
   ============================================= */
.achievements-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:1.5rem}
.badge-card{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--r-lg);padding:1.5rem;text-align:center;transition:all var(--t);position:relative;overflow:hidden}
.badge-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--bc-grad,linear-gradient(90deg,var(--pink),var(--purple)))}
.badge-card:hover{transform:translateY(-4px);box-shadow:0 12px 32px var(--shadow-lg)}
.badge-card.locked{opacity:0.45;filter:grayscale(0.6)}
.badge-card.unlocked{box-shadow:0 4px 20px var(--shadow)}
.badge-card.new-unlock{animation:badgeUnlock 0.6s cubic-bezier(0.34,1.56,0.64,1)}
@keyframes badgeUnlock{0%{transform:scale(0.5);opacity:0}60%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
.badge-emoji{font-size:2.5rem;margin-bottom:0.6rem;display:block}
.badge-card.locked .badge-emoji{filter:grayscale(1)}
.badge-name{font-size:0.85rem;font-weight:700;color:var(--text);margin-bottom:0.25rem}
.badge-desc{font-size:0.72rem;color:var(--text-m);line-height:1.5}
.badge-lock{font-size:0.7rem;color:var(--text-s);margin-top:0.4rem}
.badge-new{position:absolute;top:0.5rem;right:0.5rem;background:linear-gradient(135deg,var(--pink),var(--purple));color:#fff;font-size:0.6rem;font-weight:700;padding:0.15rem 0.45rem;border-radius:20px;text-transform:uppercase;letter-spacing:0.05em}

.achievement-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:1.5rem}
.ach-stat{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--r);padding:1.25rem;text-align:center;box-shadow:0 2px 12px var(--shadow)}
.ach-stat-num{font-size:2rem;font-weight:900;background:linear-gradient(135deg,var(--pink),var(--purple));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
.ach-stat-label{font-size:0.78rem;color:var(--text-m);margin-top:0.2rem}

.leaderboard-list{display:flex;flex-direction:column;gap:0.5rem}
.lb-item{display:flex;align-items:center;gap:0.85rem;padding:0.75rem 1rem;background:var(--bg-alt);border-radius:var(--r-sm);border:1px solid var(--border);transition:all var(--t)}
.lb-item:hover{border-color:var(--pink-l)}
.lb-item.you{background:linear-gradient(135deg,rgba(249,168,212,0.1),rgba(221,214,254,0.1));border-color:var(--pink)}
.lb-rank{font-size:1rem;font-weight:900;color:var(--text-s);min-width:28px}
.lb-rank.gold{color:#f59e0b}
.lb-rank.silver{color:#94a3b8}
.lb-rank.bronze{color:#b45309}
.lb-avatar{font-size:1.4rem;flex-shrink:0}
.lb-name{font-size:0.88rem;font-weight:700;color:var(--text);flex:1}
.lb-score{font-size:0.85rem;font-weight:700;color:var(--pink)}
.lb-you-tag{font-size:0.68rem;font-weight:700;background:var(--pink);color:#fff;padding:0.1rem 0.4rem;border-radius:20px;margin-left:0.4rem}

/* Toast notification */
.toast-container{position:fixed;bottom:5rem;right:1.5rem;z-index:9000;display:flex;flex-direction:column;gap:0.5rem;pointer-events:none}
.toast{background:var(--bg-card);border:1px solid var(--border);border-radius:var(--r);padding:0.85rem 1.1rem;box-shadow:0 8px 24px var(--shadow-lg);display:flex;align-items:center;gap:0.75rem;font-size:0.88rem;color:var(--text);min-width:260px;max-width:340px;pointer-events:all;animation:toastIn 0.4s cubic-bezier(0.34,1.56,0.64,1)}
@keyframes toastIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
.toast.removing{animation:toastOut 0.3s ease forwards}
@keyframes toastOut{to{opacity:0;transform:translateX(40px)}}
.toast-icon{font-size:1.2rem;flex-shrink:0}
.toast-msg{flex:1;line-height:1.4}
.toast-close{background:none;border:none;color:var(--text-s);cursor:pointer;font-size:0.85rem;padding:0.1rem;flex-shrink:0}
.toast.success{border-left:4px solid #10b981}
.toast.info{border-left:4px solid var(--pink)}
.toast.warning{border-left:4px solid #f59e0b}

/* Responsive for new sections */
@media(max-width:1024px){
  .challenge-layout{grid-template-columns:1fr}
  .challenge-sidebar{position:static}
  .notif-layout{grid-template-columns:1fr}
  .achievements-grid{grid-template-columns:repeat(3,1fr)}
}
@media(max-width:768px){
  .achievements-grid{grid-template-columns:repeat(2,1fr)}
  .achievement-stats{grid-template-columns:1fr 1fr}
  .cal-day{min-height:60px;padding:0.35rem}
  .cal-day-num{font-size:0.75rem}
}
@media(max-width:480px){
  .achievements-grid{grid-template-columns:repeat(2,1fr)}
  .achievement-stats{grid-template-columns:1fr}
  .cal-grid{font-size:0.75rem}
  .cal-day{min-height:48px;padding:0.25rem}
}
`;

if (c.includes(oldStr)) {
  const updated = c.replace(oldStr, newStr);
  fs.writeFileSync('style.css', updated, 'utf8');
  console.log('SUCCESS');
} else {
  // Try with just \n
  const oldStr2 = '.chc-task.done .chc-task-check{background:linear-gradient(135deg,var(--pink),var(--purple));bor\nder-color:transparent;color:#fff}\n';
  if (c.includes(oldStr2)) {
    const updated = c.replace(oldStr2, newStr);
    fs.writeFileSync('style.css', updated, 'utf8');
    console.log('SUCCESS with LF');
  } else {
    // Find the chc-task-check area and show full content
    const idx2 = c.indexOf('chc-task-check{width');
    console.log('chc-task-check idx:', idx2);
    if (idx2 >= 0) {
      const snippet = c.slice(idx2, idx2 + 300);
      console.log('Snippet:', JSON.stringify(snippet));
    }
  }
}
/**
 * BLOOM — Profile Page Script (profile.js)
 * Handles user profile display, settings, and authentication
 */

// =============================================
// AUTH CHECK - REDIRECT IF NOT LOGGED IN
// =============================================
function checkAuthAndInit() {
  const session = lsGet('bloom_session', null);
  
  if (!session || (session.isGuest && !session.userId)) {
    // Not logged in or guest — redirect to login
    window.location.href = 'login.html';
    return false;
  }
  
  initProfilePage();
  return true;
}

// =============================================
// INITIALIZE PROFILE PAGE
// =============================================
function initProfilePage() {
  const session = lsGet('bloom_session', {});
  updateProfileHeader(session);
  updateProfileInfo(session);
  loadProfileStats();
  loadRecentActivity();
  initDarkMode();
}

// =============================================
// UPDATE PROFILE HEADER
// =============================================
function updateProfileHeader(session) {
  const name = session.name || 'Guest User';
  const email = session.email || 'guest@example.com';
  const ageGroup = session.ageGroup || 'Not specified';
  const goal = session.goal || 'No goal set';
  
  document.getElementById('profile-name').textContent = name;
  document.getElementById('profile-email').textContent = email;
  document.getElementById('profile-age').textContent = ageGroup;
  document.getElementById('profile-goal').textContent = goal;
  
  // Format joined date
  const joinDate = new Date(session.loginTime);
  const today = new Date();
  const daysAgo = Math.floor((today - joinDate) / (1000 * 60 * 60 * 24));
  
  if (daysAgo === 0) {
    document.getElementById('profile-joined').textContent = 'today';
  } else if (daysAgo === 1) {
    document.getElementById('profile-joined').textContent = 'yesterday';
  } else if (daysAgo < 7) {
    document.getElementById('profile-joined').textContent = daysAgo + ' days ago';
  } else {
    document.getElementById('profile-joined').textContent = joinDate.toLocaleDateString();
  }
  
  // Load avatar if exists
  const avatar = lsGet('profile_avatar_' + session.userId, null);
  if (avatar) {
    const placeholder = document.querySelector('.profile-avatar-placeholder');
    placeholder.innerHTML = `<img src="${avatar}" alt="Profile" style="width:100%; height:100%; border-radius:50%; object-fit:cover;"/>`;
  }
}

// =============================================
// UPDATE PROFILE INFO SECTION
// =============================================
function updateProfileInfo(session) {
  document.getElementById('info-name').textContent = session.name || '—';
  document.getElementById('info-email').textContent = session.email || '—';
  document.getElementById('info-age').textContent = session.ageGroup || '—';
  document.getElementById('info-goal').textContent = session.goal || '—';
  
  // Format joined date
  const joinDate = new Date(session.loginTime);
  document.getElementById('info-joined').textContent = joinDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Last login
  const lastLogin = new Date(session.loginTime);
  document.getElementById('info-lastlogin').textContent = lastLogin.toLocaleString();
}

// =============================================
// LOAD PROFILE STATS
// =============================================
function loadProfileStats() {
  // Get data from localStorage
  const fitness = lsGet('fitness', {});
  const totalLogs = (lsGet('fitnessHistory', []) || []).length;
  const badgesEarned = lsGet('badges_earned', []).length;
  const currentStreak = lsGet('current_streak', 0);
  const totalPoints = lsGet('total_points', 0);
  
  document.getElementById('stat-logs').textContent = totalLogs;
  document.getElementById('stat-badges').textContent = badgesEarned;
  document.getElementById('stat-streak').textContent = currentStreak;
  document.getElementById('stat-points').textContent = totalPoints;
}

// =============================================
// LOAD RECENT ACTIVITY
// =============================================
function loadRecentActivity() {
  const activityList = document.getElementById('activity-list');
  const fitnessHistory = lsGet('fitnessHistory', []);
  const moodHistory = lsGet('mood_log', []);
  
  // Combine and sort recent activities
  const activities = [];
  
  fitnessHistory.forEach(entry => {
    activities.push({
      type: 'fitness',
      icon: '🏃',
      action: `Logged ${entry.type} workout`,
      detail: `${entry.workoutTime} min, ${entry.calories} cal burned`,
      date: new Date(entry.date)
    });
  });
  
  moodHistory.forEach(entry => {
    activities.push({
      type: 'mood',
      icon: '😊',
      action: 'Logged mood',
      detail: entry.mood,
      date: new Date(entry.date)
    });
  });
  
  activities.sort((a, b) => b.date - a.date);
  const recent = activities.slice(0, 10);
  
  if (recent.length === 0) {
    activityList.innerHTML = '<p class="empty-state">No activity yet. Start tracking to see your activity here!</p>';
    return;
  }
  
  activityList.innerHTML = recent.map(a => `
    <div class="activity-item">
      <div class="activity-icon">${a.icon}</div>
      <div class="activity-content">
        <div class="activity-action">${a.action}</div>
        <div class="activity-detail">${a.detail}</div>
      </div>
      <div class="activity-time">${formatTimeAgo(a.date)}</div>
    </div>
  `).join('');
}

// =============================================
// FORMAT TIME AGO
// =============================================
function formatTimeAgo(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (seconds < 60) return 'just now';
  if (minutes < 60) return minutes + 'm ago';
  if (hours < 24) return hours + 'h ago';
  if (days < 7) return days + 'd ago';
  
  return date.toLocaleDateString();
}

// =============================================
// PROFILE TAB NAVIGATION
// =============================================
function showProfileTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.profile-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Remove active class from buttons
  document.querySelectorAll('.sidebar-item').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Show selected tab
  const tab = document.getElementById('tab-' + tabName);
  if (tab) tab.classList.add('active');
  
  // Mark button as active
  event.target.closest('.sidebar-item').classList.add('active');
}

// =============================================
// AVATAR UPLOAD
// =============================================
function triggerAvatarUpload() {
  document.getElementById('avatar-file').click();
}

function handleAvatarUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    const imageData = e.target.result;
    const session = lsGet('bloom_session', {});
    
    // Save avatar to localStorage
    lsSet('profile_avatar_' + session.userId, imageData);
    
    // Update avatar display
    const placeholder = document.querySelector('.profile-avatar-placeholder');
    placeholder.innerHTML = `<img src="${imageData}" alt="Profile" style="width:100%; height:100%; border-radius:50%; object-fit:cover;"/>`;
    
    showNotification('Profile picture updated!', 'success');
  };
  reader.readAsDataURL(file);
}

// =============================================
// CHANGE PASSWORD
// =============================================
function showChangePasswordModal() {
  document.getElementById('change-password-modal').classList.remove('hidden');
}

function closeChangePasswordModal() {
  document.getElementById('change-password-modal').classList.add('hidden');
  document.getElementById('change-password-form').reset();
  document.getElementById('password-error').classList.add('hidden');
  document.getElementById('password-success').classList.add('hidden');
}

function submitChangePassword(event) {
  event.preventDefault();
  
  const currentPw = document.getElementById('current-pw').value;
  const newPw = document.getElementById('new-pw').value;
  const confirmPw = document.getElementById('confirm-pw').value;
  const errorEl = document.getElementById('password-error');
  const successEl = document.getElementById('password-success');
  
  errorEl.classList.add('hidden');
  successEl.classList.add('hidden');
  
  // Validation
  if (newPw !== confirmPw) {
    errorEl.textContent = 'New passwords do not match.';
    errorEl.classList.remove('hidden');
    return;
  }
  
  if (newPw.length < 6) {
    errorEl.textContent = 'New password must be at least 6 characters.';
    errorEl.classList.remove('hidden');
    return;
  }
  
  // Verify current password
  const session = lsGet('bloom_session', {});
  const users = lsGet('bloom_users', []);
  const user = users.find(u => u.id === session.userId);
  
  if (!user || user.passwordHash !== hashPassword(currentPw)) {
    errorEl.textContent = 'Current password is incorrect.';
    errorEl.classList.remove('hidden');
    return;
  }
  
  // Update password
  user.passwordHash = hashPassword(newPw);
  lsSet('bloom_users', users);
  
  successEl.classList.remove('hidden');
  
  setTimeout(() => {
    closeChangePasswordModal();
  }, 2000);
}

// =============================================
// SAVE NOTIFICATION SETTINGS
// =============================================
function saveNotificationSettings() {
  const settings = {
    daily: document.getElementById('notify-daily').checked,
    weekly: document.getElementById('notify-weekly').checked,
    achievements: document.getElementById('notify-achievements').checked
  };
  
  const session = lsGet('bloom_session', {});
  lsSet('notification_prefs_' + session.userId, settings);
  showNotification('Notification settings saved!', 'success');
}

// =============================================
// SAVE PREFERENCES
// =============================================
function savePreferences() {
  const goal = document.getElementById('pref-goal').value;
  
  if (!goal) {
    showNotification('Please select a goal.', 'error');
    return;
  }
  
  const session = lsGet('bloom_session', {});
  session.goal = goal;
  lsSet('bloom_session', session);
  
  // Update user record
  const users = lsGet('bloom_users', []);
  const user = users.find(u => u.id === session.userId);
  if (user) {
    user.goal = goal;
    lsSet('bloom_users', users);
  }
  
  updateProfileHeader(session);
  updateProfileInfo(session);
  showNotification('Preferences updated!', 'success');
}

// =============================================
// SET THEME PREFERENCE
// =============================================
function setThemePreference(theme) {
  const session = lsGet('bloom_session', {});
  lsSet('theme_pref_' + session.userId, theme);
  
  if (theme === 'dark') {
    document.body.classList.add('dark');
  } else if (theme === 'light') {
    document.body.classList.remove('dark');
  }
  
  showNotification('Theme preference updated!', 'success');
}

// =============================================
// LOGOUT FUNCTION
// =============================================
function doLogout() {
  if (!confirm('Are you sure you want to logout?')) return;
  
  // Clear session
  localStorage.removeItem('bloom_session');
  
  // Redirect to home
  window.location.href = 'index.html';
}

// =============================================
// NOTIFICATION HELPER
// =============================================
function showNotification(message, type = 'success') {
  const div = document.createElement('div');
  div.className = `notification notification-${type}`;
  div.innerHTML = `
    <div class="notification-content">
      <i class="fa-solid fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
      <span>${message}</span>
    </div>
  `;
  
  document.body.appendChild(div);
  
  setTimeout(() => {
    div.classList.add('show');
  }, 10);
  
  setTimeout(() => {
    div.classList.remove('show');
    setTimeout(() => div.remove(), 300);
  }, 3000);
}

// =============================================
// DARK MODE (from script.js)
// =============================================
function toggleDark() {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  save('darkMode', isDark);
  document.getElementById('dark-btn').textContent = isDark ? '☀️' : '🌙';
}

function initDarkMode() {
  if (load('darkMode', false)) {
    document.body.classList.add('dark');
    const btn = document.getElementById('dark-btn');
    if (btn) btn.textContent = '☀️';
  }
}

// =============================================
// STORAGE HELPERS (from auth.js)
// =============================================

// =============================================
// INITIALIZE ON PAGE LOAD
// =============================================
window.addEventListener('load', checkAuthAndInit);

// Also handle menu toggle
function toggleMenu() {
  const links = document.getElementById('nav-links');
  const ham = document.querySelector('.hamburger');
  if (!links) return;
  links.classList.toggle('open');
  const spans = ham?.querySelectorAll('span');
  if (spans) {
    const isOpen = links.classList.contains('open');
    if (spans[0]) spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px,5px)' : '';
    if (spans[1]) spans[1].style.opacity = isOpen ? '0' : '1';
    if (spans[2]) spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px,-5px)' : '';
  }
}
// Nutrition Planner JavaScript

// Sample recipes data
const recipes = [
    {
        id: 1,
        name: "Avocado Toast",
        category: "breakfast",
        calories: 320,
        ingredients: ["2 slices whole grain bread", "1 avocado", "1 tomato", "Salt and pepper"]
    },
    {
        id: 2,
        name: "Greek Salad",
        category: "lunch",
        calories: 280,
        ingredients: ["2 cups lettuce", "1 cucumber", "1 tomato", "1/2 cup feta cheese", "Olive oil", "Lemon juice"]
    },
    {
        id: 3,
        name: "Grilled Chicken Stir-Fry",
        category: "dinner",
        calories: 450,
        ingredients: ["4 oz chicken breast", "1 cup broccoli", "1 bell pepper", "1 carrot", "Soy sauce", "Garlic"]
    },
    {
        id: 4,
        name: "Berry Smoothie",
        category: "snacks",
        calories: 180,
        ingredients: ["1 cup mixed berries", "1 banana", "1 cup yogurt", "1 tbsp honey"]
    },
    {
        id: 5,
        name: "Oatmeal with Fruits",
        category: "breakfast",
        calories: 250,
        ingredients: ["1/2 cup oats", "1 apple", "1/2 cup milk", "Cinnamon"]
    },
    {
        id: 6,
        name: "Quinoa Bowl",
        category: "lunch",
        calories: 380,
        ingredients: ["1/2 cup quinoa", "1 cup spinach", "1/2 avocado", "Cherry tomatoes", "Balsamic vinegar"]
    },
    {
        id: 7,
        name: "Salmon with Vegetables",
        category: "dinner",
        calories: 420,
        ingredients: ["4 oz salmon fillet", "1 cup asparagus", "1 sweet potato", "Olive oil", "Herbs"]
    },
    {
        id: 8,
        name: "Yogurt Parfait",
        category: "snacks",
        calories: 220,
        ingredients: ["1 cup Greek yogurt", "1/2 cup granola", "1/2 cup berries", "1 tbsp honey"]
    }
];

// Current selected day
let currentDay = 'monday';

// Load meal plan from localStorage
function loadMealPlan() {
    const plan = JSON.parse(localStorage.getItem('mealPlan') || '{}');
    return plan;
}

// Save meal plan to localStorage
function saveMealPlan(plan) {
    localStorage.setItem('mealPlan', JSON.stringify(plan));
}

// Populate recipe selects
function populateRecipeSelects() {
    const selects = document.querySelectorAll('.recipe-select');
    selects.forEach(select => {
        select.innerHTML = '<option value="">Select Recipe</option>';
        recipes.forEach(recipe => {
            const option = document.createElement('option');
            option.value = recipe.id;
            option.textContent = recipe.name;
            select.appendChild(option);
        });
    });
}

// Update meal plan display
function updateMealPlanDisplay() {
    const plan = loadMealPlan();
    const dayPlan = plan[currentDay] || {};

    document.querySelectorAll('.meal-slot').forEach(slot => {
        const meal = slot.dataset.meal;
        const select = slot.querySelector('.recipe-select');
        if (dayPlan[meal]) {
            select.value = dayPlan[meal];
        } else {
            select.value = '';
        }
    });

    updateCalorieTracker();
}

// Add recipe to meal plan
function addRecipeToPlan(meal, recipeId) {
    const plan = loadMealPlan();
    if (!plan[currentDay]) plan[currentDay] = {};
    plan[currentDay][meal] = recipeId;
    saveMealPlan(plan);
    updateMealPlanDisplay();
}

// Update calorie tracker
function updateCalorieTracker() {
    const plan = loadMealPlan();
    const dayPlan = plan[currentDay] || {};
    let totalCalories = 0;

    Object.values(dayPlan).forEach(recipeId => {
        const recipe = recipes.find(r => r.id == recipeId);
        if (recipe) totalCalories += recipe.calories;
    });

    document.getElementById('total-calories').textContent = totalCalories;
    const goal = parseInt(document.getElementById('calorie-goal').value);
    const progress = document.getElementById('calorie-progress');
    progress.max = goal;
    progress.value = Math.min(totalCalories, goal);
}

// Generate grocery list
function generateGroceryList() {
    const plan = loadMealPlan();
    const ingredients = new Set();

    Object.values(plan).forEach(dayPlan => {
        Object.values(dayPlan).forEach(recipeId => {
            const recipe = recipes.find(r => r.id == recipeId);
            if (recipe) {
                recipe.ingredients.forEach(ing => ingredients.add(ing));
            }
        });
    });

    const listElement = document.getElementById('grocery-items');
    listElement.innerHTML = '';
    ingredients.forEach(ing => {
        const li = document.createElement('li');
        li.textContent = ing;
        listElement.appendChild(li);
    });
}

// Clear grocery list
function clearGroceryList() {
    document.getElementById('grocery-items').innerHTML = '';
}

// Display recipes
function displayRecipes() {
    const grid = document.getElementById('recipes-grid');
    grid.innerHTML = '';

    recipes.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.innerHTML = `
            <h3>${recipe.name}</h3>
            <p>Calories: ${recipe.calories}</p>
            <p>Ingredients: ${recipe.ingredients.join(', ')}</p>
            <button class="add-to-meal-btn" data-recipe-id="${recipe.id}" data-category="${recipe.category}">Add to Meal</button>
        `;
        grid.appendChild(card);
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    populateRecipeSelects();
    updateMealPlanDisplay();
    displayRecipes();

    // Day selector
    document.querySelectorAll('.day-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.day-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentDay = this.dataset.day;
            updateMealPlanDisplay();
        });
    });

    // Add recipe buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-recipe-btn')) {
            const slot = e.target.closest('.meal-slot');
            const meal = slot.dataset.meal;
            const select = slot.querySelector('.recipe-select');
            const recipeId = select.value;
            if (recipeId) {
                addRecipeToPlan(meal, recipeId);
            }
        }

        if (e.target.classList.contains('add-to-meal-btn')) {
            const recipeId = e.target.dataset.recipeId;
            const category = e.target.dataset.category;
            addRecipeToPlan(category, recipeId);
        }
    });

    // Grocery list buttons
    document.getElementById('generate-list-btn').addEventListener('click', generateGroceryList);
    document.getElementById('clear-list-btn').addEventListener('click', clearGroceryList);

    // Calorie goal change
    document.getElementById('calorie-goal').addEventListener('input', updateCalorieTracker);

    // Update auth navbar
    updateAuthNavbar();
});
// Reminders & Notifications JavaScript

// Load reminders from localStorage
function loadReminders() {
    return JSON.parse(localStorage.getItem('reminders') || '[]');
}

// Save reminders to localStorage
function saveReminders(reminders) {
    localStorage.setItem('reminders', JSON.stringify(reminders));
}

// Request notification permission
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

// Schedule notification
function scheduleNotification(reminder) {
    const now = new Date();
    const reminderTime = new Date(`${reminder.date}T${reminder.time}`);
    const delay = reminderTime - now;

    if (delay > 0) {
        setTimeout(() => {
            showNotification(reminder);
        }, delay);
    }
}

// Show notification
function showNotification(reminder) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`Reminder: ${reminder.title}`, {
            body: reminder.notes || 'Time for your reminder!',
            icon: 'favicon.ico' // Add if you have an icon
        });
    } else {
        alert(`Reminder: ${reminder.title}\n${reminder.notes || 'Time for your reminder!'}`);
    }
}

// Add reminder
function addReminder(type, title, date, time, notes) {
    const reminders = loadReminders();
    const reminder = {
        id: Date.now(),
        type,
        title,
        date,
        time,
        notes,
        created: new Date().toISOString()
    };
    reminders.push(reminder);
    saveReminders(reminders);
    scheduleNotification(reminder);
    displayReminders();
}

// Delete reminder
function deleteReminder(id) {
    const reminders = loadReminders().filter(r => r.id != id);
    saveReminders(reminders);
    displayReminders();
}

// Display reminders
function displayReminders() {
    const reminders = loadReminders();
    const container = document.getElementById('reminders-container');
    container.innerHTML = '';

    if (reminders.length === 0) {
        container.innerHTML = '<p>No reminders set.</p>';
        return;
    }

    reminders.forEach(reminder => {
        const reminderEl = document.createElement('div');
        reminderEl.className = 'reminder-item';
        reminderEl.innerHTML = `
            <div class="reminder-info">
                <h3>${reminder.title}</h3>
                <p><strong>Type:</strong> ${reminder.type}</p>
                <p><strong>Date & Time:</strong> ${reminder.date} at ${reminder.time}</p>
                ${reminder.notes ? `<p><strong>Notes:</strong> ${reminder.notes}</p>` : ''}
            </div>
            <button class="delete-btn" data-id="${reminder.id}">Delete</button>
        `;
        container.appendChild(reminderEl);
    });
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    requestNotificationPermission();
    displayReminders();

    // Form submit
    document.getElementById('reminder-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const type = document.getElementById('reminder-type').value;
        const title = document.getElementById('reminder-title').value;
        const date = document.getElementById('reminder-date').value;
        const time = document.getElementById('reminder-time').value;
        const notes = document.getElementById('reminder-notes').value;

        addReminder(type, title, date, time, notes);
        this.reset();
    });

    // Delete reminder
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.dataset.id;
            deleteReminder(id);
        }
    });

    // Update auth navbar
    updateAuthNavbar();
});
