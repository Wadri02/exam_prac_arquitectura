const Prestamo = require('../../../domain/prestamos/entities/Prestamo')
const DomainError = require('../../../domain/shared/DomainError')

class PrestarLibroUseCase {

  constructor(prestamoRepository, libroACL) {
    this.prestamoRepository = prestamoRepository
    this.libroACL = libroACL
  }

  async ejecutar({ libroId, usuarioNombre }) {
    const idNumerico = parseInt(libroId)
    if (isNaN(idNumerico)) {
      throw new DomainError('El libroId debe ser un número')
    }

    const infoLibro = await this.libroACL.obtenerInfoLibro(idNumerico)
    if (!infoLibro) {
      throw new DomainError('Libro no encontrado')
    }
    if (!infoLibro.disponible) {
      throw new DomainError('El libro no está disponible para préstamo')
    }

    const prestamo = new Prestamo({
      id: null,
      libroId: idNumerico,
      tituloLibro: infoLibro.titulo,
      usuarioNombre,
      fechaPrestamo: new Date().toLocaleDateString('en-CA')
    })

    const prestamoGuardado = await this.prestamoRepository.guardar(prestamo)

    await this.libroACL.marcarComoPrestado(idNumerico)

    return prestamoGuardado
  }
}

module.exports = PrestarLibroUseCase
