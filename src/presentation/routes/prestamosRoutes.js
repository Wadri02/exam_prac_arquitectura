const express = require('express')
const router = express.Router()
const prestamoService = require('../../business/services/prestamoService')

router.get('/', (req, res) => {
  const prestamos = prestamoService.listarPrestamos()
  res.json(prestamos)
})

router.post('/', (req, res) => {
  try {
    const prestamo = prestamoService.prestarLibro(req.body)
    res.status(201).json(prestamo)
  } catch (error) {
    const estado = error.message === 'Libro no encontrado' ? 404 : 400
    res.status(estado).json({ error: error.message })
  }
})

router.put('/:id/devolver', (req, res) => {
  try {
    const prestamo = prestamoService.devolverLibro(parseInt(req.params.id))
    res.json(prestamo)
  } catch (error) {
    const estado = error.message === 'Préstamo no encontrado' ? 404 : 400
    res.status(estado).json({ error: error.message })
  }
})

module.exports = router
