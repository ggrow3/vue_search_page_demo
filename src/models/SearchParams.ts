import type { ProjectStatus } from './Project'

export interface SearchParams {
  projectCode: string
  name: string
  department: string
  startDateFrom: Date | null
  startDateTo: Date | null
  status: ProjectStatus | null
}
