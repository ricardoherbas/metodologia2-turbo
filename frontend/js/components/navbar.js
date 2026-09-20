// renderNavbar(container): muestra nombre de usuario logueado + boton logout (authStore.clearSession + redirect a login.html)
// Se usa en todas las páginas privadas. Recibe el id de un contenedor vacío y lo llena.
import { getUsuario, clearSession } from '../store/authStore.js';

export function renderNavbar(containerId) {
  const container = document.getElementById(containerId);
  const usuario = getUsuario();

  container.innerHTML = `
    <span class="navbar-usuario">${usuario ? usuario.nombre : ''}</span>
    <button id="btn-logout" class="navbar-logout">Salir</button>
  `;

  document.getElementById('btn-logout').addEventListener('click', () => {
    clearSession();
    window.location.href = 'login.html';
  });
}