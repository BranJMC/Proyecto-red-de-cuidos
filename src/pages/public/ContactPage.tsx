import { Button } from '../../components/ui/Button'
import { SectionHeading } from '../../components/ui/SectionHeading'

export function ContactPage() {
  return (
    <section className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
      <SectionHeading
        eyebrow="Contacto"
        title="Ventas, partnerships y soporte operativo desde una misma puerta de entrada."
        description="Deja tus datos y un especialista en operaciones de cuidado te contacta."
      />
      <div className="rounded-[36px] border border-slate-200 bg-white/85 p-8 dark:border-white/10 dark:bg-slate-900/70">
        <div className="grid gap-4 sm:grid-cols-2">
          <input className="field" placeholder="Nombre" />
          <input className="field" placeholder="Email" />
          <input className="field sm:col-span-2" placeholder="Empresa o familia" />
          <textarea className="field min-h-36 sm:col-span-2" placeholder="Cuéntanos tu necesidad" />
        </div>
        <Button className="mt-6">Enviar consulta</Button>
      </div>
    </section>
  )
}
