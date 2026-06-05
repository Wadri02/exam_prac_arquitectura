const express = require('express')
const librosRoutes = require('./src/presentation/routes/librosRoutes')
const prestamosRoutes = require('./src/presentation/routes/prestamosRoutes')

const app = express()
app.use(express.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

app.use('/libros', librosRoutes)
app.use('/prestamos', prestamosRoutes)

app.listen(3000, () => {
  console.log('Servidor corriendo en puerto 3000')
})
