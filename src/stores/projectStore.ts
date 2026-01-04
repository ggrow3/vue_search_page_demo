import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'
import type { Employee, Project, SearchParams } from '@/models'
import { projectService, employeeService } from '@/services'

// Re-export types for backward compatibility
export type { Employee, Project, SearchParams } from '@/models'

export const useProjectStore = defineStore('project', () => {
  // State
  const searchParams = reactive<SearchParams>({
    projectCode: '',
    name: '',
    department: '',
    startDateFrom: null,
    startDateTo: null,
    status: null
  })

  const results = ref<Project[]>([])
  const projects = ref<Project[]>([])
  const employees = ref<Employee[]>([])
  const isSearching = ref(false)
  const isLoadingProject = ref(false)
  const hasSearched = ref(false)
  const searchError = ref<string | null>(null)
  const projectError = ref<string | null>(null)
  const currentProject = ref<Project | null>(null)

  // Getters
  const hasResults = computed(() => results.value.length > 0)
  const resultCount = computed(() => results.value.length)
  const allProjects = computed(() => projects.value)
  const allEmployees = computed(() => employees.value)

  const getProjectById = (id: number): Project | undefined => {
    return projects.value.find(proj => proj.id === id)
  }

  const getEmployeeById = (id: number): Employee | undefined => {
    return employeeService.getByIdSync(id)
  }

  const getProjectEmployees = (projectId: number): Employee[] => {
    const project = projects.value.find(proj => proj.id === projectId)
    if (!project) return []
    return employees.value.filter(emp => project.assignedEmployeeIds.includes(emp.id))
  }

  // Actions
  const initialize = async (): Promise<void> => {
    const [projectData, employeeData] = await Promise.all([
      projectService.getAll(),
      employeeService.getAll()
    ])
    projects.value = projectData
    employees.value = employeeData
  }

  const setSearchParam = <K extends keyof SearchParams>(field: K, value: SearchParams[K]): void => {
    searchParams[field] = value
  }

  const clearSearch = (): void => {
    searchParams.projectCode = ''
    searchParams.name = ''
    searchParams.department = ''
    searchParams.startDateFrom = null
    searchParams.startDateTo = null
    searchParams.status = null
    results.value = []
    hasSearched.value = false
    searchError.value = null
  }

  const getProjectCodeSuggestions = (query: string): { code: string; name: string }[] => {
    return projectService.getProjectCodeSuggestions(query)
  }

  const fetchProjects = async (): Promise<void> => {
    isSearching.value = true
    searchError.value = null
    hasSearched.value = true
    results.value = []

    try {
      results.value = await projectService.search(searchParams)
    } catch {
      searchError.value = 'Connection failed'
    } finally {
      isSearching.value = false
    }
  }

  const fetchProjectById = async (id: number): Promise<Project | null> => {
    isLoadingProject.value = true
    projectError.value = null

    try {
      const project = await projectService.getById(id)
      currentProject.value = project
      if (!project) {
        projectError.value = 'Project not found'
      }
      return project
    } catch {
      projectError.value = 'Failed to load project'
      return null
    } finally {
      isLoadingProject.value = false
    }
  }

  return {
    // State
    searchParams,
    results,
    isSearching,
    isLoadingProject,
    hasSearched,
    searchError,
    projectError,
    currentProject,

    // Getters
    hasResults,
    resultCount,
    allProjects,
    allEmployees,
    getProjectById,
    getEmployeeById,
    getProjectEmployees,

    // Actions
    initialize,
    setSearchParam,
    clearSearch,
    getProjectCodeSuggestions,
    fetchProjects,
    fetchProjectById
  }
})
