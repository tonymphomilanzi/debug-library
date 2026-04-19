import { useState } from 'react'
import { 
  ArrowLeft, Trash2, Plus, X, ChevronDown, ChevronUp,
  AlertTriangle, Lightbulb, Code2,
  BookOpen, Users, Timer, Brain, CheckCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import useDebugStore from '@/store/useDebugStore'
import { 
  BUG_CATEGORIES, PROJECT_TYPES, 
  SEVERITY_COLORS, STATUS_COLORS 
} from '@/lib/constants'
import DebugTimer from '@/components/shared/DebugTimer'
import TagInput from '@/components/shared/TagInput'
import StackSelector from '@/components/shared/StackSelector'
import ScoreSlider from '@/components/shared/ScoreSlider'
import { Field, TextInput, TextArea, CodeArea, Select } from '@/components/shared/Field'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { v4 as uuidv4 } from 'uuid'

function Section({ title, icon: Icon, children, defaultOpen = true, accent }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={cn(
      "bg-[#111] border rounded-lg overflow-hidden",
      accent ? `border-${accent}-500/20` : "border-[#1f1f1f]"
    )}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon size={14} className="text-[#666]" />}
          <span className="text-sm font-medium text-white">{title}</span>
        </div>
        {open 
          ? <ChevronUp size={13} className="text-[#555]" /> 
          : <ChevronDown size={13} className="text-[#555]" />
        }
      </button>
      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-[#1a1a1a]">
          <div className="pt-4">{children}</div>
        </div>
      )}
    </div>
  )
}

