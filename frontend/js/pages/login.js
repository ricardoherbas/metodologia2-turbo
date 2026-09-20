// Escucha submit del form de login.html -> api/auth.login() -> authStore.setSession() -> redirect a dashboard.html
// Conecta el form de login.html con la API y con el authStore.
import { login } from '../api/auth.js';
import { setSession } from '../store/authStore.js';

const form = document.getElementById('login-form');
const errorEl = document.getElementById('login-error');

form.addEventListener('submit', async (event) => {
  event.preventDefault(); // evita que el form recargue la página

  errorEl.hidden = true;

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const data = await login(email, password); // { ok, usuario, token }
    setSession(data.token, data.usuario);
    window.location.href = 'dashboard.html';
  } catch (err) {
    errorEl.textContent = err.message;
    errorEl.hidden = false;
  }
});