import { ref, watch, computed } from 'vue';

export interface ColumnOption {
  field: string;
  header: string;
  icon: string;
}

export function usePersistedColumns(
  options: ColumnOption[],
  storageKey: string
) {
  const loadColumns = (): ColumnOption[] => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (!saved) return [...options];

      const fields: string[] = JSON.parse(saved);
      // Preserve saved order by mapping from saved fields, then filter valid ones
      const columns = fields
        .map(field => options.find(col => col.field === field))
        .filter((col): col is ColumnOption => col !== undefined);
      return columns.length ? columns : [...options];
    } catch {
      return [...options];
    }
  };

  const selectedColumns = ref<ColumnOption[]>(loadColumns());

  const visibleFields = computed(() =>
    new Set(selectedColumns.value.map(col => col.field))
  );

  watch(selectedColumns, (cols) => {
    localStorage.setItem(storageKey, JSON.stringify(cols.map(c => c.field)));
  }, { deep: true });

  return {
    selectedColumns,
    isVisible: (field: string) => visibleFields.value.has(field)
  };
}
