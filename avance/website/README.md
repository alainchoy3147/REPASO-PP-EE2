# Cómo crear un Listado nuevo (CRUD completo)

Este es el proceso que se siguió para **Turillos**, **Aplicaciones**, **Experiencias** y **Empresas**.
El ejemplo de esta guía es **Empresas** (tabla `enterprises`), copiado desde **Aplicaciones** (tabla `applications`).

> Regla de oro: **copia la entidad que más se parezca** a la nueva.
> - Solo tiene `name` → copia **Carreras** (`carrer`).
> - Tiene muchos campos y llaves foráneas → copia **Aplicaciones**, **Estudiantes** o **Turillos**.

---

## 0. Antes de empezar

1. PostgreSQL prendido: `cd C:\Users\Cuysin\Downloads\pgsql\pgsql\bin` → `pg_ctl -D ..\data -l ..\postgres.log start`
2. Mira las columnas de la tabla en `db/migrations/20261020125131_create_schema.sql` (busca `CREATE TABLE enterprises`).
   Anota cuáles son **obligatorias** (`NOT NULL`) y cuáles son **llaves foráneas** (`REFERENCES otra_tabla(id)`).
3. ¿La tabla tiene datos? Mírala en Antares. Si está vacía, haz el paso 1. Si ya tiene datos, salta al paso 2.

---

## Resumen: los 3 tipos de cambio

| Tipo | Qué haces | Archivos |
|---|---|---|
| **A. Copiar el archivo entero** | Copias, pegas con otro nombre y haces Ctrl+H | repository, service, api, Listado.jsx, Detalle.jsx, .css |
| **B. Copiar una sección** | Entras al archivo, copias un bloque que ya existe, lo pegas debajo y cambias los nombres | `routes.js`, `enterprise.jsx`, `SideBarEnterprise.jsx`, `index.js` |
| **C. Crear desde cero** | Archivo nuevo | migración de datos (`npm run db:new`) |

---

## Lista de archivos EN ORDEN

| # | Archivo | Tipo | Copiado de |
|---|---|---|---|
| 1 | `db/migrations/xxxx_fill_....sql` | C | — (solo si la tabla está vacía) |
| 2 | `admin/models/enterprise.js` | A | `carrer.js` (casi siempre **ya existe**) |
| 3 | `admin/models/index.js` | B | las relaciones de `Student` (casi siempre **ya existen**) |
| 4 | `admin/repositories/enterprise_repositories.js` | A | `application_repositories.js` |
| 5 | `admin/services/enterprises_service.js` | A | `applications_service.js` |
| 6 | `admin/apis/enterprise_api.js` | A | `application_api.js` |
| 7 | `admin/configs/routes.js` | B | bloque `// api applications` + rutas `/enterprise/applications` |
| 8 | **Probar la API en Chrome** | — | `localhost:3000/api/v1/enterprises` y `/api/v1/enterprises/1` |
| 9 | `src/pages/enterprise/EmpresaListado.jsx` + `.css` | A | `AplicacionListado.jsx` |
| 10 | `src/pages/enterprise/EmpresaDetalle.jsx` + `.css` | A | `AplicacionDetalle.jsx` |
| 11 | `src/entries/enterprise.jsx` | B | los imports y las 3 `<Route>` de Aplicaciones |
| 12 | `src/partials/SideBarEnterprise.jsx` | B | el `<NavLink>` de "Listado de Aplicaciones" |
| 13 | **Probar la página** | — | `localhost:3000/enterprise/enterprises` + **Ctrl+F5** |

> El `.css` puede quedar vacío: crea el archivo y listo (el `.jsx` lo importa y si no existe falla).

---

## Tipo A: copiar el archivo y cambiar nombres (Ctrl+H)

