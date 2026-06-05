const prestamos = []
let contadorId = 1

function obtenerTodos() {
  return [...prestamos]
}

function obtenerPorId(id) {
  return prestamos.find(p => p.id === id) || null
}

function guardar(datos) {
  const prestamo = {
    id: contadorId++,
    libroId: datos.libroId,
    tituloLibro: datos.tituloLibro,
    usuarioNombre: datos.usuarioNombre,
    fechaPrestamo: datos.fechaPrestamo,
    fechaDevolucion: null,
    activo: true
  }
  prestamos.push(prestamo)
  return prestamo
}

function registrarDevolucion(id, fechaDevolucion) {
  const prestamo = prestamos.find(p => p.id === id)
  if (!prestamo) return null
  prestamo.fechaDevolucion = fechaDevolucion
  prestamo.activo = false
  return prestamo
}

module.exports = {
  obtenerTodos,
  obtenerPorId,
  guardar,
  registrarDevolucion
}
