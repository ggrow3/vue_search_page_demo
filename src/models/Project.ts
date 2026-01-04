export type ProjectStatus = 'active' | 'on-hold' | 'completed'

export interface Project {
  id: number
  projectCode: string
  name: string
  description: string
  department: string
  startDate: string
  endDate: string | null
  status: ProjectStatus
  assignedEmployeeIds: number[]
}
