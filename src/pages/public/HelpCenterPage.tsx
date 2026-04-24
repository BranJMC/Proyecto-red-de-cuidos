const helpTopics = [
  ['Reservas y pagos', 'Aprende a estimar costos, subir comprobantes y seguir aprobaciones.'],
  ['Verificacion de cuidadores', 'Entiende cada capa de cedula, selfie, OTP y revision manual.'],
  ['Mensajeria y seguridad', 'Buenas practicas para coordinar servicios y reportar incidencias.'],
  ['Cuenta y perfil', 'Gestiona notificaciones, favoritos y configuracion de demo.'],
]

export function HelpCenterPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="font-display text-5xl text-slate-950 dark:text-white">Help center</h1>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {helpTopics.map(([title, description]) => (
          <article key={title} className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
            <h2 className="font-display text-2xl text-slate-950 dark:text-white">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">{description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
