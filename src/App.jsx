import { useState } from 'react'
import LandingPage from './LandingPage'
import Sidebar from './components/layout/Sidebar'
import Dashboard from './components/views/Dashboard'
import BugList from './components/views/BugList'
import BugDetail from './components/views/BugDetail'
import Projects from './components/views/Projects'
import Patterns from './components/views/Patterns'
import KnowledgeGaps from './components/views/KnowledgeGaps'
import MonthlyReview from './components/views/MonthlyReview'
import Playbooks from './components/views/Playbooks'
import useDebugStore from './store/useDebugStore'

const views = {
  dashboard: Dashboard,
  bugs: BugList,
  'bug-detail': BugDetail,
  projects: Projects,
  patterns: Patterns,
  knowledge: KnowledgeGaps,
  review: MonthlyReview,
  playbooks: Playbooks,
}

export default function App() {
  const { activeView } = useDebugStore()
  const [showApp, setShowApp] = useState(false)
  const View = views[activeView] || Dashboard

  if (!showApp) {
    return <LandingPage onEnter={() => setShowApp(true)} />
  }

  return (
    <div className="flex h-screen bg-[#0a0a0a] overflow-hidden font-sans">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <View />
      </main>
    </div>
  )
}