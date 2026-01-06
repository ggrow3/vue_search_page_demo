import type { ProjectNote } from '@/models';
import type { INoteService } from '../interfaces';
import { NOTES_DB } from '@/mocks';
import { delay, cloneGroupedArray } from '@/utils/mockUtils';

let mockNotes = cloneGroupedArray(NOTES_DB);

export const mockNoteService: INoteService = {
  async getByProjectId(projectId: number): Promise<ProjectNote[]> {
    await delay();
    return mockNotes[projectId] || [];
  },

  async create(projectId: number, content: string): Promise<ProjectNote> {
    await delay();
    const now = new Date().toISOString();
    const note: ProjectNote = {
      id: Date.now(),
      projectId,
      content,
      createdAt: now,
      updatedAt: now
    };

    if (!mockNotes[projectId]) {
      mockNotes[projectId] = [];
    }
    mockNotes[projectId].unshift(note);
    return note;
  },

  async update(projectId: number, noteId: number, content: string): Promise<ProjectNote | null> {
    await delay();
    const projectNotes = mockNotes[projectId];
    if (projectNotes) {
      const note = projectNotes.find(n => n.id === noteId);
      if (note) {
        note.content = content;
        note.updatedAt = new Date().toISOString();
        return { ...note };
      }
    }
    return null;
  },

  async delete(projectId: number, noteId: number): Promise<boolean> {
    await delay();
    const projectNotes = mockNotes[projectId];
    if (projectNotes) {
      const index = projectNotes.findIndex(n => n.id === noteId);
      if (index !== -1) {
        projectNotes.splice(index, 1);
        return true;
      }
    }
    return false;
  },

  resetMockData(): void {
    mockNotes = cloneGroupedArray(NOTES_DB);
  }
};
