interface OtpInputProps {
  length?: number
}

export function OtpInput({ length = 6 }: OtpInputProps) {
  return (
    <div className="grid grid-cols-6 gap-3">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          maxLength={1}
          className="h-14 rounded-2xl border border-slate-200 bg-white text-center text-xl font-semibold text-slate-950 outline-none ring-0 transition focus:border-cyan-500 dark:border-white/10 dark:bg-slate-900 dark:text-white"
          inputMode="numeric"
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  )
}
