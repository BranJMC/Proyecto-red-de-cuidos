# Manual de archivos del proyecto CareWy

## Objetivo de este documento

Este manual explica para que sirve cada archivo importante del proyecto CareWy. La idea es que puedas responder si te preguntan que hace un archivo, en que parte del sistema participa y por que existe dentro del proyecto.

## 1. Archivos de raiz del proyecto

### `package.json`

Define el nombre del proyecto, los scripts de trabajo y las dependencias principales. Desde aqui se ejecutan comandos como `npm run dev`, `npm run server`, `npm run build` y `npm run lint`.

### `package-lock.json`

Guarda la version exacta de las dependencias instaladas para que el proyecto se pueda reproducir de forma estable en otra computadora.

### `README.md`

Es el documento principal de arranque del proyecto. Resume que es CareWy, como se ejecuta y a que otros documentos de apoyo debe entrar una persona que revise el repositorio.

### `index.html`

Es el archivo HTML base donde Vite monta la aplicacion React. Contiene el contenedor principal del frontend.

### `vite.config.ts`

Configura Vite, que es la herramienta que sirve para levantar el frontend en desarrollo y compilarlo en produccion.

### `eslint.config.js`

Configura ESLint, que revisa calidad y consistencia del codigo JavaScript y TypeScript.

### `tsconfig.json`

Configuracion general de TypeScript para el proyecto.

### `tsconfig.app.json`

Configuracion TypeScript especifica para la aplicacion frontend.

### `tsconfig.node.json`

Configuracion TypeScript orientada al entorno de Node y herramientas del proyecto.

### `.env`

Guarda las variables privadas del entorno local, por ejemplo la conexion a la base de datos y los datos SMTP del correo.

### `.env.example`

Muestra la estructura de variables que necesita el proyecto, sin poner datos sensibles reales.

### `.gitignore`

Define que archivos no deben subirse al repositorio, como logs, `node_modules`, builds y archivos locales del editor.

## 2. Carpeta `src/`

Esta carpeta contiene todo el frontend React.

## 2.1 Entrada principal

### `src/main.tsx`

Es el punto de entrada del frontend. Monta React en el navegador, carga estilos globales y activa la app.

### `src/index.css`

Contiene estilos globales y reglas base del sistema visual.

## 2.2 Carpeta `src/app/`

### `src/app/App.tsx`

Es el contenedor principal de la aplicacion. Normalmente conecta providers globales y el sistema de rutas.

### `src/app/providers.tsx`

Agrupa proveedores globales de React, como contexto de tema, estado compartido o toasts.

### `src/app/router.tsx`

Define todas las rutas del sistema. Desde aqui se decide que pagina se abre para cliente, cuidador, admin o publico.

## 2.3 Carpeta `src/assets/`

### `src/assets/hero.png`

Imagen usada para secciones visuales de la interfaz publica.

### `src/assets/react.svg`

Icono por defecto relacionado con React, normalmente heredado de la plantilla inicial.

### `src/assets/vite.svg`

Icono por defecto relacionado con Vite, tambien heredado de la plantilla inicial.

## 2.4 Carpeta `src/components/branding/`

### `src/components/branding/Logo.tsx`

Renderiza el logo y nombre visible de la plataforma CareWy. Se usa en navbar, sidebar y footer.

## 2.5 Carpeta `src/components/navigation/`

### `src/components/navigation/Navbar.tsx`

Barra superior publica de la aplicacion. Contiene accesos generales del sitio.

### `src/components/navigation/PublicFooter.tsx`

Pie de pagina del sitio publico. Muestra marca y enlaces secundarios.

### `src/components/navigation/Sidebar.tsx`

Menu lateral de los dashboards internos. Cambia segun el rol del usuario.

### `src/components/navigation/MobileMenu.tsx`

Version movil del menu de navegacion para pantallas pequenas.

### `src/components/navigation/UserMenu.tsx`

