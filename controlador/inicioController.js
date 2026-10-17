// Controlador del inicio: prepara los datos y se los entrega a la vista.
import { buscarProducto, productosConStockBajo } from '../modelo/repositorio.js';
import { iniciarMenuMovil } from '../js/modulos/componentes.js';
import { renderEncabezado, renderIndicadores, renderRecientes, renderStockBajo } from '../js/modulos/inicio-ui.js';

iniciarMenuMovil();

const usuario = { nombre: 'Laura🥺​' };

// Indicadores decorativos del tablero (datos de ejemplo).
const indicadores = [
  { etiqueta: 'Total de productos',       valor: '126',        nota: '+8 este mes',        emoji: '📦' },
  { etiqueta: 'Productos con poco stock', valor: '13',         nota: 'Requieren atención', emoji: '⚠️', alerta: true },
  { etiqueta: 'Valor del inventario',     valor: '$8.450.000', nota: '+5,4% este mes',     emoji: '💳' },
  { etiqueta: 'Ventas realizadas',        valor: '348',        nota: '+12,6% este mes',    emoji: '💵' },
];

// Productos "recientes" (por ahora, orden fijado a mano).
const IDS_RECENTES = [1, 3, 2, 4];

const recientes = IDS_RECENTES.map(buscarProducto).filter(Boolean);

renderEncabezado(usuario);
renderIndicadores(indicadores);
renderRecientes(recientes);
renderStockBajo(productosConStockBajo());
