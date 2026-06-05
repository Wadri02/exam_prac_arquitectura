const DomainError = require('../../../domain/shared/DomainError')

class DevolverLibroUseCase {
  constructor(prestamoRepository, libroACL) {
    this.prestamoRepository = prestamoRepository
    this.libroACL = libroACL
  }

  async ejecutar(prestamoId) {
    const prestamo = await this.prestamoRepository.obtenerPorId(prestamoId)
    if (!prestamo) {
      throw new DomainError('Préstamo no encontrado')
    }

    prestamo.registrarDevolucion()

    await this.prestamoRepository.actualizar(prestamo)

    await this.libroACL.marcarComoDisponible(prestamo.libroId)

    return prestamo
  }
}

module.exports = DevolverLibroUseCase
