// Vista del formulario (agregar / editar producto):
// pinta campos, categorías, vista previa y mensajes de error.
import { $, escapar, moneda, soloNumero } from '../comun/utilidades.js';
import { pintarVistaPrevia } from './componentes.js';

const form = $('formulario');
const f = form.elements;

// Muestra u oculta el mensaje de error de un campo.
export function mostrarError(campo, mensaje) {
  const caja = form.querySelector(`[data-campo="${campo}"]`);
  if (!caja) return;
  const cajaError = caja.querySelector('.campo-error');
  if (cajaError) { cajaError.hidden = !mensaje; cajaError.querySelector('span').textContent = mensaje || ''; }
  caja.classList.toggle('con-error', Boolean(mensaje));
  const entrada = f[campo];
  if (entrada) { if (mensaje) entrada.setAttribute('aria-invalid', 'true'); else entrada.removeAttribute('aria-invalid'); }
}

// Llena las sugerencias del datalist y deja puesta la categoría actual.
export function llenarCategorias(categorias, actual) {
  $('listaCategorias').innerHTML = categorias
    .map(categoria => `<option value="${escapar(categoria)}"></option>`).join('');
  f.categoria.value = actual || '';
}

// Lee los valores del formulario.
export function leerDatos() {
  return {
    codigo: f.codigo.value.trim(),
    nombre: f.nombre.value.trim(),
    categoria: f.categoria.value.trim(),
    precio: soloNumero(f.precio.value),
    cantidadTexto: f.cantidad.value,
    cantidadInvalida: f.cantidad.validity.badInput,
    descripcion: f.descripcion.value.trim(),
  };
}

// Formatea el precio mostrado: "4500" -> "$4.500".
export function formatearPrecio() {
  f.precio.value = f.precio.value.trim() === '' ? '' : moneda(soloNumero(f.precio.value));
}

// Pinta los datos del producto cuando se edita.
export function pintarProducto(producto) {
  $('subtitulo').textContent = `Actualiza la información de ${producto.nombre}.`;
  f.codigo.value = producto.codigo;
  f.nombre.value = producto.nombre;
  f.categoria.value = producto.categoria;
  f.precio.value = moneda(producto.precio);
  f.cantidad.value = producto.stock;
  f.descripcion.value = producto.descripcion || '';
  pintarVistaPrevia($('vistaPrevia'), producto.imagen || '');
}

export function mostrarErrorGeneral(mensaje) {
  const caja = $('errorGeneral');
  caja.textContent = mensaje;
  caja.hidden = false;
}

export function ocultarErrorGeneral() {
  $('errorGeneral').hidden = true;
}
