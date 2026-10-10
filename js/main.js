// Utilidades y comportamiento común a todas las páginas
const $ = id => document.getElementById(id);
const moneda = n => '$' + Number(n).toLocaleString('es-CO');
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// Menú lateral en móvil
(function iniciarMenu() {
  const sidebar = $('sidebar');
  const boton = $('menuBtn');
  if (!sidebar || !boton) return;
  boton.addEventListener('click', () => sidebar.classList.toggle('abierto'));
  document.addEventListener('click', e => {
    if (!sidebar.contains(e.target) && !boton.contains(e.target)) sidebar.classList.remove('abierto');
  });
})();