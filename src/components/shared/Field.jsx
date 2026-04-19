export function Field({ label, hint, children, required }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <label className="text-xs font-medium text-[#888] uppercase tracking-wider">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
        {hint && <span className="text-xs text-[#555]">{hint}</span>}
      </div>
      {children}
    </div>
  )
}

export function TextInput({ value, onChange, placeholder, className = '' }) {
  return (
    <input
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-3 py-2 rounded-md bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm placeholder-[#444] focus:outline-none focus:border-[#444] transition-colors ${className}`}
    />
  )
}

export function TextArea({ value, onChange, placeholder, rows = 4, className = '' }) {
  return (
    <textarea
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={`w-full px-3 py-2 rounded-md bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm placeholder-[#444] focus:outline-none focus:border-[#444] transition-colors resize-none font-sans ${className}`}
    />
  )
}

export function CodeArea({ value, onChange, placeholder, rows = 6 }) {
  return (
    <textarea
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      spellCheck={false}
      className="w-full px-3 py-2 rounded-md bg-[#0d0d0d] border border-[#2a2a2a] text-green-400 text-xs font-mono focus:outline-none focus:border-[#444] transition-colors resize-none"
    />
  )
}

export function Select({ value, onChange, options, placeholder }) {
  return (
    <select
      value={value || ''}
      onChange={e => onChange(e.target.value)}
      className="w-full px-3 py-2 rounded-md bg-[#1a1a1a] border border-[#2a2a2a] text-white text-sm focus:outline-none focus:border-[#444] transition-colors"
    >
      {placeholder && <option value="" className="text-[#444]">{placeholder}</option>}
      {options.map(opt => (
        <option key={opt.value || opt} value={opt.value || opt}>
          {opt.label || opt}
        </option>
      ))}
    </select>
  )
}