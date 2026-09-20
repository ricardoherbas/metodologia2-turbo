// login(email,password), registrar(nombre,email,password), getPerfil() -> usa client.js contra /auth/*
// Funciones contra /api/auth/*. Todas usan client.js, que ya agrega BASE_URL y el token.
import { post, get } from './client.js';

// Devuelve { ok, usuario, token }
export function login(email, password) {
  return post('/auth/login', { email, password });
}

// Devuelve { ok, usuario, token }
export function registrar(nombre, email, password) {
  return post('/auth/registrar', { nombre, email, password });
}

// Requiere token (lo agrega client.js solo). Devuelve { ok, usuario }
export function getPerfil() {
  return get('/auth/perfil');
}