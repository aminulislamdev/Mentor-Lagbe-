
export function StrengthMeter({ password }: { password: string }) {
  const strength = (() => {
    if (!password) return 0
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    return score
  })()

  const labels = ["", "Fragile", "Fair", "Sound", "Sealed-grade"]
  const tones = ["", "#A34343", "#B87959", "#668B78", "#344C43"]

  if (!password) return null

  return (
    <div className="mt-2 flex items-center gap-3" aria-live="polite">
      <div className="flex flex-1 gap-1.5" aria-hidden="true">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-0.75 flex-1 rounded-full transition-colors duration-300"
            style={{
              backgroundColor:
                i <= strength ? tones[strength] : "rgba(52,76,67,0.14)",
            }}
          />
        ))}
      </div>
      <span
        className="font-mono text-[9px] font-medium uppercase tracking-[0.2em]"
        style={{ color: tones[strength] }}
      >
        {labels[strength]}
      </span>
    </div>
  )
}