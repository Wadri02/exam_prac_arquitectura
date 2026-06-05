const ILibroRepository = require('../../domain/catalogo/ports/ILibroRepository')
const Libro = require('../../domain/catalogo/entities/Libro')

class InMemoryLibroRepository extends ILibroRepository {
  constructor() {
    super()
    this._libros = []
    this._contador = 1
  }

  async obtenerTodos() {
    return this._libros.map(l => l.toJSON())
  }

  async obtenerPorId(id) {
    return this._libros.find(l => l.id === id) || null
  }

  async obtenerPorIsbn(isbn) {
    return this._libros.find(l => l.isbn === isbn) || null
  }

  async guardar(libro) {

    const libroConId = new Libro({
      id: this._contador++,
      titulo: libro.titulo,
      autor: libro.autor,
      isbn: libro.isbn,
      anio: libro.anio,
      disponible: libro.disponible
    })
    this._libros.push(libroConId)
    return libroConId
  }

  async eliminar(id) {
    const indice = this._libros.findIndex(l => l.id === id)
    if (indice === -1) return false
    this._libros.splice(indice, 1)
    return true
  }

  async actualizar(libro) {
    const indice = this._libros.findIndex(l => l.id === libro.id)
    if (indice === -1) return null
    this._libros[indice] = libro
    return libro
  }
}

module.exports = InMemoryLibroRepository
