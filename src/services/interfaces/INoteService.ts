import type { ProjectNote } from '@/models';

export interface INoteService {
  getByProjectId(projectId: number): Promise<ProjectNote[]>;
  create(projectId: number, content: string): Promise<ProjectNote>;
  update(projectId: number, noteId: number, content: string): Promise<ProjectNote | null>;
  delete(projectId: number, noteId: number): Promise<boolean>;
  resetMockData?(): void;
}
