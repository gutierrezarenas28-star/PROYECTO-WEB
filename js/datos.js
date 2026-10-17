// Configuración y datos iniciales (sólo constantes).
// Carpeta img/ calculada desde la ubicación de este archivo (js/datos.js),
// así funciona sin importar si la página está en la raíz o en html/.
const RUTA_IMG = new URL('../img/', document.currentScript.src).href;

const UMBRAL_STOCK_BAJO = 10; // stock igual o menor a este número = "Stock bajo"
const CATEGORIAS = ['Granos', 'Lácteos', 'Despensa', 'Bebidas'];

const PRODUCTOS_INICIALES = [
  { id: 1, codigo: 'PROD-001', nombre: 'Arroz Diana',     categoria: 'Granos',   precio: 4500,  stock: 25, imagen: RUTA_IMG + 'arroz.jpg', descripcion: 'Arroz blanco de 1 kg' },
  { id: 2, codigo: 'PROD-002', nombre: 'Aceite Premier',  categoria: 'Despensa', precio: 12900, stock: 8,  imagen: RUTA_IMG + 'aceite.jpg' },
  { id: 3, codigo: 'PROD-003', nombre: 'Leche Entera',    categoria: 'Lácteos',  precio: 3800,  stock: 42, imagen: RUTA_IMG + 'leche.jpg' },
  { id: 4, codigo: 'PROD-004', nombre: 'Café Sello Rojo', categoria: 'Bebidas',  precio: 8500,  stock: 5,  imagen: RUTA_IMG + 'cafe.jpg' },
  { id: 5, codigo: 'PROD-005', nombre: 'Frijol Rojo',     categoria: 'Granos',   precio: 6200,  stock: 17, imagen: RUTA_IMG + 'frijol.jpg' },
  { id: 6, codigo: 'PROD-006', nombre: 'Azúcar Morena',   categoria: 'Despensa', precio: 4200,  stock: 31, imagen: RUTA_IMG + 'azucar.jpg' },
];