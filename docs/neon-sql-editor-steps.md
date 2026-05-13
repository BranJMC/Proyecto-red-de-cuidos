# Neon SQL Editor: orden correcto

Si vas a migrar desde la web de Neon usando el `SQL Editor`, usa este orden:

1. Ejecuta [neon-schema.sql](C:/Users/Brandon/Desktop/Red%20de%20cuidos/database/neon-schema.sql)
2. Espera a que termine sin errores
3. Ejecuta [neon-seed-editor.sql](C:/Users/Brandon/Desktop/Red%20de%20cuidos/database/neon-seed-editor.sql) si quieres datos iniciales
4. Copia tu `DATABASE_URL` de Neon al archivo `.env`
5. Reinicia el backend con `npm run server`

## Que hace cada archivo

- `neon-schema.sql`
  Crea extensiones, tipos, tablas, relaciones, funciones, triggers y vistas.

- `neon-seed-editor.sql`
  Inserta datos iniciales para probar login, cuidadores, reservas, mensajes, admin y analiticas.

## Cuando usar el seed

Usalo si quieres entrar de inmediato y probar la app con datos ya cargados.

Si prefieres una base limpia, ejecuta solo `neon-schema.sql`.

## Credenciales de prueba

Las cuentas semilla fueron creadas por el backend de desarrollo. La referencia principal de usuarios esta en [seed.js](C:/Users/Brandon/Desktop/Red%20de%20cuidos/server/seed.js).