Menu del usuario autenticado. Desde aqui se puede ver perfil, configuracion y cerrar sesion.

## 2.6 Carpeta `src/components/ui/`

Aqui estan los componentes visuales reutilizables.

### `src/components/ui/Button.tsx`

Boton reutilizable del sistema con variantes visuales.

### `src/components/ui/Modal.tsx`

Ventana modal reutilizable para mostrar contenido encima de la pantalla.

### `src/components/ui/EmptyState.tsx`

Componente para mostrar estados vacios, por ejemplo cuando no hay mensajes o resenas.

### `src/components/ui/SkeletonCard.tsx`

Muestra placeholders de carga mientras llegan datos reales.

### `src/components/ui/ToastViewport.tsx`

Contenedor donde aparecen mensajes breves tipo alerta o confirmacion.

### `src/components/ui/NotificationBell.tsx`

Icono de notificaciones para el dashboard.

### `src/components/ui/OtpInput.tsx`

Campo especializado para ingresar el codigo 2FA casilla por casilla, con avance automatico.

### `src/components/ui/FileUploader.tsx`

Componente reutilizable para seleccionar y subir archivos.

### `src/components/ui/ReceiptUploader.tsx`

Componente especifico para subir comprobantes de pago del cliente.

### `src/components/ui/CameraCapture.tsx`

Permite capturar o manipular imagenes, pensado para fotos de identidad o evidencia.

### `src/components/ui/RatingStars.tsx`

Muestra la calificacion en forma de estrellas.

### `src/components/ui/StatCard.tsx`

Tarjeta visual para metricas y valores resumidos.

### `src/components/ui/InfoCard.tsx`

Tarjeta generica para mostrar informacion estructurada.

### `src/components/ui/ChartCard.tsx`

Tarjeta contenedora para graficas.

### `src/components/ui/DataTable.tsx`

Tabla reutilizable para datos administrativos o listados estructurados.

### `src/components/ui/ProgressTracker.tsx`

Muestra estados o pasos de progreso en ciertos flujos.

### `src/components/ui/SectionHeading.tsx`

Encabezado visual reutilizable para secciones.

### `src/components/ui/SocialFeed.tsx`

Componente para mostrar contenido comunitario o publicaciones.

### `src/components/ui/CalendarCard.tsx`

Tarjeta base para contenido relacionado con calendario o agenda.

### `src/components/ui/MonthAvailabilityCalendar.tsx`

Calendario mensual donde se muestra disponibilidad, reservas y estados por fecha.

### `src/components/ui/AvailabilityScheduler.tsx`

Componente donde el cuidador define su horario de trabajo y disponibilidad.

### `src/components/ui/BookingWizard.tsx`

Formulario principal de reserva guiada desde el perfil del cuidador.

### `src/components/ui/PriceCalculatorCard.tsx`

Resumen o estimador de precio de una reserva segun horas y extras.

### `src/components/ui/ChatLayout.tsx`

Estructura base visual de la seccion de mensajes y conversaciones.

### `src/components/ui/SearchFilters.tsx`

Panel de filtros para buscar cuidadores por provincia, canton u otros criterios.

### `src/components/ui/ZoneSelector.tsx`

Componente que ayuda al cuidador a elegir las zonas donde ofrece servicios.

### `src/components/ui/RoleSwitcherDemo.tsx`

Componente heredado de la fase demo para cambiar rapidamente entre roles o vistas. Hoy sirve mas como apoyo interno que como flujo principal.

## 2.7 Carpeta `src/contexts/`

### `src/contexts/theme-context.ts`

Define tipos o estructura base del contexto de tema.

### `src/contexts/ThemeContext.tsx`

Proveedor de tema del frontend.

### `src/contexts/useTheme.ts`

Hook para consumir el contexto de tema desde componentes React.

## 2.8 Carpeta `src/features/auth/`

### `src/features/auth/LoginForm.tsx`

Formulario modular de inicio de sesion.

