# Biblioteca - Domain-Driven Design (DDD)

## ¿Qué es esto?

El sistema está dividido en dos **Bounded Contexts** con responsabilidades claramente delimitadas. El dominio puro (entidades, value objects, puertos) no tiene ninguna dependencia de Express ni de librerías externas. Express vive únicamente en la capa de infraestructura.

La relación entre contextos es **Customer/Supplier**: el contexto _Préstamos_ (customer) necesita información del contexto _Catálogo_ (supplier). Un **Anti-Corruption Layer** (LibroACL) actúa como traductor para que el lenguaje de Catálogo no contamine el dominio de Préstamos.

## Estructura de carpetas

```
/
├── index.js                                      ← DI Root: compone todo el grafo de dependencias
├── package.json
├── README.md
└── backend/
    ├── domain/
    │   ├── shared/
    │   │   ├── DomainError.js                    ← error base del dominio
    │   │   └── ValueObject.js                    ← base inmutable para VOs
    │   ├── catalogo/                             ← BC Catálogo
    │   │   ├── entities/
    │   │   │   └── Libro.js                      ← Aggregate Root
    │   │   ├── valueobjects/
    │   │   │   ├── ISBN.js
    │   │   │   └── TituloLibro.js
    │   │   └── ports/
    │   │       └── ILibroRepository.js           ← interfaz (puerto)
    │   └── prestamos/                            ← BC Préstamos
    │       ├── entities/
    │       │   └── Prestamo.js                   ← Aggregate Root
    │       ├── valueobjects/
    │       │   └── FechaPrestamo.js
    │       └── ports/
    │           └── IPrestamoRepository.js        ← interfaz (puerto)
    ├── application/
    │   ├── catalogo/usecases/
    │   │   ├── ListarLibrosUseCase.js
    │   │   ├── RegistrarLibroUseCase.js
    │   │   └── EliminarLibroUseCase.js
    │   └── prestamos/usecases/
    │       ├── ListarPrestamosUseCase.js
    │       ├── PrestarLibroUseCase.js
    │       └── DevolverLibroUseCase.js
    └── infrastructure/
        ├── persistence/
        │   ├── InMemoryLibroRepository.js        ← adaptador: implementa ILibroRepository
        │   └── InMemoryPrestamoRepository.js     ← adaptador: implementa IPrestamoRepository
        ├── acl/
        │   └── LibroACL.js                       ← Anti-Corruption Layer
        └── http/
            ├── controllers/
            │   ├── LibroController.js
            │   └── PrestamoController.js
            └── routes/
                ├── librosRoutes.js
                └── prestamosRoutes.js
```

## Flujo de una petición

```
HTTP Request
    ↓
Route (infraestructura)        → mapea a método del Controller
    ↓
Controller (infraestructura)   → llama al Use Case correspondiente
    ↓
Use Case (aplicación)          → orquesta entidades y repositorios
    ↓
Aggregate (dominio)            → aplica invariantes del negocio
    ↓
Repository (puerto)            → InMemory... (adaptador concreto)
```

## Relación entre Bounded Contexts

```
BC Catálogo                     BC Préstamos
(Supplier)                      (Customer)
    │                               │
    │   LibroACL.js (ACL)           │
    └──────────────────────────────►│
         traduce conceptos
         de Catálogo a lo que
         Préstamos necesita
```

## Cómo ejecutar

```bash
npm install
npm start
```

El servidor levanta en `http://localhost:3000`

## Endpoints disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | /libros | Lista todos los libros |
| POST | /libros | Registra un libro nuevo |
| DELETE | /libros/:id | Elimina un libro |
| GET | /prestamos | Lista todos los préstamos |
| POST | /prestamos | Crea un préstamo |
| PUT | /prestamos/:id/devolver | Devuelve un libro |

### POST /libros — cuerpo esperado
```json
{
  "titulo": "El nombre del viento",
  "autor": "Patrick Rothfuss",
  "isbn": "978-0756404741",
  "anio": 2007
}
```

### POST /prestamos — cuerpo esperado
```json
{
  "libroId": 1,
  "usuarioNombre": "Juan Pérez"
}
```

## Conceptos clave de DDD aplicados

| Concepto | Dónde |
|----------|-------|
| Aggregate Root | `Libro.js`, `Prestamo.js` |
| Value Object | `ISBN.js`, `TituloLibro.js`, `FechaPrestamo.js` |
| Port (interfaz) | `ILibroRepository.js`, `IPrestamoRepository.js` |
| Adapter | `InMemoryLibroRepository.js`, `InMemoryPrestamoRepository.js` |
| Use Case | `*UseCase.js` en `application/` |
| Anti-Corruption Layer | `LibroACL.js` |
| DI Root / Composition Root | `index.js` |
| Bounded Context | `backend/domain/catalogo/`, `backend/domain/prestamos/` |
