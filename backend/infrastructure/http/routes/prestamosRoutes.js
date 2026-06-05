const express = require('express')

function crearPrestamosRouter(prestamoController) {
  const router = express.Router()

  router.get('/', prestamoController.listar)
  router.post('/', prestamoController.prestar)
  router.put('/:id/devolver', prestamoController.devolver)

  return router
}

module.exports = crearPrestamosRouter
