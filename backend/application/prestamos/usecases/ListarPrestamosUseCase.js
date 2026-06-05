class ListarPrestamosUseCase {
  constructor(prestamoRepository) {
    this.prestamoRepository = prestamoRepository
  }

  async ejecutar() {
    return await this.prestamoRepository.obtenerTodos()
  }
}

module.exports = ListarPrestamosUseCase
