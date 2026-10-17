// Piezas de interfaz reutilizables: menú móvil, imagen del producto
// y diálogo de confirmación.
import { $ } from '../comun/utilidades.js';

// ---------- Menú lateral en móvil ----------
export function iniciarMenuMovil() {
  const sidebar = $('sidebar');
  const boton = $('menuBtn');
  if (!sidebar || !boton) return; // no está en esta página
  boton.addEventListener('click', () => sidebar.classList.toggle('abierto'));
  document.addEventListener('click', evento => {
    if (!sidebar.contains(evento.target) && !boton.contains(evento.target)) sidebar.classList.remove('abierto');
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
function reducirImagen(enlace) {
  return new Promise((resolver, rechazar) => {
    const imagen = new Image();
    imagen.onload = () => {
      const escala = Math.min(1, LADO_MAXIMO / Math.max(imagen.width, imagen.height));
      const lienzo = document.createElement('canvas');
      lienzo.width = Math.round(imagen.width * escala);
      lienzo.height = Math.round(imagen.height * escala);
      const contexto = lienzo.getContext('2d');
      contexto.fillStyle = '#fff';
      contexto.fillRect(0, 0, lienzo.width, lienzo.height);
      contexto.drawImage(imagen, 0, 0, lienzo.width, lienzo.height);
      resolver(lienzo.toDataURL('image/jpeg', 0.85));
    };
    imagen.onerror = rechazar;
    imagen.src = enlace;
  });
}

// Muestra la imagen en la caja de vista previa (si no carga, queda el ícono).
export function pintarVistaPrevia(caja, enlace) {
  caja.classList.remove('con-imagen');
  caja.style.backgroundImage = '';
  if (!enlace) return;
  const prueba = new Image();
  prueba.onload = () => {
    caja.style.backgroundImage = `url("${enlace}")`;
    caja.classList.add('con-imagen');
  };
  prueba.src = enlace;
}

// Conecta el botón "Seleccionar imagen" con el input oculto y la vista previa.
// onError se llama con "" para quitar el error, o con el mensaje de error.
export function conectarImagen({ botonId, entradaId, vistaPreviaId, onCambio, onError }) {
  const boton = $(botonId);
  const entrada = $(entradaId);
  const caja = $(vistaPreviaId);
  if (!boton || !entrada || !caja) return;

  boton.addEventListener('click', () => entrada.click());

  entrada.addEventListener('change', evento => {
    const archivo = evento.target.files[0];
    evento.target.value = '';
    if (!archivo) return;
    onError('');
    const error = validarArchivo(archivo);
    if (error) return onError(error);
    leerArchivo(archivo)
      .then(reducirImagen)
      .then(enlace => { pintarVistaPrevia(caja, enlace); onCambio(enlace); })
      .catch(() => onError('No se pudo leer la imagen.'));
  });
}

// ---------- Diálogo de confirmación ----------
let confirmarAccion = null;

export function iniciarConfirmar() {
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
export function mostrarConfirmar(accion) {
  const modal = $('modalEliminar');
  if (!modal) return;
  confirmarAccion = accion;
  modal.showModal();
  $('cancelarEliminar').focus();
}
