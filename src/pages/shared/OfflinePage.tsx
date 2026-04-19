import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'

export function OfflinePage() {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-center justify-center px-4 text-center sm:px-6 lg:px-8">
      <h1 className="font-display text-6xl text-slate-950 dark:text-white">Sin conexion</h1>
      <p className="mt-5 text-lg text-slate-500 dark:text-slate-400">
        La app sigue instalada y lista para reconectar cuando vuelva internet.
      </p>
      <Link to="/" className="mt-8">
        <Button>Volver al inicio</Button>
      </Link>
    </section>
  )
}
