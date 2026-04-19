import { Link } from 'react-router-dom'
import { LoginForm } from '../../features/auth/LoginForm'

export function LoginPage() {
  return (
    <section className="rounded-[36px] border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200/40 dark:border-white/10 dark:bg-slate-950/80 dark:shadow-none">
      <h1 className="font-display text-4xl text-slate-950 dark:text-white">Bienvenido de vuelta</h1>
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
        Accede a tu espacio y continua tu operacion.
      </p>
      <div className="mt-8">
        <LoginForm />
      </div>
      <div className="mt-6 flex items-center justify-between text-sm">
        <Link to="/auth/forgot-password" className="text-cyan-600 dark:text-cyan-300">
          Olvide mi contrasena
        </Link>
        <Link to="/auth/register" className="text-slate-500 dark:text-slate-400">
          Crear cuenta
        </Link>
      </div>
    </section>
  )
}
