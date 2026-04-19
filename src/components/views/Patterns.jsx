import { useState } from 'react'
import { Plus, GitBranch, X, ChevronDown, ChevronUp } from 'lucide-react'
import useDebugStore from '../../store/useDebugStore'

const PATTERN_EXAMPLES = [
  { name: 'It Works But...', symptom: 'Code looks correct, logic is right, still broken', usuallyMeans: 'Environment/config issue, not logic issue' },
  { name: 'It Was Working Yesterday', symptom: 'No changes made, suddenly broken', usuallyMeans: 'External dependency changed, env variable, API change' },
  { name: 'Works On My Machine', symptom: 'Works locally, fails in production', usuallyMeans: 'Environment difference, hardcoded values, OS differences' },
  { name: 'The Silent Failure', symptom: 'No errors, no logs, just nothing happening', usuallyMeans: 'Async issue, wrong scope, event not reaching target' },
]

function PatternCard({ pattern, bugs, onUpdate, onDelete }) {
  const [open, setOpen] = useState(false)
  const relatedBugs = bugs.filter(b => pattern.relatedBugIds?.includes(b.id))

  return (
    <div className="bg-[#111] border border-[#1f1f1f] rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="text-sm font-medium text-white">{pattern.name || 'Unnamed Pattern'}</h3>
          <div className="flex items-center gap-1">
            <button onClick={() => setOpen(!open)} className="p-1.5 hover:bg-white/5 rounded text-[#555]">
              {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
            <button onClick={onDelete} className="p-1.5 hover:bg-red-500/10 rounded text-[#444] hover:text-red-400">
              <X size={12} />
            </button>
          </div>
        </div>
        {pattern.symptom && (
          <p className="text-xs text-[#666] mt-1">
            <span className="text-[#555]">Symptom:</span> {pattern.symptom}
          </p>
        )}
        {pattern.usuallyMeans && (
          <p className="text-xs text-[#888] mt-1">
            <span className="text-[#555]">Usually means:</span> {pattern.usuallyMeans}
          </p>
        )}
        {relatedBugs.length > 0 && (
          <div className="flex gap-1 mt-2">
            {relatedBugs.map(b => (
              <span key={b.id} className="text-xs bg-white/5 text-[#666] px-1.5 py-0.5 rounded">{b.bugId}</span>
            ))}
          </div>
        )}
      </div>
      {open && (
        <div className="px-4 pb-4 border-t border-[#1a1a1a] pt-4 space-y-3">
          {[
            { key: 'name', label: 'Pattern Name', multi: false },
            { key: 'symptom', label: 'Symptom', multi: true },
            { key: 'usuallyMeans', label: 'Usually Means', multi: true },
            { key: 'notes', label: 'Notes', multi: true },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs text-[#555] mb-1 block">{f.label}</label>
              {f.multi ? (
                <textarea
                  value={pattern[f.key] || ''}
                  onChange={e => onUpdate({ [f.key]: e.target.value })}
                  rows={2}
                  className="w-full px-2 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-xs text-white focus:outline-none resize-none"
                />
              ) : (
                <input
                  value={pattern[f.key] || ''}
                  onChange={e => onUpdate({ [f.key]: e.target.value })}
                  className="w-full px-2 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-xs text-white focus:outline-none"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Patterns() {
  const { patterns, addPattern, updatePattern, deletePattern, bugs } = useDebugStore()

  return (
    <div className="p-6 space-y-5 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Bug Patterns</h1>
          <p className="text-sm text-[#666] mt-0.5">Recurring patterns you've recognized across bugs</p>
        </div>
        <button
          onClick={() => addPattern({ name: 'New Pattern' })}
          className="flex items-center gap-1.5 px-3 py-2 bg-white text-black rounded-md text-sm font-medium hover:bg-white/90"
        >
          <Plus size={14} />
          Add Pattern
        </button>
      </div>

      {patterns.length === 0 && (
        <div className="bg-[#111] border border-[#1f1f1f] rounded-lg p-4">
          <p className="text-xs text-[#666] mb-3 font-medium">Starter patterns to get you going:</p>
          <div className="space-y-2">
            {PATTERN_EXAMPLES.map(ex => (
              <button
                key={ex.name}
                onClick={() => addPattern(ex)}
                className="w-full text-left p-3 rounded-md border border-[#2a2a2a] hover:border-[#3a3a3a] bg-[#0d0d0d] transition-colors group"
              >
                <p className="text-sm text-white">{ex.name}</p>
                <p className="text-xs text-[#555] mt-0.5">{ex.symptom}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {patterns.map(pattern => (
          <PatternCard
            key={pattern.id}
            pattern={pattern}
            bugs={bugs}
            onUpdate={updates => updatePattern(pattern.id, updates)}
            onDelete={() => deletePattern(pattern.id)}
          />
        ))}
      </div>
    </div>
  )
}