# Red de Cuidados

Red de Cuidados es una Progressive Web App (PWA) para conectar clientes con cuidadores verificados. La plataforma esta disenada para servicios de cuidado infantil, adulto mayor, asistencia a personas con discapacidad, apoyo en el hogar, servicios por hora, turnos nocturnos y servicios de emergencia.

El sistema actual corresponde a una version frontend funcional con datos simulados, arquitectura preparada para backend, rutas por rol, paneles administrativos, flujo de reserva, chat, notificaciones, comprobantes, verificacion de cuidadores y un script inicial de base de datos PostgreSQL.

## Objetivo Del Proyecto

El objetivo es construir una plataforma profesional donde:

- Los clientes puedan buscar cuidadores, revisar perfiles, ver resenas, hacer reservas, subir comprobantes de pago, chatear y reportar problemas.
- Los cuidadores puedan registrarse, completar verificacion obligatoria, configurar zonas, tarifas, horarios, calendario, aceptar servicios y registrar entrada/salida.
- Los administradores puedan revisar cuidadores, comprobantes, reportes, alertas de fraude, metricas, auditoria y backups diarios.
- La futura capa backend pueda conectar autenticacion real, base de datos, notificaciones en tiempo real e inteligencia artificial para verificaciones.

## Tecnologias Utilizadas

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Zustand
- React Hook Form
- Zod
- Framer Motion
- Axios
- Socket.io Client
- Recharts
- PWA con manifest, service worker y pagina offline

### Backend Propuesto

- Node.js con Express o NestJS
- API REST
- Socket.io para chat y notificaciones
- Autenticacion con JWT, refresh tokens y OTP por correo
- Servicios de IA para revision documental y comprobantes

### Base De Datos Propuesta

- PostgreSQL como base principal
- PostGIS para zonas, ubicacion y mapas de calor
- Tablas internas para OTP, sesiones, notificaciones, jobs y auditoria
- Almacenamiento de archivos mediante filesystem local en desarrollo o storage compatible en produccion

## Instrucciones Para Ejecutar El Sistema

### Requisitos Previos

- Node.js 18 o superior
- npm
- Git

### Instalacion

```bash
npm install
```

### Ejecutar En Desarrollo

```bash
npm run dev
```

La aplicacion quedara disponible normalmente en:

```txt
http://localhost:5173
```

### Validar El Proyecto

```bash
npm run lint
npm run build
```

## Accesos Y Flujo Actual

La pantalla inicial muestra dos opciones publicas:

- Ingresar como cliente
- Ingresar como cuidador

Al seleccionar una opcion, se abre una pagina de acceso dedicada:

```txt
/auth/access/client
/auth/access/caregiver
```

El acceso de administrador no se muestra publicamente. Actualmente se mantiene disponible mediante modo demo para revisar avances:

```txt
/demo
```

Cuando se implemente el backend, el administrador debera tener credenciales internas propias y autenticacion reforzada.

## Evidencia Visual

Las capturas deben agregarse en una carpeta del proyecto, por ejemplo:

```txt
docs/screenshots/
```

Capturas sugeridas:

- Landing con selector de rol cliente/cuidador.
- Pantalla de acceso por rol.
- Dashboard del cliente.
- Busqueda y reserva con perfil de cuidador.
- Dashboard del cuidador.
- Calendario mensual del cuidador.
- Panel admin de aprobaciones.
- Panel admin de comprobantes.

Ejemplo de referencia Markdown:

```md
![Landing](docs/screenshots/landing.png)
![Dashboard cliente](docs/screenshots/client-dashboard.png)
![Panel admin](docs/screenshots/admin-dashboard.png)
```

> Nota: las imagenes no se incluyen todavia en el repositorio. Deben capturarse ejecutando la aplicacion localmente.

## Arquitectura Del Sistema

La arquitectura propuesta es cliente-servidor.

Actualmente el repositorio contiene el frontend completo. El backend y la base de datos estan definidos a nivel de preparacion tecnica mediante servicios mock, tipos TypeScript y script SQL.

### Tipo De Arquitectura

