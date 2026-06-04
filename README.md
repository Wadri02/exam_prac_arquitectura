# biblioteca-arquitecturas

Proyecto desarrollado para la **Evaluación Sumativa I** (70% de la ponderación). Implementa un sistema de gestión de biblioteca en **Node.js con Express**, donde los mismos endpoints y la misma lógica de negocio se construyen tres veces, cada una con una arquitectura de software diferente. Los datos se almacenan en memoria (sin base de datos).

El objetivo es comparar en la práctica cómo el estilo arquitectónico afecta la organización del código, su mantenibilidad y su capacidad de crecer.

---

## Ramas del proyecto

| Rama | Arquitectura |
|------|-------------|
| `spaghetti` | Código espagueti — todo en un solo archivo |
| `layered` | Monolítico por capas |
| `ddd` | Enfoque DDD con dos Bounded Contexts |
| `main` | Frontend compartido (Bootstrap 5) |

---

## Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- npm (viene con Node.js)
- Git

---

## Clonar el repositorio

```bash
git clone https://github.com/Wadri02/P_practica_arqui.git
cd P_practica_arqui
```

---

## Cómo cambiar de rama y ejecutar

Cada rama contiene su propio backend y el frontend compartido. El flujo es siempre el mismo:

```bash
# 1. Cambiar a la rama que quieres probar
git checkout spaghetti   # o: layered  /  ddd

# 2. Instalar dependencias
npm install

# 3. Arrancar el servidor
npm start
# → Servidor corriendo en http://localhost:3000

# 4. Abrir el frontend
#    Clic derecho en frontend/index.html → Open with Live Server
```

> El frontend es idéntico en todas las ramas. Solo cambia el backend.

### Abrir el frontend con Live Server

Se recomienda usar la extensión **Live Server** de VS Code para abrir el frontend:

1. Instala la extensión [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) en VS Code
2. Asegúrate de que el backend ya esté corriendo (`npm start`)
3. Clic derecho sobre `frontend/index.html` → **Open with Live Server**

Live Server abre el frontend en un puerto automático (normalmente `5500`). Esto funciona sin configuración adicional porque el backend tiene CORS abierto para cualquier origen — línea 41 de `index.js`:

```js
res.setHeader('Access-Control-Allow-Origin', '*') // acepta peticiones desde cualquier puerto
```

---

### Asignar un puerto fijo a Live Server (opcional)

Si prefieres que Live Server use siempre el mismo puerto, crea el archivo `.vscode/settings.json` en la raíz del proyecto:

```json
{
  "liveServer.settings.port": 5500
}
```

Si defines un puerto fijo, puedes también restringir el CORS del backend para que solo acepte peticiones desde ese puerto en lugar de cualquier origen. Cambia la línea 41 de `index.js` en la rama que estés usando:

```js
// Antes (acepta cualquier origen):
res.setHeader('Access-Control-Allow-Origin', '*')

// Después (solo acepta el puerto 5500):
res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500')
```

> Si cambias el puerto de Live Server en `.vscode/settings.json`, actualiza también este valor para que coincidan.

---

### Solución de problemas

**El frontend muestra "No se pudo conectar al servidor"**
→ El backend no está corriendo. Ejecuta `npm start` primero.

**Quieres cambiar el puerto del backend**
→ Actualiza el puerto en dos lugares:
- `index.js` — última línea: `app.listen(3000, ...)`
- `frontend/index.html` línea 92:
```js
const API = 'http://localhost:3000' // ← cambia 3000 por el nuevo puerto
```

---

## Descripción de cada rama

### `spaghetti` — Código espagueti

Todo el código vive en un único archivo `index.js`: Express, las rutas, las validaciones, la lógica de negocio y los datos en variables globales `var`. No hay clases, no hay módulos, no hay separación de responsabilidades.

Representa el estilo habitual cuando se construye algo rápido sin pensar en estructura. Funciona, pero escalar o mantener este código se vuelve difícil a medida que crece.

```
index.js   ← rutas + validaciones + lógica + datos, todo junto
```

---

### `layered` — Monolítico por capas

El código está dividido en tres capas horizontales. Cada capa solo se comunica con la inmediatamente inferior. La presentación llama a servicios, los servicios llaman a repositorios, los repositorios acceden a los datos.

Es la arquitectura N-capas clásica (MVC extendido) que se encuentra en la mayoría de aplicaciones empresariales.

```
src/
├── presentation/routes/    ← traduce HTTP a llamadas de servicio
├── business/services/      ← aplica reglas y orquesta repositorios
└── data/repositories/      ← accede a los datos en memoria
```

---

### `ddd` — Domain-Driven Design

El sistema está dividido en dos **Bounded Contexts** con lenguajes ubicuos propios:

- **Catálogo**: gestiona el inventario de libros (`Libro`, `ISBN`, `TituloLibro`)
- **Préstamos**: gestiona el ciclo de vida de los préstamos (`Prestamo`, `FechaPrestamo`)

La relación entre contextos es **Customer/Supplier**. El contexto Préstamos consulta disponibilidad al Catálogo a través de un **Anti-Corruption Layer** (`LibroACL`), evitando que los conceptos de un contexto contaminen al otro.

Express y el almacenamiento en memoria viven únicamente en la capa de infraestructura. El dominio no tiene ninguna dependencia externa.

```
backend/
├── domain/
│   ├── catalogo/       ← entidades, value objects y puerto del BC Catálogo
│   └── prestamos/      ← entidades, value objects y puerto del BC Préstamos
├── application/        ← casos de uso por bounded context
└── infrastructure/
    ├── persistence/    ← adaptadores InMemory
    ├── acl/            ← Anti-Corruption Layer
    └── http/           ← controladores y rutas Express
index.js                ← DI Root: compone todo el grafo de dependencias
```

---

## Endpoints disponibles (todas las ramas)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/libros` | Lista todos los libros |
| POST | `/libros` | Registra un libro nuevo |
| DELETE | `/libros/:id` | Elimina un libro |
| GET | `/prestamos` | Lista todos los préstamos |
| POST | `/prestamos` | Crea un préstamo |
| PUT | `/prestamos/:id/devolver` | Registra la devolución de un libro |

---

## Estructura general del repositorio

```
P_practica_arqui/
├── frontend/
│   └── index.html      ← interfaz web (Bootstrap 5, igual en todas las ramas)
├── index.js            ← punto de entrada del backend (cambia por rama)
├── package.json
└── README.md
```
