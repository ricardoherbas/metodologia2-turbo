// obtenerTodos, obtenerPorId, crear, actualizar, eliminar -> /usuarios
// Funciones contra /api/usuarios.
import { get, put } from './client.js';

// { ok, usuario }
export function obtenerPorId(id) {
    return get(`/usuarios/${id}`);
}

// datos = { nombre, email }
export function actualizar(id, datos) {
    return put(`/usuarios/${id}`, datos);
}