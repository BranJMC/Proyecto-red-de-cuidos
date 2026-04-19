import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { verificationSteps } from '../../services/mockData'
import { Button } from '../../components/ui/Button'
import { CameraCapture } from '../../components/ui/CameraCapture'
import { FileUploader } from '../../components/ui/FileUploader'
import { OtpInput } from '../../components/ui/OtpInput'

const cedulaSchema = z.object({
  idNumber: z
    .string()
    .min(9, 'Cedula invalida')
    .max(12, 'Cedula invalida')
    .regex(/^[0-9-]+$/, 'Solo numeros y guiones'),
})

export function CaregiverOnboardingWizard() {
  const [step, setStep] = useState(0)
  const form = useForm<z.infer<typeof cedulaSchema>>({
    resolver: zodResolver(cedulaSchema),
    defaultValues: { idNumber: '1-1234-5678' },
  })

  const steps = [
    {
      title: 'Verificacion de cedula',
      content: (
        <form
          onSubmit={form.handleSubmit(() => setStep(1))}
          className="space-y-5"
        >
          <div>
            <label className="mb-2 block text-sm text-slate-600 dark:text-slate-300">Numero de cedula</label>
            <input {...form.register('idNumber')} className="field" placeholder="1-1234-5678" />
            <p className="mt-2 text-sm text-rose-500">{form.formState.errors.idNumber?.message}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <FileUploader label="Frente de cedula" helper="Formato JPG/PNG, recorte automatico y OCR listo." />
            <FileUploader label="Reverso de cedula" helper="Validacion antifraude y lectura de datos posterior." />
          </div>
          <Button type="submit">Continuar</Button>
        </form>
      ),
    },
    {
      title: 'Foto facial obligatoria',
      content: (
        <div className="space-y-6">
          <CameraCapture />
          <div className="flex justify-end">
            <Button onClick={() => setStep(2)}>Validar rostro</Button>
          </div>
        </div>
      ),
    },
    {
      title: 'OTP de email y SMS',
      content: (
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-[28px] border border-slate-200 bg-white/80 p-6 dark:border-white/10 dark:bg-slate-900/70">
            <p className="text-sm text-slate-500 dark:text-slate-400">Codigo enviado al correo</p>
            <h4 className="mt-2 font-display text-2xl text-slate-950 dark:text-white">Verifica tu email</h4>
            <div className="mt-5">
              <OtpInput />
            </div>
          </div>
          <div className="rounded-[28px] border border-slate-200 bg-white/80 p-6 dark:border-white/10 dark:bg-slate-900/70">
            <p className="text-sm text-slate-500 dark:text-slate-400">Codigo enviado al movil</p>
            <h4 className="mt-2 font-display text-2xl text-slate-950 dark:text-white">Verifica tu telefono</h4>
            <div className="mt-5">
              <OtpInput />
            </div>
          </div>
          <div className="lg:col-span-2 flex justify-end">
            <Button onClick={() => setStep(3)}>Finalizar onboarding</Button>
          </div>
        </div>
      ),
    },
    {
      title: 'Estado del expediente',
      content: (
        <div className="grid gap-4">
          {verificationSteps.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-[24px] border border-slate-200 bg-white/80 px-5 py-4 dark:border-white/10 dark:bg-slate-900/70"
            >
              <div>
                <p className="font-medium text-slate-950 dark:text-white">{item.title}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      ),
    },
  ]

  return (
    <div className="rounded-[36px] border border-slate-200 bg-white/85 p-8 shadow-xl shadow-slate-200/50 dark:border-white/10 dark:bg-slate-950/70 dark:shadow-none">
      <div className="mb-8 flex flex-wrap gap-3">
        {steps.map((wizardStep, index) => (
          <div
            key={wizardStep.title}
            className={`rounded-full px-4 py-2 text-sm ${
              index === step
                ? 'bg-slate-950 text-white dark:bg-cyan-400 dark:text-slate-950'
                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            Paso {index + 1}
          </div>
        ))}
      </div>
      <h3 className="font-display text-3xl text-slate-950 dark:text-white">{steps[step].title}</h3>
      <div className="mt-8">{steps[step].content}</div>
    </div>
  )
}
