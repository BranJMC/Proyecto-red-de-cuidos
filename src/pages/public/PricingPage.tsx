import { pricingPlans } from '../../utils/constants'
import { Button } from '../../components/ui/Button'
import { SectionHeading } from '../../components/ui/SectionHeading'

export function PricingPage() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <SectionHeading
        eyebrow="Precios"
        title="Monetizacion lista para crecer por volumen, recurrencia y cuentas enterprise."
        description="Tarifas transparentes para familias y una narrativa premium para cerrar alianzas institucionales."
        align="center"
      />
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {pricingPlans.map((plan) => (
          <div key={plan.name} className="rounded-[32px] border border-slate-200 bg-white/85 p-8 text-center dark:border-white/10 dark:bg-slate-900/70">
            <p className="text-sm uppercase tracking-[0.32em] text-cyan-600 dark:text-cyan-300">{plan.name}</p>
            <p className="mt-4 font-display text-5xl text-slate-950 dark:text-white">{plan.price}</p>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{plan.description}</p>
            <ul className="mt-8 space-y-3 text-left text-sm text-slate-600 dark:text-slate-300">
              {plan.features.map((feature) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
            <Button fullWidth className="mt-8">
              Elegir plan
            </Button>
          </div>
        ))}
      </div>
    </section>
  )
}
