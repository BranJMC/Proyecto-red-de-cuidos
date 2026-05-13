import { useRef } from 'react'

interface OtpInputProps {
  length?: number
  value?: string
  onChange?: (value: string) => void
}

export function OtpInput({ length = 6, value = '', onChange }: OtpInputProps) {
  const digits = Array.from({ length }, (_, index) => value[index] ?? '')
  const inputRefs = useRef<Array<HTMLInputElement | null>>([])

  function focusInput(index: number) {
    inputRefs.current[index]?.focus()
    inputRefs.current[index]?.select()
  }

  return (
    <div className="grid grid-cols-6 gap-3">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            inputRefs.current[index] = element
          }}
          maxLength={1}
          value={digit}
          onChange={(event) => {
            const nextDigit = event.target.value.replace(/\D/g, '').slice(-1)
            const nextValue = digits.map((current, currentIndex) => (currentIndex === index ? nextDigit : current)).join('')
            onChange?.(nextValue)

            if (nextDigit && index < length - 1) {
              focusInput(index + 1)
            }
          }}
          onKeyDown={(event) => {
            if (event.key === 'Backspace' && !digits[index] && index > 0) {
              focusInput(index - 1)
            }
          }}
          onPaste={(event) => {
            event.preventDefault()
            const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
            onChange?.(pasted)
            focusInput(Math.min(pasted.length, length - 1))
          }}
          className="h-14 rounded-2xl border border-slate-200 bg-white text-center text-xl font-semibold text-slate-950 outline-none ring-0 transition focus:border-cyan-500 dark:border-white/10 dark:bg-slate-900 dark:text-white"
          inputMode="numeric"
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  )
}
