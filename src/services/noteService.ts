import type { ProjectNote } from '@/models'
import { isMockMode } from '@/config'
import { NOTES_DB } from '@/mocks'
import { httpClient } from './httpClient'

// Deep clone helper
const cloneNotesDB = (): Record<number, ProjectNote[]> => {
  const cloned: Record<number, ProjectNote[]> = {}
  for (const [key, value] of Object.entries(NOTES_DB)) {
    cloned[Number(key)] = value.map(note => ({ ...note }))
  }
  return cloned
}

// Local state for mock mode
let mockNotes: Record<number, ProjectNote[]> = cloneNotesDB()

const simulateDelay = (ms: number = 300): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms))

export const noteService = {
  async getByProjectId(projectId: number): Promise<ProjectNote[]> {
    if (isMockMode()) {
      await simulateDelay()
      return mockNotes[projectId] || []
    }
    return httpClient.get<ProjectNote[]>(`/projects/${projectId}/notes`)
  },

  async create(projectId: number, content: string): Promise<ProjectNote> {
    if (isMockMode()) {
      await simulateDelay()
      const now = new Date().toISOString()
      const note: ProjectNote = {
        id: Date.now(),
        projectId,
        content,
        createdAt: now,
        updatedAt: now
      }

      if (!mockNotes[projectId]) {
        mockNotes[projectId] = []
      }
      mockNotes[projectId].unshift(note)
      return note
    }
    return httpClient.post<ProjectNote>(`/projects/${projectId}/notes`, { content })
  },

  async update(projectId: number, noteId: number, content: string): Promise<ProjectNote | null> {
    if (isMockMode()) {
      await simulateDelay()
      const projectNotes = mockNotes[projectId]
      if (projectNotes) {
        const note = projectNotes.find(n => n.id === noteId)
        if (note) {
          note.content = content
          note.updatedAt = new Date().toISOString()
          return { ...note }
        }
      }
      return null
    }
    return httpClient.patch<ProjectNote>(`/notes/${noteId}`, { content })
  },

  async delete(projectId: number, noteId: number): Promise<boolean> {
    if (isMockMode()) {
      await simulateDelay()
      const projectNotes = mockNotes[projectId]
      if (projectNotes) {
        const index = projectNotes.findIndex(n => n.id === noteId)
        if (index !== -1) {
          projectNotes.splice(index, 1)
          return true
        }
      }
      return false
    }
    await httpClient.delete(`/notes/${noteId}`)
    return true
  },

  getCount(projectId: number): number {
    return mockNotes[projectId]?.length || 0
  },

  // Reset mock data (useful for testing)
  resetMockData(): void {
    mockNotes = cloneNotesDB()
  }
}
