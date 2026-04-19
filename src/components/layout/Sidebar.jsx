
import { 
  Bug, LayoutDashboard, FolderOpen, Brain, 
  GitBranch, Settings, Plus, ChevronDown,
  BookOpen, TrendingUp, Download, Upload
} from 'lucide-react'
import { cn } from '../../lib/utils'
import useDebugStore from '../../store/useDebugStore'
import { storage } from '../../lib/storage'
import { BUG_STATUS, STATUS_COLORS } from '../../lib/constants'
import { formatDistanceToNow } from 'date-fns'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'bugs', label: 'Bug Entries', icon: Bug },
  { id: 'projects', label: 'Projects', icon: FolderOpen },
  { id: 'patterns', label: 'Patterns', icon: GitBranch },
  { id: 'knowledge', label: 'Knowledge Gaps', icon: Brain },
  { id: 'review', label: 'Monthly Review', icon: TrendingUp },
  { id: 'playbooks', label: 'Playbooks', icon: BookOpen },
]

export default function Sidebar() {
  const { activeView, setActiveView, bugs, addBug, setSelectedBugId } = useDebugStore()

  const activeBugs = bugs.filter(b => b.status === BUG_STATUS.ACTIVE || b.status === BUG_STATUS.INVESTIGATING)

  const handleNewBug = () => {
    const bug = addBug({ title: 'Untitled Bug', status: BUG_STATUS.ACTIVE })
    setSelectedBugId(bug.id)
    setActiveView('bug-detail')
  }

  const handleExport = () => {
    const data = storage.exportAll()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `debug-library-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          storage.importAll(data)
          window.location.reload()
        } catch { alert('Invalid file format') }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  return (
    <aside className="w-64 min-h-screen bg-[#111111] border-r border-[#1f1f1f] flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-[#1f1f1f]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center">
            <Bug size={14} className="text-black" />
          </div>
          <div>
            <p className="text-sm font-medium text-white leading-none">DebugLib</p>
            <p className="text-xs text-[#666] mt-0.5">Personal Debug Library</p>
          </div>
        </div>
      </div>

      {/* New Bug Button */}
      <div className="p-3">
        <button
          onClick={handleNewBug}
          className="w-full flex items-center gap-2 px-3 py-2 bg-white text-black rounded-md text-sm font-medium hover:bg-white/90 transition-colors"
        >
          <Plus size={14} />
          Log New Bug
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={cn(
              "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors text-left",
              activeView === item.id
                ? "bg-white/10 text-white"
                : "text-[#888] hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon size={15} />
            {item.label}
          </button>
        ))}

        {/* Active Bugs Section */}
        {activeBugs.length > 0 && (
          <div className="pt-4">
            <p className="px-3 text-xs text-[#555] font-medium uppercase tracking-wider mb-1">
              Active ({activeBugs.length})
            </p>
            {activeBugs.slice(0, 5).map(bug => (
              <button
                key={bug.id}
                onClick={() => { setSelectedBugId(bug.id); setActiveView('bug-detail') }}
                className="w-full flex items-start gap-2 px-3 py-2 rounded-md text-sm hover:bg-white/5 transition-colors text-left group"
              >
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0",
                  bug.status === 'active' ? 'bg-blue-400' : 'bg-purple-400'
                )} />
                <div className="min-w-0">
                  <p className="text-[#aaa] group-hover:text-white truncate text-xs leading-tight">
                    {bug.title || 'Untitled Bug'}
                  </p>
                  <p className="text-[#555] text-xs mt-0.5">{bug.bugId}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-[#1f1f1f] space-y-1">
        <button
          onClick={handleExport}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#666] hover:text-white hover:bg-white/5 rounded-md transition-colors"
        >
          <Download size={13} />
          Export Data
        </button>
        <button
          onClick={handleImport}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#666] hover:text-white hover:bg-white/5 rounded-md transition-colors"
        >
          <Upload size={13} />
          Import Data
        </button>
      </div>
    </aside>
  )
}