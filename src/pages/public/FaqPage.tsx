const faqs = [
  ['Como verifican a los cuidadores?', 'El flujo incluye cedula, foto facial, email OTP, SMS OTP y revisiones manuales por admin.'],
  ['Se puede usar offline?', 'La app es instalable como PWA y cuenta con experiencia offline preparada.'],
  ['Hay soporte para chat en vivo?', 'Si. El frontend ya queda listo para Socket.io y notificaciones en tiempo real.'],
  ['Puedo conectar pagos despues?', 'Si. La UI esta preparada para integrarse con Stripe, dLocal u otro gateway.'],
]

export function FaqPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="space-y-4">
        {faqs.map(([question, answer]) => (
          <article key={question} className="rounded-[28px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
            <h2 className="font-display text-2xl text-slate-950 dark:text-white">{question}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{answer}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
