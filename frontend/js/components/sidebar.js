// renderSidebar(container): links a dashboard, movimientos, categorias, metas, asistente-ia, perfil
// Se usa en todas las páginas privadas. Recibe el id de un contenedor vacío y lo llena.
// Marca como "activo" el link de la página actual comparando con el nombre del archivo.

    const LINKS = [
    { href: 'dashboard.html', label: 'Dashboard' },
    { href: 'movimientos.html', label: 'Movimientos' },
    { href: 'categorias.html', label: 'Categorías' },
    { href: 'metas.html', label: 'Metas de ahorro' },
    { href: 'asistente-ia.html', label: 'Asistente IA' },
    { href: 'perfil.html', label: 'Mi perfil' },
    ];

    export function renderSidebar(containerId) {
    const container = document.getElementById(containerId);
    const paginaActual = window.location.pathname.split('/').pop();

    container.innerHTML = `
        <nav>
        <ul class="sidebar-list">
            ${LINKS.map(
            (link) => `
            <li>
                <a href="${link.href}" class="${link.href === paginaActual ? 'activo' : ''}">
                ${link.label}
                </a>
            </li>`
            ).join('')}
        </ul>
        </nav>
    `;
    }