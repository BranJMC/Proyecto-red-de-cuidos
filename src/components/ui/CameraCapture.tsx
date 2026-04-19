import { Camera } from 'lucide-react'

export function CameraCapture() {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white/80 p-6 dark:border-white/10 dark:bg-slate-900/70">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-cyan-50 p-3 text-cyan-700 dark:bg-cyan-400/10 dark:text-cyan-300">
          <Camera className="size-5" />
        </div>
        <div>
          <p className="font-medium text-slate-950 dark:text-white">Captura facial obligatoria</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            UI lista para integrar camara, selfie guiada y validacion biometrica.
          </p>
        </div>
      </div>
      <div className="mt-6 grid h-56 place-items-center rounded-[24px] border border-dashed border-slate-300 bg-[radial-gradient(circle_at_center,_rgba(34,211,238,0.16),_transparent_60%)] dark:border-white/10">
        <div className="text-center">
          <div className="mx-auto mb-4 size-20 rounded-full border-2 border-cyan-500/60" />
          <p className="text-sm text-slate-600 dark:text-slate-300">Modo camara / subida manual</p>
        </div>
      </div>
    </div>
  )
}
