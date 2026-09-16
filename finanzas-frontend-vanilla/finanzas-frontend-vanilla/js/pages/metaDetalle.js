// guardProtectedPage() + lee ?id= de la URL, trae la meta y sus aportes, form para nuevo aporte

import { guardProtectedPage } from '../utils/protectedPage.js';
guardProtectedPage();

import * as metasApi from '../api/metasAhorro.js';
import * as aportesApi from '../api/aportesMetas.js';

// Leemos el "id" desde la URL, ej: meta-detalle.html?id=5
const parametros = new URLSearchParams(window.location.search);
const metaId = Number(parametros.get('id'));


let meta = null;
let aportes = [];

const tituloMeta = document.getElementById('nombre-meta-titulo');
const resumenMeta = document.getElementById('resumen-meta');
const form = document.getElementById('form-aporte');
const lista = document.getElementById('lista-aportes');

async function iniciar() {
    const [resMeta, resAportes] = await Promise.all([
    metasApi.obtenerPorId(metaId),
    aportesApi.obtenerPorMeta(metaId),
    ]);

    meta = resMeta.meta;
    aportes = resAportes.aportes;

    pintarResumen();
    pintarAportes();
}

function pintarResumen() {
    tituloMeta.textContent = meta.nombre;
    resumenMeta.textContent = `$${meta.monto_actual} / $${meta.monto_objetivo} — ${meta.estado}`;
}

function pintarAportes() {
    const html = aportes.map((aporte) => {
        return `
        <li>
            $${aporte.monto} el ${aporte.fecha.split('T')[0]} (${aporte.descripcion || 'sin descripción'})
            <button class="btn-eliminar" data-id="${aporte.id}">Eliminar</button>
        </li>
        `;
    }).join('');

    lista.innerHTML = html;
}

//  Crear aporte
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const datos = {
        meta_id: metaId,
        monto: Number(document.getElementById('monto-aporte').value),
        descripcion: document.getElementById('descripcion-aporte').value,
    };

    await aportesApi.crear(datos);

  // Volvemos a pedir todo (meta + aportes) porque el monto_actual de la
  // meta cambio solo en el backend (por el trigger de PostgreSQL) y
  // necesitamos traer ese valor actualizado, no lo podemos calcular aca.
    await iniciar();

    form.reset();
});

// Eliminar aporte 
lista.addEventListener('click', async (event) => {
    const boton = event.target.closest('.btn-eliminar');
    if (!boton) return;

    const id = Number(boton.dataset.id);
    await aportesApi.eliminar(id);

    await iniciar(); // mismo motivo: el monto_actual cambia solo
});

iniciar();
