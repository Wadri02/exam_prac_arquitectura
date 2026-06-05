# Biblioteca - Arquitectura Spaghetti

## ¿Qué es esto?

Todo el código vive en un solo archivo `index.js`. Express, las rutas, las validaciones, la lógica de negocio y los datos están todos juntos revueltos. Se usaron variables globales con `var` en lugar de `const`/`let`. No hay clases, no hay módulos, no hay separación de responsabilidades.

Este estilo es común cuando alguien aprende a programar o cuando algo se construye "rápido para ayer". Funciona, pero escalar esto es una pesadilla.

## Estructura

```
/
├── index.js       ← todo está acá: datos, rutas, lógica, validaciones
├── package.json
└── README.md
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

## Problemas de esta arquitectura

- Si cambia la forma de guardar datos, hay que reescribir medio archivo
- Las validaciones, la lógica y el acceso a datos están mezclados
- Imposible hacer pruebas unitarias sin levantar Express
- Agregar un endpoint nuevo significa scrollear todo el archivo
- Con más de 5 endpoints se vuelve difícil de leer