- Cliente-servidor para la comunicacion entre frontend y backend.
- Arquitectura por capas en frontend.
- API REST para operaciones principales.
- WebSockets para chat, presencia y notificaciones en tiempo real.
- Base de datos relacional con PostgreSQL.

### Componentes Principales

#### Frontend

Ubicado en:

```txt
src/
```

Responsabilidades:

- UI publica.
- Autenticacion visual por rol.
- Dashboards cliente/cuidador/admin.
- Reserva y estimador de pagos.
- Chat y notificaciones.
- Carga de documentos y comprobantes.
- Modo demo.
- PWA installable.

#### Backend Futuro

Responsabilidades:

- Registro e inicio de sesion.
- OTP por correo en registro y login.
- Control de roles.
- API REST.
- Procesamiento de reservas.
- Revision de documentos.
- Conexion con servicios de IA.
- Notificaciones en tiempo real.
- Subida y validacion de archivos.

#### Base De Datos

Responsabilidades:

- Usuarios y roles.
- Perfiles de clientes, cuidadores y administradores.
- Verificaciones.
- Calendarios.
- Reservas.
- Pagos.
- Mensajes.
- Notificaciones.
- Reportes.
- Auditoria.
- Backups.


## Estructura Principal Del Proyecto

```txt
src/
  app/
  assets/
  components/
  contexts/
  features/
  hooks/
  layouts/
  pages/
  routes/
  services/
  store/
  types/
  utils/

database/
  schema.sql
```

## Diseno De Base De Datos

El proyecto incluye un script SQL inicial en:

```txt
database/schema.sql
```

Este script esta pensado para PostgreSQL con PostGIS y cubre las funcionalidades principales del sistema.

### Tablas Principales

#### Autenticacion Y Usuarios

- `users`
- `client_profiles`
- `caregiver_profiles`
- `admin_profiles`
- `email_verifications`
- `login_otps`
- `password_reset_tokens`
- `sessions`

#### Verificacion De Cuidadores

- `caregiver_verifications`
- `verification_documents`
- `files`
- `ai_reviews`

#### Ubicacion Y Zonas

- `provinces`
- `cities`
- `neighborhoods`
- `service_zones`
- `caregiver_service_zones`
- `booking_locations`
- `zone_heatmap_events`

#### Reservas Y Servicios

- `caregiver_services`
- `caregiver_working_hours`
- `caregiver_calendar_blocks`
- `bookings`
- `booking_status_history`
- `booking_checkins`
- `hourly_service_updates`
- `booking_evidence_files`

#### Chat Y Notificaciones

- `conversations`
- `conversation_participants`
- `messages`
- `message_attachments`
- `notifications`
- `notification_preferences`

#### Pagos Y Comprobantes

- `payment_proofs`
- `payment_proof_files`
- `payment_reviews`

#### Comunidad Y Resenas

- `reviews`
- `review_replies`
- `social_posts`
- `social_post_media`
- `social_post_comments`
- `social_post_likes`

#### Administracion

- `reports`
- `report_attachments`
- `support_tickets`
- `support_ticket_messages`
- `fraud_alerts`
- `audit_logs`
- `daily_backups`
- `platform_settings`
- `content_pages`
- `blog_posts`
- `faq_items`
- `app_jobs`

### Relaciones Principales

- `users` se relaciona con `client_profiles`, `caregiver_profiles` o `admin_profiles` segun el rol.
- `caregiver_profiles` se relaciona con verificaciones, zonas, servicios, horarios y calendario.
- `bookings` une un cliente con un cuidador.
- `payment_proofs` pertenece a una reserva.
- `reviews` se crean a partir de reservas completadas.
- `messages` pertenecen a conversaciones.
- `hourly_service_updates` pertenece a una reserva y contiene evidencias por hora.
- `ai_reviews` puede asociarse a verificaciones, documentos o comprobantes.
- `audit_logs` registra acciones administrativas importantes.

### Justificacion Del Diseno

PostgreSQL es adecuado porque el sistema tiene muchas relaciones entre entidades: usuarios, roles, reservas, pagos, documentos, revisiones y reportes. El modelo relacional ayuda a mantener integridad y trazabilidad.

