import type { Employee } from '@/models';
import type { IEmployeeService } from '../interfaces';
import { httpClient } from '../httpClient';
import { EMPLOYEES_DB } from '@/mocks';

export const apiEmployeeService: IEmployeeService = {
  async getAll(): Promise<Employee[]> {
    return httpClient.get<Employee[]>('/employees');
  },

  async getById(id: number): Promise<Employee | undefined> {
    try {
      return await httpClient.get<Employee>(`/employees/${id}`);
    } catch {
      return undefined;
    }
  },

  // Sync methods use local data for instant lookup (e.g., autocomplete UX)
  getByIdSync(id: number): Employee | undefined {
    return EMPLOYEES_DB.find(e => e.id === id);
  },

  getNameSync(id: number): string {
    const emp = EMPLOYEES_DB.find(e => e.id === id);
    return emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown';
  },

  async getByProjectId(projectId: number): Promise<Employee[]> {
    return httpClient.get<Employee[]>(`/projects/${projectId}/employees`);
  }
};
