import { SectionHeading } from '../../components/ui/SectionHeading'

export function HowItWorksPage() {
  const steps = [
    'Familias publican o reservan una necesidad de cuidado.',
    'El sistema sugiere cuidadores segun especialidad, disponibilidad y confianza.',
    'El cuidador completa onboarding seguro con cedula, foto facial y OTP.',
    'Reserva, chat, seguimiento y pago ocurren dentro del mismo flujo.',
  ]

  return (
    <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Flujo"
        title="Del descubrimiento a la reserva confirmada, todo sucede dentro de una misma experiencia."
        description="Disenado para minimizar friccion, reducir riesgo y dar visibilidad en tiempo real a clientes, cuidadores y admins."
      />
      <div className="mt-12 space-y-4">
        {steps.map((step, index) => (
          <div key={step} className="flex gap-5 rounded-[28px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-slate-950 text-white dark:bg-cyan-400 dark:text-slate-950">
              {index + 1}
            </div>
            <p className="pt-2 text-base text-slate-600 dark:text-slate-300">{step}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
