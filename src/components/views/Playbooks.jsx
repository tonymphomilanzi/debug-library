import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

const PLAYBOOKS = [
  {
    id: 1,
    title: "Nothing Works, No Error",
    scenario: "Code runs silently. No output, no error, just nothing.",
    steps: [
      "Is it running at all? Add console.log at the very entry point",
      "Is data reaching the function? Log all inputs before the function body",
      "Is the event firing? Check DevTools → Elements → Event Listeners",
      "Is this the right environment? Check all .env variables",
      "Did something external change? Check dependency versions",
      "Are you looking at the right file? Check the build/compiled output",
    ],
    insight: "Silent failures are almost always scope, timing, or wrong-file problems. Trust logs over your eyes."
  },
  {
    id: 2,
    title: "Works Locally, Broken in Production",
    scenario: "Passes all local tests, breaks when deployed.",
    steps: [
      "Compare environment variables — local vs production",
      "Search codebase for 'localhost' — hardcoded URLs are the #1 cause",
      "Compare Node/runtime versions between environments",
      "Check CORS settings — often different per environment",
      "Check if the latest code is actually deployed",
      "Look at the production logs, not local logs",
    ],
    insight: "The bug exists in both environments. You are just not seeing it locally because your local env papers over the issue."
  },
  {
    id: 3,
    title: "Worked Yesterday, Broken Today",
    scenario: "You changed nothing. It just stopped working.",
    steps: [
      "Run git diff — something changed somewhere",
      "Check if an external API or service is down",
      "Check if a package auto-updated (check package-lock.json)",
      "Check browser cache — hard refresh with Ctrl+Shift+R",
      "Check if a teammate pushed code",
      "Check rate limits on any APIs you are using",
    ],
    insight: "Something always changed. Either your code, someone else's code, or a dependency. Your job is finding which."
  },
  {
    id: 4,
    title: "Type/Data Error",
    scenario: "Getting unexpected values, NaN, undefined, or wrong types.",
    steps: [
      "Log the exact value AND typeof at the source",
      "Trace data backwards — where does it come from?",
      "Check every transformation — each map/filter/reduce can corrupt data",
      "Check API response shape against your assumption",
      "Check if async data is arriving before you use it",
      "Check if you are mutating when you should be copying",
    ],
    insight: "Data bugs are archaeology. The problem happened before the error. Trace backwards from the error, not forwards from the input."
  },
  {
    id: 5,
    title: "Performance Issue",
    scenario: "App is slow, laggy, or causes high CPU/memory.",
    steps: [
      "Open DevTools → Performance tab → Record the slow action",
      "Check for unnecessary re-renders in React DevTools",
      "Look for n+1 query patterns in network tab",
      "Check if large data is being processed on every render",
      "Look for missing indexes in database queries",
      "Check if you are downloading the same data multiple times",
    ],
    insight: "Measure before you optimize. Never assume where the bottleneck is — you will almost always be wrong."
  },
  {
    id: 6,
    title: "The Async Trap",
    scenario: "Data is undefined, arrives late, or state updates don't stick.",
    steps: [
      "Check if you are using await on every async call",
      "Check if you are handling the Promise correctly",
      "Add loading and error states — you are probably rendering before data arrives",
      "Check race conditions — two async calls, which one wins?",
      "Check if useEffect dependencies are correct in React",
      "Check if you are returning the Promise (not just calling it)",
    ],
    insight: "Async code fails silently because JavaScript does not crash on unhandled promises by default. Add catch handlers everywhere."
  }
]

function PlaybookCard({ playbook }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-[#111] border border-[#1f1f1f] rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors text-left"
      >
        <div>
          <h3 className="text-sm font-medium text-white">{playbook.title}</h3>
          <p className="text-xs text-[#555] mt-0.5">{playbook.scenario}</p>
        </div>
        {open ? <ChevronUp size={13} className="text-[#555]" /> : <ChevronDown size={13} className="text-[#555]" />}
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-[#1a1a1a]">
          <div className="pt-4 space-y-2">
            {playbook.steps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="text-xs font-mono text-[#555] mt-0.5 w-4 flex-shrink-0">{idx + 1}.</span>
                <p className="text-sm text-[#aaa]">{step}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-md">
            <p className="text-xs text-yellow-400">
              <span className="font-medium">Key Insight:</span> {playbook.insight}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Playbooks() {
  return (
    <div className="p-6 space-y-4 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-semibold text-white">Debugging Playbooks</h1>
        <p className="text-sm text-[#666] mt-0.5">Systematic approaches for common bug scenarios</p>
      </div>
      <div className="space-y-2">
        {PLAYBOOKS.map(pb => <PlaybookCard key={pb.id} playbook={pb} />)}
      </div>
    </div>
  )
}