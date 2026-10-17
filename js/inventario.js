// Página de inventario: filtros, tabla y paginación.
iniciarMenuMovil();
iniciarConfirmar();

const POR_PAGINA = 6;
let productos = cargarProductos();
let pagina = 1;
const filtro = { texto: '', categoria: '' };

// ---------- Filtros ----------
function filtrados() {
  const texto = filtro.texto.trim().toLowerCase();
  return productos.filter(producto =>
    (!filtro.categoria || producto.categoria === filtro.categoria) &&
    (!texto || producto.nombre.toLowerCase().includes(texto) || producto.codigo.toLowerCase().includes(texto))
  );
}

function renderCategorias() {
  const cats = [...new Set(productos.map(producto => producto.categoria))].sort((a, b) => a.localeCompare(b, 'es'));
  if (!cats.includes(filtro.categoria)) filtro.categoria = '';
  $('categoria').innerHTML = '<option value="">Todas las categorías</option>' +
    cats.map(categoria => `<option value="${escapar(categoria)}">${escapar(categoria)}</option>`).join('');
  $('categoria').value = filtro.categoria;
}

// ---------- Tabla ----------
function filaHTML(producto) {
  const bajo = producto.stock <= UMBRAL_STOCK_BAJO;
  return `
    <div class="fila fila-dato">
      <div class="miniatura" style="background-image:url('${escapar(producto.imagen)}')" role="img" aria-label="${escapar(producto.nombre)}"></div>
      <div class="celda-producto">
        <span class="celda-nombre">${escapar(producto.nombre)}</span>
        <span class="celda-codigo">${escapar(producto.codigo)}</span>
      </div>
      <span class="celda-suave">${escapar(producto.categoria)}</span>
      <span>${moneda(producto.precio)}</span>
      <span>${producto.stock}</span>
      <span><span class="etiqueta-estado${bajo ? ' bajo' : ''}">${bajo ? 'Stock bajo' : 'Disponible'}</span></span>
      <div class="acciones">
        <a class="accion editar" href="editar-producto.html?id=${producto.id}" aria-label="Editar ${escapar(producto.nombre)}">✏️</a>
        <button class="accion eliminar" type="button" data-id="${producto.id}" aria-label="Eliminar ${escapar(producto.nombre)}">🗑️</button>
      </div>
    </div>`;
}

function renderPaginacion(totalPaginas) {
  let marcado = `<button class="btn-pag" type="button" data-pagina="${pagina - 1}" ${pagina === 1 ? 'disabled' : ''}>Anterior</button>`;
  for (let indicador = 1; indicador <= totalPaginas; indicador++) {
    marcado += `<button class="btn-pag${indicador === pagina ? ' activo' : ''}" type="button" data-pagina="${indicador}">${indicador}</button>`;
  }
  marcado += `<button class="btn-pag" type="button" data-pagina="${pagina + 1}" ${pagina === totalPaginas ? 'disabled' : ''}>Siguiente</button>`;
  $('paginas').innerHTML = marcado;
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
}

// ---------- Eventos ----------
$('buscador').addEventListener('input', evento => { filtro.texto = evento.target.value; pagina = 1; render(); });
$('categoria').addEventListener('change', evento => { filtro.categoria = evento.target.value; pagina = 1; render(); });

$('paginas').addEventListener('click', evento => {
  const boton = evento.target.closest('[data-pagina]');
  if (!boton || boton.disabled) return;
  pagina = Number(boton.dataset.pagina);
  render();
});

// Eliminar con confirmación
$('filas').addEventListener('click', evento => {
  const boton = evento.target.closest('.eliminar');
  if (!boton) return;
  const id = Number(boton.dataset.id);
  mostrarConfirmar(() => {
    eliminarProducto(id);          // función del repositorio
    productos = cargarProductos();
    renderCategorias();
    render();
  });
});

renderCategorias();
render();
