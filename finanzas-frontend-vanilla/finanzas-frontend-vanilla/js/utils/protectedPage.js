// guardProtectedPage(): si no hay sesion (authStore) redirige a login.html. Se importa al principio de cada pagina privada
// Se importa como PRIMERA línea de cada página privada (dashboard.js, movimientos.js, etc.)
// Si no hay sesión válida, corta la ejecución y redirige a login.html.
import { isAuthenticated } from '../store/authStore.js';

export function guardProtectedPage() {
  if (!isAuthenticated()) {
    window.location.href = 'login.html';
  }
}

// Usado solo en index.html: manda al usuario a donde corresponda según si tiene sesión o no.
export function redirectSegunSesion() {
  window.location.href = isAuthenticated() ? 'dashboard.html' : 'login.html';
}