### `src/features/auth/RegisterRoleSelector.tsx`

Ayuda a seleccionar el rol al momento de registrarse o entrar a un flujo de autenticacion.

## 2.9 Carpeta `src/features/booking/`

### `src/features/booking/BookingModal.tsx`

Modal rapido para iniciar una reserva sin salir del listado de cuidadores.

## 2.10 Carpeta `src/features/verification/`

### `src/features/verification/CaregiverOnboardingWizard.tsx`

Flujo guiado para completar informacion inicial del cuidador y prepararlo para postularse.

## 2.11 Carpeta `src/hooks/`

### `src/hooks/useToast.ts`

Hook para lanzar mensajes visuales de exito, error o aviso.

### `src/hooks/useSocket.ts`

Hook para trabajar con sockets o preparar tiempo real en el frontend.

### `src/hooks/useInstallPrompt.ts`

Hook para manejar la instalacion de la PWA desde el navegador.

## 2.12 Carpeta `src/layouts/`

### `src/layouts/PublicLayout.tsx`

Layout general de las paginas publicas.

### `src/layouts/AuthLayout.tsx`

Layout de pantallas de autenticacion como login, registro y recuperacion.

### `src/layouts/DashboardLayout.tsx`

Layout base de dashboards internos. Incluye sidebar, encabezado y contenido principal.

## 2.13 Carpeta `src/pages/public/`

Estas paginas componen la parte abierta al publico.

### `src/pages/public/LandingPage.tsx`

Pagina principal del proyecto. Presenta la plataforma y dirige al usuario a cliente o cuidador.

### `src/pages/public/AboutPage.tsx`

Explica que es CareWy, su proposito y enfoque.

### `src/pages/public/HowItWorksPage.tsx`

Describe como funciona la plataforma para usuarios nuevos.

### `src/pages/public/PricingPage.tsx`

Presenta informacion general sobre tarifas, costos o planes.

### `src/pages/public/ContactPage.tsx`

Pagina de contacto general.

### `src/pages/public/FaqPage.tsx`

Pagina de preguntas frecuentes.

### `src/pages/public/HelpCenterPage.tsx`

Centro de ayuda con orientacion general para usuarios.

### `src/pages/public/SupportPage.tsx`

Seccion publica de soporte.

### `src/pages/public/TermsPage.tsx`

Terminos y condiciones de uso de la plataforma.

### `src/pages/public/PrivacyPage.tsx`

Politica de privacidad del sistema.

### `src/pages/public/CareersPage.tsx`

Pagina informativa sobre oportunidades o enfoque institucional.

### `src/pages/public/BlogPage.tsx`

Espacio para contenido tipo blog o publicaciones institucionales.

### `src/pages/public/TestimonialsPage.tsx`

Pagina de testimonios o experiencias de usuarios.

### `src/pages/public/TrustSafetyPage.tsx`

Seccion enfocada en confianza, seguridad y verificacion.

### `src/pages/public/CommunityPage.tsx`

Espacio de comunidad, publicaciones o interaccion social.

## 2.14 Carpeta `src/pages/auth/`

### `src/pages/auth/RoleAccessPage.tsx`

Pantalla principal de acceso por rol. Aqui el usuario puede entrar como cliente, cuidador o admin segun corresponda.

### `src/pages/auth/ForgotPasswordPage.tsx`

Pagina donde el usuario solicita recuperacion de contrasena.

### `src/pages/auth/ResetPasswordPage.tsx`

Pantalla donde el usuario ingresa la nueva contrasena despues de abrir el enlace recibido por correo.

### `src/pages/auth/EmailVerificationPage.tsx`

Pantalla para confirmar el codigo 2FA enviado por correo.

### `src/pages/auth/SmsVerificationPage.tsx`

Pantalla preparada para un flujo de verificacion por telefono o codigo alterno.

### `src/pages/auth/LoginPage.tsx`

