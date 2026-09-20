// fetch wrapper generico: request(path, options) que agrega BASE_URL, header 'Authorization: Bearer <token>' (leido de authStore) y maneja errores/JSON
// Wrapper genérico sobre fetch. Todos los archivos de js/api/*.js pasan por acá,
// así el token y el manejo de errores se resuelven en un solo lugar.

import { API_BASE_URL } from '../config.js';
import { getToken } from '../store/authStore.js';

export async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  // El backend a veces responde sin body (204) o con json de error.
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // El backend a veces manda { error: '...' } y a veces { error: [...] } (validadores).
    const mensaje = Array.isArray(data?.error)
      ? data.error.join(' ')
      : data?.error || 'Ocurrió un error al conectar con el servidor.';
    throw new Error(mensaje);
  }

  return data;
}

// Atajos para no repetir el method en cada llamado
export const get = (path) => request(path);
export const post = (path, body) => request(path, { method: 'POST', body });
export const put = (path, body) => request(path, { method: 'PUT', body });
export const del = (path) => request(path, { method: 'DELETE' });