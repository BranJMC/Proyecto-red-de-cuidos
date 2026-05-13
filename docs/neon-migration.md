# Migracion a Neon

Esta aplicacion puede migrarse a Neon sin rehacer la logica principal porque Neon es PostgreSQL administrado en la nube y soporta extensiones de Postgres, incluyendo PostGIS.

## Lo importante antes de empezar

- La base actual del proyecto usa `PostgreSQL`.
- El esquema actual usa `pgcrypto`, `citext` y `postgis`.
- Neon documenta conexiones Postgres normales con `sslmode=require`.
- Neon tambien documenta soporte para `postgis` dentro de sus extensiones.

## Paso 1: Crear el proyecto en Neon

1. Entra a [https://neon.com/](https://neon.com/).
2. Crea un proyecto nuevo.
3. Abre el boton `Connect`.
4. Copia la `connection string`.

Ejemplo:

```env
DATABASE_URL=postgresql://usuario:password@ep-xxxx-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

## Paso 2: Crear la base y cargar el esquema

Puedes usar la base por defecto de Neon (`neondb`) o crear una nueva si prefieres separar ambientes.

Desde Windows PowerShell, usando `psql` local:

```powershell
$env:PGPASSWORD='TU_PASSWORD_NEON'
& 'C:\Program Files\PostgreSQL\18\bin\psql.exe' `
  -h 'TU_HOST_NEON' `
  -U 'TU_USUARIO_NEON' `
  -d 'neondb' `
  -f 'C:\Users\Brandon\Desktop\Red de cuidos\database\schema.sql'
```

## Paso 3: Exportar tus datos locales

Si quieres migrar tambien los datos actuales:

```powershell
$env:PGPASSWORD='Red-cuidos3112'
& 'C:\Program Files\PostgreSQL\18\bin\pg_dump.exe' `
  -h localhost `
  -U postgres `
  -d red_cuidados `
  --data-only `
  --inserts `
  --column-inserts `
  -f 'C:\Users\Brandon\Desktop\Red de cuidos\database\red_cuidados-data.sql'
```

## Paso 4: Importar los datos a Neon

```powershell
$env:PGPASSWORD='TU_PASSWORD_NEON'
& 'C:\Program Files\PostgreSQL\18\bin\psql.exe' `
  -h 'TU_HOST_NEON' `
  -U 'TU_USUARIO_NEON' `
  -d 'neondb' `
  -f 'C:\Users\Brandon\Desktop\Red de cuidos\database\red_cuidados-data.sql'
```

## Paso 5: Actualizar el backend

Edita tu `.env`:

```env
PORT=3000
DATABASE_URL=postgresql://usuario:password@ep-xxxx-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=red-cuidados-dev-secret
VITE_API_URL=http://localhost:3000/api
VITE_USE_MOCKS=false
```

El backend ya quedo preparado para aceptar Neon con SSL.

## Paso 6: Probar la API

1. Reinicia el backend:

```powershell
npm run server
```

2. Prueba salud:

```powershell
Invoke-WebRequest http://localhost:3000/api/health | Select-Object -ExpandProperty Content
```

3. Prueba login y rutas clave:
- `/api/auth/login`
- `/api/caregivers`
- `/api/bookings`
- `/api/notifications`
- `/api/admin/users`

## Paso 7: Verificacion funcional

Antes de dar la migracion por cerrada, revisa:

- login
- registro
- onboarding de cuidador
- lista de cuidadores
- favoritos
- reservas
- mensajes
- notificaciones
- comprobantes/pagos
- panel admin

## Recomendacion

La opcion con menos riesgo para ti es Neon, no MongoDB.

MongoDB obligaria a rediseñar varias relaciones del proyecto. Neon conserva el modelo relacional actual, por lo que la mayoria del trabajo es migrar conexion, esquema y datos.