function AttemptsList({ bug }) {
  const { addAttempt, updateAttempt, removeAttempt } = useDebugStore()
  const [newAttempt, setNewAttempt] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState(null)

  const handleDeleteClick = (attemptId) => {
    setPendingDeleteId(attemptId)
    setConfirmOpen(true)
  }

  const handleConfirmDelete = () => {
    removeAttempt(bug.id, pendingDeleteId)
    toast.success('Attempt removed')
    setConfirmOpen(false)
    setPendingDeleteId(null)
  }

  return (
    <>
      <div className="space-y-2">
        {(bug.attempts || []).map((attempt, idx) => (
          <div 
            key={attempt.id} 
            className="flex items-start gap-2 p-3 bg-[#0d0d0d] rounded-md border border-[#1a1a1a]"
          >
            <span className="text-xs text-[#555] font-mono mt-0.5 min-w-[20px]">
              {idx + 1}.
            </span>
            <div className="flex-1 space-y-2">
              <textarea
                value={attempt.description}
                onChange={e => updateAttempt(bug.id, attempt.id, { description: e.target.value })}
                placeholder="What I tried..."
                rows={2}
                className="w-full bg-transparent text-sm text-white resize-none outline-none placeholder-[#444]"
              />
              <div className="flex items-center gap-2">
                <select
                  value={attempt.result}
                  onChange={e => updateAttempt(bug.id, attempt.id, { result: e.target.value })}
                  className="text-xs bg-[#1a1a1a] border border-[#2a2a2a] rounded px-2 py-0.5 text-white focus:outline-none"
                >
                  <option value="failed">Failed</option>
                  <option value="partial">Partial</option>
                  <option value="led-to-solution">Led to solution</option>
                </select>
                <span className="text-xs text-[#444]">
                  {new Date(attempt.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
            <button 
              onClick={() => handleDeleteClick(attempt.id)} 
              className="text-[#444] hover:text-red-400 transition-colors mt-0.5"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        <div className="flex gap-2">
          <input
            value={newAttempt}
            onChange={e => setNewAttempt(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && newAttempt.trim()) {
                addAttempt(bug.id, newAttempt.trim())
                setNewAttempt('')
                toast.success('Attempt logged')
              }
            }}
            placeholder="What did you try? (Press Enter to add)"
            className="flex-1 px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md text-sm text-white placeholder-[#444] focus:outline-none focus:border-[#333]"
          />
          <button
            onClick={() => {
              if (newAttempt.trim()) {
                addAttempt(bug.id, newAttempt.trim())
                setNewAttempt('')
                toast.success('Attempt logged')
              }
            }}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-md transition-colors"
          >
            <Plus size={14} className="text-white" />
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleConfirmDelete}
        title="Remove this attempt?"
        description="This debugging attempt will be permanently removed from the log."
        confirmLabel="Remove"
      />
    </>
  )
}

function TimelineLog({ bug }) {
  const { addTimelineEntry } = useDebugStore()
  const [newEntry, setNewEntry] = useState('')

  return (
    <div className="space-y-2">
      {(bug.debuggingTimeline || []).map(entry => (
        <div key={entry.id} className="flex gap-3 text-sm">
          <span className="text-xs text-[#555] font-mono whitespace-nowrap mt-0.5">
            {new Date(entry.time).toLocaleTimeString()}
          </span>
          <span className="text-[#aaa]">{entry.note}</span>
        </div>
      ))}
      <div className="flex gap-2 mt-2">
        <input
          value={newEntry}
          onChange={e => setNewEntry(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && newEntry.trim()) {
              addTimelineEntry(bug.id, newEntry.trim())
              setNewEntry('')
              toast.success('Timeline entry added')
            }
          }}
          placeholder="Log what you just tried or found... (Enter)"
          className="flex-1 px-3 py-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-md text-sm text-white placeholder-[#444] focus:outline-none focus:border-[#333]"
        />
      </div>
    </div>
  )
}

function OtherDevSolutions({ bug }) {
  const { addOtherDevSolution, updateOtherDevSolution, removeOtherDevSolution } = useDebugStore()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingDeleteId, setPendingDeleteId] = useState(null)

  const handleDeleteClick = (solutionId) => {
    setPendingDeleteId(solutionId)
    setConfirmOpen(true)
  }

  const handleConfirmDelete = () => {
    removeOtherDevSolution(bug.id, pendingDeleteId)
    toast.success('Solution removed')
    setConfirmOpen(false)
    setPendingDeleteId(null)
  }

  return (
    <>
      <div className="space-y-4">
        {(bug.otherDevSolutions || []).map((sol, idx) => (
          <div 
            key={sol.id} 
            className="p-4 bg-[#0d0d0d] rounded-lg border border-[#1a1a1a] space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#555] font-mono">Solution {idx + 1}</span>
              <button 
                onClick={() => handleDeleteClick(sol.id)} 
                className="text-[#444] hover:text-red-400 transition-colors"
              >
                <X size={12} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-[#555] mb-1 block">Developer / Source</label>
                <input
                  value={sol.devName}
                  onChange={e => updateOtherDevSolution(bug.id, sol.id, { devName: e.target.value })}
                  placeholder="Name or Stack Overflow / Blog"
                  className="w-full px-2 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-xs text-white placeholder-[#444] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs text-[#555] mb-1 block">Time to Solve</label>
                <input
                  value={sol.timeToSolve}
                  onChange={e => updateOtherDevSolution(bug.id, sol.id, { timeToSolve: e.target.value })}
                  placeholder="e.g. 8 minutes"
                  className="w-full px-2 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-xs text-white placeholder-[#444] focus:outline-none"
                />
              </div>
            </div>

            {[
              { key: 'approach', label: 'Their Approach', placeholder: 'How did they approach the problem?' },
              { key: 'whyItWorks', label: 'Why It Works', placeholder: 'The mechanism behind their solution' },
              { key: 'whyBetterOrWorse', label: 'Better or Worse Than Mine?', placeholder: 'Compare approaches, tradeoffs...' },
              { key: 'whenToUse', label: 'When to Use Their Approach', placeholder: 'Context where this makes sense' },
              { key: 'whatILearned', label: 'What I Learned From Them', placeholder: 'The mental model or skill gained...' },
            ].map(field => (
              <div key={field.key}>
                <label className="text-xs text-[#555] mb-1 block">{field.label}</label>
                <textarea
                  value={sol[field.key]}
                  onChange={e => updateOtherDevSolution(bug.id, sol.id, { [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  rows={2}
                  className="w-full px-2 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-xs text-white placeholder-[#444] focus:outline-none resize-none"
                />
              </div>
            ))}
          </div>
        ))}

        <button
          onClick={() => {
            addOtherDevSolution(bug.id, {})
            toast.success('Solution slot added')
          }}
          className="flex items-center gap-1.5 px-3 py-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#2a2a2a] rounded-md text-xs text-[#888] hover:text-white transition-colors"
        >
          <Plus size={12} />
          Add Developer Solution
        </button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleConfirmDelete}
        title="Remove this solution?"
        description="This developer solution will be permanently removed."
        confirmLabel="Remove"
      />
    </>
  )
}

export default function BugDetail() {
  const { bugs, selectedBugId, updateBug, deleteBug, setActiveView } = useDebugStore()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const bug = bugs.find(b => b.id === selectedBugId)

  if (!bug) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-[#555]">Bug not found</p>
      </div>
    )
  }

  const u = (field) => (val) => {
    updateBug(bug.id, { [field]: val })
  }

  const handleConfirmDelete = () => {
    deleteBug(bug.id)
    toast.success(`${bug.bugId} deleted`)
    setActiveView('bugs')
    setConfirmOpen(false)
  }

  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'investigating', label: 'Investigating' },
    { value: 'solved', label: 'Solved' },
    { value: 'blocked', label: 'Blocked' },
  ]

  const severityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
  ]

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1f1f1f] bg-[#0a0a0a] sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveView('bugs')}
              className="p-1.5 rounded-md hover:bg-white/5 text-[#666] hover:text-white transition-colors"
            >
              <ArrowLeft size={15} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#555]">{bug.bugId}</span>
                <input
                  value={bug.title || ''}
                  onChange={e => updateBug(bug.id, { title: e.target.value })}
                  placeholder="Bug title..."
                  className="text-base font-medium text-white bg-transparent border-none outline-none placeholder-[#444] min-w-[300px]"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={bug.status}
              onChange={e => {
                updateBug(bug.id, { status: e.target.value })
                toast.success(`Status updated to ${e.target.value}`)
              }}
              className={cn(
                "text-xs px-2 py-1 rounded border focus:outline-none bg-transparent cursor-pointer",
                STATUS_COLORS[bug.status]
              )}
            >
              {statusOptions.map(o => (
                <option key={o.value} value={o.value} className="bg-[#111] text-white">
                  {o.label}
                </option>
              ))}
            </select>

            <select
              value={bug.severity}
              onChange={e => {
                updateBug(bug.id, { severity: e.target.value })
                toast.success(`Severity updated to ${e.target.value}`)
              }}
              className={cn(
                "text-xs px-2 py-1 rounded border focus:outline-none bg-transparent cursor-pointer",
                SEVERITY_COLORS[bug.severity]
              )}
            >
              {severityOptions.map(o => (
                <option key={o.value} value={o.value} className="bg-[#111] text-white">
                  {o.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => setConfirmOpen(true)}
              className="p-1.5 rounded-md hover:bg-red-500/10 text-[#444] hover:text-red-400 transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4 max-w-4xl mx-auto">

            {/* Timer */}
            <DebugTimer bug={bug} />

            {/* Meta Info */}
            <Section title="Project & Context" icon={Timer}>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Project Name" required>
                  <TextInput 
                    value={bug.projectName} 
                    onChange={u('projectName')} 
                    placeholder="My App" 
                  />
                </Field>
                <Field label="Project Type">
                  <Select 
                    value={bug.projectType} 
                    onChange={u('projectType')} 
                    options={PROJECT_TYPES} 
                    placeholder="Select type" 
                  />
                </Field>
              </div>
              <Field label="Tech Stack">
                <StackSelector selected={bug.stack || []} onChange={u('stack')} />
              </Field>
              <Field label="Bug Category">
                <Select 
                  value={bug.category} 
                  onChange={u('category')} 
                  options={BUG_CATEGORIES} 
                  placeholder="Select category" 
                />
              </Field>
              <Field label="Tags">
                <TagInput 
                  tags={bug.tags || []} 
                  onChange={u('tags')} 
                  placeholder="Add tags (press Enter)..." 
                />
              </Field>
              <Field label="Difficulty" hint="How hard was this to solve?">
                <ScoreSlider value={bug.difficulty || 5} onChange={u('difficulty')} />
              </Field>
            </Section>

            {/* Layer 1 & 2 */}
            <Section title="Layer 1 & 2 — What Broke & Where" icon={AlertTriangle}>
              <Field label="Problem Statement" required hint="Layer 1: WHAT is the symptom?">
                <TextArea
                  value={bug.problemStatement}
                  onChange={u('problemStatement')}
                  placeholder="Describe exactly what is broken. What are you seeing?"
                  rows={3}
                />
              </Field>
              <Field label="What I Expected" hint="What should have happened?">
                <TextArea
                  value={bug.whatIExpected}
                  onChange={u('whatIExpected')}
                  placeholder="Describe the expected behavior..."
                  rows={2}
                />
              </Field>
              <Field label="What Actually Happened" hint="The exact symptom">
                <TextArea
                  value={bug.whatHappened}
                  onChange={u('whatHappened')}
                  placeholder="What happened instead?"
                  rows={2}
                />
              </Field>
              <Field label="Error Message / Console Output">
                <CodeArea
                  value={bug.errorMessage}
                  onChange={u('errorMessage')}
                  placeholder="Paste the exact error here..."
                  rows={4}
                />
              </Field>
              <Field label="Where Did It Break?" hint="Layer 2: WHERE in the system?">
                <TextArea
                  value={bug.layerWhere}
                  onChange={u('layerWhere')}
                  placeholder="Was it in the component, the API, the database, the build process?"
                  rows={2}
                />
              </Field>
            </Section>

            {/* Investigation */}
            <Section title="Investigation — What I Tried" icon={Code2}>
              <p className="text-xs text-[#555] mb-3">
                Document every attempt. Failed attempts teach you as much as the solution.
              </p>
              <AttemptsList bug={bug} />
            </Section>

            {/* Debug Timeline */}
            <Section title="Debug Timeline" icon={Timer} defaultOpen={false}>
              <p className="text-xs text-[#555] mb-3">
                Real-time log. Add entries as you debug to track your thought process.
              </p>
              <TimelineLog bug={bug} />
            </Section>

            {/* Root Cause */}
            <Section title="Layer 3 — Root Cause (The Real Why)" icon={Brain}>
              <Field label="Root Cause" required hint="Not the symptom — the actual cause">
                <TextArea
                  value={bug.rootCause}
                  onChange={u('rootCause')}
                  placeholder="What was actually wrong? Dig past the symptom to the real cause."
                  rows={3}
                />
              </Field>
            </Section>

            {/* Solution */}
            <Section title="Layer 4 — The Fix & How It Works" icon={CheckCircle} accent="green">
              <Field label="The Fix" required>
                <TextArea
                  value={bug.fix}
                  onChange={u('fix')}
                  placeholder="Describe what you changed to fix it."
                  rows={2}
                />
              </Field>
              <Field label="Fix Code">
                <CodeArea
                  value={bug.fixCode}
                  onChange={u('fixCode')}
                  placeholder="// The code that fixed it..."
                  rows={6}
                />
              </Field>
              <Field label="Why It Works — The Mechanism" hint="Layer 4: HOW does the fix work?">
                <TextArea
                  value={bug.whyItWorks}
                  onChange={u('whyItWorks')}
                  placeholder="Explain the mechanism. Not just WHAT you changed but WHY that change fixes it."
                  rows={4}
                />
              </Field>
              <Field label="Deeper Mechanism / How The System Actually Works">
                <TextArea
                  value={bug.mechanismExplanation}
                  onChange={u('mechanismExplanation')}
                  placeholder="What does this tell you about how the underlying system works?"
                  rows={3}
                />
              </Field>
            </Section>

            {/* Layer 5 */}
            <Section title="Layer 5 — Pattern & When You'll See This Again" icon={Lightbulb} accent="yellow">
              <Field label="When Will I See This Again?" hint="Layer 5: WHEN — pattern recognition">
                <TextArea
                  value={bug.whenWillISeeThisAgain}
                  onChange={u('whenWillISeeThisAgain')}
                  placeholder="Describe the pattern. When does this class of bug show up?"
                  rows={3}
                />
              </Field>
              <Field label="Mental Model I Built">
                <TextArea
                  value={bug.mentalModel}
                  onChange={u('mentalModel')}
                  placeholder="What mental model did you gain? How do you think about this system now?"
                  rows={3}
                />
              </Field>
            </Section>

            {/* Knowledge Gap */}
            <Section title="Knowledge Gap Discovered" icon={Brain}>
              <Field label="What Did I Not Know?">
                <TextArea
                  value={bug.knowledgeGap}
                  onChange={u('knowledgeGap')}
                  placeholder="What gap in your knowledge allowed this bug to stump you?"
                  rows={2}
                />
              </Field>
              <div className="grid grid-cols-2 gap-6 pt-2">
                <Field label="Knowledge Level Before">
                  <ScoreSlider 
                    value={bug.knowledgeBeforeScore || 5} 
                    onChange={u('knowledgeBeforeScore')} 
                  />
                </Field>
                <Field label="Knowledge Level After">
                  <ScoreSlider 
                    value={bug.knowledgeAfterScore || 5} 
                    onChange={u('knowledgeAfterScore')} 
                  />
                </Field>
              </div>
            </Section>

            {/* Debugging Reflection */}
            <Section title="Debugging Reflection" icon={BookOpen} defaultOpen={false}>
              <Field label="Mistakes I Made While Debugging">
                <TextArea
                  value={bug.mistakes}
                  onChange={u('mistakes')}
                  placeholder="What wrong turns did you take? Where did you waste time?"
                  rows={3}
                />
              </Field>
              <Field label="What A Senior Dev Would Do Differently">
                <TextArea
                  value={bug.whatSeniorWouldDo}
                  onChange={u('whatSeniorWouldDo')}
                  placeholder="What approach would have been faster? What tool did you not know?"
                  rows={3}
                />
              </Field>
            </Section>

            {/* Other Dev Solutions */}
            <Section title="Other Developer Solutions" icon={Users} defaultOpen={false}>
              <p className="text-xs text-[#555] mb-3">
                Add solutions from colleagues, Stack Overflow, or blogs.
              </p>
              <OtherDevSolutions bug={bug} />
            </Section>

            {/* Notes */}
            <Section title="Additional Notes" icon={BookOpen} defaultOpen={false}>
              <TextArea
                value={bug.notes}
                onChange={u('notes')}
                placeholder="Anything else worth remembering..."
                rows={4}
              />
            </Section>

          </div>
        </div>
      </div>

      {/* Delete Bug Confirm */}
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleConfirmDelete}
        title={`Delete ${bug.bugId}?`}
        description={`"${bug.title || 'Untitled Bug'}" will be permanently deleted. This cannot be undone.`}
        confirmLabel="Delete Bug"
      />
    </>
  )
}