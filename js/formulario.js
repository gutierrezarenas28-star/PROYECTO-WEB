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
  const producto = caja.querySelector('.campo-error');
  if (producto) { producto.hidden = !mensaje; producto.querySelector('span').textContent = mensaje || ''; }
  caja.classList.toggle('con-error', Boolean(mensaje));
  const entrada = f[campo];
  if (entrada) { if (mensaje) entrada.setAttribute('aria-invalid', 'true'); else entrada.removeAttribute('aria-invalid'); }
}

function llenarCategorias(actual) {
  const cats = [...new Set([...CATEGORIAS, ...cargarProductos().map(producto => producto.categoria), actual].filter(Boolean))];
  f.categoria.innerHTML = '<option value="">Seleccione una categoría</option>' +
    cats.map(categoria => `<option value="${escapar(categoria)}">${escapar(categoria)}</option>`).join('');
}

// ---------- Imagen ----------
conectarImagen({
  botonId: 'btnImagen',
  entradaId: 'archivo',
  vistaPreviaId: 'vistaPrevia',
  onCambio: enlace => { imagen = enlace; },
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
form.addEventListener('input', evento => { if (evento.target.name) mostrarError(evento.target.name, ''); $('errorGeneral').hidden = true; });
form.addEventListener('change', evento => { if (evento.target.name) mostrarError(evento.target.name, ''); });

f.precio.addEventListener('blur', () => {
  f.precio.value = f.precio.value.trim() === '' ? '' : moneda(soloNumero(f.precio.value));
});

// ---------- Guardar ----------
function guardar(d) {
  const campos = {
    codigo: d.codigo,
    nombre: d.nombre, categoria: d.categoria, precio: d.precio,
    stock: Number(d.cantidadTexto), descripcion: d.descripcion, imagen: imagen,
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

form.addEventListener('submit', evento => {
  evento.preventDefault();
  const datos = leerDatos();
  const errores = validarProducto(datos, producto ? producto.id : null);
  // Marca en rojo los campos vacíos o inválidos
  CAMPOS.forEach(categoria => mostrarError(categoria, errores[categoria]));
  const primero = CAMPOS.find(categoria => errores[categoria]);
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
    imagen = producto.imagen || '';
    pintarVistaPrevia($('vistaPrevia'), imagen);
  }
} else {
  llenarCategorias();
  f.codigo.placeholder = 'Ej. ' + codigoSugerido();
}
