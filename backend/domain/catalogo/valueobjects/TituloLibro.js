const ValueObject = require('../../shared/ValueObject')
const DomainError = require('../../shared/DomainError')

class TituloLibro extends ValueObject {
  constructor(valor) {
    super()
    if (!valor || valor.trim() === '') {
      throw new DomainError('El título del libro no puede estar vacío')
    }
    if (valor.trim().length < 2) {
      throw new DomainError('El título del libro debe tener al menos 2 caracteres')
    }
    this.valor = valor.trim()
    Object.freeze(this)
  }

  toString() {
    return this.valor
  }
}

module.exports = TituloLibro
