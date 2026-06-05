const DomainError = require('../../../domain/shared/DomainError')

class LibroController {

  constructor(listarLibrosUseCase, registrarLibroUseCase, eliminarLibroUseCase) {
    this.listarLibrosUseCase = listarLibrosUseCase
    this.registrarLibroUseCase = registrarLibroUseCase
    this.eliminarLibroUseCase = eliminarLibroUseCase

    this.listar = this.listar.bind(this)
    this.registrar = this.registrar.bind(this)
    this.eliminar = this.eliminar.bind(this)
  }

  async listar(req, res) {
    try {
      const libros = await this.listarLibrosUseCase.ejecutar()
      res.json(libros)
    } catch (error) {
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  async registrar(req, res) {
    try {
      const libro = await this.registrarLibroUseCase.ejecutar(req.body)
      res.status(201).json(libro.toJSON())
    } catch (error) {
      if (error instanceof DomainError) {
        return res.status(400).json({ error: error.message })
      }
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }

  async eliminar(req, res) {
    try {
      await this.eliminarLibroUseCase.ejecutar(parseInt(req.params.id))
      res.json({ mensaje: 'Libro eliminado correctamente' })
    } catch (error) {
      if (error instanceof DomainError) {
        const estado = error.message === 'Libro no encontrado' ? 404 : 400
        return res.status(estado).json({ error: error.message })
      }
      res.status(500).json({ error: 'Error interno del servidor' })
    }
  }
}

module.exports = LibroController
