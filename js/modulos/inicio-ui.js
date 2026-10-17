// Vista del inicio: pinta el encabezado, los indicadores y las listas resumen.
import { $, escapar, moneda, primeraMayuscula, saludoSegunHora } from '../comun/utilidades.js';
import { esStockBajo } from '../../modelo/repositorio.js';

function fechaCorta(ahora) {
  return ahora.toLocaleDateString('es-CO', { day: 'numeric', month: 'long' });
}

function fechaLarga(ahora) {
  return primeraMayuscula(ahora.toLocaleDateString('es-CO', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  }));
}

export function renderEncabezado(usuario) {
  const ahora = new Date();
  $('saludo').textContent = `¡${saludoSegunHora(ahora.getHours())}, ${usuario.nombre}!`;
  $('subtitulo').textContent = `Aquí tienes el resumen de tu tienda para hoy, ${fechaCorta(ahora)}.`;
  $('fecha').textContent = fechaLarga(ahora);
}

export function renderIndicadores(indicadores) {
  $('indicadores').innerHTML = indicadores.map(indicador => `
    <article class="tarjeta indicador${indicador.alerta ? ' alerta' : ''}">
      <div class="indicador-cabecera">
        <span>${indicador.etiqueta}</span>
        <span class="indicador-icono">${indicador.emoji}</span>
      </div>
      <div class="indicador-valor">${indicador.valor}</div>
      <div class="indicador-nota">${indicador.nota}</div>
    </article>`).join('');
}

function filaProducto(producto) {
  const bajo = esStockBajo(producto);
  return `
    <div class="producto">
      <div class="producto-imagen" style="background-image:url('${escapar(producto.imagen)}')" role="img" aria-label="${escapar(producto.nombre)}"></div>
      <div class="producto-info">
        <span class="producto-nombre">${escapar(producto.nombre)}</span>
        <span class="producto-categoria">${escapar(producto.categoria)}</span>
      </div>
      <span class="producto-precio">${moneda(producto.precio)}</span>
      <span class="etiqueta-stock${bajo ? ' bajo' : ''}">${producto.stock} uds.</span>
    </div>`;
}

export function renderRecientes(productos) {
  $('recientes').innerHTML = productos.map(filaProducto).join('');
}

export function renderStockBajo(productos) {
  $('stockBajo').innerHTML = productos.map(filaProducto).join('');
}
