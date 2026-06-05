const libroRepository = require('../../data/repositories/libroRepository')

function listarLibros() {
  return libroRepository.obtenerTodos()
}

function registrarLibro({ titulo, autor, isbn, anio }) {
  if (!titulo || titulo.trim() === '') {
    throw new Error('El título es requerido')
  }
  if (!autor || autor.trim() === '') {
    throw new Error('El autor es requerido')
  }
  if (!isbn || isbn.trim() === '') {
    throw new Error('El ISBN es requerido')
  }
  if (!anio || isNaN(anio)) {
    throw new Error('El año es requerido y debe ser un número')
  }

  const existente = libroRepository.obtenerPorIsbn(isbn)
  if (existente) {
    throw new Error('Ya existe un libro con ese ISBN')
  }

  return libroRepository.guardar({ titulo: titulo.trim(), autor: autor.trim(), isbn, anio: parseInt(anio) })
}

function eliminarLibro(id) {
  const libro = libroRepository.obtenerPorId(id)
  if (!libro) {
    throw new Error('Libro no encontrado')
  }
  if (!libro.disponible) {
    throw new Error('No se puede eliminar un libro que está prestado')
  }
  libroRepository.eliminar(id)
}

function cambiarDisponibilidad(id, disponible) {
  return libroRepository.actualizarDisponibilidad(id, disponible)
}

function obtenerPorId(id) {
  return libroRepository.obtenerPorId(id)
}

module.exports = {
  listarLibros,
  registrarLibro,
  eliminarLibro,
  cambiarDisponibilidad,
  obtenerPorId
}
