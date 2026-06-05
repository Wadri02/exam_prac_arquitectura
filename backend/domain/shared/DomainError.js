class DomainError extends Error {
  constructor(mensaje) {
    super(mensaje)
    this.name = 'DomainError'
  }
}

module.exports = DomainError
