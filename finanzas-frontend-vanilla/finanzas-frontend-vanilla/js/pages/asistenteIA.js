// guardProtectedPage() + input de pregunta -> api/ia.consultarIA() -> pinta chatBubble con la respuesta. Historial solo en memoria de la pagina
import { guardProtectedPage } from '../utils/protectedPage.js';
guardProtectedPage();

import { getUsuario } from '../store/authStore.js';
import * as iaApi from '../api/ia.js';

const usuario = getUsuario();

const chat = document.getElementById('chat');
const form = document.getElementById('form-pregunta');
const inputPregunta = document.getElementById('pregunta');

function agregarMensaje(texto, esUsuario) {
    const clase = esUsuario ? 'mensaje-usuario' : 'mensaje-ia';
    const burbuja = document.createElement('p');
    burbuja.className = clase;
    burbuja.textContent = texto;
    chat.appendChild(burbuja);

  chat.scrollTop = chat.scrollHeight; // baja el scroll al último mensaje
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const pregunta = inputPregunta.value;
  agregarMensaje(pregunta, true); // pintamos la pregunta del usuario al toque
    inputPregunta.value = '';

  agregarMensaje('Pensando...', false); // mensaje provisorio, mientras Ollama procesa

    try {
    const respuesta = await iaApi.consultar(pregunta, usuario.id);

    chat.removeChild(chat.lastChild); // sacamos el "Pensando..."
    agregarMensaje(respuesta.respuesta, false);
    } catch (error) {
    chat.removeChild(chat.lastChild);
    agregarMensaje('Ocurrió un error al consultar. Probá de nuevo.', false);
    }
});