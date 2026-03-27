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
}

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
