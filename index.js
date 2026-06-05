var express = require('express')
var app = express()
app.use(express.json())

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})

var libros = []
var prestamos = []
var contadorLibros = 1
var contadorPrestamos = 1

app.get('/libros', function(req, res) {
  res.json(libros)
})

app.post('/libros', function(req, res) {
  var titulo = req.body.titulo
  var autor = req.body.autor
  var isbn = req.body.isbn
  var anio = req.body.anio

  if (!titulo || titulo == '') {
    res.status(400).json({ error: 'El titulo es requerido' })
    return
  }
  if (!autor || autor == '') {
    res.status(400).json({ error: 'El autor es requerido' })
    return
  }
  if (!isbn || isbn == '') {
    res.status(400).json({ error: 'El ISBN es requerido' })
    return
  }
  if (!anio) {
    res.status(400).json({ error: 'El año es requerido' })
    return
  }

  var encontrado = false
  for (var i = 0; i < libros.length; i++) {
    if (libros[i].isbn == isbn) {
      encontrado = true
      break
    }
  }
  if (encontrado) {
    res.status(400).json({ error: 'Ya existe un libro con ese ISBN' })
    return
  }

  var nuevoLibro = {
    id: contadorLibros,
    titulo: titulo,
    autor: autor,
    isbn: isbn,
    anio: parseInt(anio),
    disponible: true
  }
  contadorLibros++
  libros.push(nuevoLibro)
  res.status(201).json(nuevoLibro)
})

app.delete('/libros/:id', function(req, res) {
  var id = parseInt(req.params.id)
  var indice = -1

  for (var i = 0; i < libros.length; i++) {
    if (libros[i].id == id) {
      indice = i
      break
    }
  }

  if (indice == -1) {
    res.status(404).json({ error: 'Libro no encontrado' })
    return
  }

  if (libros[indice].disponible == false) {
    res.status(400).json({ error: 'No se puede eliminar un libro que esta prestado' })
    return
  }

  libros.splice(indice, 1)
  res.json({ mensaje: 'Libro eliminado correctamente' })
})

app.post('/prestamos', function(req, res) {
  var libroId = parseInt(req.body.libroId)
  var usuarioNombre = req.body.usuarioNombre

  if (!usuarioNombre || usuarioNombre == '') {
    res.status(400).json({ error: 'El nombre del usuario es requerido' })
    return
  }

  var libro = null
  for (var i = 0; i < libros.length; i++) {
    if (libros[i].id == libroId) {
      libro = libros[i]
      break
    }
  }

  if (libro == null) {
    res.status(404).json({ error: 'Libro no encontrado' })
    return
  }

  if (libro.disponible == false) {
    res.status(400).json({ error: 'El libro no esta disponible para prestamo' })
    return
  }

  var hoy = new Date()
  var nuevoPrestamo = {
    id: contadorPrestamos,
    libroId: libroId,
    tituloLibro: libro.titulo,
    usuarioNombre: usuarioNombre,
    fechaPrestamo: hoy.toISOString().split('T')[0],
    fechaDevolucion: null,
    activo: true
  }
  contadorPrestamos++
  prestamos.push(nuevoPrestamo)

  libro.disponible = false

  res.status(201).json(nuevoPrestamo)
})

app.put('/prestamos/:id/devolver', function(req, res) {
  var id = parseInt(req.params.id)
  var prestamo = null

  for (var i = 0; i < prestamos.length; i++) {
    if (prestamos[i].id == id) {
      prestamo = prestamos[i]
      break
    }
  }

  if (prestamo == null) {
    res.status(404).json({ error: 'Prestamo no encontrado' })
    return
  }

  if (prestamo.activo == false) {
    res.status(400).json({ error: 'Este prestamo ya fue devuelto' })
    return
  }

  var hoy = new Date()
  prestamo.fechaDevolucion = hoy.toISOString().split('T')[0]
  prestamo.activo = false

  for (var i = 0; i < libros.length; i++) {
    if (libros[i].id == prestamo.libroId) {
      libros[i].disponible = true
      break
    }
  }

  res.json(prestamo)
})

app.get('/prestamos', function(req, res) {
  res.json(prestamos)
})

app.listen(3000, function() {
  console.log('Servidor corriendo en puerto 3000')
})
