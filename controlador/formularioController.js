
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

let producto = null; 
let imagen = '';    


conectarImagen({
  botonId: 'btnImagen',
  entradaId: 'archivo',
  vistaPreviaId: 'vistaPrevia',
  onCambio: enlace => { imagen = enlace; },
  onError: mensaje => mostrarError('imagen', mensaje),
});


form.addEventListener('input', evento => { if (evento.target.name) mostrarError(evento.target.name, ''); ocultarErrorGeneral(); });
form.addEventListener('change', evento => { if (evento.target.name) mostrarError(evento.target.name, ''); });

f.precio.addEventListener('blur', formatearPrecio);


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


function categoriasDisponibles(actual) {
  return [...new Set([...CATEGORIAS, ...cargarProductos().map(producto => producto.categoria), actual].filter(Boolean))];
}

/
function normalizarCategoria(nombre) {
  const existente = categoriasDisponibles().find(categoria => categoria.toLowerCase() === nombre.toLowerCase());
  return existente || primeraMayuscula(nombre);
}

if (esEditar) {
  const id = Number(new URLSearchParams(location.search).get('producto'));
  producto = buscarProducto(id);

  if (!producto) {
    location.replace('inventario.html'); 
  } else {
    llenarCategorias(categoriasDisponibles(producto.categoria), producto.categoria);
    imagen = producto.imagen || '';
    pintarProducto(producto);
  }
} else {
  llenarCategorias(categoriasDisponibles());
  f.codigo.placeholder = 'Ej. ' + codigoSugerido();
}