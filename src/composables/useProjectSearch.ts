import { computed, type ComputedRef, type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useProjectStore } from '@/stores/projectStore'
import type { Project, SearchParams } from '@/models'
import { formatDate } from '@/utils/dateFormatters'

interface UseProjectSearchReturn {
  // State
  searchParams: Ref<SearchParams>
  results: Ref<Project[]>
  isLoading: Ref<boolean>
  hasSearched: Ref<boolean>
  error: Ref<string | null>

  // Computed
  hasResults: ComputedRef<boolean>
  resultCount: ComputedRef<number>
  showTable: ComputedRef<boolean>

  // Methods
  performSearch: () => Promise<void>
  clearSearch: () => void
  updateSearchParam: <K extends keyof SearchParams>(field: K, value: SearchParams[K]) => void
  formatDate: (dateString: string) => string
}

export function useProjectSearch(): UseProjectSearchReturn {
  const store = useProjectStore()

  // Extract reactive refs from store
  const { searchParams, results, isSearching, hasSearched, searchError } = storeToRefs(store)

  // Computed properties
  const hasResults = computed(() => store.hasResults)
  const resultCount = computed(() => store.resultCount)
  const showTable = computed(() => hasSearched.value || isSearching.value)

  // Methods
  const performSearch = (): Promise<void> => store.fetchProjects()
  const clearSearch = (): void => store.clearSearch()
  const updateSearchParam = <K extends keyof SearchParams>(field: K, value: SearchParams[K]): void => {
    store.setSearchParam(field, value)
  }

  return {
    // State (aliased for backward compatibility)
    searchParams,
    results,
    isLoading: isSearching,
    hasSearched,
    error: searchError,

    // Computed
    hasResults,
    resultCount,
    showTable,

    // Methods
    performSearch,
    clearSearch,
    updateSearchParam,
    formatDate
  }
}
