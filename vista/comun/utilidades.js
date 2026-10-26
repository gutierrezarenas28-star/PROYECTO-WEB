// Funciones de ayuda compartidas por el modelo, la vista y el controlador.

// Busca un elemento por su id.
export const $ = id => document.getElementById(id);

// Formatea un número como moneda colombiana: 4500 -> "$4.500".
export const moneda = numero => '$' + Number(numero).toLocaleString('es-CO');

// Escapa texto para insertarlo de forma segura en HTML.
export const escapar = s => String(s).replace(/[&<>"']/g, categoria => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[categoria]));

// Deja sólo los dígitos (para el precio tipeado).
export const soloNumero = texto => Number(String(texto).replace(/\D/g, ''));

// Pone en mayúscula la primera letra: "lunes" -> "Lunes".
export const primeraMayuscula = s => s.charAt(0).toUpperCase() + s.slice(1);

// Saludo según la hora del día.
export const saludoSegunHora = h => {
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
};