PostGIS se propone porque el sistema necesita filtros por provincia, ciudad, barrio, zonas de trabajo y posibles mapas de calor administrativos.

Los archivos no se guardan directamente como binarios en la base de datos. Se registra metadata en la tabla `files` y el archivo real se almacena en un servicio externo o carpeta local durante desarrollo.

### Script De Creacion

El script completo esta en:

```txt
database/schema.sql
```

Ejemplo de ejecucion:

```bash
psql -U postgres -d red_cuidados -f database/schema.sql
```

## Documentacion De Servicios Del Sistema

Actualmente no existe backend implementado. Los datos se consumen desde `src/services/mockData.ts` y `src/services/api.ts`.

Cuando se construya el backend, estos son los endpoints sugeridos:

### Autenticacion

| Metodo | Endpoint | Descripcion |
| --- | --- | --- |
| POST | `/api/auth/register` | Registrar cliente o cuidador |
| POST | `/api/auth/verify-email` | Verificar correo con OTP |
| POST | `/api/auth/login` | Validar email y contrasena |
| POST | `/api/auth/login/verify-otp` | Confirmar OTP de login |
| POST | `/api/auth/forgot-password` | Solicitar recuperacion |
| POST | `/api/auth/reset-password` | Cambiar contrasena |
| POST | `/api/auth/logout` | Cerrar sesion |

### Cuidadores

| Metodo | Endpoint | Descripcion |
| --- | --- | --- |
| GET | `/api/caregivers` | Listar cuidadores |
| GET | `/api/caregivers/:slug` | Ver perfil publico |
| PUT | `/api/caregivers/me` | Actualizar perfil |
| PUT | `/api/caregivers/me/zones` | Configurar zonas |
| PUT | `/api/caregivers/me/tariffs` | Configurar tarifas |
| PUT | `/api/caregivers/me/working-hours` | Configurar horarios |

### Verificacion

| Metodo | Endpoint | Descripcion |
| --- | --- | --- |
| POST | `/api/caregiver-verifications` | Crear expediente |
| POST | `/api/caregiver-verifications/documents` | Subir documentos |
| POST | `/api/caregiver-verifications/submit` | Enviar a revision |
| GET | `/api/admin/caregiver-approvals` | Listar aprobaciones |
| PUT | `/api/admin/caregiver-approvals/:id` | Aprobar o rechazar |

### Reservas

| Metodo | Endpoint | Descripcion |
| --- | --- | --- |
| POST | `/api/bookings/estimate` | Calcular precio |
| POST | `/api/bookings` | Crear reserva |
| GET | `/api/bookings` | Listar reservas del usuario |
| PUT | `/api/bookings/:id/status` | Cambiar estado |
| POST | `/api/bookings/:id/check-in` | Marcar entrada |
| POST | `/api/bookings/:id/check-out` | Marcar salida |
| POST | `/api/bookings/:id/hourly-updates` | Enviar evidencia por hora |

### Pagos

| Metodo | Endpoint | Descripcion |
| --- | --- | --- |
| POST | `/api/payment-proofs` | Subir comprobante |
| GET | `/api/payment-proofs` | Ver comprobantes |
| GET | `/api/admin/payment-proofs` | Revision admin |
| PUT | `/api/admin/payment-proofs/:id` | Aprobar o rechazar |

### Chat Y Notificaciones

| Metodo | Endpoint | Descripcion |
| --- | --- | --- |
| GET | `/api/conversations` | Listar conversaciones |
| GET | `/api/conversations/:id/messages` | Listar mensajes |
| POST | `/api/conversations/:id/messages` | Enviar mensaje |
| GET | `/api/notifications` | Listar notificaciones |
| PUT | `/api/notifications/:id/read` | Marcar como leida |

### Reportes Y Soporte

| Metodo | Endpoint | Descripcion |
| --- | --- | --- |
| POST | `/api/reports` | Crear reporte |
| GET | `/api/admin/reports` | Revisar reportes |
| POST | `/api/support-tickets` | Crear ticket |
| PUT | `/api/admin/support-tickets/:id` | Actualizar ticket |

