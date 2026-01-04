import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import type { ProjectNote } from '@/models'
import { noteService } from '@/services'

// Re-export types for convenience
export type { ProjectNote } from '@/models'

export const useNoteStore = defineStore('note', () => {
  // State
  const notes = reactive<Record<number, ProjectNote[]>>({})
  const isLoading = ref(false)

  // Getters
  const getProjectNotes = (projectId: number): ProjectNote[] => {
    return notes[projectId] || []
  }

  const getNoteCount = (projectId: number): number => {
    return notes[projectId]?.length || 0
  }

  // Actions
  const loadProjectNotes = async (projectId: number): Promise<void> => {
    isLoading.value = true
    try {
      const projectNotes = await noteService.getByProjectId(projectId)
      notes[projectId] = projectNotes
    } finally {
      isLoading.value = false
    }
  }

  const addNote = async (projectId: number, content: string): Promise<ProjectNote> => {
    const note = await noteService.create(projectId, content)
    if (!notes[projectId]) {
      notes[projectId] = []
    }
    notes[projectId].unshift(note)
    return note
  }

  const updateNote = async (projectId: number, noteId: number, content: string): Promise<void> => {
    const updatedNote = await noteService.update(projectId, noteId, content)
    if (updatedNote) {
      const projectNotes = notes[projectId]
      if (projectNotes) {
        const index = projectNotes.findIndex(n => n.id === noteId)
        if (index !== -1) {
          projectNotes[index] = updatedNote
        }
      }
    }
  }

  const deleteNote = async (projectId: number, noteId: number): Promise<void> => {
    const success = await noteService.delete(projectId, noteId)
    if (success) {
      const projectNotes = notes[projectId]
      if (projectNotes) {
        const index = projectNotes.findIndex(n => n.id === noteId)
        if (index !== -1) {
          projectNotes.splice(index, 1)
        }
      }
    }
  }

  return {
    // State
    notes,
    isLoading,

    // Getters
    getProjectNotes,
    getNoteCount,

    // Actions
    loadProjectNotes,
    addNote,
    updateNote,
    deleteNote
  }
})
