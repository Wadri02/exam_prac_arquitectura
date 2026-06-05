class LibroACL {

  constructor(libroRepository) {
    this.libroRepository = libroRepository
  }

  async obtenerInfoLibro(libroId) {
    const libro = await this.libroRepository.obtenerPorId(libroId)
    if (!libro) return null

    return {
      id: libro.id,
      titulo: libro.titulo,
      disponible: libro.disponible
    }
  }

  async marcarComoPrestado(libroId) {
    const libro = await this.libroRepository.obtenerPorId(libroId)
    if (!libro) return
    libro.marcarComoPrestado()
    await this.libroRepository.actualizar(libro)
  }

  async marcarComoDisponible(libroId) {
    const libro = await this.libroRepository.obtenerPorId(libroId)
    if (!libro) return
    libro.marcarComoDisponible()
    await this.libroRepository.actualizar(libro)
  }
}

module.exports = LibroACL
