// Escucha submit del form de registro.html -> api/auth.registrar() -> redirect a login.html
// Conecta el form de registro.html con la API y con el authStore.
import { registrar } from '../api/auth.js';
import { setSession } from '../store/authStore.js';

const form = document.getElementById('registro-form');
const errorEl = document.getElementById('registro-error');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  errorEl.hidden = true;

  const nombre = document.getElementById('nombre').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const data = await registrar(nombre, email, password); // { ok, usuario, token }
    // El backend ya nos da token al registrar, así que logueamos directo
    // sin pasar por login.html de nuevo.
    setSession(data.token, data.usuario);
    window.location.href = 'dashboard.html';
  } catch (err) {
    errorEl.textContent = err.message;
    errorEl.hidden = false;
  }
});