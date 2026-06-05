class ListarLibrosUseCase {
  constructor(libroRepository) {
    this.libroRepository = libroRepository
  }

  async ejecutar() {
    return await this.libroRepository.obtenerTodos()
  }
}

module.exports = ListarLibrosUseCase
