import { 
  Bug, CheckCircle, Clock, Zap, TrendingUp, 
  AlertCircle, Timer, Brain, GitBranch, ArrowRight
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { cn } from '../../lib/utils'
import useDebugStore from '../../store/useDebugStore'
import { STATUS_COLORS, SEVERITY_COLORS } from '../../lib/constants'

function formatDuration(seconds) {
  if (!seconds) return 'N/A'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m ${seconds % 60}s`
}

function StatCard({ icon: Icon, label, value, sub, color = 'white' }) {
  return (
    <div className="bg-[#111] border border-[#1f1f1f] rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-[#666] uppercase tracking-wider mb-1">{label}</p>
          <p className="text-2xl font-bold" style={{ color }}>{value}</p>
          {sub && <p className="text-xs text-[#555] mt-1">{sub}</p>}
        </div>
        <div className="p-2 rounded-md bg-white/5">
          <Icon size={16} className="text-[#666]" />
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { bugs, patterns, knowledgeGaps, getStats, setActiveView, setSelectedBugId } = useDebugStore()
  const stats = getStats()

  const recentBugs = bugs.slice(0, 5)
  const activeBugs = bugs.filter(b => b.status === 'active' || b.status === 'investigating')
  const recentlySolved = bugs.filter(b => b.status === 'solved').slice(0, 3)

  const categoryBreakdown = bugs.reduce((acc, bug) => {
    if (bug.category) {
      acc[bug.category] = (acc[bug.category] || 0) + 1
    }
    return acc
  }, {})

  const topCategories = Object.entries(categoryBreakdown)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-white">Dashboard</h1>
        <p className="text-sm text-[#666] mt-1">Your debugging journey at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Bug} label="Total Bugs" value={stats.total} sub="All time" />
        <StatCard icon={CheckCircle} label="Solved" value={stats.solved} sub={`${stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0}% solve rate`} color="#4ade80" />
        <StatCard icon={AlertCircle} label="Active" value={stats.active + stats.investigating} sub={`${stats.blocked} blocked`} color="#60a5fa" />
        <StatCard icon={Timer} label="Avg Debug Time" value={formatDuration(stats.avgDebugTime)} sub="Per bug" color="#c084fc" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Active Bugs */}
        <div className="lg:col-span-2 bg-[#111] border border-[#1f1f1f] rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium text-white">Active Bugs</h2>
            <button
              onClick={() => setActiveView('bugs')}
              className="text-xs text-[#666] hover:text-white flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight size={12} />
            </button>
          </div>

          {activeBugs.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle size={24} className="text-green-400 mx-auto mb-2" />
              <p className="text-sm text-[#666]">No active bugs. You are clean!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {activeBugs.slice(0, 6).map(bug => (
                <button
                  key={bug.id}
                  onClick={() => { setSelectedBugId(bug.id); setActiveView('bug-detail') }}
                  className="w-full flex items-center gap-3 p-3 rounded-md bg-white/[0.02] hover:bg-white/5 border border-[#1f1f1f] hover:border-[#2a2a2a] transition-all text-left group"
                >
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full flex-shrink-0",
                    bug.status === 'investigating' ? 'bg-purple-400' : 'bg-blue-400'
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{bug.title || 'Untitled'}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-[#555]">{bug.bugId}</span>
                      {bug.projectName && (
                        <span className="text-xs text-[#555]">· {bug.projectName}</span>
                      )}
                      <span className="text-xs text-[#555]">
                        · {formatDistanceToNow(new Date(bug.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={cn(
                      "text-xs px-1.5 py-0.5 rounded border",
                      SEVERITY_COLORS[bug.severity]
                    )}>
                      {bug.severity}
                    </span>
                    <ArrowRight size={12} className="text-[#555] group-hover:text-white transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Bug Categories */}
          <div className="bg-[#111] border border-[#1f1f1f] rounded-lg p-4">
            <h2 className="text-sm font-medium text-white mb-4">Top Bug Types</h2>
            {topCategories.length === 0 ? (
              <p className="text-xs text-[#555] text-center py-4">No data yet</p>
            ) : (
              <div className="space-y-2.5">
                {topCategories.map(([category, count]) => (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[#888]">{category}</span>
                      <span className="text-xs text-[#555]">{count}</span>
                    </div>
                    <div className="h-1 bg-[#1f1f1f] rounded-full">
                      <div
                        className="h-1 bg-white rounded-full transition-all"
                        style={{ width: `${(count / bugs.length) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-[#111] border border-[#1f1f1f] rounded-lg p-4 space-y-3">
            <h2 className="text-sm font-medium text-white">Library Health</h2>
            <div className="flex items-center justify-between py-1.5 border-b border-[#1a1a1a]">
              <div className="flex items-center gap-2 text-xs text-[#666]">
                <Brain size={12} />
                Knowledge Gaps
              </div>
              <span className="text-xs text-white font-medium">{knowledgeGaps.length}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-[#1a1a1a]">
              <div className="flex items-center gap-2 text-xs text-[#666]">
                <GitBranch size={12} />
                Patterns Found
              </div>
              <span className="text-xs text-white font-medium">{patterns.length}</span>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2 text-xs text-[#666]">
                <TrendingUp size={12} />
                Total Debug Time
              </div>
              <span className="text-xs text-white font-medium">
                {formatDuration(stats.totalDebugTime)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recently Solved */}
      {recentlySolved.length > 0 && (
        <div className="bg-[#111] border border-[#1f1f1f] rounded-lg p-4">
          <h2 className="text-sm font-medium text-white mb-4">Recently Solved</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {recentlySolved.map(bug => (
              <button
                key={bug.id}
                onClick={() => { setSelectedBugId(bug.id); setActiveView('bug-detail') }}
                className="text-left p-3 rounded-md bg-green-500/5 border border-green-500/10 hover:border-green-500/20 transition-all group"
              >
                <div className="flex items-start gap-2">
                  <CheckCircle size={13} className="text-green-400 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-white truncate">{bug.title}</p>
                    <p className="text-xs text-[#555] mt-0.5">
                      {formatDuration(bug.totalDebugTime)} · {bug.bugId}
                    </p>
                    {bug.category && (
                      <p className="text-xs text-[#555] truncate">{bug.category}</p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}