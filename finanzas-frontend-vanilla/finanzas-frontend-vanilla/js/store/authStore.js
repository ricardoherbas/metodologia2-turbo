// Maneja sesion en localStorage: getToken(), getUsuario(), setSession(token,usuario), clearSession(), isAuthenticated()
// Maneja la sesión del usuario guardándola en localStorage.
// Usamos dos claves separadas: una para el token JWT y otra para los datos del usuario.

const TOKEN_KEY = 'finanzas_token';
const USUARIO_KEY = 'finanzas_usuario';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUsuario() {
  const raw = localStorage.getItem(USUARIO_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setSession(token, usuario) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USUARIO_KEY);
}

export function isAuthenticated() {
  return Boolean(getToken());
}