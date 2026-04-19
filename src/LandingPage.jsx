import { useState, useEffect } from 'react'
import { 
  Bug, ArrowRight, Timer, Brain, GitBranch, 
  BookOpen, TrendingUp, CheckCircle, Zap,
  Users, Shield, Download, ChevronRight,
  Clock, AlertTriangle, Lightbulb, Code2
} from 'lucide-react'

const GRID_SIZE = 40

function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg width="100%" height="100%" className="opacity-[0.04]">
        <defs>
          <pattern id="grid" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
            <path 
              d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`} 
              fill="none" 
              stroke="white" 
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      {/* Gradient fade on edges */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-transparent to-[#0a0a0a]" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]" />
    </div>
  )
}

{/**function LiveBadge() {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#2a2a2a] bg-[#111] text-xs text-[#888]">
      <span className="relative flex h-1.5 w-1.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
      </span>
      v1.0 is live — free forever
    </div>
  )
}**/}

function Navbar({ onEnter }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#1a1a1a] bg-[#0a0a0a]/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center">
            <Bug size={13} className="text-black" />
          </div>
          <span className="text-sm font-semibold text-white">DebugLib</span>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {['Features', 'How It Works', 'Playbooks'].map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s/g, '-')}`}
              className="text-sm text-[#666] hover:text-white transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={onEnter}
          className="flex items-center gap-1.5 px-4 py-2 bg-white text-black text-sm font-medium rounded-md hover:bg-white/90 transition-colors"
        >
          Open App
          <ArrowRight size={13} />
        </button>
      </div>
    </nav>
  )
}

