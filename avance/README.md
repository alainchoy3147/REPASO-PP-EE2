# Plantilla del Curso de Programación Web 

2026-2

---

## Descripción del Proyecto

Esta plantilla implementa una aplicación web full-stack utilizando React.js + Vite para el frontend y Node.js + Express para el backend. El proyecto está organizado para separar la interfaz, lógica de negocio, acceso a datos y configuración, permitiendo desarrollar tanto el sitio web como un panel administrativo.

La aplicación utiliza Supabase como base de datos y dispone de migraciones SQL para gestionar su estructura y datos iniciales. Además, incluye configuración para Vercel, vistas EJS para páginas del servidor y una API organizada mediante controladores, servicios y repositorios.

| Carpeta | Descripción |
|---|---|
| `admin/` | Lógica del panel administrativo: APIs, controladores, modelos, repositorios y servicios. |
| `api/` | Punto de entrada de la API del servidor. |
| `configs/` | Configuración general, base de datos, middlewares y funciones auxiliares. |
| `db/` | Esquema y migraciones SQL de la base de datos Supabase. |
| `docs/` | Documentación técnica, incluyendo el diagrama de la base de datos. |
| `public/` | Archivos públicos y recursos estáticos. |
| `src/` | Aplicación React: páginas, componentes, estilos, helpers y entradas de la aplicación. |
| `views/` | Plantillas EJS para las páginas renderizadas por Express. |
| `website/` | Lógica del sitio web: APIs, controladores, modelos, repositorios, rutas y servicios. |
| `server.js` | Archivo principal para iniciar y configurar el servidor Express. |


## Comandos GIT

Descargar GIT del [enlace](https://git-scm.com/install/windows)

![Sitio web de descarga](./docs/gitwindows.png)

Crear proyecto GIT

    > git init
    
Loguearse

    > git config --global user.name "Tu Nombre"
    > git config --global user.email "tu@email.com"

Crear rama

    > git checkout -b feature/prueba

Ver ramas

    > git branch

Cambiar rama

    > git checkout #nombre_rama

Cambiar a commit

    > git reset --hard #commit

Cambiar remote

    > git remote set-url origin git@github.com:usuario/repositorio.git

    git remote set-url origin git@github.com:jovaldiv-ops/pw-2026-2.git

Instalar dependencias:

    npm install

npm install -g vercel
vercel login
vercel --prod

---

## Descargar el proyecto desde GitHub (git clone)

Para bajar el proyecto a otra carpeta o a otra PC. Ejemplo con el repo `https://github.com/alainchoy3147/REPASO-PP-EE2.git`.

**1. Abre una terminal en la carpeta donde lo quieres guardar**

En el Explorador de archivos, entra a la carpeta (por ejemplo `Documentos`), escribe `cmd` en la barra de direcciones y presiona Enter.

**2. Descarga el repositorio**

    git clone https://github.com/alainchoy3147/REPASO-PP-EE2.git

Esto crea la carpeta `REPASO-PP-EE2` con todo adentro.

**3. Entra a la carpeta del proyecto** (la que tiene el `package.json`)

    cd REPASO-PP-EE2\avance

**4. Instala las dependencias** (`node_modules` no se sube a GitHub, hay que crearlo)

    npm install

**5. Crea el archivo `.env`** (tampoco se sube a GitHub porque tiene la contraseña)

En VS Code: clic derecho en la carpeta `avance` → **New File** → `.env`, y pega:

    DB="postgres://postgres:123@localhost:5433/bolsa?sslmode=disable"
    DB_NAME="bolsa"
    DB_USER="postgres"
    DB_PASS="123"
    DB_HOST="localhost"
    DB_PORT=5433

**6. Prende PostgreSQL**

    cd C:\Users\Cuysin\Downloads\pgsql\pgsql\bin
    pg_ctl -D ..\data -l ..\postgres.log start

**7. Crea las tablas y los datos** (solo la primera vez, o si la base `bolsa` está vacía)

    cd "ruta\de\REPASO-PP-EE2\avance"
    npm run db:up

> Si `bolsa` ya tiene las tablas de antes, `db:up` solo aplica lo que falte. Si sale un error como
> `relation "carrers" already exists`, la base ya estaba creada por otro proyecto: no hace falta correrlo.

**8. Prende el proyecto**

    npm run dev

Abre `http://localhost:3000/enterprise/carrers`.

**Para bajar cambios nuevos** que subiste después desde otra PC (dentro de la carpeta del proyecto):

    git pull

---

## Subir mi avance a un repositorio vacío de GitHub

**1. Crea el repositorio en GitHub**

En github.com → botón **New** (o **+** → **New repository**) → ponle nombre → **Create repository**.

> Déjalo **vacío**: NO marques "Add a README", ".gitignore" ni "license".
> Si lo creas con README, el primer `git push` sale `rejected` (ver el final de esta sección).

Copia la URL que te da GitHub, por ejemplo: `https://github.com/tu-usuario/mi-repo.git`

**2. Abre la terminal en la carpeta del proyecto** (la que tiene el `package.json`)

En VS Code: **Terminal → New Terminal**.

**3. Revisa que el `.gitignore` exista** y tenga `node_modules/` y `.env`
(así no subes miles de archivos ni tu contraseña).

**4. Revisa si la carpeta ya tiene git**

    git status

- Si dice `fatal: not a git repository` → la carpeta **no** tiene git. Haz el **Caso A**.
- Si muestra archivos o `On branch master` → **ya** tiene git (por ejemplo, la clonaste del repo del profe). Haz el **Caso B**.

### Caso A: la carpeta NO tiene git

    git init
    git add .
    git commit -m "Mi avance"
    git branch -M main
    git remote add origin https://github.com/tu-usuario/mi-repo.git
    git push -u origin main

### Caso B: la carpeta YA tiene git (apunta al repo del profe)

No borres el remote del profe. Agrega **otro** remote con un nombre distinto (`mio`):

    git add .
    git commit -m "Mi avance"
    git remote add mio https://github.com/tu-usuario/mi-repo.git
    git push -u mio master:main

- `master:main` = sube tu rama local `master` como rama `main` en GitHub.
  Si tu rama se llama distinto, mira cuál es con `git branch` (la que tiene `*`).
- Con `git remote -v` ves los dos: `origin` (el del profe) y `mio` (el tuyo).

### La primera vez que haces push

Se abre una ventana del navegador para iniciar sesión en GitHub. Inicia sesión con la cuenta
**dueña del repositorio** y autoriza. Las siguientes veces ya no lo pide.

### Para subir cambios después

    git add .
    git commit -m "Describe lo que cambiaste"
    git push            (Caso A)
    git push mio        (Caso B)

### Errores comunes

| Mensaje | Qué pasa | Solución |
|---|---|---|
| `rejected ... (fetch first)` | El repo de GitHub no está vacío (tiene un README) | `git pull origin main --allow-unrelated-histories` (Caso B: `mio` en vez de `origin`), y luego vuelve a hacer push |
| `remote origin already exists` | Ya hay un remote con ese nombre | Usa otro nombre (`mio`), o cámbialo: `git remote set-url origin URL` |
| `Permission denied` / `403` | Iniciaste sesión con otra cuenta | Panel de control → **Administrador de credenciales** → **Credenciales de Windows** → borra la de `git:https://github.com` y vuelve a hacer push |
| `nothing to commit` | No hay cambios nuevos | Igual puedes hacer `git push` si ya tenías commits sin subir |
| `src refspec main does not match any` | Tu rama no se llama `main` | Mira el nombre con `git branch` y úsalo en el push |