1. En VS Code, clic derecho sobre `application_api.js` → **Copiar** → clic derecho en la carpeta → **Pegar**.
2. Renómbralo a `enterprise_api.js`.
3. Ábrelo y presiona **Ctrl+H**. Activa el botón **`Aa`** (Alt+C) para respetar mayúsculas.
4. Reemplaza **en este orden** (primero plurales, luego singulares) con **Reemplazar todo** (Ctrl+Alt+Enter):

| Buscar | Reemplazar por |
|---|---|
| `Applications` | `Enterprises` |
| `applications` | `enterprises` |
| `Application` | `Enterprise` |
| `application` | `enterprise` |
| `Aplicaciones` | `Empresas` |
| `aplicaciones` | `empresas` |
| `Aplicación` | `Empresa` |
| `aplicación` | `empresa` |

5. Revisa el **import** de arriba: el nombre del archivo debe existir **exactamente igual**
   (`'../services/enterprises_service.js'`). Este fue el error de Turillos: `turillo_repositories.js` vs `turillo_repository.js`.

Haz lo mismo con el repository, el service, el Listado y el Detalle.
En el Listado/Detalle también reemplaza el nombre de las funciones: `_cargarAplicaciones` → `_cargarEmpresas`.

> **Después del Ctrl+H todavía hay que ajustar** lo que es propio de cada entidad:
> los **filtros**, los **includes** y los **campos del formulario**. Eso se explica en la sección "El formulario".

---

## Tipo B: copiar una sección dentro de un archivo

### `admin/configs/routes.js` (2 secciones + 1 import)

```js
// 1. arriba, con los demás imports
import * as enterpriseApis from '../apis/enterprise_api.js';

// 2. copia el bloque "// api applications" y cambia los nombres
router.get('/api/v1/enterprises/test', enterpriseApis.test);
router.get('/api/v1/enterprises/simple', enterpriseApis.listEnterprisesSimple);
router.get('/api/v1/enterprises', enterpriseApis.listEnterprises);
router.get('/api/v1/enterprises/:id', enterpriseApis.getEnterpriseById);
router.post('/api/v1/enterprises', enterpriseApis.createEnterprise);
router.put('/api/v1/enterprises/:id', enterpriseApis.updateEnterprise);
router.delete('/api/v1/enterprises/:id', enterpriseApis.deleteEnterprise);

// 3. abajo, con las páginas de enterprise (si falta, F5 da "Cannot GET")
router.get('/enterprise/enterprises', enterprises.home);
router.get('/enterprise/enterprises/new', enterprises.home);
router.get('/enterprise/enterprises/:id/edit', enterprises.home);
```

- `/api/v1/...` → devuelve **JSON** (lo usa axios).
- `/enterprise/...` → devuelve la **página** de React.
- `/simple` va **antes** de `/:id`; si no, Express cree que "simple" es un id.

### `src/entries/enterprise.jsx` (imports + Routes)

```jsx
import EmpresaListado from '../pages/enterprise/EmpresaListado'   // arriba (¡una sola vez!)
import EmpresaDetalle from '../pages/enterprise/EmpresaDetalle'

{/* Empresas */}
<Route path="enterprises" element={<EmpresaListado />} />
<Route path="enterprises/new" element={<EmpresaDetalle />} />
<Route path="enterprises/:id/edit" element={<EmpresaDetalle />} />
```

Ojo con dos errores que ya pasaron:
- `element={<EstudianteListado />}` en la ruta de turillos → mostraba la página equivocada.
- El mismo `import` dos veces → `[REACT]` no compila y el navegador sigue con la versión vieja.

### `src/partials/SideBarEnterprise.jsx`

Copia un `<NavLink>` completo y cambia `to="/enterprise/enterprises"` y el texto `Listado de Empresas`.

### `admin/models/index.js` (solo si la relación no existe)

```js
Enterprise.belongsTo(District, { foreignKey: 'district_id', as: 'district' });
```
- `belongsTo` va en la tabla que **tiene** la columna `_id`.
- `as` es el nombre con el que aparece en el JSON (`enterprise.district.name`).

---

## El formulario: cómo cambia según los atributos

