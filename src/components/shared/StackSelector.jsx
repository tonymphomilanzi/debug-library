import { X } from 'lucide-react'
import { TECH_STACKS } from '../../lib/constants'

export default function StackSelector({ selected = [], onChange }) {
  const toggle = (tech) => {
    if (selected.includes(tech)) {
      onChange(selected.filter(t => t !== tech))
    } else {
      onChange([...selected, tech])
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {selected.map(tech => (
          <span
            key={tech}
            className="flex items-center gap-1 px-2 py-0.5 bg-white text-black text-xs rounded-md font-medium"
          >
            {tech}
            <button onClick={() => toggle(tech)}>
              <X size={10} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex flex-wrap gap-1">
        {TECH_STACKS.filter(t => !selected.includes(t)).map(tech => (
          <button
            key={tech}
            onClick={() => toggle(tech)}
            className="px-2 py-0.5 text-xs rounded-md bg-[#1a1a1a] text-[#888] hover:text-white hover:bg-[#2a2a2a] transition-colors border border-[#2a2a2a]"
          >
            {tech}
          </button>
        ))}
      </div>
    </div>
  )
}