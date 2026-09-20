// consultarIA(pregunta, usuarioId) -> POST /ia/consultar
// Funciones contra /api/ia.
import { post } from './client.js';

// { pregunta, usuarioId }
// Devuelve { pregunta, sql, resultado, respuesta }
export function consultar(pregunta, usuarioId) {
    return post('/ia/consultar', { pregunta, usuarioId });
}