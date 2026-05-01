// ============================================================
// AUTH.JS — Admin Authentication Module
// Let's Go Tours and Travels
// ============================================================
// NOTE: This uses localStorage for demo purposes (GitHub Pages).
// A production app MUST use a secure backend with bcrypt hashing
// and server-side session management.
// ============================================================

(function () {
  const USERS_KEY    = 'letsgo_adminUsers';
  const SESSION_KEY  = 'letsgo_adminSession';

  // ── Simple obfuscation (NOT real security – demo only) ──
  function encode(str) {
    return btoa(unescape(encodeURIComponent('letsgo_v1_' + str)));
  }

  // ── Storage helpers ──
  function getUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; }
    catch { return []; }
  }
  function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
  function setSession(user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify({
      name: user.name,
      email: user.email,
      loggedInAt: Date.now()
    }));
  }

  // ── Seed default admin if no accounts exist ──
  function seedDefaultAdmin() {
    const users = getUsers();
    if (users.length === 0) {
      users.push({
        name: 'Admin',
        email: 'admin@letsgo.com',
        passwordHash: encode('Admin@123')
      });
      saveUsers(users);
    }
  }

  // ── Validation ──
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }
  function isValidPassword(pw) {
    return typeof pw === 'string' && pw.length >= 6;
  }

  // ── Public API ──

  /**
   * Register a new admin account.
   * @returns {{ success: boolean, error: string|null }}
   */
  function signUp(name, email, password) {
    name    = (name || '').trim();
    email   = (email || '').trim().toLowerCase();
    password = password || '';

    if (!name)                    return { success: false, error: 'Full name is required.' };
    if (!isValidEmail(email))     return { success: false, error: 'Please enter a valid email address.' };
    if (!isValidPassword(password)) return { success: false, error: 'Password must be at least 6 characters.' };

    const users = getUsers();
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    users.push({ name, email, passwordHash: encode(password) });
    saveUsers(users);
    setSession({ name, email });
    return { success: true, error: null };
  }

  /**
   * Authenticate an existing admin.
   * @returns {{ success: boolean, error: string|null }}
   */
  function signIn(email, password) {
    email    = (email || '').trim().toLowerCase();
    password = password || '';

    if (!email || !password) return { success: false, error: 'Please fill in all fields.' };

    const users = getUsers();
    const user  = users.find(u => u.email === email && u.passwordHash === encode(password));

    if (!user) return { success: false, error: 'Invalid email or password.' };

    setSession({ name: user.name, email: user.email });
    return { success: true, error: null };
  }

  /**
   * Sign out the current admin and redirect to login.
   */
  function signOut() {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = 'login.html';
  }

  /**
   * Returns true if a valid session exists.
   */
  function isAuthenticated() {
    try {
      const s = JSON.parse(localStorage.getItem(SESSION_KEY));
      return !!(s && s.email);
    } catch { return false; }
  }

  /**
   * Returns the currently signed-in admin { name, email } or null.
   */
  function getAdminUser() {
    try {
      return JSON.parse(localStorage.getItem(SESSION_KEY)) || null;
    } catch { return null; }
  }

  // ── Boot ──
  seedDefaultAdmin();

  // ── Expose globally ──
  window.Auth = { signUp, signIn, signOut, isAuthenticated, getAdminUser };

})();
