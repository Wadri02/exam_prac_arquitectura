const express = require('express')
const router = express.Router()
const libroService = require('../../business/services/libroService')

router.get('/', (req, res) => {
  const libros = libroService.listarLibros()
  res.json(libros)
})

router.post('/', (req, res) => {
  try {
    const libro = libroService.registrarLibro(req.body)
    res.status(201).json(libro)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

router.delete('/:id', (req, res) => {
  try {
    libroService.eliminarLibro(parseInt(req.params.id))
    res.json({ mensaje: 'Libro eliminado correctamente' })
  } catch (error) {
    const estado = error.message === 'Libro no encontrado' ? 404 : 400
    res.status(estado).json({ error: error.message })
  }
})

module.exports = router
