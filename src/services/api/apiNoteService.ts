import type { ProjectNote } from '@/models';
import type { INoteService } from '../interfaces';
import { httpClient } from '../httpClient';

export const apiNoteService: INoteService = {
  async getByProjectId(projectId: number): Promise<ProjectNote[]> {
    return httpClient.get<ProjectNote[]>(`/projects/${projectId}/notes`);
  },

  async create(projectId: number, content: string): Promise<ProjectNote> {
    return httpClient.post<ProjectNote>(`/projects/${projectId}/notes`, { content });
  },

  async update(_projectId: number, noteId: number, content: string): Promise<ProjectNote | null> {
    return httpClient.patch<ProjectNote>(`/notes/${noteId}`, { content });
  },

  async delete(_projectId: number, noteId: number): Promise<boolean> {
    await httpClient.delete(`/notes/${noteId}`);
    return true;
  }
};