Cada **columna** de la tabla aparece en **estos lugares**. Para agregar, quitar o cambiar un campo,
busca el nombre con **Ctrl+F** dentro del archivo y toca **todos** los lugares.

### En el Detalle (`EmpresaDetalle.jsx`): 5 lugares por campo

Ejemplo con la columna `ruc`:

```jsx
// 1. ESTADO (arriba)
const [ruc, setRuc] = useState("");

// 2. CARGAR AL EDITAR (dentro de _obtenerEmpresa)
setRuc(enterprise.ruc || "");

// 3. LIMPIAR (dentro de _limpiarFormulario)
setRuc("");

// 4. ENVIAR (dentro de payload)  →  el nombre de la izquierda = nombre de la COLUMNA
ruc: ruc.trim(),

// 5. EL INPUT (en el return) → copia un <div className="col-md-..."> completo y cambia
<div className="col-md-3">
  <label htmlFor="ruc" className="form-label">RUC *</label>
  <input type="text" id="ruc" className="form-control"
         value={ruc} onChange={(e) => setRuc(e.target.value)}
         maxLength={11} required />
</div>
```

> **Truco:** para quitar un campo, haz Ctrl+F con su nombre (`ruc`) y borra las 5 apariciones.
> Para agregar uno, busca un campo del mismo tipo, copia sus 5 apariciones y cambia el nombre.

### En el Listado (`EmpresaListado.jsx`): 1 lugar por columna (+ filtros si quieres)

```jsx
<th>RUC</th>                    // en <thead>
<td>{enterprise.ruc}</td>       // en <tbody>, en el mismo orden
```
Si agregas o quitas columnas, cambia también `colSpan="8"` (número total de columnas) del mensaje "No se encontraron...".

### Qué input usar según el tipo de la columna

| Columna en SQL | Estado inicial | Input | En el payload |
|---|---|---|---|
| `VARCHAR(n) NOT NULL` | `""` | `<input type="text" maxLength={n} required />` | `campo.trim()` |
| `VARCHAR(n)` (puede ser NULL) | `""` | `<input type="text" maxLength={n} />` | `campo.trim() \|\| null` |
| `VARCHAR` de correo | `""` | `<input type="email" />` | `campo.trim()` |
| `TEXT` | `""` | `<textarea rows="3" />` | `campo.trim() \|\| null` |
| `INT` | `""` | `<input type="number" />` | `campo !== "" ? Number(campo) : null` |
| `DECIMAL(10,2)` | `""` | `<input type="number" step="0.01" />` | `campo !== "" ? Number(campo) : null` |
| `DATE` | `""` | `<input type="date" />` | `campo \|\| null` |
| `TIMESTAMP` (fecha) | `""` | `<input type="date" />` y al cargar `valor.slice(0, 10)` | `campo \|\| null` |
| `BOOLEAN` | `false` | `<input type="checkbox" checked={x} onChange={(e) => setX(e.target.checked)} />` | `campo` |
| `INT REFERENCES otra(id)` | `""` | `<select>` con la lista (ver abajo) | `campo !== "" ? Number(campo) : null` |

- El **checkbox** usa `checked` y `e.target.checked` (no `value`). Ejemplo: `is_draft` en `AplicacionDetalle.jsx`.
- Columnas `id`, `created` y `updated` **no van** en el formulario: la BD las llena sola.

### Campo que es llave foránea (FK) → `<select>`

Ejemplo: `district_id` en Empresa (igual que `carrere_id` en Estudiante).

```jsx
// a) un estado para la LISTA y otro para el VALOR elegido
const [districts, setDistricts] = useState([]);
const [districtId, setDistrictId] = useState("");

// b) traer la lista al abrir la página
useEffect(() => {
  const _cargarCatalogos = async () => {
    const districtsRes = await axios.get('/api/v1/districts');
    setDistricts(districtsRes.data.data || []);
  };
  _cargarCatalogos();
}, []);

// c) el select: MUESTRA el nombre, GUARDA el id
<select className="form-select" value={districtId}
        onChange={(e) => setDistrictId(e.target.value)}>
  <option value="">Seleccionar distrito</option>
  {districts.map((district) => (
    <option key={district.id} value={district.id}>{district.name}</option>
  ))}
</select>
```

