const usuario = { nombre: 'Laura' };

const indicadores = [
  { etiqueta: 'Total de productos',       valor: '126',        nota: '+8 este mes',        icono: 'package' },
  { etiqueta: 'Productos con poco stock', valor: '13',         nota: 'Requieren atención', icono: 'triangle-alert', alerta: true },
  { etiqueta: 'Valor del inventario',     valor: '$8.450.000', nota: '+5,4% este mes',     icono: 'wallet-cards' },
  { etiqueta: 'Ventas realizadas',        valor: '348',        nota: '+12,6% este mes',    icono: 'badge-dollar-sign' },
];

const lista = cargarProductos();
const porId = id => lista.find(p => p.id === id);
const recientes = [1, 3, 2, 4].map(porId).filter(Boolean);
const stockBajo = [4, 2, 5].map(porId).filter(Boolean);

const mayuscula = s => s.charAt(0).toUpperCase() + s.slice(1);

function saludoSegunHora(h) {
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

function renderEncabezado() {
  const ahora = new Date();
  $('saludo').textContent = `¡${saludoSegunHora(ahora.getHours())}, ${usuario.nombre}!`;
  const corta = ahora.toLocaleDateString('es-CO', { day: 'numeric', month: 'long' });
  $('subtitulo').textContent = `Aquí tienes el resumen de tu tienda para hoy, ${corta}.`;
  const larga = ahora.toLocaleDateString('es-CO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  $('fecha').textContent = mayuscula(larga);
}

function renderIndicadores() {
  $('indicadores').innerHTML = indicadores.map(i => `
    <article class="tarjeta indicador${i.alerta ? ' alerta' : ''}">
      <div class="indicador-cabecera">
        <span>${i.etiqueta}</span>
        <span class="indicador-icono"><i class="icono" data-lucide="${i.icono}"></i></span>
      </div>
      <div class="indicador-valor">${i.valor}</div>
      <div class="indicador-nota">${i.nota}</div>
    </article>`).join('');
}

function filaProducto(p) {
  const bajo = p.stock <= UMBRAL_STOCK_BAJO;
  return `
    <div class="producto">
      <div class="producto-img" style="background-image:url('${esc(p.img)}')" role="img" aria-label="${esc(p.nombre)}"></div>
      <div class="producto-info">
        <span class="producto-nombre">${esc(p.nombre)}</span>
        <span class="producto-categoria">${esc(p.categoria)}</span>
      </div>
      <span class="producto-precio">${moneda(p.precio)}</span>
      <span class="etiqueta-stock${bajo ? ' bajo' : ''}">${p.stock} uds.</span>
    </div>`;
}

renderEncabezado();
renderIndicadores();
$('recientes').innerHTML = recientes.map(filaProducto).join('');
$('stockBajo').innerHTML = stockBajo.map(filaProducto).join('');
lucide.createIcons(); // convierte cada <i data-lucide="..."> en su ícono