Pagina de login mas clasica, hoy menos protagonista porque el proyecto usa acceso por rol.

### `src/pages/auth/RegisterPage.tsx`

Pagina de registro tradicional, mantenida como apoyo o estructura historica.

## 2.15 Carpeta `src/pages/client/`

### `src/pages/client/ClientHomePage.tsx`

Dashboard principal del cliente con resumen de actividad, reservas y notificaciones.

### `src/pages/client/SearchCaregiversPage.tsx`

Pantalla para buscar cuidadores, filtrarlos y ver cards del directorio.

### `src/pages/client/ClientMessagesPage.tsx`

Pagina de conversaciones del cliente.

### `src/pages/client/ClientNotificationsPage.tsx`

Centro de notificaciones del cliente.

### `src/pages/client/ClientBookingsPage.tsx`

Lista general de reservas del cliente.

### `src/pages/client/UpcomingServicesPage.tsx`

Muestra los proximos servicios reservados por el cliente.

### `src/pages/client/ClientPaymentsPage.tsx`

Pantalla para subir comprobantes de pago y revisar su estado.

### `src/pages/client/ClientReviewsPage.tsx`

Espacio donde el cliente puede revisar o dejar resenas.

### `src/pages/client/ClientReportsPage.tsx`

Permite crear reportes o incidentes sobre una reserva o situacion.

### `src/pages/client/ClientSettingsPage.tsx`

Configuracion de cuenta del cliente, incluida la opcion de eliminar la cuenta.

## 2.16 Carpeta `src/pages/caregiver/`

### `src/pages/caregiver/CaregiverHomePage.tsx`

Dashboard principal del cuidador con resumen de perfil, actividad y recordatorios.

### `src/pages/caregiver/JobRequestsPage.tsx`

Pantalla que concentra solicitudes pendientes y trabajos aceptados.

### `src/pages/caregiver/AcceptedJobsPage.tsx`

Vista historica o complementaria de trabajos aceptados. Hoy sirve como pantalla separada heredada del flujo anterior.

### `src/pages/caregiver/CalendarPage.tsx`

Calendario operativo del cuidador. Muestra reservas pendientes, aceptadas, mixtas y capacidad diaria.

### `src/pages/caregiver/CaregiverMessagesPage.tsx`

Mensajes del cuidador con clientes.

### `src/pages/caregiver/CaregiverNotificationsPage.tsx`

Notificaciones del cuidador.

### `src/pages/caregiver/EarningsPage.tsx`

Pantalla de ganancias y comprobantes. Resume ingresos y muestra pagos recibidos.

### `src/pages/caregiver/ReviewsPage.tsx`

Pantalla de resenas del cuidador. Si no hay, muestra un estado vacio explicativo.

### `src/pages/caregiver/DocumentsPage.tsx`

Es una de las pantallas mas importantes del rol cuidador. Aqui se suben documentos, se gestiona la postulacion y se ve el estado de revision.

### `src/pages/caregiver/CaregiverSettingsPage.tsx`

Pantalla de tarifas, zonas, provincias, cantones y horarios laborales del cuidador.

### `src/pages/caregiver/VerificationWizardPage.tsx`

Pantalla historica o complementaria para un flujo guiado de verificacion.

## 2.17 Carpeta `src/pages/admin/`

### `src/pages/admin/AdminOverviewPage.tsx`

Resumen principal del administrador con metricas y graficas.

### `src/pages/admin/UsersManagementPage.tsx`

Gestion de usuarios del sistema.

### `src/pages/admin/CaregiverApprovalsPage.tsx`

Pantalla central para revisar y decidir postulaciones de cuidadores. Desde aqui se abren expedientes y documentos.

### `src/pages/admin/PaymentProofsPage.tsx`

Pantalla para revisar comprobantes de pago y aprobar o rechazar.

### `src/pages/admin/ReportsCenterPage.tsx`

Centro administrativo de reportes enviados por usuarios.

