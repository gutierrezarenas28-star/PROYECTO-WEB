// Productos: reglas de datos (crear, leer, actualizar, eliminar y consultas).
// No toca localStorage directamente: usa almacenamiento.js.
import { CLAVE_PRODUCTOS, UMBRAL_STOCK_BAJO } from './datos.js';
import { leerJSON, guardarJSON } from './almacenamiento.js';

export function cargarProductos() {
  return leerJSON(CLAVE_PRODUCTOS, []);
}

function guardarProductos(productos) {
  guardarJSON(CLAVE_PRODUCTOS, productos);
}

export function buscarProducto(id) {
  return cargarProductos().find(producto => producto.id === id) || null;
}

function siguienteId(productos) {
  return Math.max(0, ...productos.map(producto => producto.id)) + 1;
}

// Devuelve true si algún otro producto ya usa ese código.
export function existeCodigo(codigo, idExcluido) {
  return cargarProductos().some(producto =>
    producto.id !== idExcluido && producto.codigo.toLowerCase() === codigo.toLowerCase());
}

// Ejemplo: "PROD-007" para el siguiente producto.
export function codigoSugerido() {
  const numeros = cargarProductos()
    .map(producto => Number((producto.codigo.match(/(\d+)$/) || [])[1]))
    .filter(Number.isFinite);
  return 'PROD-' + String(Math.max(0, ...numeros) + 1).padStart(3, '0');
}

// ---------- Reglas del dominio ----------
export function esStockBajo(producto) {
  return producto.stock <= UMBRAL_STOCK_BAJO;
}

export function productosConStockBajo() {
  return cargarProductos().filter(esStockBajo);
}

// Los más nuevos primero (el id crece con cada producto agregado).
export function productosRecientes(cantidad) {
  return cargarProductos().sort((a, b) => b.id - a.id).slice(0, cantidad);
}

// Cifras del inventario para el tablero de inicio.
export function resumenInventario() {
  const productos = cargarProductos();
  return {
    total: productos.length,
    stockBajo: productos.filter(esStockBajo).length,
    valor: productos.reduce((suma, producto) => suma + producto.precio * producto.stock, 0),
    categorias: new Set(productos.map(producto => producto.categoria)).size,
  };
}

// ---------- Crear, actualizar y eliminar ----------
// Devuelve el id del producto nuevo.
export function agregarProducto(campos) {
  const productos = cargarProductos();
  const id = siguienteId(productos);
  guardarProductos([...productos, { id, ...campos }]);
  return id;
}

export function actualizarProducto(id, campos) {
  const productos = cargarProductos();
  const existe = productos.some(producto => producto.id === id);
  if (!existe) return false;
  guardarProductos(productos.map(producto => (producto.id === id ? { ...producto, ...campos } : producto)));
  return true;
}

export function eliminarProducto(id) {
  guardarProductos(cargarProductos().filter(producto => producto.id !== id));
}
