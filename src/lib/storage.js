const STORAGE_KEYS = {
  BUGS: 'debuglib_bugs',
  PROJECTS: 'debuglib_projects',
  PATTERNS: 'debuglib_patterns',
  KNOWLEDGE_GAPS: 'debuglib_knowledge_gaps',
  SETTINGS: 'debuglib_settings'
}

export const storage = {
  getBugs: () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.BUGS) || '[]')
    } catch { return [] }
  },
  saveBugs: (bugs) => localStorage.setItem(STORAGE_KEYS.BUGS, JSON.stringify(bugs)),

  getProjects: () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECTS) || '[]')
    } catch { return [] }
  },
  saveProjects: (projects) => localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects)),

  getPatterns: () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.PATTERNS) || '[]')
    } catch { return [] }
  },
  savePatterns: (patterns) => localStorage.setItem(STORAGE_KEYS.PATTERNS, JSON.stringify(patterns)),

  getKnowledgeGaps: () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.KNOWLEDGE_GAPS) || '[]')
    } catch { return [] }
  },
  saveKnowledgeGaps: (gaps) => localStorage.setItem(STORAGE_KEYS.KNOWLEDGE_GAPS, JSON.stringify(gaps)),

  exportAll: () => {
    return {
      bugs: storage.getBugs(),
      projects: storage.getProjects(),
      patterns: storage.getPatterns(),
      knowledgeGaps: storage.getKnowledgeGaps(),
      exportedAt: new Date().toISOString()
    }
  },

  importAll: (data) => {
    if (data.bugs) storage.saveBugs(data.bugs)
    if (data.projects) storage.saveProjects(data.projects)
    if (data.patterns) storage.savePatterns(data.patterns)
    if (data.knowledgeGaps) storage.saveKnowledgeGaps(data.knowledgeGaps)
  }
}