### `src/pages/admin/AdminNotificationsPage.tsx`

Notificaciones del rol administrador.

### `src/pages/admin/AdminSettingsPage.tsx`

Configuraciones generales de la plataforma.

### `src/pages/admin/AuditLogsPage.tsx`

Vista de bitacora o trazabilidad administrativa.

### `src/pages/admin/AnalyticsPage.tsx`

Pantalla de analitica y graficas mas detalladas. Hoy puede mantenerse como apoyo tecnico aunque ya no sea foco del menu principal.

### `src/pages/admin/ContentManagementPage.tsx`

Gestion de contenido editable de la plataforma.

### `src/pages/admin/FraudAlertsPage.tsx`

Vista administrativa para alertas de fraude o inconsistencias.

### `src/pages/admin/SupportTicketsPage.tsx`

Pantalla relacionada con tickets de soporte.

## 2.18 Carpeta `src/pages/shared/`

### `src/pages/shared/BookingPage.tsx`

Pagina compartida del flujo de reserva, reutilizada por mas de un rol o contexto.

### `src/pages/shared/CaregiverProfilePage.tsx`

Perfil publico completo del cuidador, con informacion, calendario y formulario de solicitud.

### `src/pages/shared/NotFoundPage.tsx`

Pagina de error 404 cuando una ruta no existe.

### `src/pages/shared/OfflinePage.tsx`

Pantalla mostrada cuando la PWA queda sin conexion.

## 2.19 Carpeta `src/routes/`

### `src/routes/ProtectedRoute.tsx`

Protege las rutas internas para que solo entren usuarios autenticados y con el rol correcto.

## 2.20 Carpeta `src/services/`

### `src/services/api.ts`

Es una pieza central. Reune las funciones que hablan con el backend o, segun el caso, con capas de datos internas. Aqui estan los metodos para login, reservas, comprobantes, reportes, aprobaciones y mas.

### `src/services/mockData.ts`

Contiene datos semilla o estructuras de apoyo usadas durante desarrollo y para ciertos componentes visuales.

### `src/services/socket.ts`

Configura la conexion base para sockets o tiempo real.

## 2.21 Carpeta `src/store/`

### `src/store/useAppStore.ts`

Store global de Zustand. Guarda usuario autenticado, favoritos, sesiones y acciones globales del frontend.

## 2.22 Carpeta `src/types/`

### `src/types/index.ts`

Define los tipos TypeScript del proyecto: usuarios, reservas, mensajes, documentos, pagos, etc.

## 2.23 Carpeta `src/utils/`

### `src/utils/constants.ts`

Centraliza constantes del sistema, como menus, enlaces y configuraciones visibles.

### `src/utils/helpers.ts`

Agrupa funciones auxiliares como formateos, conversiones y utilidades reutilizables.

## 3. Carpeta `server/`

Aqui vive el backend en Node.js y Express.

### `server/index.js`

Es el archivo principal del backend. Define rutas API, autenticacion, reservas, comprobantes, aprobaciones, mensajes, reportes y otras reglas del sistema.

### `server/db.js`

Configura la conexion con PostgreSQL o Neon.

### `server/mailer.js`

Maneja el envio de correos, como 2FA y recuperacion de contrasena.

### `server/utils.js`

Reune funciones auxiliares del backend, por ejemplo normalizaciones, calculos y helpers de negocio.

### `server/seed.js`

Carga datos iniciales o de prueba en la base de datos.

## 4. Carpeta `database/`

Contiene la estructura SQL de la base de datos.

### `database/schema.sql`

Esquema base general del proyecto en PostgreSQL.

### `database/neon-schema.sql`

Version del esquema preparada para Neon y para el flujo actual de la aplicacion.

### `database/neon-seed.sql`

Script de datos semilla para entorno Neon.

### `database/neon-seed-editor.sql`

Version del seed pensada para pegar directamente en el SQL Editor web de Neon.

