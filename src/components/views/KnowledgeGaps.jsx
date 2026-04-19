import { useState } from 'react'
import { Plus, Brain, TrendingUp, X, ChevronDown, ChevronUp } from 'lucide-react'
import { cn } from '../../lib/utils'
import useDebugStore from '../../store/useDebugStore'
import ScoreSlider from '../shared/ScoreSlider'

function GapCard({ gap, bugs, onUpdate, onDelete }) {
  const [open, setOpen] = useState(false)
  const relatedBugs = bugs.filter(b => gap.discoveredVia?.includes(b.id))
  const growth = gap.confidenceNow - gap.confidenceBefore

  const statusColors = {
    learning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    solid: 'bg-green-500/10 text-green-400 border-green-500/20',
    fuzzy: 'bg-red-500/10 text-red-400 border-red-500/20'
  }

  return (
    <div className="bg-[#111] border border-[#1f1f1f] rounded-lg overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={cn("text-xs px-1.5 py-0.5 rounded border", statusColors[gap.status] || statusColors.learning)}>
                {gap.status}
              </span>
              {growth > 0 && (
                <span className="text-xs text-green-400">+{growth} growth</span>
              )}
            </div>
            <h3 className="text-sm font-medium text-white">{gap.topic || 'Unnamed Gap'}</h3>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={() => setOpen(!open)} className="p-1.5 hover:bg-white/5 rounded transition-colors text-[#555]">
              {open ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
            <button onClick={onDelete} className="p-1.5 hover:bg-red-500/10 rounded transition-colors text-[#444] hover:text-red-400">
              <X size={12} />
            </button>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-[#555] mb-1">Before</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 bg-[#1a1a1a] rounded-full">
                <div
                  className="h-1 bg-red-400 rounded-full"
                  style={{ width: `${(gap.confidenceBefore / 10) * 100}%` }}
                />
              </div>
              <span className="text-xs text-[#555] font-mono">{gap.confidenceBefore}/10</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-[#555] mb-1">Now</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 bg-[#1a1a1a] rounded-full">
                <div
                  className="h-1 bg-green-400 rounded-full"
                  style={{ width: `${(gap.confidenceNow / 10) * 100}%` }}
                />
              </div>
              <span className="text-xs text-[#555] font-mono">{gap.confidenceNow}/10</span>
            </div>
          </div>
        </div>
      </div>

      {open && (
        <div className="px-4 pb-4 border-t border-[#1a1a1a] pt-4 space-y-3">
          <div>
            <label className="text-xs text-[#555] mb-1 block">Topic</label>
            <input
              value={gap.topic || ''}
              onChange={e => onUpdate({ topic: e.target.value })}
              className="w-full px-2 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-sm text-white focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-[#555] mb-1 block">Status</label>
              <select
                value={gap.status}
                onChange={e => onUpdate({ status: e.target.value })}
                className="w-full px-2 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-xs text-white focus:outline-none"
              >
                <option value="learning">Learning</option>
                <option value="solid">Solid</option>
                <option value="fuzzy">Still Fuzzy</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-[#555] mb-2 block">Confidence Before</label>
            <ScoreSlider value={gap.confidenceBefore} onChange={v => onUpdate({ confidenceBefore: v })} />
          </div>
          <div>
            <label className="text-xs text-[#555] mb-2 block">Confidence Now</label>
            <ScoreSlider value={gap.confidenceNow} onChange={v => onUpdate({ confidenceNow: v })} />
          </div>
          <div>
            <label className="text-xs text-[#555] mb-1 block">Resources / Notes</label>
            <textarea
              value={gap.resources || ''}
              onChange={e => onUpdate({ resources: e.target.value })}
              placeholder="Links, books, courses that helped..."
              rows={2}
              className="w-full px-2 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-xs text-white focus:outline-none resize-none"
            />
          </div>
          {relatedBugs.length > 0 && (
            <div>
              <label className="text-xs text-[#555] mb-1 block">Discovered Via</label>
              <div className="flex flex-wrap gap-1">
                {relatedBugs.map(b => (
                  <span key={b.id} className="text-xs bg-white/5 text-[#888] px-1.5 py-0.5 rounded">{b.bugId}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function KnowledgeGaps() {
  const { knowledgeGaps, addKnowledgeGap, updateKnowledgeGap, deleteKnowledgeGap, bugs } = useDebugStore()

  const solidCount = knowledgeGaps.filter(g => g.status === 'solid').length
  const learningCount = knowledgeGaps.filter(g => g.status === 'learning').length
  const fuzzyCount = knowledgeGaps.filter(g => g.status === 'fuzzy').length

  return (
    <div className="p-6 space-y-5 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Knowledge Gaps</h1>
          <p className="text-sm text-[#666] mt-0.5">Track what you learn from every bug</p>
        </div>
        <button
          onClick={() => addKnowledgeGap({ topic: 'New Knowledge Gap', confidenceBefore: 3, confidenceNow: 3, status: 'learning' })}
          className="flex items-center gap-1.5 px-3 py-2 bg-white text-black rounded-md text-sm font-medium hover:bg-white/90 transition-colors"
        >
          <Plus size={14} />
          Add Gap
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Still Learning', value: learningCount, color: '#eab308' },
          { label: 'Still Fuzzy', value: fuzzyCount, color: '#ef4444' },
          { label: 'Solid Now', value: solidCount, color: '#4ade80' },
        ].map(s => (
          <div key={s.label} className="bg-[#111] border border-[#1f1f1f] rounded-lg p-3 text-center">
            <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs text-[#666] mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {knowledgeGaps.length === 0 ? (
        <div className="text-center py-16 bg-[#111] border border-[#1f1f1f] rounded-lg">
          <Brain size={32} className="text-[#333] mx-auto mb-3" />
          <p className="text-white font-medium">No knowledge gaps tracked</p>
          <p className="text-sm text-[#555] mt-1">Add gaps you discover while debugging</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {knowledgeGaps.map(gap => (
            <GapCard
              key={gap.id}
              gap={gap}
              bugs={bugs}
              onUpdate={(updates) => updateKnowledgeGap(gap.id, updates)}
              onDelete={() => deleteKnowledgeGap(gap.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}