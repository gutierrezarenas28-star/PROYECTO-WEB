// Productos: datos de ejemplo en memoria.
// En esta entrega los datos aún no se guardan:
// los cambios duran sólo mientras la página está abierta.
import { PRODUCTOS_INICIALES, UMBRAL_STOCK_BAJO } from './datos.js';

let productosEnMemoria = PRODUCTOS_INICIALES.map(producto => ({ ...producto }));

export function cargarProductos() {
  return productosEnMemoria.map(producto => ({ ...producto }));
}

export function buscarProducto(id) {
  return productosEnMemoria.find(producto => producto.id === id) || null;
}

// Devuelve true si algún otro producto ya usa ese código.
export function existeCodigo(codigo, idExcluido) {
  return productosEnMemoria.some(producto =>
    producto.id !== idExcluido && producto.codigo.toLowerCase() === codigo.toLowerCase());
}

// Ejemplo: "PROD-007" para el siguiente producto.
export function codigoSugerido() {
  const numeros = productosEnMemoria
    .map(producto => Number((producto.codigo.match(/(\d+)$/) || [])[1]))
    .filter(Number.isFinite);
  return 'PROD-' + String(Math.max(0, ...numeros) + 1).padStart(3, '0');
}

// Regla del dominio: un producto tiene stock bajo si su stock
// es menor o igual al umbral configurado.
export function esStockBajo(producto) {
  return producto.stock <= UMBRAL_STOCK_BAJO;
}

// Productos que necesitan reposición.
export function productosConStockBajo() {
  return productosEnMemoria.filter(esStockBajo).map(producto => ({ ...producto }));
}

// Devuelve el id del producto nuevo.
export function agregarProducto(campos) {
  const id = Math.max(0, ...productosEnMemoria.map(producto => producto.id)) + 1;
  productosEnMemoria.push({ id, ...campos });
  return id;
}

export function actualizarProducto(id, campos) {
  const producto = productosEnMemoria.find(elemento => elemento.id === id);
  if (!producto) return false;
  Object.assign(producto, campos);
  return true;
}

export function eliminarProducto(id) {
  productosEnMemoria = productosEnMemoria.filter(producto => producto.id !== id);
}