Requisitos para que funcione:
1. La otra tabla necesita **su API de listado** (`/api/v1/districts`). Si no existe, créala primero
   copiando `districts_apis.js` + service + repository (así se hicieron modalities y workdays).
2. Para mostrar el **nombre** en el Listado: relación en `index.js` + `include` en el repository:
   ```js
   include: [{ model: District, as: 'district', attributes: ['id', 'name'] }]
   ```
   y en la tabla: `<td>{enterprise.district?.name || '—'}</td>`.
3. Si la otra tabla no tiene `name` (por ejemplo `students`), muestra lo que sí tenga:
   `{student.names} {student.last_names}`.
4. Si la FK es `NOT NULL` (ej. `enterprise_id` en applications, `student_id` en experiences), pon `required` en el `<select>`.

### Los filtros del Listado (opcional)

Un filtro nuevo toca 3 archivos. Ejemplo: filtrar empresas por distrito.

| Archivo | Qué agregar |
|---|---|
| `enterprise_api.js` (listEnterprises) | `const districtId = req.query.districtId \|\| null;` y pasarlo al service |
| `enterprises_service.js` (fetchAllPaginated) | `if (districtId) { whereClause.district_id = districtId; }` |
| `EmpresaListado.jsx` | estado `districtId`, el `<select>`, y `params.districtId` en `_cargarEmpresas` |

El buscador de texto está en el service, dentro de `whereClause[Op.or]`: ahí pones las columnas en las que quieres buscar:
```js
whereClause[Op.or] = [
  { name:  { [Op.iLike]: `%${search}%` } },
  { ruc:   { [Op.iLike]: `%${search}%` } },
  { email: { [Op.iLike]: `%${search}%` } },
];
```

---

## Paso 1 (solo si la tabla está vacía): migración de datos

```
npm run db:new fill_enterprises
```
Escribe los INSERT debajo de `-- migrate:up`, el DELETE debajo de `-- migrate:down`, y luego `npm run db:up`.
Si pones los `id` a mano, termina con:
```sql
SELECT setval(pg_get_serial_sequence('enterprises', 'id'), (SELECT MAX(id) FROM enterprises));
```
(si no, al crear desde la página sale **500 Validation error**).
Ejemplo completo: `db/migrations/20261120052841_fill_applications_experiences.sql`.

---

## Cómo probar (y dónde mirar si falla)

1. `npm run dev` (o `rs` si ya estaba prendido).
2. Chrome: `localhost:3000/api/v1/enterprises` y `/api/v1/enterprises/1` → `"success": true`.
3. Chrome: `localhost:3000/enterprise/enterprises` + **Ctrl+F5** → probar Agregar, Editar, Eliminar.

| Síntoma | Dónde mirar |
|---|---|
| Ninguna página carga | Terminal `[EXPRESS]`: `ERR_MODULE_NOT_FOUND` = un import con nombre de archivo mal escrito |
| Cambié React y no se ve | Terminal `[REACT]`: si hay error en rojo, no compiló (ej. import repetido) |
| `X is not associated to Y!` | Falta la relación en `index.js` o el `as` no coincide con el del `include` |
| La tabla sale vacía pero la API trae datos | El `setX(...)`: listado paginado usa `response.data.data.list` |
| 404 en F12 → Network | Falta la ruta en `routes.js` o falta una `/` en la URL del axios |
| `Cannot GET /enterprise/...` al dar F5 | Falta la ruta de página en `routes.js` |
| 500 al guardar | F12 → Network → la respuesta tiene `error`: suele ser un campo `NOT NULL` vacío o un nombre de columna mal escrito en el payload |
