export type EmployeeStatus = 'active' | 'inactive'

export interface Employee {
  id: number
  firstName: string
  lastName: string
  department: string
  position: string
  hireDate: string
  status: EmployeeStatus
}
