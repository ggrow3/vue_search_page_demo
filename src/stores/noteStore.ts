import { reactive, ref } from 'vue';
import { defineStore } from 'pinia';
import type { ProjectNote } from '@/models';
import { noteService } from '@/services';
import { updateItemById, removeItemById } from '@/utils/arrayUtils';

export const useNoteStore = defineStore('note', () => {
  const notes = reactive<Record<number, ProjectNote[]>>({});
  const isLoading = ref(false);

  const getProjectNotes = (projectId: number): ProjectNote[] =>
    notes[projectId] || [];

  const getNoteCount = (projectId: number): number =>
    notes[projectId]?.length || 0;

  const loadProjectNotes = async (projectId: number): Promise<void> => {
    isLoading.value = true;
    try {
      notes[projectId] = await noteService.getByProjectId(projectId);
    } finally {
      isLoading.value = false;
    }
  };

  const addNote = async (projectId: number, content: string): Promise<ProjectNote> => {
    const note = await noteService.create(projectId, content);
    if (!notes[projectId]) {
      notes[projectId] = [];
    }
    notes[projectId].unshift(note);
    return note;
  };

  const updateNote = async (projectId: number, noteId: number, content: string): Promise<boolean> => {
    const updatedNote = await noteService.update(projectId, noteId, content);
    if (notes[projectId]) {
      return updateItemById(notes[projectId], noteId, updatedNote);
    }
    return false;
  };

  const deleteNote = async (projectId: number, noteId: number): Promise<void> => {
    const success = await noteService.delete(projectId, noteId);
    if (success && notes[projectId]) {
      removeItemById(notes[projectId], noteId);
    }
  };

  return {
    notes,
    isLoading,
    getProjectNotes,
    getNoteCount,
    loadProjectNotes,
    addNote,
    updateNote,
    deleteNote
  };
});
