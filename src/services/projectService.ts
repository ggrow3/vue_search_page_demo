import type { Employee, Project, SearchParams } from '@/models'
import { isMockMode } from '@/config'
import { EMPLOYEES_DB, PROJECTS_DB } from '@/mocks'
import { httpClient } from './httpClient'

// Simulate network delay for mock mode
const simulateDelay = (ms: number = 300): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms))

export const projectService = {
  async getAll(): Promise<Project[]> {
    if (isMockMode()) {
      await simulateDelay()
      return [...PROJECTS_DB]
    }
    return httpClient.get<Project[]>('/projects')
  },

  async getById(id: number): Promise<Project | null> {
    if (isMockMode()) {
      await simulateDelay()
      return PROJECTS_DB.find(p => p.id === id) || null
    }
    try {
      return await httpClient.get<Project>(`/projects/${id}`)
    } catch {
      return null
    }
  },

  async search(params: SearchParams): Promise<Project[]> {
    if (isMockMode()) {
      await simulateDelay(800)
      return PROJECTS_DB.filter((item) => {
        const matchProjectCode =
          !params.projectCode || item.projectCode.includes(params.projectCode)
        const matchName =
          !params.name || item.name.toLowerCase().includes(params.name.toLowerCase())
        const matchDepartment =
          !params.department || item.department.toLowerCase().includes(params.department.toLowerCase())
        const matchStatus =
          !params.status || item.status === params.status

        const itemStartDate = new Date(item.startDate)
        const matchFromDate = !params.startDateFrom || itemStartDate >= new Date(params.startDateFrom)
        const matchToDate = !params.startDateTo || itemStartDate <= new Date(params.startDateTo)

        return matchProjectCode && matchName && matchDepartment && matchStatus && matchFromDate && matchToDate
      })
    }
    const queryParams = new URLSearchParams()
    if (params.projectCode) queryParams.append('projectCode', params.projectCode)
    if (params.name) queryParams.append('name', params.name)
    if (params.department) queryParams.append('department', params.department)
    if (params.status) queryParams.append('status', params.status)
    if (params.startDateFrom) queryParams.append('startDateFrom', params.startDateFrom.toISOString())
    if (params.startDateTo) queryParams.append('startDateTo', params.startDateTo.toISOString())

    return httpClient.get<Project[]>(`/projects/search?${queryParams}`)
  },

  getProjectCodeSuggestions(query: string): { code: string; name: string }[] {
    if (!query) return []
    return PROJECTS_DB
      .filter(proj => proj.projectCode.includes(query))
      .map(proj => ({ code: proj.projectCode, name: proj.name }))
  }
}

export const employeeService = {
  async getAll(): Promise<Employee[]> {
    if (isMockMode()) {
      await simulateDelay()
      return [...EMPLOYEES_DB]
    }
    return httpClient.get<Employee[]>('/employees')
  },

  async getById(id: number): Promise<Employee | undefined> {
    if (isMockMode()) {
      await simulateDelay()
      return EMPLOYEES_DB.find(e => e.id === id)
    }
    try {
      return await httpClient.get<Employee>(`/employees/${id}`)
    } catch {
      return undefined
    }
  },

  getByIdSync(id: number): Employee | undefined {
    return EMPLOYEES_DB.find(e => e.id === id)
  },

  getNameSync(id: number): string {
    const emp = EMPLOYEES_DB.find(e => e.id === id)
    return emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown'
  },

  async getByProjectId(projectId: number): Promise<Employee[]> {
    if (isMockMode()) {
      await simulateDelay()
      const project = PROJECTS_DB.find(p => p.id === projectId)
      if (!project) return []
      return EMPLOYEES_DB.filter(emp => project.assignedEmployeeIds.includes(emp.id))
    }
    return httpClient.get<Employee[]>(`/projects/${projectId}/employees`)
  }
}
