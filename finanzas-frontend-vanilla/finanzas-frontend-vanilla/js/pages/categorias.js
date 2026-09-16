// guardProtectedPage() + CRUD de categorias

import { guardProtectedPage } from '../utils/protectedPage.js';
guardProtectedPage();

import * as categoriasApi from '../api/categorias.js';

let categorias = []; // guardamos la lista aca para no pedirla de nuevo cada vez

const form = document.getElementById('form-categoria');
const inputNombre = document.getElementById('nombre-categoria');
const lista = document.getElementById('lista-categorias');

async function cargarCategorias() {
    const respuesta = await categoriasApi.obtenerTodas();
    categorias = respuesta.categorias;
    pintarLista();
}

function pintarLista() {
    const html = categorias.map((categoria) => {
        return `
        <li>
            ${categoria.nombre}
            <button class="btn-eliminar" data-id="${categoria.id}">Eliminar</button>
        </li>
        `;
    }).join('');

    lista.innerHTML = html;
}

//  Crear categoria
form.addEventListener('submit', async (event) => {
  event.preventDefault(); // evita que la pagina se recargue al enviar el form

    const nombre = inputNombre.value;
    const respuesta = await categoriasApi.crear({ nombre });

  categorias.push(respuesta.categoria); // agregamos la nueva a la lista en memoria
    pintarLista();

  form.reset(); // limpia el input
});

// Eliminar categoria 
lista.addEventListener('click', async (event) => {
    const boton = event.target.closest('.btn-eliminar');
    if (!boton) return;

    const id = Number(boton.dataset.id);
    await categoriasApi.eliminar(id);

    categorias = categorias.filter((categoria) => categoria.id !== id);
    pintarLista();
}); 
cargarCategorias();