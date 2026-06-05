const IPrestamoRepository = require('../../domain/prestamos/ports/IPrestamoRepository')
const Prestamo = require('../../domain/prestamos/entities/Prestamo')

class InMemoryPrestamoRepository extends IPrestamoRepository {
  constructor() {
    super()
    this._prestamos = []
    this._contador = 1
  }

  async obtenerTodos() {
    return this._prestamos.map(p => p.toJSON())
  }

  async obtenerPorId(id) {
    return this._prestamos.find(p => p.id === id) || null
  }

  async guardar(prestamo) {

    const prestamoConId = new Prestamo({
      id: this._contador++,
      libroId: prestamo.libroId,
      tituloLibro: prestamo.tituloLibro,
      usuarioNombre: prestamo.usuarioNombre,
      fechaPrestamo: prestamo.fechaPrestamo,
      fechaDevolucion: prestamo.fechaDevolucion,
      activo: prestamo.activo
    })
    this._prestamos.push(prestamoConId)
    return prestamoConId
  }

  async actualizar(prestamo) {
    const indice = this._prestamos.findIndex(p => p.id === prestamo.id)
    if (indice === -1) return null
    this._prestamos[indice] = prestamo
    return prestamo
  }
}

module.exports = InMemoryPrestamoRepository
