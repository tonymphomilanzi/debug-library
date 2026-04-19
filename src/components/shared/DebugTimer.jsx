import { useState, useEffect } from 'react'
import { Play, Pause, CheckCircle, Timer } from 'lucide-react'
import { cn } from '../../lib/utils'
import useDebugStore from '../../store/useDebugStore'

function formatTime(seconds) {
  if (!seconds && seconds !== 0) return '--:--:--'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function DebugTimer({ bug }) {
  const { updateBug, pauseTimer, resumeTimer, solveBug } = useDebugStore()
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (bug.status === 'solved') {
      setElapsed(bug.totalDebugTime || 0)
      return
    }

    const tick = () => {
      if (bug.timerPaused) return
      const start = new Date(bug.timerStarted).getTime()
      const now = Date.now()
      const pausedTime = bug.totalPausedTime || 0
      setElapsed(Math.floor((now - start - pausedTime) / 1000))
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [bug.timerStarted, bug.timerPaused, bug.totalPausedTime, bug.status, bug.totalDebugTime])

  const isSolved = bug.status === 'solved'

  const getTimerColor = () => {
    if (isSolved) return 'text-green-400'
    if (elapsed > 7200) return 'text-red-400'
    if (elapsed > 3600) return 'text-orange-400'
    if (elapsed > 1800) return 'text-yellow-400'
    return 'text-white'
  }

  const getTimerBg = () => {
    if (isSolved) return 'border-green-500/20 bg-green-500/5'
    if (elapsed > 7200) return 'border-red-500/20 bg-red-500/5'
    if (elapsed > 3600) return 'border-orange-500/20 bg-orange-500/5'
    return 'border-[#2a2a2a] bg-[#111]'
  }

  return (
    <div className={cn("rounded-lg border p-4", getTimerBg())}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Timer size={14} className={getTimerColor()} />
          <span className="text-xs text-[#666] uppercase tracking-wider">Debug Timer</span>
          {bug.timerPaused && (
            <span className="text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-1.5 py-0.5 rounded">
              Paused
            </span>
          )}
          {isSolved && (
            <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-1.5 py-0.5 rounded">
              Solved
            </span>
          )}
        </div>

        {!isSolved && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => bug.timerPaused ? resumeTimer(bug.id) : pauseTimer(bug.id)}
              className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-[#888] hover:text-white transition-colors"
            >
              {bug.timerPaused ? <Play size={12} /> : <Pause size={12} />}
            </button>
            <button
              onClick={() => solveBug(bug.id)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-green-500/10 hover:bg-green-500/20 text-green-400 text-xs font-medium transition-colors border border-green-500/20"
            >
              <CheckCircle size={12} />
              Mark Solved
            </button>
          </div>
        )}
      </div>

      <div className={cn("font-mono text-3xl font-bold mt-2", getTimerColor())}>
        {formatTime(elapsed)}
      </div>

      {!isSolved && (
        <div className="mt-2 flex gap-3 text-xs text-[#555]">
          <span>Started {new Date(bug.timerStarted).toLocaleTimeString()}</span>
          {elapsed > 3600 && (
            <span className="text-orange-400">
              Over 1 hour — consider asking for help
            </span>
          )}
        </div>
      )}

      {isSolved && bug.solvedAt && (
        <p className="text-xs text-[#555] mt-1">
          Solved at {new Date(bug.solvedAt).toLocaleTimeString()} on {new Date(bug.solvedAt).toLocaleDateString()}
        </p>
      )}
    </div>
  )
}