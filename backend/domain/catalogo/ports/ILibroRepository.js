class ILibroRepository {

  async obtenerTodos() {
    throw new Error('ILibroRepository.obtenerTodos() debe ser implementado')
  }

  async obtenerPorId(id) {
    throw new Error('ILibroRepository.obtenerPorId() debe ser implementado')
  }

  async obtenerPorIsbn(isbn) {
    throw new Error('ILibroRepository.obtenerPorIsbn() debe ser implementado')
  }

  async guardar(libro) {
    throw new Error('ILibroRepository.guardar() debe ser implementado')
  }

  async eliminar(id) {
    throw new Error('ILibroRepository.eliminar() debe ser implementado')
  }

  async actualizar(libro) {
    throw new Error('ILibroRepository.actualizar() debe ser implementado')
  }
}

module.exports = ILibroRepository
