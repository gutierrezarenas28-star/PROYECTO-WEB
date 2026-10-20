// Único archivo que habla con localStorage.
// No conoce productos ni reglas de negocio: solo lee y escribe JSON.

// Devuelve el valor guardado en la clave, o valorPorDefecto si no existe
// o si el contenido está dañado.
export function leerJSON(clave, valorPorDefecto) {
  try {
    const texto = localStorage.getItem(clave);
    return texto === null ? valorPorDefecto : JSON.parse(texto);
  } catch {
    return valorPorDefecto;
  }
}

// Guarda el valor como JSON. Lanza un error si no cabe (cuota llena)
// o si localStorage no está disponible; quien llama decide qué mostrar.
export function guardarJSON(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}
