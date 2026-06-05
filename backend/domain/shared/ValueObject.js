class ValueObject {
  constructor(valor) {
    if (new.target === ValueObject) {
      throw new Error('ValueObject es abstracto, no se puede instanciar directamente')
    }
  }

  equals(otro) {
    if (!(otro instanceof this.constructor)) return false
    return JSON.stringify(this) === JSON.stringify(otro)
  }
}

module.exports = ValueObject
