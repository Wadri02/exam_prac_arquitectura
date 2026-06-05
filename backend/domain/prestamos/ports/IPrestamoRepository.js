class IPrestamoRepository {

  async obtenerTodos() {
    throw new Error('IPrestamoRepository.obtenerTodos() debe ser implementado')
  }

  async obtenerPorId(id) {
    throw new Error('IPrestamoRepository.obtenerPorId() debe ser implementado')
  }

  async guardar(prestamo) {
    throw new Error('IPrestamoRepository.guardar() debe ser implementado')
  }

  async actualizar(prestamo) {
    throw new Error('IPrestamoRepository.actualizar() debe ser implementado')
  }
}

module.exports = IPrestamoRepository
