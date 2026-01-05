import { ref, computed, reactive } from 'vue';
import { defineStore } from 'pinia';
import type { Project, SearchParams } from '@/models';
import { projectService } from '@/services';
import { useEmployeeStore } from './employeeStore';

export const useProjectStore = defineStore('project', () => {
  const searchParams = reactive<SearchParams>({
    projectCodes: [],
    name: '',
    department: '',
    startDateFrom: null,
    startDateTo: null,
    statuses: []
  });

  const results = ref<Project[]>([]);
  const projects = ref<Project[]>([]);
  const isSearching = ref(false);
  const isLoadingProject = ref(false);
  const hasSearched = ref(false);
  const searchError = ref<string | null>(null);
  const projectError = ref<string | null>(null);
  const currentProject = ref<Project | null>(null);

  const employeeStore = useEmployeeStore();

  const hasResults = computed(() => results.value.length > 0);
  const resultCount = computed(() => results.value.length);

  const getProjectById = (id: number): Project | undefined =>
    projects.value.find(proj => proj.id === id);

  const getEmployeeById = (id: number) => employeeStore.byId(id);

  const getProjectEmployees = (projectId: number) => {
    const project = projects.value.find(proj => proj.id === projectId);
    if (!project) return [];
    return employeeStore.employees.filter(emp => project.assignedEmployeeIds.includes(emp.id));
  };

  const initialize = async (): Promise<void> => {
    const [projectData] = await Promise.all([
      projectService.getAll(),
      employeeStore.initialize()
    ]);
    projects.value = projectData;
  };

  const setSearchParam = <K extends keyof SearchParams>(field: K, value: SearchParams[K]): void => {
    searchParams[field] = value;
  };

  const clearSearch = (): void => {
    searchParams.projectCodes = [];
    searchParams.name = '';
    searchParams.department = '';
    searchParams.startDateFrom = null;
    searchParams.startDateTo = null;
    searchParams.statuses = [];
    results.value = [];
    hasSearched.value = false;
    searchError.value = null;
  };

  const getProjectCodeSuggestions = (query: string) =>
    projectService.getProjectCodeSuggestions(query);

  const fetchProjects = async (): Promise<void> => {
    isSearching.value = true;
    searchError.value = null;
    hasSearched.value = true;
    results.value = [];

    try {
      results.value = await projectService.search(searchParams);
    } catch {
      searchError.value = 'Connection failed';
    } finally {
      isSearching.value = false;
    }
  };

  const fetchProjectById = async (id: number): Promise<Project | null> => {
    isLoadingProject.value = true;
    projectError.value = null;

    try {
      const project = await projectService.getById(id);
      currentProject.value = project;
      if (!project) {
        projectError.value = 'Project not found';
      }
      return project;
    } catch {
      projectError.value = 'Failed to load project';
      return null;
    } finally {
      isLoadingProject.value = false;
    }
  };

  return {
    searchParams,
    results,
    isSearching,
    isLoadingProject,
    hasSearched,
    searchError,
    projectError,
    currentProject,
    hasResults,
    resultCount,
    projects,
    getProjectById,
    getEmployeeById,
    getProjectEmployees,
    initialize,
    setSearchParam,
    clearSearch,
    getProjectCodeSuggestions,
    fetchProjects,
    fetchProjectById
  };
});
