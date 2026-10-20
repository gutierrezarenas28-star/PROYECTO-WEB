// Controlador del formulario: agregar o editar un producto
// (el <body> trae data-modo="editar" cuando se edita).
import { $, primeraMayuscula } from '../js/comun/utilidades.js';
import { CATEGORIAS } from '../modelo/datos.js';
import { cargarProductos, buscarProducto, codigoSugerido, agregarProducto, actualizarProducto } from '../modelo/repositorio.js';
import { validarProducto } from '../modelo/validaciones.js';
import { iniciarMenuMovil, conectarImagen } from '../js/modulos/componentes.js';
import { mostrarError, llenarCategorias, leerDatos, formatearPrecio, pintarProducto, mostrarErrorGeneral, ocultarErrorGeneral } from '../js/modulos/formulario-ui.js';

iniciarMenuMovil();

const esEditar = document.body.dataset.modo === 'editar';
const form = $('formulario');
const f = form.elements;
const CAMPOS = ['codigo', 'nombre', 'categoria', 'precio', 'cantidad'];

let producto = null; // producto que se edita (sólo en modo editar)
let imagen = '';     // ruta o data URL de la imagen

// ---------- Imagen ----------
conectarImagen({
  botonId: 'btnImagen',
  entradaId: 'archivo',
  vistaPreviaId: 'vistaPrevia',
  onCambio: enlace => { imagen = enlace; },
  onError: mensaje => mostrarError('imagen', mensaje),
});

// Quita el error de un campo apenas la persona lo vuelve a editar
form.addEventListener('input', evento => { if (evento.target.name) mostrarError(evento.target.name, ''); ocultarErrorGeneral(); });
form.addEventListener('change', evento => { if (evento.target.name) mostrarError(evento.target.name, ''); });

f.precio.addEventListener('blur', formatearPrecio);

// ---------- Guardar ----------
function guardar(datos) {
  const campos = {
    codigo: datos.codigo,
    nombre: datos.nombre, categoria: datos.categoria, precio: datos.precio,
    stock: Number(datos.cantidadTexto), descripcion: datos.descripcion, imagen: imagen,
  };
  try {
    if (esEditar) actualizarProducto(producto.id, campos);
    else agregarProducto(campos);
  } catch {
    // localStorage lleno o bloqueado (suele pasar con imágenes muy pesadas)
    mostrarErrorGeneral('No se pudo guardar. Prueba con una imagen más liviana o libera espacio del navegador.');
    return;
  }
  location.href = 'inventario.html';
}

form.addEventListener('submit', evento => {
  evento.preventDefault();
  const datos = leerDatos();
  const errores = validarProducto(datos, producto ? producto.id : null);
  // Marca en rojo los campos vacíos o inválidos
  CAMPOS.forEach(campo => mostrarError(campo, errores[campo]));
  const primero = CAMPOS.find(campo => errores[campo]);
  if (primero) { f[primero].focus(); return; }
  datos.categoria = normalizarCategoria(datos.categoria);
  guardar(datos);
});

// ---------- Inicio de la página ----------
// Sugerencias del datalist: las fijas + las que ya usan los productos.
function categoriasDisponibles(actual) {
  return [...new Set([...CATEGORIAS, ...cargarProductos().map(producto => producto.categoria), actual].filter(Boolean))];
}

// Reutiliza la categoría existente aunque cambien mayúsculas
// ("granos" -> "Granos") y deja la primera letra en mayúscula.
function normalizarCategoria(nombre) {
  const existente = categoriasDisponibles().find(categoria => categoria.toLowerCase() === nombre.toLowerCase());
  return existente || primeraMayuscula(nombre);
}

if (esEditar) {
  const id = Number(new URLSearchParams(location.search).get('id'));
  producto = buscarProducto(id);

  if (!producto) {
    location.replace('inventario.html'); // el producto no existe
  } else {
    llenarCategorias(categoriasDisponibles(producto.categoria), producto.categoria);
    imagen = producto.imagen || '';
    pintarProducto(producto);
  }
} else {
  llenarCategorias(categoriasDisponibles());
  f.codigo.placeholder = 'Ej. ' + codigoSugerido();
}
