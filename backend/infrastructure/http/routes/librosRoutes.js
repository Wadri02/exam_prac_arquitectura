const express = require('express')

function crearLibrosRouter(libroController) {
  const router = express.Router()

  router.get('/', libroController.listar)
  router.post('/', libroController.registrar)
  router.delete('/:id', libroController.eliminar)

  return router
}

module.exports = crearLibrosRouter
