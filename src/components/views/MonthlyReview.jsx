import { useState } from 'react'
import { TrendingUp, Clock, Bug, CheckCircle, Brain } from 'lucide-react'
import { startOfMonth, endOfMonth, isWithinInterval, format, subMonths } from 'date-fns'
import useDebugStore from '../../store/useDebugStore'

function formatDuration(seconds) {
  if (!seconds) return 'N/A'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export default function MonthlyReview() {
  const { bugs, knowledgeGaps } = useDebugStore()
  const [selectedMonth, setSelectedMonth] = useState(0)

  const monthDate = subMonths(new Date(), selectedMonth)
  const monthStart = startOfMonth(monthDate)
  const monthEnd = endOfMonth(monthDate)

  const monthBugs = bugs.filter(b =>
    isWithinInterval(new Date(b.createdAt), { start: monthStart, end: monthEnd })
  )

  const solved = monthBugs.filter(b => b.status === 'solved')
  const avgTime = solved.length > 0
    ? solved.reduce((a, b) => a + (b.totalDebugTime || 0), 0) / solved.length
    : 0

  const categoryBreakdown = monthBugs.reduce((acc, b) => {
    if (b.category) acc[b.category] = (acc[b.category] || 0) + 1
    return acc
  }, {})

  const topCategories = Object.entries(categoryBreakdown).sort((a, b) => b[1] - a[1]).slice(0, 5)

  const stackBreakdown = monthBugs.reduce((acc, b) => {
    b.stack?.forEach(s => { acc[s] = (acc[s] || 0) + 1 })
    return acc
  }, {})

  return (
    <div className="p-6 space-y-5 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Monthly Review</h1>
          <p className="text-sm text-[#666] mt-0.5">{format(monthDate, 'MMMM yyyy')}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSelectedMonth(m => m + 1)}
            className="px-3 py-1.5 bg-[#111] border border-[#1f1f1f] rounded-md text-sm text-[#888] hover:text-white transition-colors"
          >
            ←
          </button>
          <span className="px-3 text-sm text-white">{format(monthDate, 'MMM yyyy')}</span>
          <button
            disabled={selectedMonth === 0}
            onClick={() => setSelectedMonth(m => m - 1)}
            className="px-3 py-1.5 bg-[#111] border border-[#1f1f1f] rounded-md text-sm text-[#888] hover:text-white transition-colors disabled:opacity-30"
          >
            →
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total Bugs', value: monthBugs.length, icon: Bug },
          { label: 'Solved', value: solved.length, icon: CheckCircle },
          { label: 'Solve Rate', value: `${monthBugs.length > 0 ? Math.round((solved.length / monthBugs.length) * 100) : 0}%`, icon: TrendingUp },
          { label: 'Avg Debug Time', value: formatDuration(avgTime), icon: Clock },
        ].map(s => (
          <div key={s.label} className="bg-[#111] border border-[#1f1f1f] rounded-lg p-4">
            <p className="text-xs text-[#666] mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>

      {monthBugs.length === 0 ? (
        <div className="text-center py-16 bg-[#111] border border-[#1f1f1f] rounded-lg">
          <p className="text-[#555]">No bugs logged this month</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Top Categories */}
          <div className="bg-[#111] border border-[#1f1f1f] rounded-lg p-4">
            <h2 className="text-sm font-medium text-white mb-3">Top Bug Categories</h2>
            <div className="space-y-2">
              {topCategories.map(([cat, count]) => (
                <div key={cat} className="flex items-center gap-2">
                  <span className="text-xs text-[#888] flex-1">{cat}</span>
                  <div className="w-24 h-1 bg-[#1a1a1a] rounded-full">
                    <div
                      className="h-1 bg-white rounded-full"
                      style={{ width: `${(count / monthBugs.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-[#555] w-4 text-right">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Slowest Bugs */}
          <div className="bg-[#111] border border-[#1f1f1f] rounded-lg p-4">
            <h2 className="text-sm font-medium text-white mb-3">Hardest Bugs This Month</h2>
            <div className="space-y-2">
              {solved
                .sort((a, b) => (b.totalDebugTime || 0) - (a.totalDebugTime || 0))
                .slice(0, 5)
                .map(bug => (
                  <div key={bug.id} className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-white truncate">{bug.title}</p>
                      <p className="text-xs text-[#555]">{bug.bugId}</p>
                    </div>
                    <span className="text-xs text-[#888] ml-2">{formatDuration(bug.totalDebugTime)}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="bg-[#111] border border-[#1f1f1f] rounded-lg p-4">
            <h2 className="text-sm font-medium text-white mb-3">Stack This Month</h2>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(stackBreakdown).map(([tech, count]) => (
                <span key={tech} className="flex items-center gap-1 px-2 py-0.5 bg-white/5 text-[#888] text-xs rounded">
                  {tech}
                  <span className="text-[#555]">({count})</span>
                </span>
              ))}
            </div>
          </div>

          {/* Knowledge Gaps Closed */}
          <div className="bg-[#111] border border-[#1f1f1f] rounded-lg p-4">
            <h2 className="text-sm font-medium text-white mb-3">Knowledge Progress</h2>
            <div className="space-y-2">
              {knowledgeGaps.slice(0, 5).map(gap => {
                const growth = gap.confidenceNow - gap.confidenceBefore
                return (
                  <div key={gap.id} className="flex items-center justify-between">
                    <span className="text-xs text-[#888] flex-1 truncate">{gap.topic}</span>
                    <span className={`text-xs font-mono ${growth > 0 ? 'text-green-400' : growth < 0 ? 'text-red-400' : 'text-[#555]'}`}>
                      {growth > 0 ? '+' : ''}{growth}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bug List for Month */}
      {monthBugs.length > 0 && (
        <div className="bg-[#111] border border-[#1f1f1f] rounded-lg p-4">
          <h2 className="text-sm font-medium text-white mb-3">All Bugs This Month</h2>
          <div className="space-y-1">
            {monthBugs.map(bug => (
              <div key={bug.id} className="flex items-center gap-3 py-1.5 border-b border-[#1a1a1a] last:border-0">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  bug.status === 'solved' ? 'bg-green-400' :
                  bug.status === 'blocked' ? 'bg-red-400' :
                  bug.status === 'investigating' ? 'bg-purple-400' : 'bg-blue-400'
                }`} />
                <span className="text-xs text-[#555] font-mono">{bug.bugId}</span>
                <span className="text-xs text-white flex-1 truncate">{bug.title}</span>
                {bug.totalDebugTime && (
                  <span className="text-xs text-[#555]">{formatDuration(bug.totalDebugTime)}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}