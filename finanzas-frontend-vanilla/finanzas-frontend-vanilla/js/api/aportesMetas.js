// obtenerTodos, obtenerPorMeta(meta_id), obtenerPorId, crear, actualizar, eliminar -> /aportes-metas
// Funciones contra /api/aportes-metas.
import { get, post, del } from './client.js';

// { ok, aportes: [...] }
export function obtenerPorMeta(metaId) {
    return get(`/aportes-metas/meta/${metaId}`);
}

// datos = { meta_id, monto, descripcion }
export function crear(datos) {
    return post('/aportes-metas', datos);
}

export function eliminar(id) {
    return del(`/aportes-metas/${id}`);
}   