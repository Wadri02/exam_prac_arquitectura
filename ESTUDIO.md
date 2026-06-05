# Guía de estudio — Código línea por línea

Este documento explica cada archivo del proyecto en las tres ramas de arquitectura y el frontend compartido.

---

## Índice

1. [Frontend compartido — `frontend/index.html`](#1-frontend-compartido)
2. [Rama `spaghetti` — `index.js`](#2-rama-spaghetti)
3. [Rama `layered`](#3-rama-layered)
4. [Rama `ddd`](#4-rama-ddd)

---

---

# 1. Frontend compartido

## `frontend/index.html`

El frontend es idéntico en todas las ramas. Se conecta al backend a través de `fetch` (peticiones HTTP).

### Head

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
```
Carga Bootstrap 5 desde internet. Bootstrap es una librería de estilos que da apariencia visual a los elementos HTML sin tener que escribir CSS propio.

---

### Sección de libros (HTML)

```html
<input type="text" id="titulo" class="form-control" placeholder="Título">
```
Crea un campo de texto. El `id="titulo"` permite accederlo desde JavaScript con `document.getElementById('titulo')`. `form-control` es una clase de Bootstrap que le da estilo al input.

```html
<button class="btn btn-primary" onclick="agregarLibro()">Agregar</button>
```
Botón que al ser presionado llama a la función `agregarLibro()` definida en el `<script>` más abajo.

```html
<div id="errorLibro" class="text-danger mt-1"></div>
```
Contenedor vacío que sirve para mostrar mensajes de error debajo del formulario. Se llena desde JavaScript cuando hay un error.

---

### Script — variables globales

```js
const API = 'http://localhost:3000'
```
Guarda la dirección base del backend. Todas las peticiones HTTP usarán esta variable. Si el backend corre en otro puerto, se cambia aquí (línea 92).

```js
let todosLosLibros = []
```
Array que guarda todos los libros cargados desde el servidor. Se usa para poder filtrar localmente sin volver a consultar al backend.

```js
cargarLibros()
cargarPrestamos()
```
Se ejecutan automáticamente cuando la página termina de cargar. Traen los datos iniciales del servidor.

---

### `cargarLibros()`

```js
const res = await fetch(`${API}/libros`)
```
Hace una petición GET a `http://localhost:3000/libros`. `await` espera a que el servidor responda antes de continuar.

```js
todosLosLibros = await res.json()
```
Convierte la respuesta del servidor (que llega como texto JSON) a un array de objetos JavaScript, y lo guarda en la variable global.

```js
renderizarLibros(todosLosLibros)
```
Llama a la función que pinta los libros en la tabla HTML.

```js
catch (e) { ... '<tr><td ... >No se pudo conectar al servidor</td></tr>' }
```
Si el `fetch` falla (el backend no está corriendo), muestra un mensaje de error dentro de la tabla en lugar de dejar la página rota.

---

### `filtrarLibros()`

```js
const texto = document.getElementById('busqueda').value.toLowerCase()
```
Lee el texto que el usuario escribió en el campo de búsqueda y lo convierte a minúsculas para que la búsqueda no distinga mayúsculas.

```js
const filtrados = todosLosLibros.filter(l => l.titulo.toLowerCase().includes(texto))
```
Filtra el array local de libros — no hace una nueva petición al servidor. Solo muestra los libros cuyo título contiene el texto buscado.

---

### `renderizarLibros(libros)`

```js
tbody.innerHTML = libros.map(l => `<tr>...<td>${l.titulo}</td>...</tr>`).join('')
```
Genera el HTML de cada fila de la tabla usando template literals (las comillas invertidas `` ` ``). `map` recorre cada libro y lo convierte en una fila `<tr>`. `join('')` une todas las filas en un solo string que se inyecta en la tabla.

---

### `agregarLibro()`

```js
const body = { titulo: ..., autor: ..., isbn: ..., anio: parseInt(...) }
```
Construye el objeto con los datos del formulario. `parseInt` convierte el año de texto a número entero.

```js
const res = await fetch(`${API}/libros`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body)
})
```
Hace una petición POST al backend. `JSON.stringify` convierte el objeto JavaScript a texto JSON que el servidor puede entender. El header `Content-Type: application/json` le dice al servidor que el cuerpo es JSON.

```js
if (!res.ok) {
  document.getElementById('errorLibro').textContent = data.error
  return
}
```
Si el servidor responde con un código de error (400, 404, etc.), muestra el mensaje de error del servidor debajo del formulario y detiene la ejecución.

---

### `eliminarLibro(id)`

```js
const res = await fetch(`${API}/libros/${id}`, { method: 'DELETE' })
```
Hace una petición DELETE a `/libros/5` (por ejemplo). El `id` viene del botón "Eliminar" de cada fila de la tabla.

---

### `cargarPrestamos()`

```js
const activos = prestamos.filter(p => p.activo)
```
Filtra solo los préstamos activos (`activo: true`). Los préstamos devueltos existen en el array pero no se muestran en la tabla.

---

### `realizarPrestamo()`

Funciona igual que `agregarLibro()` pero hace POST a `/prestamos` con `libroId` y `usuarioNombre`.

---

### `devolverLibro(id)`

```js
await fetch(`${API}/prestamos/${id}/devolver`, { method: 'PUT' })
```
Hace una petición PUT al endpoint de devolución. PUT se usa cuando se actualiza un recurso existente (en este caso el préstamo pasa de activo a devuelto).

---
---

# 2. Rama `spaghetti`

## `index.js` — todo en un solo archivo

Esta rama pone absolutamente todo junto: configuración de Express, datos, validaciones y lógica de negocio.

---

### Configuración inicial

```js
var express = require('express')
var app = express()
app.use(express.json())
```
`require('express')` importa el framework Express. `express()` crea la aplicación. `express.json()` es un middleware que le dice a Express que lea el cuerpo de las peticiones POST/PUT como JSON automáticamente.

Nota: se usa `var` en lugar de `const`/`let` — esto es intencional para mostrar un estilo de código más antiguo y sin buenas prácticas.

```js
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})
```
Configura CORS (Cross-Origin Resource Sharing). Sin esto el navegador bloquea las peticiones del frontend (Live Server en puerto 5500) al backend (puerto 3000) porque son orígenes distintos. El `*` significa que acepta peticiones de cualquier origen. La línea `OPTIONS → 204` responde a las "preflight requests" que el navegador envía antes de algunas peticiones para verificar permisos.

---

### Variables globales de datos

```js
var libros = []
var prestamos = []
var contadorLibros = 1
var contadorPrestamos = 1
```
Los datos viven en arrays en memoria. No hay base de datos. Cada vez que se reinicia el servidor los datos se pierden. Los contadores se usan para asignar IDs autoincrementales.

---

### GET /libros

```js
app.get('/libros', function(req, res) {
  res.json(libros)
})
```
Cuando alguien hace GET a `/libros`, responde con el array completo en formato JSON. Sin validaciones, sin transformaciones — directo al array.

---

### POST /libros

```js
var titulo = req.body.titulo
```
Lee el campo `titulo` del cuerpo JSON de la petición.

```js
if (!titulo || titulo == '') {
  res.status(400).json({ error: 'El titulo es requerido' })
  return
}
```
Valida que el campo no esté vacío. `status(400)` significa "Bad Request" — el cliente envió datos incorrectos. El `return` detiene la ejecución para que no continúe con el resto del código.

```js
var encontrado = false
for (var i = 0; i < libros.length; i++) {
  if (libros[i].isbn == isbn) {
    encontrado = true
    break
  }
}
if (encontrado) { ... }
```
Recorre el array con un `for` clásico para verificar si ya existe un libro con el mismo ISBN. En JavaScript moderno esto se haría con `libros.find(...)`, pero aquí se usa el estilo antiguo intencionalmente.

```js
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
```
Crea el objeto libro, incrementa el contador de IDs, lo agrega al array y responde con `201 Created` y el libro creado.

---

### DELETE /libros/:id

```js
var id = parseInt(req.params.id)
```
`req.params.id` siempre llega como string desde la URL (`/libros/3` → `"3"`). `parseInt` lo convierte a número para poder compararlo.

```js
var indice = -1
for (var i = 0; i < libros.length; i++) {
  if (libros[i].id == id) { indice = i; break }
}
if (indice == -1) { res.status(404).json(...) }
```
Busca el índice del libro en el array. Si no lo encuentra, responde con `404 Not Found`.

```js
libros.splice(indice, 1)
```
Elimina el elemento en la posición `indice`. `splice(posicion, cantidad)` modifica el array original.

---

### POST /prestamos

```js
libro.disponible = false
```
Modifica el objeto libro directamente en el array global. Como JavaScript pasa objetos por referencia, al encontrar el libro con el `for` y asignarlo a `libro`, cualquier cambio en `libro` afecta al objeto dentro del array.

```js
var hoy = new Date()
fechaPrestamo: hoy.toISOString().split('T')[0]
```
`new Date()` obtiene la fecha y hora actual. `.toISOString()` la convierte a formato `"2026-06-05T14:30:00.000Z"`. `.split('T')[0]` toma solo la parte de la fecha: `"2026-06-05"`.

---

### PUT /prestamos/:id/devolver

```js
prestamo.fechaDevolucion = hoy.toISOString().split('T')[0]
prestamo.activo = false
```
Registra la fecha de devolución y marca el préstamo como inactivo.

```js
for (var i = 0; i < libros.length; i++) {
  if (libros[i].id == prestamo.libroId) {
    libros[i].disponible = true
    break
  }
}
```
Busca el libro correspondiente al préstamo y lo marca como disponible nuevamente.

---

### Arranque del servidor

```js
app.listen(3000, function() {
  console.log('Servidor corriendo en puerto 3000')
})
```
Inicia el servidor en el puerto 3000. A partir de aquí Express queda escuchando peticiones indefinidamente.

---
---

# 3. Rama `layered`

Esta rama divide el código en tres carpetas con responsabilidades separadas: presentación, negocio y datos.

---

## `index.js`

```js
const librosRoutes = require('./src/presentation/routes/librosRoutes')
const prestamosRoutes = require('./src/presentation/routes/prestamosRoutes')
```
Solo importa las rutas. Ya no hay lógica de negocio ni acceso a datos aquí.

```js
app.use('/libros', librosRoutes)
app.use('/prestamos', prestamosRoutes)
```
Monta los routers. Cualquier petición que empiece con `/libros` es manejada por `librosRoutes`, y lo mismo para `/prestamos`. El `index.js` en esta rama es solo configuración.

---

## `src/presentation/routes/librosRoutes.js`

La capa de presentación solo sabe de HTTP: recibe peticiones y devuelve respuestas. No tiene lógica de negocio.

```js
const router = express.Router()
```
Crea un router independiente. Un router es como una mini-aplicación Express que maneja un grupo de rutas.

```js
router.get('/', (req, res) => {
  const libros = libroService.listarLibros()
  res.json(libros)
})
```
Para GET `/libros`: delega completamente al servicio y devuelve lo que retorna. La ruta no valida nada ni toca datos.

```js
router.post('/', (req, res) => {
  try {
    const libro = libroService.registrarLibro(req.body)
    res.status(201).json(libro)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})
```
El `try/catch` captura los errores que lanza el servicio (validaciones, ISBN duplicado, etc.) y los convierte en respuestas HTTP con código 400.

```js
const estado = error.message === 'Libro no encontrado' ? 404 : 400
```
Operador ternario: si el mensaje de error es "Libro no encontrado" usa 404, si no usa 400. Así distingue entre "no existe" y "datos inválidos".

```js
module.exports = router
```
Exporta el router para que `index.js` pueda importarlo.

---

## `src/presentation/routes/prestamosRoutes.js`

Mismo patrón que `librosRoutes.js`. Delega a `prestamoService`.

---

## `src/business/services/libroService.js`

La capa de negocio contiene todas las reglas y validaciones. No sabe de HTTP ni de cómo están guardados los datos.

```js
const libroRepository = require('../../data/repositories/libroRepository')
```
Importa el repositorio directamente. Este es el acoplamiento que DDD eliminaría — el servicio sabe exactamente qué implementación de repositorio usa.

```js
function registrarLibro({ titulo, autor, isbn, anio }) {
```
Desestructura el objeto recibido directamente en los parámetros. Es equivalente a recibir un objeto y hacer `const titulo = obj.titulo`, etc.

```js
if (!titulo || titulo.trim() === '') {
  throw new Error('El título es requerido')
}
```
Lanza un error que la capa de presentación capturará en su `try/catch`. El servicio no sabe cómo se mostrará el error — eso es responsabilidad de quien lo llame.

```js
const existente = libroRepository.obtenerPorIsbn(isbn)
if (existente) throw new Error('Ya existe un libro con ese ISBN')
```
Consulta al repositorio si ya existe un libro con ese ISBN antes de guardar.

```js
return libroRepository.guardar({ titulo: titulo.trim(), autor: autor.trim(), isbn, anio: parseInt(anio) })
```
Llama al repositorio para persistir el libro. Devuelve el resultado (el libro con ID asignado) a quien llamó al servicio.

```js
function cambiarDisponibilidad(id, disponible) {
  return libroRepository.actualizarDisponibilidad(id, disponible)
}
```
Función auxiliar que usa `prestamoService` cuando presta o devuelve un libro — así no accede directamente al repositorio de libros desde el servicio de préstamos.

---

## `src/business/services/prestamoService.js`

```js
const libroService = require('./libroService')
```
Importa el servicio de libros. Esto es acoplamiento horizontal (entre servicios de la misma capa) — uno de los puntos débiles de la arquitectura en capas que DDD resuelve con el ACL.

```js
function prestarLibro({ libroId, usuarioNombre }) {
  const libro = libroService.obtenerPorId(idNumerico)
  if (!libro) throw new Error('Libro no encontrado')
  if (!libro.disponible) throw new Error('El libro no está disponible')
  ...
  libroService.cambiarDisponibilidad(idNumerico, false)
}
```
Para hacer un préstamo: verifica que el libro exista y esté disponible, crea el préstamo, y luego actualiza la disponibilidad del libro a través del servicio de libros.

```js
const hoy = new Date().toISOString().split('T')[0]
```
Obtiene la fecha actual en formato `YYYY-MM-DD` en una sola línea.

---

## `src/data/repositories/libroRepository.js`

La capa de datos maneja únicamente el almacenamiento. No tiene lógica de negocio.

```js
const libros = []
let contadorId = 1
```
El array y el contador son variables del módulo. En Node.js cada módulo se carga una sola vez, así que estos valores persisten mientras el servidor esté corriendo.

```js
function obtenerTodos() {
  return [...libros]
}
```
El `[...libros]` es el spread operator — devuelve una copia del array, no el array original. Así el llamador no puede modificar accidentalmente los datos internos.

```js
function obtenerPorId(id) {
  return libros.find(l => l.id === id) || null
}
```
`find` devuelve el primer elemento que cumpla la condición, o `undefined` si no lo encuentra. El `|| null` convierte el `undefined` en `null` para ser más explícito.

```js
function guardar(datos) {
  const libro = { id: contadorId++, ...datos, disponible: true }
  libros.push(libro)
  return libro
}
```
`contadorId++` usa el valor actual y luego lo incrementa. `...datos` expande todas las propiedades del objeto recibido dentro del nuevo objeto.

```js
function actualizarDisponibilidad(id, disponible) {
  const libro = libros.find(l => l.id === id)
  if (!libro) return null
  libro.disponible = disponible
  return libro
}
```
Modifica el objeto directamente en el array (por referencia) y lo devuelve actualizado.

```js
module.exports = { obtenerTodos, obtenerPorId, obtenerPorIsbn, guardar, eliminar, actualizarDisponibilidad }
```
Exporta las funciones como un objeto. Solo lo que está aquí es accesible desde otros archivos.

---

## `src/data/repositories/prestamoRepository.js`

```js
function registrarDevolucion(id, fechaDevolucion) {
  const prestamo = prestamos.find(p => p.id === id)
  if (!prestamo) return null
  prestamo.fechaDevolucion = fechaDevolucion
  prestamo.activo = false
  return prestamo
}
```
Actualiza el préstamo con la fecha de devolución y lo marca como inactivo. Devuelve el préstamo actualizado.

---
---

# 4. Rama `ddd`

Esta rama es la más compleja. Aplica Domain-Driven Design con dos Bounded Contexts separados.

---

## `index.js` — Composition Root

```js
const InMemoryLibroRepository = require('./backend/infrastructure/persistence/InMemoryLibroRepository')
...
const libroRepository = new InMemoryLibroRepository()
```
Este es el único lugar de toda la aplicación donde se decide qué implementación concreta usar. El dominio nunca importa `InMemoryLibroRepository` directamente.

```js
const libroACL = new LibroACL(libroRepository)
```
Crea el Anti-Corruption Layer pasándole el repositorio de libros. El ACL es el puente entre los dos bounded contexts.

```js
const prestarLibroUseCase = new PrestarLibroUseCase(prestamoRepository, libroACL)
```
El caso de uso de préstamos recibe el ACL (no el repositorio de libros directamente). Así el bounded context de Préstamos nunca accede directamente al de Catálogo.

```js
const crearLibrosRouter = require('./backend/infrastructure/http/routes/librosRoutes')
app.use('/libros', crearLibrosRouter(libroController))
```
Las rutas en DDD son funciones que reciben el controller como parámetro (inyección de dependencia), a diferencia de `layered` donde el router importa el servicio directamente.

---

## `backend/domain/shared/DomainError.js`

```js
class DomainError extends Error {
  constructor(mensaje) {
    super(mensaje)
    this.name = 'DomainError'
  }
}
```
Extiende la clase `Error` nativa de JavaScript. `super(mensaje)` llama al constructor de `Error` para configurar el mensaje. `this.name = 'DomainError'` permite identificar este tipo de error con `instanceof DomainError` en los controladores, separando errores de dominio (400) de errores inesperados (500).

---

## `backend/domain/shared/ValueObject.js`

```js
class ValueObject {
  constructor(valor) {
    if (new.target === ValueObject) {
      throw new Error('ValueObject es abstracto, no se puede instanciar directamente')
    }
  }
```
`new.target` contiene la clase que se está instanciando. Si alguien hace `new ValueObject()` directamente, `new.target` es `ValueObject` y lanza el error. Si una subclase llama a `super()`, `new.target` es la subclase y no lanza error. Esto simula clases abstractas en JavaScript.

```js
  equals(otro) {
    if (!(otro instanceof this.constructor)) return false
    return JSON.stringify(this) === JSON.stringify(otro)
  }
```
Compara dos Value Objects por valor, no por referencia. `JSON.stringify` serializa todas las propiedades a string para comparar. `this.constructor` es la clase concreta del objeto (por ejemplo `ISBN`).

---

## `backend/domain/catalogo/entities/Libro.js` — Aggregate Root

```js
class Libro {
  constructor({ id, titulo, autor, isbn, anio, disponible = true }) {
```
`disponible = true` es un valor por defecto — si no se pasa `disponible`, se asume `true`.

```js
    this._titulo = new TituloLibro(titulo)
    this._isbn = new ISBN(isbn)
```
El título y el ISBN no se guardan como strings crudos sino como Value Objects. Esto hace que la validación ocurra en el constructor — si el ISBN es inválido, `new ISBN(isbn)` lanza un error antes de que el libro llegue a existir.

```js
  get id() { return this._id }
  get titulo() { return this._titulo.toString() }
```
Los `get` son propiedades de solo lectura. El guion bajo en `_id` es una convención que indica que la propiedad es privada (no hay propiedades verdaderamente privadas sin el `#` de JavaScript moderno). El getter de `titulo` devuelve el string, no el Value Object, para que la infraestructura no necesite saber que es un `TituloLibro`.

```js
  marcarComoPrestado() {
    if (!this._disponible) throw new DomainError('El libro ya está prestado')
    this._disponible = false
  }
```
Las reglas de negocio viven en la entidad. El libro sabe por sí mismo que no puede prestarse dos veces. En `spaghetti` y `layered` esta regla estaba dispersa en el código.

```js
  toJSON() {
    return { id: this._id, titulo: this._titulo.toString(), ... }
  }
```
Serializa la entidad a un objeto plano. Lo usan los controladores para responder al cliente, ya que Express no puede serializar directamente las propiedades privadas (`_id`, etc.).

---

## `backend/domain/catalogo/valueobjects/ISBN.js`

```js
class ISBN extends ValueObject {
  constructor(valor) {
    super()
    if (!valor || valor.trim() === '') throw new DomainError('El ISBN no puede estar vacío')
    this.valor = valor.trim()
    Object.freeze(this)
  }
```
`super()` llama al constructor de `ValueObject`. `Object.freeze(this)` hace el objeto inmutable — ninguna propiedad puede ser modificada después de la construcción. Esto es fundamental en los Value Objects: su valor nunca cambia.

```js
  toString() { return this.valor }
```
Permite usar el Value Object como string en template literals: `` `ISBN: ${isbn}` `` llama a `toString()` automáticamente.

---

## `backend/domain/catalogo/valueobjects/TituloLibro.js`

```js
if (valor.trim().length < 2) {
  throw new DomainError('El título debe tener al menos 2 caracteres')
}
```
Regla de negocio adicional: el título no puede ser de un solo carácter. Esta validación vive en el Value Object y se aplica en cualquier lugar donde se cree un título.

---

## `backend/domain/catalogo/ports/ILibroRepository.js`

```js
class ILibroRepository {
  async obtenerTodos() {
    throw new Error('ILibroRepository.obtenerTodos() debe ser implementado')
  }
  ...
}
```
Define la interfaz (contrato) que cualquier repositorio de libros debe cumplir. En lenguajes tipados como Java o TypeScript esto sería una interfaz o clase abstracta formal. En JavaScript se simula lanzando errores en los métodos base. El dominio solo conoce esta clase — nunca conoce `InMemoryLibroRepository`.

---

## `backend/domain/prestamos/entities/Prestamo.js`

```js
  registrarDevolucion() {
    if (!this._activo) throw new DomainError('Este préstamo ya fue devuelto')
    this._fechaDevolucion = new Date().toLocaleDateString('en-CA')
    this._activo = false
  }
```
`toLocaleDateString('en-CA')` devuelve la fecha en formato `YYYY-MM-DD` usando la zona horaria local del sistema. Se usa `'en-CA'` (inglés canadiense) porque ese locale produce el formato ISO sin conversión UTC — evita el bug de que la fecha cambie si el servidor está en zona horaria negativa.

---

## `backend/domain/prestamos/valueobjects/FechaPrestamo.js`

```js
  static hoy() {
    return new FechaPrestamo(new Date().toISOString().split('T')[0])
  }
```
Método estático de fábrica — se llama como `FechaPrestamo.hoy()` sin necesidad de crear una instancia primero. Encapsula la lógica de obtener la fecha actual.

---

## `backend/domain/prestamos/ports/IPrestamoRepository.js`

Mismo patrón que `ILibroRepository` pero para préstamos. Define `obtenerTodos`, `obtenerPorId`, `guardar` y `actualizar`.

---

## `backend/application/catalogo/usecases/ListarLibrosUseCase.js`

```js
class ListarLibrosUseCase {
  constructor(libroRepository) {
    this.libroRepository = libroRepository
  }
  async ejecutar() {
    return await this.libroRepository.obtenerTodos()
  }
}
```
El caso de uso más simple posible. Recibe el repositorio por inyección de dependencia (no lo importa) y delega la consulta. El método `ejecutar` es la convención para llamar a un caso de uso.

---

## `backend/application/catalogo/usecases/RegistrarLibroUseCase.js`

```js
const existente = await this.libroRepository.obtenerPorIsbn(isbn)
if (existente) throw new DomainError('Ya existe un libro con ese ISBN')

const libro = new Libro({ id: null, titulo, autor, isbn, anio })
return await this.libroRepository.guardar(libro)
```
El caso de uso orquesta: primero verifica duplicado, luego crea la entidad (que valida sus propios datos internamente), luego persiste. El `id: null` se pasa porque el repositorio asignará el ID real al guardar.

---

## `backend/application/catalogo/usecases/EliminarLibroUseCase.js`

```js
const libro = await this.libroRepository.obtenerPorId(id)
if (!libro) throw new DomainError('Libro no encontrado')
if (!libro.disponible) throw new DomainError('No se puede eliminar un libro prestado')
await this.libroRepository.eliminar(id)
```
Verifica las reglas de negocio antes de eliminar. El caso de uso coordina, la entidad no necesita saber que va a ser eliminada.

---

## `backend/application/prestamos/usecases/PrestarLibroUseCase.js`

```js
constructor(prestamoRepository, libroACL) {
  this.libroACL = libroACL
}
```
Recibe el ACL, no el repositorio de libros. Esta es la diferencia clave con `layered`: el bounded context de Préstamos nunca toca directamente el repositorio del bounded context de Catálogo.

```js
const infoLibro = await this.libroACL.obtenerInfoLibro(idNumerico)
```
Consulta al ACL. El ACL devuelve solo `{ id, titulo, disponible }` — no el objeto `Libro` completo. El bounded context de Préstamos no necesita saber nada más sobre un libro.

```js
const prestamoGuardado = await this.prestamoRepository.guardar(prestamo)
await this.libroACL.marcarComoPrestado(idNumerico)
```
Primero guarda el préstamo, luego actualiza el libro a través del ACL. El orden importa: si `marcarComoPrestado` falla, el préstamo ya fue guardado (esto es un problema de consistencia que en producción se resolvería con transacciones).

---

## `backend/application/prestamos/usecases/DevolverLibroUseCase.js`

```js
prestamo.registrarDevolucion()
await this.prestamoRepository.actualizar(prestamo)
await this.libroACL.marcarComoDisponible(prestamo.libroId)
```
Llama al método de la entidad (que aplica las reglas de negocio), luego persiste el cambio, luego actualiza el libro. La lógica de qué significa "devolver" vive en `Prestamo.registrarDevolucion()`.

---

## `backend/infrastructure/acl/LibroACL.js`

```js
async obtenerInfoLibro(libroId) {
  const libro = await this.libroRepository.obtenerPorId(libroId)
  if (!libro) return null
  return { id: libro.id, titulo: libro.titulo, disponible: libro.disponible }
}
```
El ACL actúa como traductor. Recibe un `Libro` del bounded context de Catálogo y devuelve solo los campos que el bounded context de Préstamos necesita. Así si el modelo de `Libro` cambia, solo hay que actualizar el ACL, no todos los archivos de Préstamos.

```js
async marcarComoPrestado(libroId) {
  const libro = await this.libroRepository.obtenerPorId(libroId)
  libro.marcarComoPrestado()
  await this.libroRepository.actualizar(libro)
}
```
El ACL puede llamar métodos del dominio de Catálogo (`marcarComoPrestado`) porque sí pertenece a la infraestructura que conecta ambos contextos.

---

## `backend/infrastructure/http/controllers/LibroController.js`

```js
constructor(...) {
  this.listar = this.listar.bind(this)
  this.registrar = this.registrar.bind(this)
  this.eliminar = this.eliminar.bind(this)
}
```
El `.bind(this)` es necesario porque cuando Express llama a los métodos del controller como callbacks (`router.get('/', libroController.listar)`), pierde la referencia al objeto original y `this` sería `undefined`. Hacer bind fija el contexto.

```js
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
```
El `instanceof DomainError` distingue errores conocidos (validaciones de negocio → 400) de errores inesperados (bugs → 500). El cliente recibe mensajes descriptivos para los primeros y un mensaje genérico para los segundos.

---

## `backend/infrastructure/http/routes/librosRoutes.js`

```js
function crearLibrosRouter(libroController) {
  const router = express.Router()
  router.get('/', libroController.listar)
  router.post('/', libroController.registrar)
  router.delete('/:id', libroController.eliminar)
  return router
}
module.exports = crearLibrosRouter
```
A diferencia de `layered`, el router es una función de fábrica que recibe el controller como parámetro. Así el router no importa nada — el `index.js` le pasa el controller ya construido con todas sus dependencias.

---

## `backend/infrastructure/persistence/InMemoryLibroRepository.js`

```js
class InMemoryLibroRepository extends ILibroRepository {
```
Extiende `ILibroRepository` — cumple el contrato definido en el dominio. Esto permite que el día que se cambie a PostgreSQL, se cree `PostgresLibroRepository extends ILibroRepository` y se cambie solo la línea en `index.js`.

```js
async obtenerTodos() {
  return this._libros.map(l => l.toJSON())
}
```
Devuelve objetos planos (via `toJSON()`), no instancias de `Libro`. Así la capa de aplicación y los controladores reciben datos serializables sin saber que internamente son objetos de dominio.

```js
async guardar(libro) {
  const libroConId = new Libro({
    id: this._contador++,
    titulo: libro.titulo,
    ...
  })
  this._libros.push(libroConId)
  return libroConId
}
```
Al guardar, crea una nueva instancia de `Libro` con el ID asignado. El repositorio es el responsable de asignar IDs en esta implementación.

```js
async actualizar(libro) {
  const indice = this._libros.findIndex(l => l.id === libro.id)
  if (indice === -1) return null
  this._libros[indice] = libro
  return libro
}
```
Reemplaza el elemento en el array. Se usa cuando la entidad fue modificada fuera del repositorio (como en `DevolverLibroUseCase` donde se llama a `prestamo.registrarDevolucion()` y luego se persiste).

---

## `backend/infrastructure/persistence/InMemoryPrestamoRepository.js`

Mismo patrón que `InMemoryLibroRepository`. Extiende `IPrestamoRepository` e implementa los métodos con arrays en memoria.

---

## Comparación entre las tres ramas

| Aspecto | Spaghetti | Layered | DDD |
|---|---|---|---|
| Archivos | 1 | 8 | 23 |
| ¿Dónde viven las validaciones? | En el endpoint | En el servicio | En la entidad / use case |
| ¿Puede cambiar el almacenamiento sin tocar lógica? | No | Solo repositorios | Sí, solo `index.js` |
| ¿Puede probarse la lógica sin HTTP? | No | Sí (servicios) | Sí (use cases y entidades) |
| ¿Los contextos están separados? | No | No | Sí (ACL) |
| Curva de aprendizaje | Baja | Media | Alta |
