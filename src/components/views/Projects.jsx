import { useState } from 'react'
import { Plus, FolderOpen, X, Bug } from 'lucide-react'
import { cn } from '../../lib/utils'
import useDebugStore from '../../store/useDebugStore'
import { PROJECT_TYPES, TECH_STACKS } from '../../lib/constants'
import StackSelector from '../shared/StackSelector'

export default function Projects() {
  const { projects, addProject, updateProject, deleteProject, bugs, setActiveView, setSelectedBugId } = useDebugStore()

  return (
    <div className="p-6 space-y-5 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-white">Projects</h1>
          <p className="text-sm text-[#666] mt-0.5">Organize bugs by project</p>
        </div>
        <button
          onClick={() => addProject({ name: 'New Project' })}
          className="flex items-center gap-1.5 px-3 py-2 bg-white text-black rounded-md text-sm font-medium hover:bg-white/90"
        >
          <Plus size={14} />
          New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16 bg-[#111] border border-[#1f1f1f] rounded-lg">
          <FolderOpen size={32} className="text-[#333] mx-auto mb-3" />
          <p className="text-white font-medium">No projects yet</p>
          <p className="text-sm text-[#555] mt-1">Create a project to organize your bugs</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map(project => {
            const projectBugs = bugs.filter(b => b.projectName === project.name)
            const solvedBugs = projectBugs.filter(b => b.status === 'solved')

            return (
              <div key={project.id} className="bg-[#111] border border-[#1f1f1f] rounded-lg p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-[#555] mb-1 block">Project Name</label>
                        <input
                          value={project.name}
                          onChange={e => updateProject(project.id, { name: e.target.value })}
                          className="w-full px-2 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-sm text-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-[#555] mb-1 block">Type</label>
                        <select
                          value={project.type}
                          onChange={e => updateProject(project.id, { type: e.target.value })}
                          className="w-full px-2 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-xs text-white focus:outline-none"
                        >
                          <option value="">Select type</option>
                          {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-[#555] mb-1 block">Stack</label>
                      <StackSelector selected={project.stack || []} onChange={s => updateProject(project.id, { stack: s })} />
                    </div>
                    <div>
                      <label className="text-xs text-[#555] mb-1 block">Description</label>
                      <textarea
                        value={project.description || ''}
                        onChange={e => updateProject(project.id, { description: e.target.value })}
                        placeholder="What is this project?"
                        rows={2}
                        className="w-full px-2 py-1.5 bg-[#1a1a1a] border border-[#2a2a2a] rounded text-xs text-white focus:outline-none resize-none"
                      />
                    </div>
                    <div className="flex items-center gap-4 pt-1">
                      <span className="text-xs text-[#555]">
                        <span className="text-white font-medium">{projectBugs.length}</span> bugs
                      </span>
                      <span className="text-xs text-[#555]">
                        <span className="text-green-400 font-medium">{solvedBugs.length}</span> solved
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => { if (window.confirm('Delete project?')) deleteProject(project.id) }}
                    className="p-1.5 text-[#444] hover:text-red-400 hover:bg-red-500/5 rounded transition-colors"
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}