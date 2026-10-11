// Piezas de interfaz reutilizables: menú móvil, imagen del producto,
// diálogo de confirmación y validación del formulario.

// ---------- Menú lateral en móvil ----------
function iniciarMenuMovil() {
  const sidebar = $('sidebar');
  const boton = $('menuBtn');
  if (!sidebar || !boton) return; // no está en esta página
  boton.addEventListener('click', () => sidebar.classList.toggle('abierto'));
  document.addEventListener('click', e => {
    if (!sidebar.contains(e.target) && !boton.contains(e.target)) sidebar.classList.remove('abierto');
  });
}

// ---------- Imagen del producto ----------
const TIPOS_PERMITIDOS = ['image/png', 'image/jpeg'];
const TAMANO_MAXIMO = 5 * 1024 * 1024; // 5 MB
const LADO_MAXIMO = 480; // px, para que quepa en el almacenamiento

// Devuelve null si el archivo es válido, o el mensaje de error.
function validarArchivo(archivo) {
  if (!TIPOS_PERMITIDOS.includes(archivo.type)) return 'Usa una imagen PNG o JPG.';
  if (archivo.size > TAMANO_MAXIMO) return 'La imagen no puede pesar más de 5 MB.';
  return null;
}

function leerArchivo(archivo) {
  return new Promise((resolver, rechazar) => {
    const lector = new FileReader();
    lector.onload = () => resolver(lector.result);
    lector.onerror = rechazar;
    lector.readAsDataURL(archivo);
  });
}

// Reduce la imagen para que quepa en el almacenamiento del navegador.
function reducirImagen(url) {
  return new Promise((resolver, rechazar) => {
    const img = new Image();
    img.onload = () => {
      const escala = Math.min(1, LADO_MAXIMO / Math.max(img.width, img.height));
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

// Muestra la imagen en la caja de vista previa (si no carga, queda el ícono).
function pintarVistaPrevia(caja, url) {
  caja.classList.remove('con-imagen');
  caja.style.backgroundImage = '';
  if (!url) return;
  const prueba = new Image();
  prueba.onload = () => {
    caja.style.backgroundImage = `url("${url}")`;
    caja.classList.add('con-imagen');
  };
  prueba.src = url;
}

// Conecta el botón "Seleccionar imagen" con el input oculto y la vista previa.
// onError se llama con "" para quitar el error, o con el mensaje de error.
function conectarImagen({ botonId, entradaId, vistaPreviaId, onCambio, onError }) {
  const boton = $(botonId);
  const entrada = $(entradaId);
  const caja = $(vistaPreviaId);
  if (!boton || !entrada || !caja) return;

  boton.addEventListener('click', () => entrada.click());

  entrada.addEventListener('change', e => {
    const archivo = e.target.files[0];
    e.target.value = '';
    if (!archivo) return;
    onError('');
    const error = validarArchivo(archivo);
    if (error) return onError(error);
    leerArchivo(archivo)
      .then(reducirImagen)
      .then(url => { pintarVistaPrevia(caja, url); onCambio(url); })
      .catch(() => onError('No se pudo leer la imagen.'));
  });
}

// ---------- Diálogo de confirmación ----------
let confirmarAccion = null;

function iniciarConfirmar() {
  const modal = $('modalEliminar');
  if (!modal) return; // no está en esta página
  $('cancelarEliminar').addEventListener('click', () => modal.close());
  $('confirmarEliminar').addEventListener('click', () => {
    modal.close();
    if (confirmarAccion) confirmarAccion();
  });
  modal.addEventListener('close', () => { confirmarAccion = null; });
}

// Muestra el diálogo; accion se ejecuta sólo si la persona confirma.
function mostrarConfirmar(accion) {
  const modal = $('modalEliminar');
  if (!modal) return;
  confirmarAccion = accion;
  modal.showModal();
  $('cancelarEliminar').focus();
}

// ---------- Validación del formulario ----------
// datos: { codigo, nombre, categoria, precio, cantidadTexto, cantidadInvalida }
// Devuelve { campo: mensaje } con los errores encontrados.
function validarProducto(datos, idActual) {
  const errores = {};

  if (!datos.codigo) errores.codigo = 'El código es obligatorio.';
  else if (existeCodigo(datos.codigo, idActual))
    errores.codigo = 'Ya existe un producto con ese código.';

  if (!datos.nombre) errores.nombre = 'El nombre es obligatorio.';
  if (!datos.categoria) errores.categoria = 'Seleccione una categoría.';
  if (!(datos.precio > 0)) errores.precio = 'El precio debe ser mayor que 0.';

  if (datos.cantidadTexto === '')
    errores.cantidad = datos.cantidadInvalida ? 'La cantidad debe ser un número entero.' : 'La cantidad es obligatoria.';
  else if (Number(datos.cantidadTexto) < 0) errores.cantidad = 'La cantidad no puede ser negativa.';
  else if (!Number.isInteger(Number(datos.cantidadTexto))) errores.cantidad = 'La cantidad debe ser un número entero.';

  return errores;
}
