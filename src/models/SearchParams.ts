import type { ProjectStatus } from './Project';

export interface SearchParams {
  projectCodes: string[];
  name: string;
  department: string;
  startDateFrom: Date | null;
  startDateTo: Date | null;
  statuses: ProjectStatus[];
}
