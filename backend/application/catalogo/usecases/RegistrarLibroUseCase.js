const Libro = require('../../../domain/catalogo/entities/Libro')
const DomainError = require('../../../domain/shared/DomainError')

class RegistrarLibroUseCase {

  constructor(libroRepository) {
    this.libroRepository = libroRepository
  }

  async ejecutar({ titulo, autor, isbn, anio }) {

    const existente = await this.libroRepository.obtenerPorIsbn(isbn)
    if (existente) {
      throw new DomainError('Ya existe un libro con ese ISBN')
    }

    const libro = new Libro({ id: null, titulo, autor, isbn, anio })

    return await this.libroRepository.guardar(libro)
  }
}

module.exports = RegistrarLibroUseCase
