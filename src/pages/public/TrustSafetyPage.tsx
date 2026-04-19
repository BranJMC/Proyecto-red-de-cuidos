export function TrustSafetyPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <p className="text-sm uppercase tracking-[0.32em] text-cyan-600 dark:text-cyan-300">Trust & Safety</p>
      <h1 className="mt-4 font-display text-5xl text-slate-950 dark:text-white">Confianza diseniada como infraestructura del producto.</h1>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {[
          ['Identity stack', 'Cedula, selfie, email OTP y SMS OTP con estados y aprobaciones.'],
          ['Payments review', 'Comprobantes, revisiones manuales y placeholders de AI verification.'],
          ['Fraud operations', 'Centro de alertas y auditoria para equipos de riesgo.'],
          ['Support escalation', 'Tickets, reportes y flujos de respuesta para incidentes sensibles.'],
        ].map(([title, description]) => (
          <article key={title} className="rounded-[32px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
            <h2 className="font-display text-2xl text-slate-950 dark:text-white">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-400">{description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
