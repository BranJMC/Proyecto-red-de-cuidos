# Manual de la aplicacion CareWy

## 1. Introduccion

CareWy es una plataforma web para conectar clientes que necesitan apoyo de cuidado con cuidadores verificados. La aplicacion permite registrar usuarios, gestionar perfiles, solicitar servicios, conversar antes y despues de una reserva, subir comprobantes de pago y administrar todo el flujo desde un panel de control.

Este manual esta pensado para ayudarte a explicar el proyecto durante la revision, tanto desde la parte funcional como desde la parte tecnica.

## 2. Objetivo general

El objetivo del sistema es centralizar en una sola plataforma:

- La busqueda de cuidadores por ubicacion y perfil profesional.
- La reserva de servicios de cuido con persistencia real en base de datos.
- La validacion de cuidadores y comprobantes por parte del administrador.
- La comunicacion entre cliente y cuidador.
- El control de estados, reportes y trazabilidad del servicio.

## 3. Roles del sistema

### Cliente

El cliente puede:

- Crear una cuenta.
- Iniciar sesion con correo, contrasena y codigo 2FA.
- Buscar cuidadores por provincia y canton.
- Marcar cuidadores como favoritos.
- Ver el perfil del cuidador.
- Iniciar una conversacion antes de reservar.
- Solicitar una reserva.
- Ver proximos servicios, reservas y notificaciones.
- Subir comprobantes de pago.
- Enviar reportes.
- Editar su configuracion o eliminar su cuenta.

### Cuidador

El cuidador puede:

- Crear una cuenta.
- Iniciar sesion con 2FA.
- Completar su perfil profesional.
- Configurar tarifas, provincias, cantones y horarios.
- Subir documentos para postularse como cuidador.
- Enviar su solicitud para revision del admin.
- Ver solicitudes y trabajos aceptados.
- Gestionar su calendario.
- Conversar con clientes.
- Ver ganancias y comprobantes.
- Revisar sus notificaciones y resenas.
- Solicitar retiro del servicio si ya fue aprobado.

### Administrador

El administrador puede:

- Iniciar sesion con credenciales internas.
- Ver el resumen general de la plataforma.
- Revisar usuarios.
- Revisar postulaciones de cuidadores.
- Abrir y verificar documentos subidos.
- Aprobar, rechazar o suspender servicios de cuidadores.
- Revisar comprobantes de pago.
- Ver reportes del sistema.
- Gestionar notificaciones y configuraciones generales.
- Consultar bitacora o trazabilidad administrativa.

## 4. Flujo funcional principal

### Registro e inicio de sesion

1. El usuario entra por la landing principal.
2. Escoge si desea entrar como cliente o cuidador.
3. Si no tiene cuenta, se registra con sus datos.
4. La cuenta queda registrada en la base de datos.
5. Luego inicia sesion con correo y contrasena.
6. Si las credenciales son validas, recibe un codigo 2FA por correo.
7. Al ingresar el codigo, entra al dashboard de su rol.

### Recuperacion de contrasena

1. El usuario entra en "Olvide mi contrasena".
2. Escribe su correo.
3. El sistema envia un enlace seguro.
4. El usuario abre ese enlace en la misma pestana.
5. Cambia la contrasena.
6. El sistema lo devuelve a la aplicacion.

### Reserva de servicio

1. El cliente entra al directorio de cuidadores.
2. Filtra por provincia y canton.
3. Abre el perfil del cuidador.
4. Escoge una fecha en el calendario.
5. Completa el formulario de solicitud.
6. El sistema crea la reserva y genera un codigo de referencia.
7. Ese codigo se usa luego como motivo del comprobante de pago.
8. El cliente, el cuidador y el administrador conocen ese codigo.

### Comprobante de pago

1. El cliente sube una imagen o archivo del comprobante.
2. El backend guarda el archivo y registra el comprobante en la base de datos.
3. El sistema compara preliminarmente monto y codigo de referencia.
4. El admin puede abrir el comprobante completo en su dashboard.
5. Luego puede aprobarlo o rechazarlo.

### Postulacion de cuidador

1. El cuidador entra al apartado Perfil.
2. Completa cedula, foto del rostro y documentos obligatorios.
3. Envia la solicitud.
4. El admin recibe la postulacion.
5. El admin abre el expediente, revisa los archivos y decide.
6. Si falta algo, puede rechazar con comentario.
7. Si el cuidador vuelve a enviar la solicitud, se conserva el historial del motivo de rechazo anterior.

## 5. Explicacion de pantallas principales

### Landing publica

La landing presenta la marca CareWy y dirige a:

- acceso cliente
- acceso cuidador
- informacion general de la plataforma

### Login por rol

Cada rol tiene su acceso diferenciado. Cliente y cuidador se autentican con:

- correo
- contrasena
- codigo 2FA por correo

El admin usa credenciales internas:

- `admin@redcuidados.com`
- `RedCuidados2026`

### Dashboard cliente

Resume:

- reservas cercanas
- mensajes
- notificaciones
- accesos rapidos para buscar y reservar

### Busqueda de cuidadores

Permite:

- ver cards de cuidadores en 3 columnas
- filtrar por provincia y canton
- poner favoritos
- abrir el perfil
- reservar o iniciar chat

### Perfil publico del cuidador

Muestra:

- foto
- nombre
- descripcion profesional
- tarifa
- ubicacion
- disponibilidad
- calendario de reserva
- formulario de solicitud de servicio

### Dashboard cuidador

Muestra:

- estado del perfil
- recordatorios
- actividad de reservas
- accesos a solicitudes, calendario, ganancias y documentos

### Perfil del cuidador

Es la seccion donde:

- completa la postulacion
- sube los documentos
- ve el estado de revision
- revisa observaciones del admin
- solicita ofrecer o retirar el servicio

### Tarifas y zonas del cuidador

Permite:

- ajustar tarifa por hora
- elegir provincias
- elegir cantones
- definir horario laboral

### Solicitudes y trabajos

Se divide en columnas para:

- solicitudes pendientes
- trabajos aceptados

Cada trabajo muestra:

- direccion
- horario
- estado
- codigo de reserva cuando aplique

### Ganancias y comprobantes

Muestra:

- total estimado ganado
- resumen diario
- comprobantes recibidos
- nombre de quien lo envio
- estado de revision
- archivo o imagen asociada

### Dashboard admin

El admin tiene acceso a:

- resumen
- usuarios
- aprobaciones
- comprobantes
- reportes
- notificaciones
- configuraciones
- auditoria

## 6. Arquitectura del proyecto

La aplicacion sigue una arquitectura cliente-servidor.

### Frontend

Tecnologias principales:

- React
- TypeScript
- Tailwind CSS
- React Router
- Zustand
- Axios

Responsabilidades:

- interfaz visual
- formularios
- navegacion por rol
- manejo de estado del usuario
- consumo de la API

### Backend

Tecnologias principales:

- Node.js
- Express
- JWT
- bcryptjs
- Nodemailer
- Multer

Responsabilidades:

- autenticacion
- envio de 2FA
- recuperacion de contrasena
- logica de negocio
- persistencia
- subida de archivos
- validaciones

### Base de datos

Tecnologias principales:

- PostgreSQL
- Neon
- PostGIS

Responsabilidades:

- usuarios
- perfiles
- reservas
- pagos
- documentos
- mensajes
- reportes
- auditoria

## 7. Manual de la base de datos

### 7.1 Extensiones y tipos

El esquema usa:

- `pgcrypto`
- `citext`
- `postgis`

Tambien define tipos para:

- roles
- estados de cuenta
- estados de verificacion
- estados de reserva
- estados de pago
- tipos de notificacion

### 7.2 Tablas principales y su funcion

#### Usuarios y seguridad

- `users`: tabla central de autenticacion y rol.
- `client_profiles`: perfil extendido del cliente.
- `caregiver_profiles`: perfil extendido del cuidador.
- `admin_profiles`: perfil del administrador.
- `email_verifications`: control de verificaciones por correo.
- `login_otps`: codigos 2FA.
- `password_reset_tokens`: tokens de recuperacion.
- `sessions`: sesiones activas.

#### Ubicacion

- `provinces`: provincias.
- `cities`: cantones o ciudades.
- `neighborhoods`: barrios.
- `service_zones`: zonas de servicio georreferenciadas.
- `caregiver_service_zones`: relacion cuidador-zona.
- `booking_locations`: ubicacion puntual de la reserva.

#### Perfil profesional del cuidador

- `caregiver_services`: tipos de servicio que ofrece.
- `caregiver_certifications`: certificaciones del cuidador.
- `caregiver_working_hours`: horario semanal.
- `caregiver_calendar_blocks`: bloqueos del calendario.
- `caregiver_verifications`: expediente principal de revision.
- `verification_documents`: documentos subidos.
- `files`: metadatos de archivos.
- `ai_reviews`: resultados de revision automatica o preliminar.

#### Reservas y operacion

- `bookings`: reserva principal.
- `booking_status_history`: historial de cambios de estado.
- `booking_checkins`: entradas y salidas del servicio.
- `hourly_service_updates`: reportes por hora durante el cuido.
- `booking_evidence_files`: evidencia visual de una reserva.

#### Mensajes y comunicacion

- `conversations`: conversacion entre usuarios.
- `conversation_participants`: participantes.
- `messages`: mensajes enviados.
- `message_attachments`: adjuntos del chat.
- `notifications`: notificaciones del sistema.
- `notification_preferences`: preferencias del usuario.

