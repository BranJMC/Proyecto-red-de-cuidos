import { SectionHeading } from '../../components/ui/SectionHeading'

export function AboutPage() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Sobre nosotros"
        title="Convertimos el cuidado en una experiencia confiable, elegante y operativamente impecable."
        description="Red de Cuidados nace para resolver una tension real: encontrar a la persona indicada con la rapidez de una app moderna y la seguridad de un proceso humano serio."
      />
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {[
          ['Confianza radical', 'Verificacion multicapa, flujos de aprobacion y soporte activo.'],
          ['Tecnologia con criterio', 'PWA, chat, analytics y arquitectura preparada para backend escalable.'],
          ['Experiencia premium', 'Cada pantalla esta disenada para inspirar seguridad y conversion.'],
        ].map(([title, description]) => (
          <div key={title} className="rounded-[28px] border border-slate-200 bg-white/85 p-6 dark:border-white/10 dark:bg-slate-900/70">
            <h3 className="font-display text-2xl text-slate-950 dark:text-white">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
