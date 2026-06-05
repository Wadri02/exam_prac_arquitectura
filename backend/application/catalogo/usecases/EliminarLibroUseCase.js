const DomainError = require('../../../domain/shared/DomainError')

class EliminarLibroUseCase {
  constructor(libroRepository) {
    this.libroRepository = libroRepository
  }

  async ejecutar(id) {
    const libro = await this.libroRepository.obtenerPorId(id)
    if (!libro) {
      throw new DomainError('Libro no encontrado')
    }
    if (!libro.disponible) {
      throw new DomainError('No se puede eliminar un libro que está prestado')
    }

    await this.libroRepository.eliminar(id)
  }
}

module.exports = EliminarLibroUseCase
