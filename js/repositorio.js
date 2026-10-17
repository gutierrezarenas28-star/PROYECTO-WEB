// Productos: datos de ejemplo en memoria.
// En esta entrega los datos aún no se guardan:
// los cambios duran sólo mientras la página está abierta.
let productosEnMemoria = PRODUCTOS_INICIALES.map(producto => ({ ...producto }));

function cargarProductos() {
  return productosEnMemoria.map(producto => ({ ...producto }));
}

function buscarProducto(id) {
  return productosEnMemoria.find(producto => producto.id === id) || null;
}

// Devuelve true si algún otro producto ya usa ese código.
function existeCodigo(codigo, idExcluido) {
  return productosEnMemoria.some(producto =>
    producto.id !== idExcluido && producto.codigo.toLowerCase() === codigo.toLowerCase());
}

// Ejemplo: "PROD-007" para el siguiente producto.
function codigoSugerido() {
  const numeros = productosEnMemoria
    .map(producto => Number((producto.codigo.match(/(\d+)$/) || [])[1]))
    .filter(Number.isFinite);
  return 'PROD-' + String(Math.max(0, ...numeros) + 1).padStart(3, '0');
}

// Devuelve el id del producto nuevo.
function agregarProducto(campos) {
  const id = Math.max(0, ...productosEnMemoria.map(producto => producto.id)) + 1;
  productosEnMemoria.push({ id, ...campos });
  return id;
}

function actualizarProducto(id, campos) {
  const producto = productosEnMemoria.find(elemento => elemento.id === id);
  if (!producto) return false;
  Object.assign(producto, campos);
  return true;
}

function eliminarProducto(id) {
  productosEnMemoria = productosEnMemoria.filter(producto => producto.id !== id);
}