### Administracion

| Metodo | Endpoint | Descripcion |
| --- | --- | --- |
| GET | `/api/admin/metrics` | Obtener metricas globales |
| GET | `/api/admin/users` | Gestionar usuarios |
| PUT | `/api/admin/users/:id/status` | Suspender o activar usuario |
| GET | `/api/admin/audit-logs` | Ver auditoria |
| POST | `/api/admin/backups` | Generar backup |

## Parametros Y Respuestas Esperadas

Ejemplo de registro:

```json
{
  "role": "client",
  "fullName": "Ana Gutierrez",
  "email": "ana@familia.com",
  "phone": "+50688888888",
  "password": "********"
}
```

Respuesta esperada:

```json
{
  "userId": "uuid",
  "role": "client",
  "requiresEmailVerification": true
}
```

Ejemplo de login:

```json
{
  "email": "ana@familia.com",
  "password": "********"
}
```

Respuesta esperada:

```json
{
  "requiresOtp": true,
  "otpDelivery": "email"
}
```

Ejemplo de verificacion OTP:

```json
{
  "email": "ana@familia.com",
  "code": "123456"
}
```

Respuesta esperada:

```json
{
  "accessToken": "jwt",
  "refreshToken": "token",
  "user": {
    "id": "uuid",
    "role": "client",
    "email": "ana@familia.com"
  }
}
```

## Como Ejecutar Con Base De Datos

El backend aun no esta implementado. Cuando se cree, los pasos esperados seran:

1. Instalar PostgreSQL.
2. Crear una base de datos llamada `red_cuidados`.
3. Activar PostGIS.
4. Ejecutar `database/schema.sql`.
5. Configurar variables de entorno del backend.
6. Levantar backend.
7. Levantar frontend.

Ejemplo futuro:

```bash
createdb red_cuidados
psql -U postgres -d red_cuidados -f database/schema.sql
npm run dev
```

## Docker

Actualmente no hay configuracion Docker incluida.

Una mejora futura seria agregar:

```txt
docker-compose.yml
```

Con servicios para:

- Frontend
- Backend
- PostgreSQL
- Servicio de archivos local

## Estado Actual Del Proyecto

Implementado:

- Frontend PWA.
- Landing con seleccion de rol cliente/cuidador.
- Acceso por rol.
- Demo mode para cliente, cuidador y admin.
- Dashboards por rol.
- Busqueda y reserva con perfiles de cuidadores.
- Calendario mensual.
- Verificacion frontend de cuidadores.
- Pagos por comprobante.
- Chat y notificaciones visuales.
- Panel admin.
- Script SQL inicial.

Pendiente:

- Backend real.
- Autenticacion real.
- OTP por correo.
- Base de datos conectada.
- Subida real de archivos.
- IA real para verificaciones.
- WebSockets conectados a servidor.
- Push notifications reales.

## Propuesta De Mejoras Futuras

### Funcionalidades Pendientes

- Backend Node.js.
- Registro y login con OTP por correo para cliente, cuidador y admin.
- Credenciales internas para administradores.
- Verificacion documental real.
- OCR para cedula.
- Analisis de comprobantes con IA.
- Comparacion facial mediante proveedor especializado.
- Notificaciones push.
- Chat real con Socket.io.
- Panel de administracion con datos reales.
- Backups diarios automatizados.

### Optimizaciones

- Lazy loading por rutas.
- Separacion de bundles.
- Cache de consultas.
- Paginacion en tablas admin.
- Busqueda por ubicacion usando PostGIS.
- Mejoras de accesibilidad.
- Pruebas unitarias y e2e.
- CI/CD con GitHub Actions.

### Evolucion Del Sistema

- App movil nativa o wrapper PWA avanzado.
- Matching inteligente entre clientes y cuidadores.
- Ranking dinamico de cuidadores.
- Scoring de riesgo.
- Programa de cuidadores destacados.
- Integracion con pagos automatizados.
- Dashboard financiero.
- Sistema de referidos.
- Multi-pais y multi-moneda.

