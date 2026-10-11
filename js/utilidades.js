// Funciones de ayuda usadas en varias páginas.

// Busca un elemento por su id.
const $ = id => document.getElementById(id);

// Formatea un número como moneda colombiana: 4500 -> "$4.500".
const moneda = n => '$' + Number(n).toLocaleString('es-CO');

// Escapa texto para insertarlo de forma segura en HTML.
const esc = s => String(s).replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));

// Deja sólo los dígitos (para el precio tipeado).
const soloNumero = texto => Number(String(texto).replace(/\D/g, ''));

// Pone en mayúscula la primera letra: "lunes" -> "Lunes".
const primeraMayuscula = s => s.charAt(0).toUpperCase() + s.slice(1);

// Saludo según la hora del día.
const saludoSegunHora = h => {
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
};

// Convierte los <i data-lucide="..."> en íconos (si la librería cargó).
const crearIconos = () => { if (window.lucide) lucide.createIcons(); };
