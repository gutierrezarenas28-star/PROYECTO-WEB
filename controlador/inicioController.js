// Controlador del inicio: prepara los datos reales y se los entrega a la vista.
import { productosRecientes, productosConStockBajo, resumenInventario } from '../modelo/repositorio.js';
import { PRODUCTOS_RECIENTES } from '../modelo/datos.js';
import { moneda } from '../js/comun/utilidades.js';
import { iniciarMenuMovil } from '../js/modulos/componentes.js';
import { renderEncabezado, renderIndicadores, renderRecientes, renderStockBajo } from '../js/modulos/inicio-ui.js';

iniciarMenuMovil();

const usuario = { nombre: 'Laura' };

function construirIndicadores() {
  const resumen = resumenInventario();
  return [
    { etiqueta: 'Total de productos',       valor: resumen.total,               nota: 'Registrados en el inventario', emoji: '📦' },
    { etiqueta: 'Productos con poco stock', valor: resumen.stockBajo,           nota: 'Requieren atención',           emoji: '⚠️', alerta: resumen.stockBajo > 0 },
    { etiqueta: 'Valor del inventario',     valor: moneda(resumen.valor),       nota: 'Precio por stock',             emoji: '💳' },
    { etiqueta: 'Categorías',               valor: resumen.categorias,          nota: 'En uso',                       emoji: '🏷️' },
  ];
}

renderEncabezado(usuario);
renderIndicadores(construirIndicadores());
renderRecientes(productosRecientes(PRODUCTOS_RECIENTES));
renderStockBajo(productosConStockBajo());
