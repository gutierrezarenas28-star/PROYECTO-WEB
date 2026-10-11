// Página de inventario: filtros, tabla y paginación.
iniciarMenuMovil();
iniciarConfirmar();

const POR_PAGINA = 6;
let productos = cargarProductos();
let pagina = 1;
const filtro = { texto: '', categoria: '' };

// ---------- Filtros ----------
function filtrados() {
  const t = filtro.texto.trim().toLowerCase();
  return productos.filter(p =>
    (!filtro.categoria || p.categoria === filtro.categoria) &&
    (!t || p.nombre.toLowerCase().includes(t) || p.codigo.toLowerCase().includes(t))
  );
}

function renderCategorias() {
  const cats = [...new Set(productos.map(p => p.categoria))].sort((a, b) => a.localeCompare(b, 'es'));
  if (!cats.includes(filtro.categoria)) filtro.categoria = '';
  $('categoria').innerHTML = '<option value="">Todas las categorías</option>' +
    cats.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join('');
  $('categoria').value = filtro.categoria;
}

// ---------- Tabla ----------
function filaHTML(p) {
  const bajo = p.stock <= UMBRAL_STOCK_BAJO;
  return `
    <div class="fila fila-dato">
      <div class="miniatura" style="background-image:url('${esc(p.img)}')" role="img" aria-label="${esc(p.nombre)}"></div>
      <div class="celda-producto">
        <span class="celda-nombre">${esc(p.nombre)}</span>
        <span class="celda-codigo">${esc(p.codigo)}</span>
      </div>
      <span class="celda-suave">${esc(p.categoria)}</span>
      <span>${moneda(p.precio)}</span>
      <span>${p.stock}</span>
      <span><span class="etiqueta-estado${bajo ? ' bajo' : ''}">${bajo ? 'Stock bajo' : 'Disponible'}</span></span>
      <div class="acciones">
        <a class="accion editar" href="editar-producto.html?id=${p.id}" aria-label="Editar ${esc(p.nombre)}"><i class="icono-sm" data-lucide="pencil"></i></a>
        <button class="accion eliminar" type="button" data-id="${p.id}" aria-label="Eliminar ${esc(p.nombre)}"><i class="icono-sm" data-lucide="trash-2"></i></button>
      </div>
    </div>`;
}

function renderPaginacion(totalPaginas) {
  let html = `<button class="btn-pag" type="button" data-pagina="${pagina - 1}" ${pagina === 1 ? 'disabled' : ''}>Anterior</button>`;
  for (let i = 1; i <= totalPaginas; i++) {
    html += `<button class="btn-pag${i === pagina ? ' activo' : ''}" type="button" data-pagina="${i}">${i}</button>`;
  }
  html += `<button class="btn-pag" type="button" data-pagina="${pagina + 1}" ${pagina === totalPaginas ? 'disabled' : ''}>Siguiente</button>`;
  $('paginas').innerHTML = html;
}

function render() {
  const lista = filtrados();
  const total = lista.length;
  const totalPaginas = Math.max(1, Math.ceil(total / POR_PAGINA));
  if (pagina > totalPaginas) pagina = totalPaginas;

  const inicio = (pagina - 1) * POR_PAGINA;
  const vista = lista.slice(inicio, inicio + POR_PAGINA);

  $('filas').innerHTML = vista.length
    ? vista.map(filaHTML).join('')
    : '<div class="tabla-vacia">No se encontraron productos.</div>';
  $('resumen').textContent = total
    ? `Mostrando ${inicio + 1}–${inicio + vista.length} de ${total} productos`
    : 'Sin resultados';
  renderPaginacion(totalPaginas);
  crearIconos();
}

// ---------- Eventos ----------
$('buscador').addEventListener('input', e => { filtro.texto = e.target.value; pagina = 1; render(); });
$('categoria').addEventListener('change', e => { filtro.categoria = e.target.value; pagina = 1; render(); });

$('paginas').addEventListener('click', e => {
  const btn = e.target.closest('[data-pagina]');
  if (!btn || btn.disabled) return;
  pagina = Number(btn.dataset.pagina);
  render();
});

// Eliminar con confirmación
$('filas').addEventListener('click', e => {
  const btn = e.target.closest('.eliminar');
  if (!btn) return;
  const id = Number(btn.dataset.id);
  mostrarConfirmar(() => {
    eliminarProducto(id);          // función del repositorio
    productos = cargarProductos();
    renderCategorias();
    render();
  });
});

renderCategorias();
render();
