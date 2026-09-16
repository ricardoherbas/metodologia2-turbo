// guardProtectedPage() + trae movimientos y metas del usuario -> pinta resumen y grafico
import { guardProtectedPage } from '../utils/protectedPage.js';
guardProtectedPage(); // si no hay sesión, esto redirige a login.html y corta acá

import { getUsuario } from '../store/authStore.js';
import { renderNavbar } from '../components/navbar.js';
import { renderSidebar } from '../components/sidebar.js';
import * as movimientosApi from '../api/movimientos.js';
import * as categoriasApi from '../api/categorias.js';
import * as metasApi from '../api/metasAhorro.js';
import { formatCurrency } from '../utils/formatCurrency.js';

renderNavbar('navbar');
renderSidebar('sidebar');

const usuario = getUsuario();

async function cargarDashboard() {
  try {
    // Pedimos todo en paralelo: movimientos del usuario, categorías (para los nombres) y metas
    const [resMovimientos, resCategorias, resMetas] = await Promise.all([
      movimientosApi.obtenerPorUsuario(usuario.id),
      categoriasApi.obtenerTodas(),
      metasApi.obtenerPorUsuario(usuario.id),
    ]);

    pintarResumen(resMovimientos.movimientos);
    pintarGastosPorCategoria(resMovimientos.movimientos, resCategorias.categorias);
    pintarMetas(resMetas.metas);
  } catch (err) {
    alert('Error cargando el dashboard: ' + err.message);
  }
}

function pintarResumen(movimientos) {
  let ingresos = 0;
  let gastos = 0;

  for (const mov of movimientos) {
    const monto = Number(mov.monto); // el backend manda el DECIMAL como string
    if (mov.tipo === 'ingreso') ingresos += monto;
    if (mov.tipo === 'gasto') gastos += monto;
  }

  document.getElementById('total-ingresos').textContent = formatCurrency(ingresos);
  document.getElementById('total-gastos').textContent = formatCurrency(gastos);
  document.getElementById('total-balance').textContent = formatCurrency(ingresos - gastos);
}

function pintarGastosPorCategoria(movimientos, categorias) {
  // Mapa rápido id -> nombre, para no andar buscando en un array por cada movimiento
  const nombrePorCategoria = {};
  for (const cat of categorias) {
    nombrePorCategoria[cat.id] = cat.nombre;
  }

  const totalesPorCategoria = {};
  for (const mov of movimientos) {
    if (mov.tipo !== 'gasto') continue;
    const nombre = nombrePorCategoria[mov.categoria_id] || 'Sin categoría';
    totalesPorCategoria[nombre] = (totalesPorCategoria[nombre] || 0) + Number(mov.monto);
  }

  const lista = document.getElementById('lista-categorias');
  lista.innerHTML = Object.entries(totalesPorCategoria)
    .map(([nombre, total]) => `<li>${nombre}: ${formatCurrency(total)}</li>`)
    .join('') || '<li>Todavía no hay gastos cargados.</li>';
}

function pintarMetas(metas) {
  const lista = document.getElementById('lista-metas');
  const activas = metas.filter((m) => m.estado === 'en proceso');

  lista.innerHTML = activas
    .map(
      (m) =>
        `<li>${m.nombre}: ${formatCurrency(m.monto_actual)} / ${formatCurrency(m.monto_objetivo)}</li>`
    )
    .join('') || '<li>No tenés metas activas.</li>';
}

cargarDashboard();