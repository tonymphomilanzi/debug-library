import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import { storage } from '../lib/storage'
import { BUG_STATUS } from '../lib/constants'

const useDebugStore = create((set, get) => ({
  // State
  bugs: storage.getBugs(),
  projects: storage.getProjects(),
  patterns: storage.getPatterns(),
  knowledgeGaps: storage.getKnowledgeGaps(),
  activeView: 'dashboard',
  selectedBugId: null,
  searchQuery: '',
  filters: {
    status: 'all',
    severity: 'all',
    project: 'all',
    category: 'all'
  },

  // Navigation
  setActiveView: (view) => set({ activeView: view }),
  setSelectedBugId: (id) => set({ selectedBugId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),

  // Bug Actions
  addBug: (bugData) => {
    const bug = {
      id: uuidv4(),
      bugId: `BUG-${String(get().bugs.length + 1).padStart(3, '0')}`,
      status: BUG_STATUS.ACTIVE,
      severity: 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Timer
      timerStarted: new Date().toISOString(),
      timerPaused: false,
      timerPausedAt: null,
      totalPausedTime: 0,
      solvedAt: null,
      totalDebugTime: null,
      // Core fields
      title: '',
      projectName: '',
      projectType: '',
      stack: [],
      category: '',
      // Problem
      problemStatement: '',
      whatIExpected: '',
      whatHappened: '',
      errorMessage: '',
      // Investigation
      attempts: [],
      // Solution
      rootCause: '',
      fix: '',
      fixCode: '',
      whyItWorks: '',
      mechanismExplanation: '',
      // Learning
      knowledgeGap: '',
      knowledgeBeforeScore: 5,
      knowledgeAfterScore: 5,
      mentalModel: '',
      whenWillISeeThisAgain: '',
      // Layers
      layerWhat: '',
      layerWhere: '',
      layerWhy: '',
      layerHow: '',
      layerWhen: '',
      // Other devs
      otherDevSolutions: [],
      // Tags
      tags: [],
      difficulty: 5,
      // Timeline
      debuggingTimeline: [],
      mistakes: '',
      whatSeniorWouldDo: '',
      // Notes
      notes: '',
      ...bugData
    }
    const bugs = [bug, ...get().bugs]
    storage.saveBugs(bugs)
    set({ bugs })
    return bug
  },

  updateBug: (id, updates) => {
    const bugs = get().bugs.map(bug =>
      bug.id === id
        ? { ...bug, ...updates, updatedAt: new Date().toISOString() }
        : bug
    )
    storage.saveBugs(bugs)
    set({ bugs })
  },

  deleteBug: (id) => {
    const bugs = get().bugs.filter(bug => bug.id !== id)
    storage.saveBugs(bugs)
    set({ bugs, selectedBugId: null })
  },

  solveBug: (id) => {
    const bug = get().bugs.find(b => b.id === id)
    if (!bug) return
    const solvedAt = new Date().toISOString()
    const startTime = new Date(bug.timerStarted).getTime()
    const endTime = new Date(solvedAt).getTime()
    const totalDebugTime = Math.floor((endTime - startTime - bug.totalPausedTime) / 1000)
    get().updateBug(id, {
      status: BUG_STATUS.SOLVED,
      solvedAt,
      totalDebugTime
    })
  },

  pauseTimer: (id) => {
    const bug = get().bugs.find(b => b.id === id)
    if (!bug || bug.timerPaused) return
    get().updateBug(id, {
      timerPaused: true,
      timerPausedAt: new Date().toISOString()
    })
  },

  resumeTimer: (id) => {
    const bug = get().bugs.find(b => b.id === id)
    if (!bug || !bug.timerPaused) return
    const pausedDuration = new Date().getTime() - new Date(bug.timerPausedAt).getTime()
    get().updateBug(id, {
      timerPaused: false,
      timerPausedAt: null,
      totalPausedTime: (bug.totalPausedTime || 0) + pausedDuration
    })
  },

  addAttempt: (bugId, attempt) => {
    const bug = get().bugs.find(b => b.id === bugId)
    if (!bug) return
    const attempts = [...(bug.attempts || []), {
      id: uuidv4(),
      description: attempt,
      timestamp: new Date().toISOString(),
      result: 'failed'
    }]
    get().updateBug(bugId, { attempts })
  },

  updateAttempt: (bugId, attemptId, updates) => {
    const bug = get().bugs.find(b => b.id === bugId)
    if (!bug) return
    const attempts = bug.attempts.map(a => a.id === attemptId ? { ...a, ...updates } : a)
    get().updateBug(bugId, { attempts })
  },

  removeAttempt: (bugId, attemptId) => {
    const bug = get().bugs.find(b => b.id === bugId)
    if (!bug) return
    const attempts = bug.attempts.filter(a => a.id !== attemptId)
    get().updateBug(bugId, { attempts })
  },

  addTimelineEntry: (bugId, entry) => {
    const bug = get().bugs.find(b => b.id === bugId)
    if (!bug) return
    const debuggingTimeline = [...(bug.debuggingTimeline || []), {
      id: uuidv4(),
      time: new Date().toISOString(),
      note: entry
    }]
    get().updateBug(bugId, { debuggingTimeline })
  },

  addOtherDevSolution: (bugId, solution) => {
    const bug = get().bugs.find(b => b.id === bugId)
    if (!bug) return
    const otherDevSolutions = [...(bug.otherDevSolutions || []), {
      id: uuidv4(),
      devName: '',
      approach: '',
      timeToSolve: '',
      whyItWorks: '',
      whyBetterOrWorse: '',
      whenToUse: '',
      whatILearned: '',
      ...solution
    }]
    get().updateBug(bugId, { otherDevSolutions })
  },

  removeOtherDevSolution: (bugId, solutionId) => {
    const bug = get().bugs.find(b => b.id === bugId)
    if (!bug) return
    const otherDevSolutions = bug.otherDevSolutions.filter(s => s.id !== solutionId)
    get().updateBug(bugId, { otherDevSolutions })
  },

  updateOtherDevSolution: (bugId, solutionId, updates) => {
    const bug = get().bugs.find(b => b.id === bugId)
    if (!bug) return
    const otherDevSolutions = bug.otherDevSolutions.map(s =>
      s.id === solutionId ? { ...s, ...updates } : s
    )
    get().updateBug(bugId, { otherDevSolutions })
  },

  // Projects
  addProject: (projectData) => {
    const project = {
      id: uuidv4(),
      name: '',
      type: '',
      stack: [],
      description: '',
      createdAt: new Date().toISOString(),
      ...projectData
    }
    const projects = [...get().projects, project]
    storage.saveProjects(projects)
    set({ projects })
    return project
  },

  updateProject: (id, updates) => {
    const projects = get().projects.map(p => p.id === id ? { ...p, ...updates } : p)
    storage.saveProjects(projects)
    set({ projects })
  },

  deleteProject: (id) => {
    const projects = get().projects.filter(p => p.id !== id)
    storage.saveProjects(projects)
    set({ projects })
  },

  // Knowledge Gaps
  addKnowledgeGap: (gapData) => {
    const gap = {
      id: uuidv4(),
      topic: '',
      discoveredVia: [],
      status: 'learning',
      confidenceBefore: 3,
      confidenceNow: 3,
      resources: '',
      notes: '',
      createdAt: new Date().toISOString(),
      ...gapData
    }
    const knowledgeGaps = [...get().knowledgeGaps, gap]
    storage.saveKnowledgeGaps(knowledgeGaps)
    set({ knowledgeGaps })
    return gap
  },

  updateKnowledgeGap: (id, updates) => {
    const knowledgeGaps = get().knowledgeGaps.map(g => g.id === id ? { ...g, ...updates } : g)
    storage.saveKnowledgeGaps(knowledgeGaps)
    set({ knowledgeGaps })
  },

  deleteKnowledgeGap: (id) => {
    const knowledgeGaps = get().knowledgeGaps.filter(g => g.id !== id)
    storage.saveKnowledgeGaps(knowledgeGaps)
    set({ knowledgeGaps })
  },

  // Patterns
  addPattern: (patternData) => {
    const pattern = {
      id: uuidv4(),
      name: '',
      symptom: '',
      usuallyMeans: '',
      relatedBugIds: [],
      notes: '',
      createdAt: new Date().toISOString(),
      ...patternData
    }
    const patterns = [...get().patterns, pattern]
    storage.savePatterns(patterns)
    set({ patterns })
    return pattern
  },

  updatePattern: (id, updates) => {
    const patterns = get().patterns.map(p => p.id === id ? { ...p, ...updates } : p)
    storage.savePatterns(patterns)
    set({ patterns })
  },

  deletePattern: (id) => {
    const patterns = get().patterns.filter(p => p.id !== id)
    storage.savePatterns(patterns)
    set({ patterns })
  },

  // Computed
  getFilteredBugs: () => {
    const { bugs, searchQuery, filters } = get()
    return bugs.filter(bug => {
      const matchesSearch = !searchQuery ||
        bug.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bug.projectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bug.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        bug.bugId?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = filters.status === 'all' || bug.status === filters.status
      const matchesSeverity = filters.severity === 'all' || bug.severity === filters.severity
      const matchesProject = filters.project === 'all' || bug.projectName === filters.project
      const matchesCategory = filters.category === 'all' || bug.category === filters.category
      return matchesSearch && matchesStatus && matchesSeverity && matchesProject && matchesCategory
    })
  },

  getStats: () => {
    const bugs = get().bugs
    const solved = bugs.filter(b => b.status === 'solved')
    const avgDebugTime = solved.length > 0
      ? solved.reduce((acc, b) => acc + (b.totalDebugTime || 0), 0) / solved.length
      : 0
    return {
      total: bugs.length,
      solved: solved.length,
      active: bugs.filter(b => b.status === 'active').length,
      investigating: bugs.filter(b => b.status === 'investigating').length,
      blocked: bugs.filter(b => b.status === 'blocked').length,
      avgDebugTime,
      totalDebugTime: solved.reduce((acc, b) => acc + (b.totalDebugTime || 0), 0)
    }
  }
}))

export default useDebugStore