export default function ScoreSlider({ value, onChange, label }) {
  const getColor = (v) => {
    if (v <= 3) return '#ef4444'
    if (v <= 5) return '#f97316'
    if (v <= 7) return '#eab308'
    if (v <= 9) return '#22c55e'
    return '#3b82f6'
  }

  const labels = ['', 'No idea', 'Vague', 'Partial', 'Getting there', 'Half confident', 'Mostly get it', 'Solid', 'Very confident', 'Can teach', 'Expert']

  return (
    <div>
      {label && <p className="text-xs text-[#666] mb-2">{label}</p>}
      <div className="flex items-center gap-3">
        <input
          type="range"
          min="1"
          max="10"
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="flex-1 accent-white"
        />
        <div className="flex items-center gap-1.5 min-w-[100px]">
          <span
            className="text-lg font-bold font-mono"
            style={{ color: getColor(value) }}
          >
            {value}/10
          </span>
        </div>
      </div>
      <p className="text-xs mt-1" style={{ color: getColor(value) }}>
        {labels[value]}
      </p>
    </div>
  )
}