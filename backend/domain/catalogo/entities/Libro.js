const DomainError = require('../../shared/DomainError')
const ISBN = require('../valueobjects/ISBN')
const TituloLibro = require('../valueobjects/TituloLibro')

class Libro {
  constructor({ id, titulo, autor, isbn, anio, disponible = true }) {
    if (!autor || autor.trim() === '') {
      throw new DomainError('El autor no puede estar vacío')
    }
    if (!anio || isNaN(parseInt(anio))) {
      throw new DomainError('El año debe ser un número válido')
    }

    this._id = id
    this._titulo = new TituloLibro(titulo)
    this._autor = autor.trim()
    this._isbn = new ISBN(isbn)
    this._anio = parseInt(anio)
    this._disponible = disponible
  }

  get id() { return this._id }
  get titulo() { return this._titulo.toString() }
  get autor() { return this._autor }
  get isbn() { return this._isbn.toString() }
  get anio() { return this._anio }
  get disponible() { return this._disponible }

  marcarComoPrestado() {
    if (!this._disponible) {
      throw new DomainError('El libro ya está prestado')
    }
    this._disponible = false
  }

  marcarComoDisponible() {
    this._disponible = true
  }

  toJSON() {
    return {
      id: this._id,
      titulo: this._titulo.toString(),
      autor: this._autor,
      isbn: this._isbn.toString(),
      anio: this._anio,
      disponible: this._disponible
    }
  }
}

module.exports = Libro
