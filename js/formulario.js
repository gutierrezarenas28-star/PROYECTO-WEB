// Lógica compartida por "Agregar producto" y "Editar producto"
const modoEditar = document.body.dataset.modo === 'editar';
const form = $('formulario');
const f = form.elements;
const productos = cargarProductos();
const CAMPOS = ['codigo', 'nombre', 'categoria', 'precio', 'cantidad'];

let producto = null;   // producto que se edita (solo en modo editar)
let imagen = '';       // ruta o data URL de la imagen

// ---------- Utilidades ----------
const soloNumero = texto => Number(String(texto).replace(/\D/g, ''));

function codigoSugerido(lista) {
  const numeros = lista.map(p => Number((p.codigo.match(/(\d+)$/) || [])[1])).filter(Number.isFinite);
  return 'PROD-' + String(Math.max(0, ...numeros) + 1).padStart(3, '0');
}

function llenarCategorias(actual) {
  const cats = [...new Set([...CATEGORIAS, ...productos.map(p => p.categoria), actual].filter(Boolean))];
  f.categoria.innerHTML = '<option value="">Seleccione una categoría</option>' +
    cats.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join('');
}

function mostrarError(campo, mensaje) {
  const caja = form.querySelector(`[data-campo="${campo}"]`);
  if (!caja) return;
  const p = caja.querySelector('.campo-error');
  if (p) { p.hidden = !mensaje; p.querySelector('span').textContent = mensaje || ''; }
  caja.classList.toggle('con-error', Boolean(mensaje));
  const entrada = f[campo];
  if (entrada) { if (mensaje) entrada.setAttribute('aria-invalid', 'true'); else entrada.removeAttribute('aria-invalid'); }
}

// ---------- Imagen ----------
function pintarVistaPrevia() {
  const caja = $('vistaPrevia');
  caja.classList.remove('con-imagen');
  caja.style.backgroundImage = '';
  if (!imagen) return;
  const prueba = new Image();
  prueba.onload = () => {
    caja.style.backgroundImage = `url("${imagen}")`;
    caja.classList.add('con-imagen');
  };
  prueba.src = imagen; // si no carga (archivo inexistente) se queda el ícono
}

// Reduce la imagen para que quepa en el almacenamiento del navegador
function reducirImagen(url) {
  return new Promise((resolver, rechazar) => {
    const img = new Image();
    img.onload = () => {
      const max = 480;
      const escala = Math.min(1, max / Math.max(img.width, img.height));
      const lienzo = document.createElement('canvas');
      lienzo.width = Math.round(img.width * escala);
      lienzo.height = Math.round(img.height * escala);
      const ctx = lienzo.getContext('2d');
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, lienzo.width, lienzo.height);
      ctx.drawImage(img, 0, 0, lienzo.width, lienzo.height);
      resolver(lienzo.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = rechazar;
    img.src = url;
  });
}

$('btnImagen').addEventListener('click', () => $('archivo').click());

$('archivo').addEventListener('change', e => {
  const archivo = e.target.files[0];
  e.target.value = '';
  if (!archivo) return;
  mostrarError('imagen', '');
  if (!['image/png', 'image/jpeg'].includes(archivo.type)) return mostrarError('imagen', 'Usa una imagen PNG o JPG.');
  if (archivo.size > 5 * 1024 * 1024) return mostrarError('imagen', 'La imagen no puede pesar más de 5 MB.');
  const lector = new FileReader();
  lector.onload = () => reducirImagen(lector.result)
    .then(url => { imagen = url; pintarVistaPrevia(); })
    .catch(() => mostrarError('imagen', 'No se pudo leer la imagen.'));
  lector.readAsDataURL(archivo);
});

// ---------- Validación ----------
function leerDatos() {
  return {
    codigo: f.codigo.value.trim(),
    nombre: f.nombre.value.trim(),
    categoria: f.categoria.value,
    precio: soloNumero(f.precio.value),
    cantidadTexto: f.cantidad.value,
    descripcion: f.descripcion.value.trim(),
  };
}

function validar(d) {
  const e = {};
  const idActual = producto ? producto.id : null;
  if (!d.codigo) e.codigo = 'El código es obligatorio.';
  else if (productos.some(p => p.id !== idActual && p.codigo.toLowerCase() === d.codigo.toLowerCase()))
    e.codigo = 'Ya existe un producto con ese código.';
  if (!d.nombre) e.nombre = 'El nombre es obligatorio.';
  if (!d.categoria) e.categoria = 'Seleccione una categoría.';
  if (!(d.precio > 0)) e.precio = 'El precio debe ser mayor que 0.';
  if (d.cantidadTexto === '') e.cantidad = f.cantidad.validity.badInput ? 'La cantidad debe ser un número entero.' : 'La cantidad es obligatoria.';
  else if (Number(d.cantidadTexto) < 0) e.cantidad = 'La cantidad no puede ser negativa.';
  else if (!Number.isInteger(Number(d.cantidadTexto))) e.cantidad = 'La cantidad debe ser un número entero.';
  return e;
}

// Quita el error de un campo apenas la persona lo vuelve a editar
form.addEventListener('input', e => { if (e.target.name) mostrarError(e.target.name, ''); $('errorGeneral').hidden = true; });
form.addEventListener('change', e => { if (e.target.name) mostrarError(e.target.name, ''); });

f.precio.addEventListener('blur', () => {
  f.precio.value = f.precio.value.trim() === '' ? '' : moneda(soloNumero(f.precio.value));
});

// ---------- Guardar ----------
function guardar(d) {
  const lista = productos.map(p => ({ ...p }));
  const campos = {
    nombre: d.nombre, categoria: d.categoria, precio: d.precio,
    stock: Number(d.cantidadTexto), descripcion: d.descripcion, img: imagen,
  };
  if (modoEditar) {
    Object.assign(lista.find(p => p.id === producto.id), campos, { codigo: d.codigo });
  } else {
    const id = Math.max(0, ...lista.map(p => p.id)) + 1;
    lista.push({ id, codigo: d.codigo, ...campos });
  }
  if (!guardarProductos(lista)) {
    const aviso = $('errorGeneral');
    aviso.textContent = 'No se pudo guardar: el navegador no tiene espacio. Prueba con una imagen más pequeña.';
    aviso.hidden = false;
    return;
  }
  location.href = 'inventario.html';
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const datos = leerDatos();
  const errores = validar(datos);
  CAMPOS.forEach(c => mostrarError(c, errores[c]));
  const primero = CAMPOS.find(c => errores[c]);
  if (primero) { f[primero].focus(); return; }
  guardar(datos);
});

// ---------- Inicio de la página ----------
if (modoEditar) {
  producto = productos.find(p => p.id === Number(new URLSearchParams(location.search).get('id')));
  if (!producto) {
    location.replace('inventario.html'); // el producto no existe
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
    pintarVistaPrevia();
  }
} else {
  llenarCategorias();
  f.codigo.placeholder = 'Ej. ' + codigoSugerido(productos);
}
lucide.createIcons();