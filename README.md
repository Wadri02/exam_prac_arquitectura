# Biblioteca - Arquitectura en Capas (Layered)

## ¿Qué es esto?

El código está organizado en tres capas horizontales. Cada capa solo habla con la inmediatamente inferior. La capa de presentación llama a servicios, los servicios llaman a repositorios, los repositorios acceden a los datos.

Esta es la arquitectura MVC/N-capas clásica que se usa en la mayoría de aplicaciones empresariales.

## Estructura de carpetas

```
/
├── index.js                              ← solo inicializa Express y monta rutas
├── package.json
├── README.md
└── src/
    ├── presentation/
    │   └── routes/
    │       ├── librosRoutes.js           ← rutas HTTP /libros
    │       └── prestamosRoutes.js        ← rutas HTTP /prestamos
    ├── business/
    │   └── services/
    │       ├── libroService.js           ← lógica de negocio de libros
    │       └── prestamoService.js        ← lógica de negocio de préstamos
    └── data/
        └── repositories/
            ├── libroRepository.js        ← acceso a datos de libros (memoria)
            └── prestamoRepository.js     ← acceso a datos de préstamos (memoria)
```

## Flujo de una petición

```
HTTP Request
    ↓
Route (presentación)   → parsea HTTP, llama al servicio
    ↓
Service (negocio)      → aplica reglas, orquesta repositorios
    ↓
Repository (datos)     → lee/escribe en el array en memoria
    ↓
Response
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
| POST | /libros | Agrega un libro nuevo |
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

## Ventajas sobre spaghetti

- Cada archivo tiene una responsabilidad clara
- Se puede cambiar el almacenamiento (pasar a BD) tocando solo los repositorios
- Los servicios se pueden probar sin HTTP
- Fácil de encontrar dónde agregar nueva lógica

## Limitaciones

- Las capas están acopladas por imports directos (difícil invertir dependencias)
- El `prestamoService` importa directamente `libroService` (acoplamiento horizontal)
- Escalar a microservicios requeriría reestructurar todo