function HeroSection({ onEnter }) {
  return (
    <section className="relative min-h-screen flex items-center pt-14">
      <GridBackground />

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full py-24">
        <div className="max-w-3xl">
          <LiveBadge />

          <h1 className="mt-8 text-6xl md:text-7xl font-bold text-white leading-[1.05] tracking-tight">
            Debug smarter.{' '}
            <span className="text-[#444]">Learn faster.</span>
          </h1>

          <p className="mt-6 text-lg text-[#666] leading-relaxed max-w-xl">
            The personal debug library that turns every bug into a lesson.
            Log problems, time your sessions, understand the{' '}
            <span className="text-white font-medium">why</span> behind every fix.
          </p>

          <div className="mt-10 flex items-center gap-3">
            <button
              onClick={onEnter}
              className="flex items-center gap-2 px-6 py-3 bg-white text-black font-medium rounded-md hover:bg-white/90 transition-all hover:gap-3 text-sm"
            >
              Start Debugging
              <ArrowRight size={14} />
            </button>
            <a
              href="#how-it-works"
              className="flex items-center gap-2 px-6 py-3 bg-transparent text-white border border-[#2a2a2a] rounded-md hover:border-[#3a3a3a] hover:bg-white/5 transition-all text-sm"
            >
              See How It Works
            </a>
          </div>

          
        </div>

        {/* Floating UI Preview */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden xl:block">
          <MockAppPreview />
        </div>
      </div>
    </section>
  )
}

function MockAppPreview() {
  const [elapsed, setElapsed] = useState(847)

  useEffect(() => {
    const interval = setInterval(() => setElapsed(e => e + 1), 1000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (s) => {
    const h = Math.floor(s / 3600)
    const m = Math.floor((s % 3600) / 60)
    const sec = s % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  return (
    <div className="w-[340px] bg-[#111] border border-[#1f1f1f] rounded-xl overflow-hidden shadow-2xl shadow-black/50">
      {/* Window bar */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[#1a1a1a]">
        <div className="w-2.5 h-2.5 rounded-full bg-[#333]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#333]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#333]" />
        <span className="ml-2 text-xs text-[#444] font-mono">BUG-007</span>
      </div>

      <div className="p-4 space-y-3">
        {/* Bug title */}
        <div>
          <p className="text-xs text-[#555] mb-1">Title</p>
          <p className="text-sm text-white font-medium">Auth token not persisting on refresh</p>
        </div>

        {/* Timer */}
        <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <Timer size={11} className="text-[#555]" />
              <span className="text-xs text-[#555]">Debug Timer</span>
            </div>
            <span className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20 px-1.5 py-0.5 rounded">
              Active
            </span>
          </div>
          <p className="font-mono text-2xl font-bold text-yellow-400">
            {formatTime(elapsed)}
          </p>
          <p className="text-xs text-[#444] mt-0.5">Started 14:22:18</p>
        </div>

        {/* Stack */}
        <div>
          <p className="text-xs text-[#555] mb-1.5">Stack</p>
          <div className="flex gap-1.5">
            {['React', 'TypeScript', 'Supabase'].map(s => (
              <span key={s} className="text-xs px-2 py-0.5 bg-white text-black rounded font-medium">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Attempts */}
        <div>
          <p className="text-xs text-[#555] mb-1.5">Attempts</p>
          <div className="space-y-1.5">
            {[
              { text: 'Checked localStorage — data is there', result: 'partial' },
              { text: 'Verified token expiry — not expired', result: 'failed' },
            ].map((a, i) => (
              <div key={i} className="flex items-start gap-2 p-2 bg-[#0d0d0d] rounded border border-[#1a1a1a]">
                <span className="text-xs text-[#444] font-mono mt-0.5">{i + 1}.</span>
                <p className="text-xs text-[#888] flex-1">{a.text}</p>
                <span className={`text-xs px-1 py-0.5 rounded ${
                  a.result === 'partial' 
                    ? 'text-yellow-400 bg-yellow-500/10' 
                    : 'text-red-400 bg-red-500/10'
                }`}>
                  {a.result}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Root cause teaser */}
        <div className="p-2.5 bg-green-500/5 border border-green-500/10 rounded">
          <p className="text-xs text-[#555] mb-0.5">Root Cause</p>
          <p className="text-xs text-green-400">
            Auth listener not initialized before render cycle...
          </p>
        </div>
      </div>
    </div>
  )
}

const FEATURES = [
  {
    icon: Timer,
    title: 'Live Debug Timer',
    description: 'Start a timer the moment you hit a bug. Track exactly how long every problem takes. Pause, resume, and see your average debug time improve over time.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/5 border-blue-500/10',
  },
  {
    icon: Brain,
    title: 'The 5-Layer System',
    description: 'Go beyond just logging the fix. Capture WHAT broke, WHERE it broke, WHY it broke, HOW the fix works, and WHEN you will see it again.',
    color: 'text-purple-400',
    bg: 'bg-purple-500/5 border-purple-500/10',
  },
  {
    icon: Users,
    title: 'Learn From Other Devs',
    description: 'Add solutions from teammates, Stack Overflow, or blogs. Compare approaches and understand why one solution is better than another.',
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/5 border-yellow-500/10',
  },
  {
    icon: GitBranch,
    title: 'Pattern Recognition',
    description: 'After 20 bugs you will start seeing patterns. DebugLib helps you name them, track them, and recognize them instantly in future code.',
    color: 'text-green-400',
    bg: 'bg-green-500/5 border-green-500/10',
  },
  {
    icon: TrendingUp,
    title: 'Knowledge Gap Tracker',
    description: 'Every bug reveals what you did not know. Track your confidence before and after. Watch yourself grow measurably with every entry.',
    color: 'text-orange-400',
    bg: 'bg-orange-500/5 border-orange-500/10',
  },
  {
    icon: BookOpen,
    title: 'Debugging Playbooks',
    description: 'Built-in systematic approaches for the most common bug scenarios. No more staring at the screen not knowing where to start.',
    color: 'text-red-400',
    bg: 'bg-red-500/5 border-red-500/10',
  },
]

function FeaturesSection() {
  return (
    <section id="features" className="relative py-32 border-t border-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs text-[#555] uppercase tracking-widest mb-3">Features</p>
          <h2 className="text-4xl font-bold text-white">
            Everything you need to{' '}
            <span className="text-[#444]">debug with intention</span>
          </h2>
          <p className="text-[#555] mt-4 max-w-xl mx-auto text-sm leading-relaxed">
            Not just a bug tracker. A system that makes you understand your 
            bugs so deeply you stop making the same mistakes twice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, title, description, color, bg }) => (
            <div
              key={title}
              className={`p-5 rounded-xl border ${bg} hover:scale-[1.01] transition-transform`}
            >
              <div className={`${color} mb-3`}>
                <Icon size={18} />
              </div>
              <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
              <p className="text-xs text-[#555] leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const LAYERS = [
  {
    number: '01',
    label: 'WHAT',
    title: 'What is the symptom?',
    description: 'Describe exactly what broke. What you expected vs what happened. The exact error message.',
    icon: AlertTriangle,
    color: 'text-red-400',
  },
  {
    number: '02',
    label: 'WHERE',
    title: 'Where did it break?',
    description: 'Was it the component, the API, the database, the build process? Locate it precisely.',
    icon: Code2,
    color: 'text-orange-400',
  },
  {
    number: '03',
    label: 'WHY',
    title: 'Root cause — the real why',
    description: 'Not the symptom. The actual cause. What created the conditions for this bug to exist.',
    icon: Brain,
    color: 'text-yellow-400',
  },
  {
    number: '04',
    label: 'HOW',
    title: 'How does the fix work?',
    description: 'The mechanism. Not just what you changed but why that change resolves the root cause.',
    icon: Lightbulb,
    color: 'text-green-400',
  },
  {
    number: '05',
    label: 'WHEN',
    title: 'When will you see this again?',
    description: 'The pattern. Name it. Describe the conditions. You will recognize it in 3 seconds next time.',
    icon: Clock,
    color: 'text-blue-400',
  },
]

function HowItWorksSection() {
  return (
    <section id="how-it-works" className="relative py-32 border-t border-[#1a1a1a]">
      <GridBackground />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs text-[#555] uppercase tracking-widest mb-3">The Method</p>
          <h2 className="text-4xl font-bold text-white">
            The 5-Layer Understanding System
          </h2>
          <p className="text-[#555] mt-4 max-w-xl mx-auto text-sm leading-relaxed">
            Most developers stop at layer 1 or 3. This system forces you to layer 5.
            That is the difference between fixing a bug and understanding it.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-[23px] top-8 bottom-8 w-px bg-gradient-to-b from-red-500/20 via-yellow-500/20 to-blue-500/20 hidden md:block" />

          <div className="space-y-4">
            {LAYERS.map(({ number, label, title, description, icon: Icon, color }, idx) => (
              <div
                key={number}
                className="relative flex items-start gap-6 p-5 bg-[#111] border border-[#1f1f1f] rounded-xl hover:border-[#2a2a2a] transition-all group"
              >
                {/* Number dot */}
                <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-xl bg-[#0d0d0d] border border-[#1a1a1a] flex items-center justify-center ${color}`}>
                  <Icon size={18} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-[#444]">{number}</span>
                    <span className={`text-xs font-bold tracking-widest ${color}`}>{label}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
                  <p className="text-xs text-[#555] leading-relaxed">{description}</p>
                </div>

                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight size={14} className="text-[#444]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const PHILOSOPHY = [
  {
    before: 'Bug → Fix → Move on',
    after: 'Bug → Understand → Document → Grow',
    label: 'Amateur vs Expert',
  },
  {
    before: 'Googling same error 6 months later',
    after: 'Finding your own past entry in 10 seconds',
    label: 'Memory vs System',
  },
  {
    before: '"I fixed it but I don\'t know why"',
    after: '"I can explain this to anyone"',
    label: 'Luck vs Mastery',
  },
]

function PhilosophySection() {
  return (
    <section className="py-32 border-t border-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-xs text-[#555] uppercase tracking-widest mb-3">The Philosophy</p>
          <h2 className="text-4xl font-bold text-white">
            Stop fixing bugs.{' '}
            <span className="text-[#444]">Start understanding them.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PHILOSOPHY.map(({ before, after, label }) => (
            <div key={label} className="p-5 bg-[#111] border border-[#1f1f1f] rounded-xl">
              <p className="text-xs text-[#555] uppercase tracking-widest mb-4">{label}</p>
              <div className="space-y-3">
                <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-lg">
                  <p className="text-xs text-[#555] mb-1">Before</p>
                  <p className="text-sm text-red-400/80">{before}</p>
                </div>
                <div className="flex justify-center">
                  <ArrowRight size={13} className="text-[#333] rotate-90" />
                </div>
                <div className="p-3 bg-green-500/5 border border-green-500/10 rounded-lg">
                  <p className="text-xs text-[#555] mb-1">After</p>
                  <p className="text-sm text-green-400">{after}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}



const PLAYBOOKS_PREVIEW = [
  'Nothing works, no error',
  'Works locally, broken in prod',
  'Worked yesterday, broken today',
  'Type / data error',
  'Performance issue',
  'The async trap',
]

function PlaybooksSection() {
  return (
    <section id="playbooks" className="py-32 border-t border-[#1a1a1a]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs text-[#555] uppercase tracking-widest mb-3">Playbooks</p>
            <h2 className="text-4xl font-bold text-white mb-4">
              Never stare blankly at a bug again
            </h2>
            <p className="text-[#555] text-sm leading-relaxed mb-6">
              Six built-in debugging playbooks for the scenarios that stump every developer. 
              Step-by-step systematic approaches so you always know your next move.
            </p>
            <p className="text-xs text-[#444] italic">
              "Measure before you optimize. Never assume where the bottleneck is — 
              you will almost always be wrong."
            </p>
          </div>

          <div className="space-y-2">
            {PLAYBOOKS_PREVIEW.map((pb, idx) => (
              <div
                key={pb}
                className="flex items-center gap-3 p-3.5 bg-[#111] border border-[#1f1f1f] rounded-lg hover:border-[#2a2a2a] transition-all group cursor-default"
              >
                <span className="text-xs font-mono text-[#444] w-5">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="text-sm text-[#888] group-hover:text-white transition-colors flex-1">
                  {pb}
                </span>
                <ChevronRight size={12} className="text-[#333] group-hover:text-[#555] transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function CTASection({ onEnter }) {
  return (
    <section className="py-32 border-t border-[#1a1a1a]">
      <div className="relative max-w-6xl mx-auto px-6 text-center">
        <GridBackground />
        <div className="relative z-10">
          <p className="text-xs text-[#555] uppercase tracking-widest mb-4">Get Started</p>
          <h2 className="text-5xl font-bold text-white mb-4">
            Log your first bug.
            <br />
            <span className="text-[#444]">Learn something real.</span>
          </h2>
          <p className="text-[#555] mb-10 text-sm max-w-md mx-auto">
            No account. No setup. No cloud. Open the app and start logging 
            immediately. Your data lives in your browser.
          </p>
          <button
            onClick={onEnter}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-md hover:bg-white/90 transition-all hover:gap-3 text-sm"
          >
            Open DebugLib Free
            <ArrowRight size={15} />
          </button>
          <p className="mt-4 text-xs text-[#444]">
            No sign up · Export your data anytime
          </p>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-[#1a1a1a] py-8">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-white rounded flex items-center justify-center">
            <Bug size={10} className="text-black" />
          </div>
          <span className="text-xs text-[#555]">DebugLib</span>
        </div>
        <p className="text-xs text-[#444]">
          © {new Date().getFullYear()} DEBUGLIB. FREE & OPEN. BUILT FOR DEVELOPERS.
        </p>
        <div className="flex items-center gap-1.5 text-xs text-[#555]">
            {/* Coffee in footer too */}
                      <a
                      href="https://ko-fi.com/tonymphomilanzi"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 py-1.5 text-xs font-medium text-amber-700 shadow-sm transition-all hover:border-amber-300 hover:bg-amber-100 hover:shadow-md"
                    >
                      <Coffee
                        className="h-3.5 w-3.5 text-amber-500 transition-transform group-hover:rotate-12"
                        strokeWidth={2}
                      />
                     Buy me a coffee
                    </a>
        </div>
      </div>
    </footer>
  )
}

export default function LandingPage({ onEnter }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] font-sans">
      <Navbar onEnter={onEnter} />
      <HeroSection onEnter={onEnter} />

      <FeaturesSection />
      <HowItWorksSection />
      <PhilosophySection />
      <PlaybooksSection />
      <CTASection onEnter={onEnter} />
      <Footer />
    </div>
  )
}