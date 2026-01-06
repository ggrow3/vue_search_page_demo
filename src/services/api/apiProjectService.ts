import type { Project, SearchParams } from '@/models';
import type { IProjectService } from '../interfaces';
import { httpClient } from '../httpClient';
import { PROJECTS_DB } from '@/mocks';

export const apiProjectService: IProjectService = {
  async getAll(): Promise<Project[]> {
    return httpClient.get<Project[]>('/projects');
  },

  async getById(id: number): Promise<Project | null> {
    try {
      return await httpClient.get<Project>(`/projects/${id}`);
    } catch {
      return null;
    }
  },

  async search(params: SearchParams): Promise<Project[]> {
    const queryParams = new URLSearchParams();
    if (params.projectCodes.length > 0) {
      params.projectCodes.forEach(code => queryParams.append('projectCodes', code));
    }
    if (params.name) queryParams.append('name', params.name);
    if (params.department) queryParams.append('department', params.department);
    if (params.statuses.length > 0) {
      params.statuses.forEach(status => queryParams.append('statuses', status));
    }
    if (params.startDateFrom) queryParams.append('startDateFrom', params.startDateFrom.toISOString());
    if (params.startDateTo) queryParams.append('startDateTo', params.startDateTo.toISOString());

    return httpClient.get<Project[]>(`/projects/search?${queryParams}`);
  },

  // Suggestions use local data for instant autocomplete UX
  getProjectCodeSuggestions(query: string): { code: string; name: string }[] {
    if (!query) return [];
    return PROJECTS_DB
      .filter(proj => proj.projectCode.includes(query))
      .map(proj => ({ code: proj.projectCode, name: proj.name }));
  }
};
