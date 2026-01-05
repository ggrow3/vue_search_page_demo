import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useProjectStore } from '@/stores/projectStore';
import { formatDate } from '@/utils/dateFormatters';

export function useProjectSearch() {
  const store = useProjectStore();
  const { searchParams, results, isSearching, hasSearched, searchError, hasResults, resultCount } = storeToRefs(store);

  const showTable = computed(() => hasSearched.value || isSearching.value);

  return {
    searchParams,
    results,
    isLoading: isSearching,
    hasSearched,
    error: searchError,
    hasResults,
    resultCount,
    showTable,
    performSearch: () => store.fetchProjects(),
    clearSearch: () => store.clearSearch(),
    updateSearchParam: store.setSearchParam,
    formatDate
  };
}