#### Pagos

- `payment_proofs`: comprobantes de pago.
- `payment_proof_files`: relacion entre comprobante y archivo.
- `payment_reviews`: revision del admin.
- `payment_history`: historial financiero mostrado en la app.

#### Interaccion del cliente

- `reviews`: resenas hacia cuidadores.
- `review_replies`: respuestas a resenas.
- `favorites`: cuidadores marcados como favoritos.
- `saved_searches`: filtros guardados.

#### Reportes y administracion

- `reports`: reportes de incidentes.
- `report_attachments`: adjuntos del reporte.
- `support_tickets`: soporte.
- `support_ticket_messages`: mensajes del soporte.
- `fraud_alerts`: alertas de fraude.
- `audit_logs`: acciones administrativas.
- `daily_backups`: historial de respaldos.
- `platform_settings`: configuraciones globales.
- `content_pages`: contenido editable.
- `blog_posts`: articulos.
- `faq_items`: preguntas frecuentes.
- `pricing_plans`: planes o referencias de cobro.
- `dashboard_metrics`: metricas agregadas.
- `analytics_series_points`: series para graficas.
- `app_jobs`: tareas internas.
- `zone_heatmap_events`: eventos de demanda por zona.

### 7.3 Relaciones clave que puedes explicar

- `users` es la tabla madre del sistema.
- Un `client_profile`, `caregiver_profile` o `admin_profile` depende de `users`.
- Una `booking` siempre relaciona un cliente y un cuidador.
- Un `payment_proof` depende de una reserva.
- Una `conversation` une usuarios para mensajeria.
- Los documentos del cuidador se enlazan por `verification_documents` y `files`.
- Los cambios importantes quedan trazados en `audit_logs`.

### 7.4 Por que esta base de datos es adecuada

Este proyecto necesita relaciones fuertes, trazabilidad y consistencia. PostgreSQL es adecuado porque:

- maneja bien relaciones complejas
- permite integridad referencial
- soporta consultas administrativas y reportes
- acepta extensiones geograficas con PostGIS
- funciona bien en local y en la nube con Neon

## 8. Endpoints importantes que ya puedes explicar

### Autenticacion

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/login/verify`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`

### Cuidadores

- `GET /api/caregivers`
- `GET /api/caregiver/application-status`
- `POST /api/caregiver/documents`
- `POST /api/caregiver/apply`

### Reservas

- `POST /api/bookings`
- `GET /api/bookings`
- `POST /api/bookings/:id/decision`

### Pagos

- `POST /api/payment-proofs`
- `GET /api/payment-proofs`
- `GET /api/admin/payment-proofs`
- `POST /api/admin/payment-proofs/:id/decision`

### Reportes

- `POST /api/reports`
- `GET /api/admin/reports`

## 9. Como defender el proyecto en la presentacion

### Orden recomendado

1. Muestra la landing.
2. Explica roles.
3. Haz login como cliente.
4. Busca un cuidador y abre su perfil.
5. Crea o muestra una reserva.
6. Enseña mensajes y comprobantes.
7. Cambia al rol de cuidador.
8. Muestra postulacion, documentos, calendario y ganancias.
9. Cambia al rol admin.
10. Revisa una postulacion o un comprobante.
11. Cierra explicando que ya hay persistencia real y que falta el bloque de IA avanzada y despliegue final.

### Preguntas que probablemente te hagan

#### Que hace la aplicacion?

Conecta clientes con cuidadores verificados, gestiona reservas, pagos, mensajes y revision administrativa en una sola plataforma.

#### Como se guardan los datos?

Se guardan en PostgreSQL/Neon. El frontend consume una API en Express y toda la informacion importante se persiste en la base de datos.

#### Como validan el acceso?

Cliente y cuidador usan correo, contrasena y 2FA por email. El admin tiene credenciales internas.

#### Como revisan a los cuidadores?

El cuidador sube documentos y envia una postulacion. El admin abre el expediente, revisa archivos y aprueba o rechaza con comentario.

#### Como manejan pagos?

Cada reserva tiene un codigo de referencia. El cliente sube el comprobante y el sistema compara monto y codigo antes de la revision final.

## 10. Pendientes reales del proyecto

Lo que puedes decir con honestidad que falta:

- OCR e IA real de punta a punta para validar nombre, monto y motivo del comprobante.
- Revision automatica real de documentos del cuidador.
- Chat completamente en tiempo real.
- Push notifications.
- Pruebas automatizadas formales.
- Despliegue final de produccion.

## 11. Conclusion

CareWy ya cumple con un avance funcional fuerte porque integra frontend, backend, persistencia real y flujos completos por rol. La aplicacion no esta solo maquetada: ya ejecuta procesos reales de autenticacion, reservas, revision y almacenamiento de datos.
