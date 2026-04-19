import { useState } from 'react'
import { X } from 'lucide-react'

export default function TagInput({ tags = [], onChange, placeholder = "Add tag..." }) {
  const [input, setInput] = useState('')

  const addTag = (value) => {
    const tag = value.trim().toLowerCase().replace(/\s+/g, '-')
    if (tag && !tags.includes(tag)) {
      onChange([...tags, tag])
    }
    setInput('')
  }

  const removeTag = (tag) => onChange(tags.filter(t => t !== tag))

  return (
    <div className="flex flex-wrap gap-1.5 p-2 rounded-md bg-[#1a1a1a] border border-[#2a2a2a] min-h-[40px]">
      {tags.map(tag => (
        <span
          key={tag}
          className="flex items-center gap-1 px-2 py-0.5 bg-white/10 text-white text-xs rounded-md"
        >
          #{tag}
          <button onClick={() => removeTag(tag)} className="text-[#888] hover:text-white">
            <X size={10} />
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            addTag(input)
          }
          if (e.key === 'Backspace' && !input && tags.length > 0) {
            removeTag(tags[tags.length - 1])
          }
        }}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="bg-transparent text-sm text-white outline-none flex-1 min-w-[80px] placeholder-[#555]"
      />
    </div>
  )
}