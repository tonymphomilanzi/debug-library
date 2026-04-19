import { useState } from 'react'
import { Search, Filter, Plus, Bug, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '../../lib/utils'
import useDebugStore from '../../store/useDebugStore'
import { STATUS_COLORS, SEVERITY_COLORS, BUG_CATEGORIES, BUG_STATUS } from '../../lib/constants'

function formatDuration(seconds) {
  if (!seconds) return null
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export default function BugList() {
  const {
    getFilteredBugs, searchQuery, setSearchQuery,
    filters, setFilters, setActiveView, setSelectedBugId,
    addBug, bugs
  } = useDebugStore()

  const [showFilters, setShowFilters] = useState(false)
  const filteredBugs = getFilteredBugs()

  const projects = [...new Set(bugs.map(b => b.projectName).filter(Boolean))]

  const handleNewBug = () => {
    const bug = addBug({ title: 'Untitled Bug', status: BUG_STATUS.ACTIVE })
    setSelectedBugId(bug.id)
    setActiveView('bug-detail')
  }

  const handleOpenBug = (bug) => {
    setSelectedBugId(bug.id)
    setActiveView('bug-detail')
  }

  return (
    <div className="p-6 space-y-4 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Bug Entries</h1>
          <p className="text-sm text-[#666] mt-0.5">{filteredBugs.length} entries</p>
        </div>
        <button
          onClick={handleNewBug}
          className="flex items-center gap-2 px-3 py-2 bg-white text-black rounded-md text-sm font-medium hover:bg-white/90 transition-colors"
        >
          <Plus size={14} />
          Log Bug
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555]" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search bugs, projects, tags..."
            className="w-full pl-9 pr-3 py-2 bg-[#111] border border-[#1f1f1f] rounded-md text-sm text-white placeholder-[#444] focus:outline-none focus:border-[#2a2a2a]"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-2 rounded-md border text-sm transition-colors",
            showFilters
              ? "bg-white/10 border-white/20 text-white"
              : "bg-[#111] border-[#1f1f1f] text-[#666] hover:text-white"
          )}
        >
          <Filter size={13} />
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-3 bg-[#111] border border-[#1f1f1f] rounded-lg">
          {[
            {
              key: 'status', label: 'Status',
              options: [
                { value: 'all', label: 'All Status' },
                { value: 'active', label: 'Active' },
                { value: 'investigating', label: 'Investigating' },
                { value: 'solved', label: 'Solved' },
                { value: 'blocked', label: 'Blocked' }
              ]
            },
            {
              key: 'severity', label: 'Severity',
              options: [
                { value: 'all', label: 'All Severity' },
                { value: 'low', label: 'Low' },
                { value: 'medium', label: 'Medium' },
                { value: 'high', label: 'High' },
                { value: 'critical', label: 'Critical' }
              ]
            },
            {
              key: 'project', label: 'Project',
              options: [
                { value: 'all', label: 'All Projects' },
                ...projects.map(p => ({ value: p, label: p }))
              ]
            },
            {
              key: 'category', label: 'Category',
              options: [
                { value: 'all', label: 'All Categories' },
                ...BUG_CATEGORIES.map(c => ({ value: c, label: c }))
              ]
            }
          ].map(filter => (
            <div key={filter.key}>
              <label className="text-xs text-[#555] mb-1 block">{filter.label}</label>
              <select
                value={filters[filter.key]}
                onChange={e => setFilters({ [filter.key]: e.target.value })}
                className="w-full px-2 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-xs text-white focus:outline-none"
              >
                {filter.options.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {/* Bug List */}
      {filteredBugs.length === 0 ? (
        <div className="text-center py-16 bg-[#111] border border-[#1f1f1f] rounded-lg">
          <Bug size={32} className="text-[#333] mx-auto mb-3" />
          <p className="text-white font-medium">No bugs found</p>
          <p className="text-sm text-[#555] mt-1">Log your first bug to get started</p>
          <button
            onClick={handleNewBug}
            className="mt-4 px-4 py-2 bg-white text-black rounded-md text-sm font-medium hover:bg-white/90 transition-colors"
          >
            Log First Bug
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredBugs.map(bug => (
            <button
              key={bug.id}
              onClick={() => handleOpenBug(bug)}
              className="w-full text-left bg-[#111] border border-[#1f1f1f] rounded-lg p-4 hover:border-[#2a2a2a] transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                  bug.status === 'solved' ? 'bg-green-400' :
                  bug.status === 'investigating' ? 'bg-purple-400' :
                  bug.status === 'blocked' ? 'bg-red-400' : 'bg-blue-400'
                )} />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-[#555]">{bug.bugId}</span>
                    <h3 className="text-sm font-medium text-white">{bug.title || 'Untitled Bug'}</h3>
                  </div>

                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    {bug.projectName && (
                      <span className="text-xs text-[#555]">{bug.projectName}</span>
                    )}
                    {bug.category && (
                      <span className="text-xs text-[#555]">· {bug.category}</span>
                    )}
                    <span className="text-xs text-[#444]">
                      · {formatDistanceToNow(new Date(bug.createdAt), { addSuffix: true })}
                    </span>
                    {bug.totalDebugTime && (
                      <span className="text-xs text-[#444]">
                        · {formatDuration(bug.totalDebugTime)} to solve
                      </span>
                    )}
                  </div>

                  {bug.tags?.length > 0 && (
                    <div className="flex items-center gap-1 mt-2 flex-wrap">
                      {bug.tags.map(tag => (
                        <span key={tag} className="text-xs text-[#555] bg-white/5 px-1.5 py-0.5 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className={cn(
                    "text-xs px-1.5 py-0.5 rounded border capitalize",
                    STATUS_COLORS[bug.status]
                  )}>
                    {bug.status}
                  </span>
                  <span className={cn(
                    "text-xs px-1.5 py-0.5 rounded border capitalize",
                    SEVERITY_COLORS[bug.severity]
                  )}>
                    {bug.severity}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}