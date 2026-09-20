// guardProtectedPage() + lista movimientos del usuario, filtros, alta/edicion/borrado usando movimientoItem.js

import { guardProtectedPage } from '../utils/protectedPage.js';
guardProtectedPage();

import { getUsuario } from '../store/authStore.js';
import * as movimientosApi from '../api/movimientos.js';
import * as categoriasApi from '../api/categorias.js';

const usuario = getUsuario(); // necesitamos saber de que usuario son los movimientos

let movimientos = [];
let categorias = [];

const form = document.getElementById('form-movimiento');
const selectCategoria = document.getElementById('categoria_id');
const lista = document.getElementById('lista-movimientos');

async function iniciar() {
    const [resMovimientos, resCategorias] = await Promise.all([
        movimientosApi.obtenerPorUsuario(usuario.id),
        categoriasApi.obtenerTodas(),
    ]);

    movimientos = resMovimientos.movimientos;
    categorias = resCategorias.categorias;

    llenarSelectCategorias();
    pintarLista();
}

function llenarSelectCategorias() {
    selectCategoria.innerHTML = categorias
    .map((categoria) => `<option value="${categoria.id}">${categoria.nombre}</option>`)
    .join('');
}

function nombreCategoria(categoriaId) {
    const categoria = categorias.find((c) => c.id === categoriaId);
    return categoria ? categoria.nombre : 'Sin categoría';
}

function pintarLista() {
    const html = movimientos.map((movimiento) => {
        const signo = movimiento.tipo === 'gasto' ? '-' : '+';
        return `
        <li>
            [${movimiento.tipo}] ${nombreCategoria(movimiento.categoria_id)}:
            ${signo}$${movimiento.monto} el ${movimiento.fecha.split('T')[0]}
            (${movimiento.descripcion || 'sin descripción'})
            <button class="btn-eliminar" data-id="${movimiento.id}">Eliminar</button>
        </li>
    `;
    }).join('');

    lista.innerHTML = html;
}

// ---------- Crear movimiento ----------
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const datos = {
        usuario_id: usuario.id,
        categoria_id: Number(document.getElementById('categoria_id').value),
        tipo: document.getElementById('tipo').value,
        monto: Number(document.getElementById('monto').value),
        fecha: document.getElementById('fecha').value,
        descripcion: document.getElementById('descripcion').value,
    };

    const respuesta = await movimientosApi.crear(datos);
    movimientos.push(respuesta.movimiento);
    pintarLista();

    form.reset();
});

// ---------- Eliminar movimiento ----------
lista.addEventListener('click', async (event) => {
    const boton = event.target.closest('.btn-eliminar');
    if (!boton) return;

    const id = Number(boton.dataset.id);
    await movimientosApi.eliminar(id);

    movimientos = movimientos.filter((movimiento) => movimiento.id !== id);
    pintarLista();
});

iniciar();
