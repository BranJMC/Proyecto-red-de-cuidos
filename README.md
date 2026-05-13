# CareWy

CareWy es una aplicacion web para conectar familias con cuidadores verificados. El proyecto incluye frontend, backend, base de datos PostgreSQL/Neon y flujos reales de autenticacion, reservas, mensajeria, comprobantes, reportes y revision administrativa.

## Ejecucion rapida

1. Instalar dependencias:

```bash
npm install
```

2. Levantar backend:

```bash
npm run server
```

3. Levantar frontend:

```bash
npm run dev
```

4. Validar antes de presentar:

```bash
npm run lint
npm run build
```

## Accesos importantes

- Cliente demo temporal: `ana@familia.com` / `RedCuidados2026`
- Administrador: `admin@redcuidados.com` / `RedCuidados2026`

El acceso de cliente y cuidador usa correo, contrasena y verificacion por codigo. El administrador entra con credenciales internas.

## Base de datos

- Motor: PostgreSQL
- Proveedor sugerido: Neon
- Script principal: `database/neon-schema.sql`
- Seed opcional para SQL Editor: `database/neon-seed-editor.sql`

## Documentacion clave

- Manual completo: [docs/manual-carewy.md](docs/manual-carewy.md)
- Manual por archivo: [docs/manual-archivos-carewy.md](docs/manual-archivos-carewy.md)
- Evaluacion frente a la rubrica: [docs/evaluacion-rubrica-carewy.md](docs/evaluacion-rubrica-carewy.md)
- Cronograma de finalizacion: [docs/cronograma-finalizacion-carewy.md](docs/cronograma-finalizacion-carewy.md)
- Migracion a Neon: [docs/neon-migration.md](docs/neon-migration.md)

## Stack principal

- Frontend: React + TypeScript
- Backend: Node.js + Express
- Base de datos: PostgreSQL + Neon
- Estilos: Tailwind CSS
- Estado/API: Zustand + Axios

## Estado del sistema

Ya funciona:

- Registro, login, 2FA y recuperacion de contrasena
- Roles de cliente, cuidador y administrador
- Busqueda de cuidadores y reserva de servicios
- Mensajes, notificaciones y reportes
- Subida de comprobantes y revision administrativa
- Postulacion de cuidadores con documentos
- Persistencia real en base de datos

Pendiente para la version final:

- OCR e IA real para validacion automatica de documentos y comprobantes
- Chat completamente en tiempo real
- Push notifications
- Pruebas automatizadas y despliegue final
