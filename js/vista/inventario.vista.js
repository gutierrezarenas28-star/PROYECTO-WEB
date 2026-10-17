// Vista del inventario: pinta categorías, tabla, resumen y paginación.
import { $, escapar, moneda } from '../comun/utilidades.js';
import { esStockBajo } from '../modelo/repositorio.js';

// ---------- Tabla ----------
function filaHTML(producto) {
  const bajo = esStockBajo(producto);
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

export function renderTabla(productos) {
  $('filas').innerHTML = productos.length
    ? productos.map(filaHTML).join('')
    : '<div class="tabla-vacia">No se encontraron productos.</div>';
}

// ---------- Filtro de categorías ----------
export function renderCategorias(categorias, seleccionada) {
  $('categoria').innerHTML = '<option value="">Todas las categorías</option>' +
    categorias.map(categoria => `<option value="${escapar(categoria)}">${escapar(categoria)}</option>`).join('');
  $('categoria').value = seleccionada;
}

// ---------- Resumen y paginación ----------
export function renderResumen(inicio, cantidad, total) {
  $('resumen').textContent = total
    ? `Mostrando ${inicio + 1}–${inicio + cantidad} de ${total} productos`
    : 'Sin resultados';
}

export function renderPaginacion(pagina, totalPaginas) {
  let marcado = `<button class="btn-pag" type="button" data-pagina="${pagina - 1}" ${pagina === 1 ? 'disabled' : ''}>Anterior</button>`;
  for (let indicador = 1; indicador <= totalPaginas; indicador++) {
    marcado += `<button class="btn-pag${indicador === pagina ? ' activo' : ''}" type="button" data-pagina="${indicador}">${indicador}</button>`;
  }
  marcado += `<button class="btn-pag" type="button" data-pagina="${pagina + 1}" ${pagina === totalPaginas ? 'disabled' : ''}>Siguiente</button>`;
  $('paginas').innerHTML = marcado;
}
