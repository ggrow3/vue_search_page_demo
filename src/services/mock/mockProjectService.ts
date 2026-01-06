import type { Project, SearchParams } from '@/models';
import type { IProjectService } from '../interfaces';
import { PROJECTS_DB } from '@/mocks';
import { delay } from '@/utils/mockUtils';

export const mockProjectService: IProjectService = {
  async getAll(): Promise<Project[]> {
    await delay();
    return [...PROJECTS_DB];
  },

  async getById(id: number): Promise<Project | null> {
    await delay();
    return PROJECTS_DB.find(p => p.id === id) || null;
  },

  async search(params: SearchParams): Promise<Project[]> {
    await delay(800);
    return PROJECTS_DB.filter((item) => {
      const matchProjectCodes =
        params.projectCodes.length === 0 || params.projectCodes.some(code => item.projectCode.includes(code));
      const matchName =
        !params.name || item.name.toLowerCase().includes(params.name.toLowerCase());
      const matchDepartment =
        !params.department || item.department.toLowerCase().includes(params.department.toLowerCase());
      const matchStatus =
        params.statuses.length === 0 || params.statuses.includes(item.status);

      const itemStartDate = new Date(item.startDate);
      const matchFromDate = !params.startDateFrom || itemStartDate >= new Date(params.startDateFrom);
      const matchToDate = !params.startDateTo || itemStartDate <= new Date(params.startDateTo);

      return matchProjectCodes && matchName && matchDepartment && matchStatus && matchFromDate && matchToDate;
    });
  },

  getProjectCodeSuggestions(query: string): { code: string; name: string }[] {
    if (!query) return [];
    return PROJECTS_DB
      .filter(proj => proj.projectCode.includes(query))
      .map(proj => ({ code: proj.projectCode, name: proj.name }));
  }
};
