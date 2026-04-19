import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'

export function NotFoundPage() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-sm uppercase tracking-[0.32em] text-cyan-600 dark:text-cyan-300">404</p>
      <h1 className="mt-4 font-display text-6xl text-slate-950 dark:text-white">Ruta no encontrada</h1>
      <p className="mt-5 max-w-xl text-lg text-slate-500 dark:text-slate-400">
        Esta vista aun no existe o fue movida. Te llevamos de vuelta a la plataforma.
      </p>
      <Link to="/" className="mt-8">
        <Button>Ir al inicio</Button>
      </Link>
    </section>
  )
}
