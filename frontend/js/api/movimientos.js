// obtenerTodos, obtenerPorUsuario(usuario_id), obtenerPorCategoria(categoria_id), obtenerPorId, crear, actualizar, eliminar -> /movimientos
// Funciones contra /api/movimientos. Todas devuelven el JSON tal cual lo manda el backend.
import { get, post, put, del } from './client.js';

// { ok, movimientos: [...] }
export function obtenerTodos() {
  return get('/movimientos');
}

// { ok, movimientos: [...] }
export function obtenerPorUsuario(usuarioId) {
  return get(`/movimientos/usuario/${usuarioId}`);
}

// { ok, movimientos: [...] }
export function obtenerPorCategoria(categoriaId) {
  return get(`/movimientos/categoria/${categoriaId}`);
}

// { ok, movimiento }
export function obtenerPorId(id) {
  return get(`/movimientos/${id}`);
}

// datos = { usuario_id, categoria_id, tipo, monto, descripcion, fecha }
export function crear(datos) {
  return post('/movimientos', datos);
}

export function actualizar(id, datos) {
  return put(`/movimientos/${id}`, datos);
}

export function eliminar(id) {
  return del(`/movimientos/${id}`);
}