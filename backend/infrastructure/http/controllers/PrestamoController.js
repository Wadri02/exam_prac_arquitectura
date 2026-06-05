const DomainError = require('../../../domain/shared/DomainError')

class PrestamoController {
  constructor(prestarLibroUseCase, devolverLibroUseCase, listarPrestamosUseCase) {
    this.prestarLibroUseCase = prestarLibroUseCase
    this.devolverLibroUseCase = devolverLibroUseCase
    this.listarPrestamosUseCase = listarPrestamosUseCase

    this.listar = this.listar.bind(this)
    this.prestar = this.prestar.bind(this)
    this.devolver = this.devolver.bind(this)
  }

  async listar(req, res) {
    try {
      const prestamos = await this.listarPrestamosUseCase.ejecutar()
      res.json(prestamos)
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  async prestar(req, res) {
    try {
      const prestamo = await this.prestarLibroUseCase.ejecutar(req.body)
      res.status(201).json(prestamo.toJSON())
    } catch (error) {
      if (error instanceof DomainError) {
        const estado = error.message === 'Libro no encontrado' ? 404 : 400
        return res.status(estado).json({ error: error.message })
      }
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  async devolver(req, res) {
    try {
      const prestamo = await this.devolverLibroUseCase.ejecutar(parseInt(req.params.id))
      res.json(prestamo.toJSON())
    } catch (error) {
      if (error instanceof DomainError) {
        const estado = error.message === 'Préstamo no encontrado' ? 404 : 400
        return res.status(estado).json({ error: error.message })
      }
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }
}

module.exports = PrestamoController
