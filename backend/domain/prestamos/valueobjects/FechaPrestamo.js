const ValueObject = require('../../shared/ValueObject')
const DomainError = require('../../shared/DomainError')

class FechaPrestamo extends ValueObject {
  constructor(fechaISO) {
    super()
    if (!fechaISO) {
      throw new DomainError('La fecha de préstamo es requerida')
    }
    const fecha = new Date(fechaISO)
    if (isNaN(fecha.getTime())) {
      throw new DomainError('La fecha de préstamo no es válida')
    }
    this.valor = fecha.toISOString().split('T')[0]
    Object.freeze(this)
  }

  toString() {
    return this.valor
  }

  static hoy() {
    return new FechaPrestamo(new Date().toISOString().split('T')[0])
  }
}

module.exports = FechaPrestamo
