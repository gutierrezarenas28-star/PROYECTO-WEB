// Reglas de negocio para validar los datos de un producto.
import { existeCodigo } from './repositorio.js';

// datos: { codigo, nombre, categoria, precio, cantidadTexto, cantidadInvalida }
// Devuelve { campo: mensaje } con los errores encontrados.
export function validarProducto(datos, idActual) {
  const errores = {};

  if (!datos.codigo) errores.codigo = 'El código es obligatorio.';
  else if (existeCodigo(datos.codigo, idActual))
    errores.codigo = 'Ya existe un producto con ese código.';

  if (!datos.nombre) errores.nombre = 'El nombre es obligatorio.';
  if (!datos.categoria) errores.categoria = 'Escribe o selecciona una categoría.';
  if (!(datos.precio > 0)) errores.precio = 'El precio debe ser mayor que 0.';

  if (datos.cantidadTexto === '')
    errores.cantidad = datos.cantidadInvalida ? 'La cantidad debe ser un número entero.' : 'La cantidad es obligatoria.';
  else if (Number(datos.cantidadTexto) < 0) errores.cantidad = 'La cantidad no puede ser negativa.';
  else if (!Number.isInteger(Number(datos.cantidadTexto))) errores.cantidad = 'La cantidad debe ser un número entero.';

  return errores;
}
