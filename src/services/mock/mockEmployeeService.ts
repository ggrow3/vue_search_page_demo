import type { Employee } from '@/models';
import type { IEmployeeService } from '../interfaces';
import { EMPLOYEES_DB, PROJECTS_DB } from '@/mocks';
import { delay } from '@/utils/mockUtils';

export const mockEmployeeService: IEmployeeService = {
  async getAll(): Promise<Employee[]> {
    await delay();
    return [...EMPLOYEES_DB];
  },

  async getById(id: number): Promise<Employee | undefined> {
    await delay();
    return EMPLOYEES_DB.find(e => e.id === id);
  },

  getByIdSync(id: number): Employee | undefined {
    return EMPLOYEES_DB.find(e => e.id === id);
  },

  getNameSync(id: number): string {
    const emp = EMPLOYEES_DB.find(e => e.id === id);
    return emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown';
  },

  async getByProjectId(projectId: number): Promise<Employee[]> {
    await delay();
    const project = PROJECTS_DB.find(p => p.id === projectId);
    if (!project) return [];
    return EMPLOYEES_DB.filter(emp => project.assignedEmployeeIds.includes(emp.id));
  }
};
