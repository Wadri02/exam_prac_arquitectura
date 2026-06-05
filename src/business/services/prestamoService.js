const prestamoRepository = require('../../data/repositories/prestamoRepository')
const libroService = require('./libroService')

function listarPrestamos() {
  return prestamoRepository.obtenerTodos()
}

function prestarLibro({ libroId, usuarioNombre }) {
  if (!usuarioNombre || usuarioNombre.trim() === '') {
    throw new Error('El nombre del usuario es requerido')
  }

  const idNumerico = parseInt(libroId)
  if (isNaN(idNumerico)) {
    throw new Error('El libroId debe ser un número')
  }

  const libro = libroService.obtenerPorId(idNumerico)
  if (!libro) {
    throw new Error('Libro no encontrado')
  }
  if (!libro.disponible) {
    throw new Error('El libro no está disponible para préstamo')
  }

  const hoy = new Date().toISOString().split('T')[0]
  const prestamo = prestamoRepository.guardar({
    libroId: idNumerico,
    tituloLibro: libro.titulo,
    usuarioNombre: usuarioNombre.trim(),
    fechaPrestamo: hoy
  })

  libroService.cambiarDisponibilidad(idNumerico, false)

  return prestamo
}

function devolverLibro(prestamoId) {
  const prestamo = prestamoRepository.obtenerPorId(prestamoId)
  if (!prestamo) {
    throw new Error('Préstamo no encontrado')
  }
  if (!prestamo.activo) {
    throw new Error('Este préstamo ya fue devuelto')
  }

  const hoy = new Date().toISOString().split('T')[0]
  const prestamoActualizado = prestamoRepository.registrarDevolucion(prestamoId, hoy)

  libroService.cambiarDisponibilidad(prestamo.libroId, true)

  return prestamoActualizado
}

module.exports = {
  listarPrestamos,
  prestarLibro,
  devolverLibro
}