### `database/neon-account-deletion.sql`

Script que crea la funcion SQL para borrar cuentas profundamente sin romper relaciones.

## 5. Carpeta `public/`

Contiene archivos estaticos que el navegador puede servir directamente.

### `public/offline.html`

Pagina estatica que se muestra cuando no hay internet.

### `public/sw.js`

Service worker de la PWA.

### `public/manifest.webmanifest`

Configura instalacion de la PWA, nombre, iconos y comportamiento.

### `public/favicon.svg`

Icono del navegador.

### `public/icon-192.svg`

Icono de 192 px para instalacion PWA.

### `public/icon-512.svg`

Icono de 512 px para instalacion PWA.

### `public/icons.svg`

Sprite o conjunto de iconos SVG del proyecto.

### `public/maskable-icon.svg`

Icono adaptable para dispositivos o instalaciones avanzadas.

### `public/brand/carewy-logo.png`

Logo principal actual de la plataforma CareWy.

## 6. Carpeta `docs/`

Contiene documentacion de apoyo.

### `docs/manual-carewy.md`

Manual funcional completo de la aplicacion.

### `docs/evaluacion-rubrica-carewy.md`

Analisis del proyecto contra la rubrica de evaluacion.

### `docs/cronograma-finalizacion-carewy.md`

Cronograma de lo que falta para terminar el proyecto al 100%.

### `docs/backend-implementation-prompt.md`

Documento con lineamientos o prompt tecnico usado para orientar la implementacion del backend.

### `docs/neon-migration.md`

Guia para migrar la base de datos a Neon.

### `docs/neon-sql-editor-steps.md`

Pasos concretos para usar el SQL Editor de Neon.

### `docs/mysql-migration-plan.md`

Documento historico de evaluacion para una posible migracion a MySQL. Sirve mas como referencia que como camino actual.

## 7. Que archivos son mas importantes para explicar

Si mañana te preguntan por los archivos mas importantes, los mas estrategicos son estos:

- [src/app/router.tsx](C:/Users/Brandon/Desktop/Red%20de%20cuidos/src/app/router.tsx)
- [src/store/useAppStore.ts](C:/Users/Brandon/Desktop/Red%20de%20cuidos/src/store/useAppStore.ts)
- [src/services/api.ts](C:/Users/Brandon/Desktop/Red%20de%20cuidos/src/services/api.ts)
- [server/index.js](C:/Users/Brandon/Desktop/Red%20de%20cuidos/server/index.js)
- [server/db.js](C:/Users/Brandon/Desktop/Red%20de%20cuidos/server/db.js)
- [database/neon-schema.sql](C:/Users/Brandon/Desktop/Red%20de%20cuidos/database/neon-schema.sql)
- [src/pages/shared/CaregiverProfilePage.tsx](C:/Users/Brandon/Desktop/Red%20de%20cuidos/src/pages/shared/CaregiverProfilePage.tsx)
- [src/pages/caregiver/DocumentsPage.tsx](C:/Users/Brandon/Desktop/Red%20de%20cuidos/src/pages/caregiver/DocumentsPage.tsx)
- [src/pages/admin/CaregiverApprovalsPage.tsx](C:/Users/Brandon/Desktop/Red%20de%20cuidos/src/pages/admin/CaregiverApprovalsPage.tsx)
- [src/pages/admin/PaymentProofsPage.tsx](C:/Users/Brandon/Desktop/Red%20de%20cuidos/src/pages/admin/PaymentProofsPage.tsx)

## 8. Forma corta de explicarlo oralmente

Puedes decirlo asi:

> El proyecto esta dividido en frontend, backend, base de datos y documentacion. En `src/` vive toda la interfaz React separada por roles, componentes y paginas. En `server/` vive la API en Express. En `database/` esta el esquema SQL de PostgreSQL/Neon. En `docs/` esta la documentacion para explicar funcionamiento, rubrica y plan de finalizacion.
