import type { Employee } from '@/models';

export interface IEmployeeService {
  getAll(): Promise<Employee[]>;
  getById(id: number): Promise<Employee | undefined>;
  getByIdSync(id: number): Employee | undefined;
  getNameSync(id: number): string;
  getByProjectId(projectId: number): Promise<Employee[]>;
}
