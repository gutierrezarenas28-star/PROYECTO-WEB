// Página del formulario: agregar o editar un producto
// (el <body> trae data-modo="editar" cuando se edita).
iniciarMenuMovil();

const esEditar = document.body.dataset.modo === 'editar';
const form = $('formulario');
const f = form.elements;
const CAMPOS = ['codigo', 'nombre', 'categoria', 'precio', 'cantidad'];

let producto = null; // producto que se edita (sólo en modo editar)
let imagen = '';     // ruta o data URL de la imagen

// ---------- Utilidades de vista ----------
function mostrarError(campo, mensaje) {
  const caja = form.querySelector(`[data-campo="${campo}"]`);
  if (!caja) return;
  const p = caja.querySelector('.campo-error');
  if (p) { p.hidden = !mensaje; p.querySelector('span').textContent = mensaje || ''; }
  caja.classList.toggle('con-error', Boolean(mensaje));
  const entrada = f[campo];
  if (entrada) { if (mensaje) entrada.setAttribute('aria-invalid', 'true'); else entrada.removeAttribute('aria-invalid'); }
}

function llenarCategorias(actual) {
  const cats = [...new Set([...CATEGORIAS, ...cargarProductos().map(p => p.categoria), actual].filter(Boolean))];
  f.categoria.innerHTML = '<option value="">Seleccione una categoría</option>' +
    cats.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join('');
}

// ---------- Imagen ----------
conectarImagen({
  botonId: 'btnImagen',
  entradaId: 'archivo',
  vistaPreviaId: 'vistaPrevia',
  onCambio: url => { imagen = url; },
  onError: mensaje => mostrarError('imagen', mensaje),
});

// ---------- Lectura y validación ----------
function leerDatos() {
  return {
    codigo: f.codigo.value.trim(),
    nombre: f.nombre.value.trim(),
    categoria: f.categoria.value,
    precio: soloNumero(f.precio.value),
    cantidadTexto: f.cantidad.value,
    cantidadInvalida: f.cantidad.validity.badInput,
    descripcion: f.descripcion.value.trim(),
  };
}

// Quita el error de un campo apenas la persona lo vuelve a editar
form.addEventListener('input', e => { if (e.target.name) mostrarError(e.target.name, ''); $('errorGeneral').hidden = true; });
form.addEventListener('change', e => { if (e.target.name) mostrarError(e.target.name, ''); });

f.precio.addEventListener('blur', () => {
  f.precio.value = f.precio.value.trim() === '' ? '' : moneda(soloNumero(f.precio.value));
});

// ---------- Guardar ----------
function guardar(d) {
  const campos = {
    codigo: d.codigo,
    nombre: d.nombre, categoria: d.categoria, precio: d.precio,
    stock: Number(d.cantidadTexto), descripcion: d.descripcion, img: imagen,
  };
  // En esta entrega los datos no se guardan: el cambio
  // vive en la memoria de la página abierta.
  if (esEditar) {
    actualizarProducto(producto.id, campos);
  } else {
    agregarProducto(campos);
  }
  location.href = 'inventario.html';
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const datos = leerDatos();
  const errores = validarProducto(datos, producto ? producto.id : null);
  // Marca en rojo los campos vacíos o inválidos
  CAMPOS.forEach(c => mostrarError(c, errores[c]));
  const primero = CAMPOS.find(c => errores[c]);
  if (primero) { f[primero].focus(); return; }
  guardar(datos);
});

// ---------- Inicio de la página ----------
if (esEditar) {
  // Si la página se abre a mano (sin ?id=...), se carga el primer
  // producto para que siempre haya algo que editar.
  const id = Number(new URLSearchParams(location.search).get('id'));
  producto = buscarProducto(id) || cargarProductos()[0];

  if (!producto) {
    location.replace('inventario.html'); // todavía no hay productos
  } else {
    llenarCategorias(producto.categoria);
    $('subtitulo').textContent = `Actualiza la información de ${producto.nombre}.`;
    f.codigo.value = producto.codigo;
    f.nombre.value = producto.nombre;
    f.categoria.value = producto.categoria;
    f.precio.value = moneda(producto.precio);
    f.cantidad.value = producto.stock;
    f.descripcion.value = producto.descripcion || '';
    imagen = producto.img || '';
    pintarVistaPrevia($('vistaPrevia'), imagen);
  }
} else {
  llenarCategorias();
  f.codigo.placeholder = 'Ej. ' + codigoSugerido();
}
crearIconos();
