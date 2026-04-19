export const BUG_STATUS = {
  ACTIVE: 'active',
  SOLVED: 'solved',
  INVESTIGATING: 'investigating',
  BLOCKED: 'blocked'
}

export const BUG_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
}

export const TECH_STACKS = [
  'React', 'Next.js', 'Vue', 'Angular', 'Svelte',
  'Node.js', 'Express', 'FastAPI', 'Django', 'Rails',
  'TypeScript', 'JavaScript', 'Python', 'Go', 'Rust',
  'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Prisma',
  'CSS', 'Tailwind', 'GraphQL', 'REST API', 'Docker',
  'AWS', 'Vercel', 'Supabase', 'Firebase', 'Other'
]

export const PROJECT_TYPES = [
  'Web App', 'Mobile App', 'API/Backend', 'CLI Tool',
  'Library/Package', 'DevOps/Infrastructure', 'Database',
  'Full Stack', 'Other'
]

export const BUG_CATEGORIES = [
  'UI/Styling', 'State Management', 'API/Network',
  'Authentication', 'Database', 'Performance',
  'Build/Config', 'Testing', 'TypeScript/Types',
  'Async/Promise', 'Event Handling', 'Routing',
  'Environment/Config', 'Dependencies', 'Logic Error', 'Other'
]

export const SEVERITY_COLORS = {
  low: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  critical: 'bg-red-500/10 text-red-400 border-red-500/20'
}

export const STATUS_COLORS = {
  active: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  investigating: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  solved: 'bg-green-500/10 text-green-400 border-green-500/20',
  blocked: 'bg-red-500/10 text-red-400 border-red-500/20'
}

export const KNOWLEDGE_LEVELS = [
  { value: 1, label: '1 - No idea' },
  { value: 2, label: '2 - Vague awareness' },
  { value: 3, label: '3 - Partial understanding' },
  { value: 4, label: '4 - Getting there' },
  { value: 5, label: '5 - Half confident' },
  { value: 6, label: '6 - Mostly understand' },
  { value: 7, label: '7 - Solid understanding' },
  { value: 8, label: '8 - Very confident' },
  { value: 9, label: '9 - Can teach it' },
  { value: 10, label: '10 - Expert' },
]