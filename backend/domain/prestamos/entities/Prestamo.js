const DomainError = require('../../shared/DomainError')
const FechaPrestamo = require('../valueobjects/FechaPrestamo')

class Prestamo {
  constructor({ id, libroId, tituloLibro, usuarioNombre, fechaPrestamo, fechaDevolucion = null, activo = true }) {
    if (!usuarioNombre || usuarioNombre.trim() === '') {
      throw new DomainError('El nombre del usuario no puede estar vacío')
    }
    if (!libroId) {
      throw new DomainError('El ID del libro es requerido')
    }

    this._id = id
    this._libroId = libroId
    this._tituloLibro = tituloLibro
    this._usuarioNombre = usuarioNombre.trim()
    this._fechaPrestamo = new FechaPrestamo(fechaPrestamo)
    this._fechaDevolucion = fechaDevolucion
    this._activo = activo
  }

  get id() { return this._id }
  get libroId() { return this._libroId }
  get tituloLibro() { return this._tituloLibro }
  get usuarioNombre() { return this._usuarioNombre }
  get fechaPrestamo() { return this._fechaPrestamo.toString() }
  get fechaDevolucion() { return this._fechaDevolucion }
  get activo() { return this._activo }

  registrarDevolucion() {
    if (!this._activo) {
      throw new DomainError('Este préstamo ya fue devuelto')
    }
    this._fechaDevolucion = new Date().toLocaleDateString('en-CA')
    this._activo = false
  }

  toJSON() {
    return {
      id: this._id,
      libroId: this._libroId,
      tituloLibro: this._tituloLibro,
      usuarioNombre: this._usuarioNombre,
      fechaPrestamo: this._fechaPrestamo.toString(),
      fechaDevolucion: this._fechaDevolucion,
      activo: this._activo
    }
  }
}

module.exports = Prestamo
