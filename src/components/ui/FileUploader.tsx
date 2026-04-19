export function FileUploader({
  label,
  helper,
}: {
  label: string
  helper: string
}) {
  return (
    <label className="flex cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-slate-50/80 px-6 py-10 text-center transition hover:border-cyan-500 hover:bg-cyan-50/50 dark:border-white/10 dark:bg-slate-900/70 dark:hover:border-cyan-400">
      <span className="font-medium text-slate-950 dark:text-white">{label}</span>
      <span className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">{helper}</span>
      <span className="mt-5 rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white dark:bg-cyan-400 dark:text-slate-950">
        Seleccionar archivo
      </span>
      <input className="hidden" type="file" />
    </label>
  )
}
