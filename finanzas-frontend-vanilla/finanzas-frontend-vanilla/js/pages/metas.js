// guardProtectedPage() + lista de metas del usuario usando metaCard.js, link a meta-detalle.html?id=

import { guardProtectedPage } from '../utils/protectedPage.js';
guardProtectedPage();

import { getUsuario } from '../store/authStore.js';
import * as metasApi from '../api/metasAhorro.js';

const usuario = getUsuario();

let metas = [];

const form = document.getElementById('form-meta');
const lista = document.getElementById('lista-metas');

async function cargarMetas() {
    const respuesta = await metasApi.obtenerPorUsuario(usuario.id);
    metas = respuesta.metas;
    pintarLista();
}

function pintarLista() {
    const html = metas.map((meta) => {
        const porcentaje = Math.round((meta.monto_actual / meta.monto_objetivo) * 100);
    return `
        <li>
            <a href="meta-detalle.html?id=${meta.id}">${meta.nombre}</a>
            — $${meta.monto_actual} / $${meta.monto_objetivo} (${porcentaje}%)
            [${meta.estado}]
            <button class="btn-eliminar" data-id="${meta.id}">Eliminar</button>
        </li>
    `;
}).join('');

    lista.innerHTML = html;
}

// Crear meta
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const datos = {
        usuario_id: usuario.id,
        nombre: document.getElementById('nombre-meta').value,
        monto_objetivo: Number(document.getElementById('monto-objetivo').value),
        fecha_limite: document.getElementById('fecha-limite').value || null,
    };

    const respuesta = await metasApi.crear(datos);
    metas.push(respuesta.meta);
    pintarLista();

    form.reset();
});

// Eliminar meta 
lista.addEventListener('click', async (event) => {
    const boton = event.target.closest('.btn-eliminar');
    if (!boton) return;

    const id = Number(boton.dataset.id);
    await metasApi.eliminar(id);

    metas = metas.filter((meta) => meta.id !== id);
    pintarLista();
});

cargarMetas();