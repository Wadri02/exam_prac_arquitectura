const libros = []
let contadorId = 1

function obtenerTodos() {
  return [...libros]
}

function obtenerPorId(id) {
  return libros.find(l => l.id === id) || null
}

function obtenerPorIsbn(isbn) {
  return libros.find(l => l.isbn === isbn) || null
}

function guardar(datos) {
  const libro = {
    id: contadorId++,
    titulo: datos.titulo,
    autor: datos.autor,
    isbn: datos.isbn,
    anio: datos.anio,
    disponible: true
  }
  libros.push(libro)
  return libro
}

function eliminar(id) {
  const indice = libros.findIndex(l => l.id === id)
  if (indice === -1) return false
  libros.splice(indice, 1)
  return true
}

function actualizarDisponibilidad(id, disponible) {
  const libro = libros.find(l => l.id === id)
  if (!libro) return null
  libro.disponible = disponible
  return libro
}

module.exports = {
  obtenerTodos,
  obtenerPorId,
  obtenerPorIsbn,
  guardar,
  eliminar,
  actualizarDisponibilidad
}
