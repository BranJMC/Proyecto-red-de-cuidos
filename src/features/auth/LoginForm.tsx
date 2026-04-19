import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useToast } from '../../hooks/useToast'
import { useAppStore } from '../../store/useAppStore'
import { Button } from '../../components/ui/Button'

const schema = z.object({
  email: z.email('Ingresa un email valido'),
  password: z.string().min(8, 'Minimo 8 caracteres'),
})

type LoginValues = z.infer<typeof schema>

export function LoginForm() {
  const setRole = useAppStore((state) => state.setRole)
  const toast = useToast()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: 'ana@familia.com', password: 'RedCuidados2026' },
  })

  const onSubmit = handleSubmit(() => {
    setRole('client')
    toast.success('Sesion iniciada', 'Acceso simulado listo para conectar al backend.')
  })

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm text-slate-600 dark:text-slate-300">Email</label>
        <input {...register('email')} className="field" placeholder="tu@email.com" />
        <p className="mt-2 text-sm text-rose-500">{errors.email?.message}</p>
      </div>
      <div>
        <label className="mb-2 block text-sm text-slate-600 dark:text-slate-300">Contrasena</label>
        <input {...register('password')} type="password" className="field" placeholder="********" />
        <p className="mt-2 text-sm text-rose-500">{errors.password?.message}</p>
      </div>
      <Button fullWidth type="submit">
        Entrar a la plataforma
      </Button>
    </form>
  )
}
