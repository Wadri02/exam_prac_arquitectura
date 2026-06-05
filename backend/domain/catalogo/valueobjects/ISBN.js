const ValueObject = require('../../shared/ValueObject')
const DomainError = require('../../shared/DomainError')

class ISBN extends ValueObject {
  constructor(valor) {
    super()
    if (!valor || valor.trim() === '') {
      throw new DomainError('El ISBN no puede estar vacío')
    }
    this.valor = valor.trim()
    Object.freeze(this)
  }

  toString() {
    return this.valor
  }
}

module.exports = ISBN
