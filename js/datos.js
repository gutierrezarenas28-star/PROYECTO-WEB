// Configuración y datos iniciales (sólo constantes).
const UMBRAL_STOCK_BAJO = 10; // stock igual o menor a este número = "Stock bajo"
const CATEGORIAS = ['Granos', 'Lácteos', 'Despensa', 'Bebidas'];

const PRODUCTOS_BASE = [
  { id: 1, codigo: 'PROD-001', nombre: 'Arroz Diana',     categoria: 'Granos',   precio: 4500,  stock: 25, img: 'img/arroz.jpg', descripcion: 'Arroz blanco de 1 kg' },
  { id: 2, codigo: 'PROD-002', nombre: 'Aceite Premier',  categoria: 'Despensa', precio: 12900, stock: 8,  img: 'img/aceite.jpg' },
  { id: 3, codigo: 'PROD-003', nombre: 'Leche Entera',    categoria: 'Lácteos',  precio: 3800,  stock: 42, img: 'img/leche.jpg' },
  { id: 4, codigo: 'PROD-004', nombre: 'Café Sello Rojo', categoria: 'Bebidas',  precio: 8500,  stock: 5,  img: 'img/cafe.jpg' },
  { id: 5, codigo: 'PROD-005', nombre: 'Frijol Rojo',     categoria: 'Granos',   precio: 6200,  stock: 17, img: 'img/frijol.jpg' },
  { id: 6, codigo: 'PROD-006', nombre: 'Azúcar Morena',   categoria: 'Despensa', precio: 4200,  stock: 31, img: 'img/azucar.jpg' },
];
