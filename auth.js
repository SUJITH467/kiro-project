/**
 * BLOOM — Auth Script (login.html & signup.html)
 * All auth stored in localStorage (no backend)
 */

// =============================================
// STORAGE HELPERS
// =============================================
const lsGet = (k, d) => { try { const v = localStorage.getItem(k); return v !== null ? JSON.parse(v) : d; } catch { return d; } };
const lsSet = (k, v) => localStorage.setItem(k, JSON.stringify(v));

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
