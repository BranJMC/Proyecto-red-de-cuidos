## Recomendacion

La mejor opcion para mover esta app fuera de PostgreSQL sin romper su naturaleza relacional es **MySQL 8 administrado en la nube**.

La recomendacion practica es:

- Motor: **MySQL 8**
- Hosting sugerido:
  - **DigitalOcean Managed MySQL** para una opcion mas estable de produccion
  - **Railway MySQL** si quieres algo mas simple y rapido para salir a web

## Por que MySQL y no Firestore o MongoDB

Esta app no se comporta como una app simple de documentos. Tiene:

- usuarios con roles
- perfiles separados
- reservas
- mensajes
- notificaciones
- pagos
- reportes
- auditoria
- relaciones muchas-a-muchas
- paneles administrativos

Ese tipo de dominio encaja mejor en una base **SQL relacional**.

## Cambios tecnicos que habria que hacer

### Backend

- Cambiar `pg` por `mysql2`
- Cambiar `DATABASE_URL` por una conexion MySQL
- Reescribir queries con placeholders de MySQL
- Ajustar `RETURNING` porque MySQL no lo maneja igual
- Reemplazar algunos casts y funciones de PostgreSQL

### Esquema

- Convertir `uuid` a `char(36)` o `binary(16)`
- Convertir enums de PostgreSQL a `ENUM` de MySQL o tablas catalogo
- Cambiar `jsonb` a `JSON`
- Cambiar vistas y triggers a sintaxis MySQL
- Reemplazar partes de `PostGIS` por `POINT`, `POLYGON`, `SRID` y funciones espaciales de MySQL

### Frontend

- Casi no requiere cambios si el backend conserva las mismas respuestas JSON

## Estrategia recomendada

1. Crear una rama de migracion.
2. Crear carpeta `server-mysql/` o migrar `server/` por etapas.
3. Traducir el esquema SQL a MySQL 8.
4. Levantar una base MySQL web.
5. Reescribir el acceso a datos del backend.
6. Cargar seed de prueba.
7. Probar login, reservas, mensajes, notificaciones, admin y pagos.
8. Cambiar produccion a la nueva `DATABASE_URL`.

## Decision final sugerida

Si quieres la mejor mezcla entre simplicidad y compatibilidad con tu proyecto:

- **Base recomendada:** MySQL 8
- **Proveedor recomendado para produccion:** DigitalOcean Managed MySQL
- **Proveedor recomendado para pruebas rapidas web:** Railway MySQL
