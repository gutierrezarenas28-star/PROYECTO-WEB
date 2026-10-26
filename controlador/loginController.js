// Controlador del inicio de sesión:
// por ahora solo diseño (aún no está conectado a la app).
import { $ } from '../vista/comun/utilidades.js';

const form = $('formLogin');

// Mostrar / ocultar contraseña (solo interfaz)
$('verClave').addEventListener('click', e => {
  const boton = e.currentTarget;
  const visible = form.elements.clave.type === 'password';
  form.elements.clave.type = visible ? 'text' : 'password';
  boton.setAttribute('aria-pressed', String(visible));
  boton.setAttribute('aria-label', visible ? 'Ocultar contraseña' : 'Mostrar contraseña');
  boton.querySelector('.ojo-abierto').hidden = visible;
  boton.querySelector('.ojo-cerrado').hidden = !visible;
});

// TODO (cuando se conecte): aquí va la validación y el inicio de sesión real.
// Por ahora se evita que el formulario recargue la página.
form.addEventListener('submit', e => e.preventDefault());
