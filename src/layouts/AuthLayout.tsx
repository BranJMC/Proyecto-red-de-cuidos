import { Outlet } from 'react-router-dom'
import { Logo } from '../components/branding/Logo'

export function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
      <section className="hidden bg-slate-950 px-10 py-12 text-white lg:flex lg:flex-col">
        <Logo dark />
        <div className="mt-auto max-w-xl">
          <p className="text-sm uppercase tracking-[0.32em] text-cyan-300">Secure onboarding</p>
          <h1 className="mt-4 font-display text-5xl leading-tight">
            La red que convierte confianza en una experiencia digital premium.
          </h1>
          <p className="mt-6 text-lg leading-8 text-white/70">
            Verificacion de identidad, biometria, OTP, chat en vivo, pagos y paneles por rol listos para un backend de produccion.
          </p>
        </div>
      </section>
      <section className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-10">
        <div className="w-full max-w-xl">
          <div className="mb-8 lg:hidden">
            <Logo />
          </div>
          <Outlet />
        </div>
      </section>
    </div>
  )
}
