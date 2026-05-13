Construye el backend completo de "Red de Cuidados" dentro del mismo repositorio y con PostgreSQL como fuente de verdad. Usa la base `red_cuidados` ya creada a partir de `database/schema.sql` y conecta el frontend existente para reemplazar los mocks por llamadas reales.

Objetivos obligatorios:
- Montar una API en Node.js con Express.
- Conectar a PostgreSQL usando `DATABASE_URL`.
- Implementar autenticacion real con registro e inicio de sesion.
- Persistir en base de datos toda reserva, favorito, onboarding de cuidador, mensaje, notificacion y dato capturado desde la UI.
- Exponer endpoints para los recursos que hoy consume `src/services/api.ts`.
- Sembrar datos iniciales coherentes para que la app no arranque vacia.
- Configurar scripts de desarrollo para cliente y servidor.
- Reemplazar en el frontend los flujos principales que hoy usan `mockData`.
- Verificar con `npm run build` y `npm run lint`.

Prioridades funcionales:
1. Login y registro por rol.
2. Listado y perfil de cuidadores.
3. Creacion y listado de reservas.
4. Favoritos, notificaciones y mensajes.
5. Onboarding y verificacion de cuidadores.
6. Historial de pagos, panel cliente, panel cuidador y panel admin.

Restricciones:
- No romper la UI actual.
- Reutilizar el esquema SQL existente en vez de inventar otro.
- Mantener el proyecto listo para desarrollo local con `npm run dev:full`.
- Si una vista aun no puede quedar 100% conectada, dejar la infraestructura y el endpoint listos y documentar claramente el pendiente.
