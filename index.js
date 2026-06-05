const express = require('express')

const InMemoryLibroRepository = require('./backend/infrastructure/persistence/InMemoryLibroRepository')
const InMemoryPrestamoRepository = require('./backend/infrastructure/persistence/InMemoryPrestamoRepository')
const LibroACL = require('./backend/infrastructure/acl/LibroACL')

const ListarLibrosUseCase = require('./backend/application/catalogo/usecases/ListarLibrosUseCase')
const RegistrarLibroUseCase = require('./backend/application/catalogo/usecases/RegistrarLibroUseCase')
const EliminarLibroUseCase = require('./backend/application/catalogo/usecases/EliminarLibroUseCase')

const ListarPrestamosUseCase = require('./backend/application/prestamos/usecases/ListarPrestamosUseCase')
const PrestarLibroUseCase = require('./backend/application/prestamos/usecases/PrestarLibroUseCase')
const DevolverLibroUseCase = require('./backend/application/prestamos/usecases/DevolverLibroUseCase')

const LibroController = require('./backend/infrastructure/http/controllers/LibroController')
const PrestamoController = require('./backend/infrastructure/http/controllers/PrestamoController')

const crearLibrosRouter = require('./backend/infrastructure/http/routes/librosRoutes')
const crearPrestamosRouter = require('./backend/infrastructure/http/routes/prestamosRoutes')

const libroRepository = new InMemoryLibroRepository()
const prestamoRepository = new InMemoryPrestamoRepository()

const libroACL = new LibroACL(libroRepository)

const listarLibrosUseCase = new ListarLibrosUseCase(libroRepository)
const registrarLibroUseCase = new RegistrarLibroUseCase(libroRepository)
const eliminarLibroUseCase = new EliminarLibroUseCase(libroRepository)

const listarPrestamosUseCase = new ListarPrestamosUseCase(prestamoRepository)
const prestarLibroUseCase = new PrestarLibroUseCase(prestamoRepository, libroACL)
const devolverLibroUseCase = new DevolverLibroUseCase(prestamoRepository, libroACL)

const libroController = new LibroController(listarLibrosUseCase, registrarLibroUseCase, eliminarLibroUseCase)
const prestamoController = new PrestamoController(prestarLibroUseCase, devolverLibroUseCase, listarPrestamosUseCase)

const app = express()
app.use(express.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

app.use('/libros', crearLibrosRouter(libroController))
app.use('/prestamos', crearPrestamosRouter(prestamoController))

app.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000')
})
