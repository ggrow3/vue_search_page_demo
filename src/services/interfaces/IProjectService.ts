import type { Project, SearchParams } from '@/models';

export interface IProjectService {
  getAll(): Promise<Project[]>;
  getById(id: number): Promise<Project | null>;
  search(params: SearchParams): Promise<Project[]>;
  getProjectCodeSuggestions(query: string): { code: string; name: string }[];
}
