// Controlador del inventario: escucha los eventos de la página y
// coordina al modelo (datos) con la vista (pintado).
import { $ } from '../js/comun/utilidades.js';
import { cargarProductos, eliminarProducto } from '../modelo/repositorio.js';
import { iniciarMenuMovil, iniciarConfirmar, mostrarConfirmar } from '../js/modulos/componentes.js';
import * as vista from '../js/modulos/inventario-ui.js';

iniciarMenuMovil();
iniciarConfirmar();

const POR_PAGINA = 6;
let productos = cargarProductos();
let pagina = 1;
const filtro = { texto: '', categoria: '' };

// ---------- Datos de la página ----------
function filtrados() {
  const texto = filtro.texto.trim().toLowerCase();
  return productos.filter(producto =>
    (!filtro.categoria || producto.categoria === filtro.categoria) &&
    (!texto || producto.nombre.toLowerCase().includes(texto) || producto.codigo.toLowerCase().includes(texto))
  );
}

function categoriasDisponibles() {
  return [...new Set(productos.map(producto => producto.categoria))]
    .sort((a, b) => a.localeCompare(b, 'es'));
}

// ---------- Pintado ----------
function renderCategorias() {
  const categorias = categoriasDisponibles();
  if (!categorias.includes(filtro.categoria)) filtro.categoria = '';
  vista.renderCategorias(categorias, filtro.categoria);
}

function render() {
  const lista = filtrados();
  const total = lista.length;
  const totalPaginas = Math.max(1, Math.ceil(total / POR_PAGINA));
  if (pagina > totalPaginas) pagina = totalPaginas;

  const inicio = (pagina - 1) * POR_PAGINA;
  const deLaPagina = lista.slice(inicio, inicio + POR_PAGINA);

  vista.renderTabla(deLaPagina, productos.length
    ? 'No se encontraron productos.'
    : 'Aún no hay productos. Usa "Agregar producto" para registrar el primero.');
  vista.renderResumen(inicio, deLaPagina.length, total);
  vista.renderPaginacion(pagina, totalPaginas);
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
    eliminarProducto(id);
    productos = cargarProductos();
    renderCategorias();
    render();
  });
});

renderCategorias();
render();
