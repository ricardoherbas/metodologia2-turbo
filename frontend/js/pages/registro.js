// Escucha submit del form de registro.html
// Registra el usuario y luego redirige a login.html.

import { registrar } from '../api/auth.js';

const form = document.getElementById('registro-form');
const errorEl = document.getElementById('registro-error');

form.addEventListener('submit', async (event) => {

  event.preventDefault();

  errorEl.hidden = true;

  const nombre = document.getElementById('nombre').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    await registrar(nombre, email, password);
    window.location.href = 'login.html';
  } catch (err) {
    errorEl.textContent = err.message;
    errorEl.hidden = false;
  }

});