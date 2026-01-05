<template>
  <div>
    <h2 class="text-gray-700 mb-4 text-xl font-semibold">
      <i class="pi pi-folder mr-2 text-primary-500"></i>Project Search
    </h2>

    <form @submit.prevent="performSearch">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div @keydown.enter.stop>
          <label for="projectCodes" class="font-bold block mb-2">Project ID(s)</label>
          <AutoComplete
            id="projectCodes"
            v-model="projectCodesModel"
            :multiple="true"
            :suggestions="projectCodeSuggestions"
            optionLabel="code"
            placeholder="Type to search project IDs"
            @complete="searchProjectCodes"
            @item-select="onProjectCodeSelect"
          >
            <template #option="{ option }">
              <div class="flex justify-between items-center gap-2">
                <span class="font-semibold">{{ option.code }}</span>
                <span class="text-gray-500 text-sm">{{ option.name }}</span>
              </div>
            </template>
            <template #chip="{ value }">
              <span>{{ typeof value === 'string' ? value : value.code }}</span>
            </template>
          </AutoComplete>
        </div>
        <div>
          <label for="name" class="font-bold block mb-2">Project Name</label>
          <InputText
            id="name"
            v-model="searchParams.name"
            placeholder="e.g. Website Redesign"
          />
        </div>
        <div>
          <label for="department" class="font-bold block mb-2">Department</label>
          <InputText
            id="department"
            v-model="searchParams.department"
            placeholder="e.g. Engineering"
          />
        </div>
        <div>
          <label for="statuses" class="font-bold block mb-2">Status</label>
          <MultiSelect
            id="statuses"
            v-model="searchParams.statuses"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="All Statuses"
            class="w-full"
            :maxSelectedLabels="2"
            selectedItemsLabel="{0} statuses"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label for="startDateFrom" class="font-bold block mb-2">Start Date From</label>
          <Calendar
            id="startDateFrom"
            v-model="searchParams.startDateFrom"
            dateFormat="mm/dd/yy"
            placeholder="Select start date"
            showIcon
            showButtonBar
            :maxDate="searchParams.startDateTo || undefined"
          />
        </div>
        <div>
          <label for="startDateTo" class="font-bold block mb-2">Start Date To</label>
          <Calendar
            id="startDateTo"
            v-model="searchParams.startDateTo"
            dateFormat="mm/dd/yy"
            placeholder="Select end date"
            showIcon
            showButtonBar
            :minDate="searchParams.startDateFrom || undefined"
          />
        </div>
      </div>

      <div class="flex justify-end gap-2 mb-5">
        <Button
          type="button"
          label="Clear"
          icon="pi pi-times"
          @click="clearSearch"
          class="p-button-secondary"
          :disabled="isLoading"
          aria-label="Clear search filters"
        />
        <Button
          type="submit"
          label="Search"
          icon="pi pi-search"
          :loading="isLoading"
          class="p-button-primary font-bold px-5"
          aria-label="Search projects"
        />
      </div>
    </form>

    <div
      v-if="error"
      class="p-3 mb-3 rounded-lg bg-red-100 text-red-700"
      role="alert"
      aria-live="assertive"
    >
      <i class="pi pi-exclamation-circle mr-2"></i>{{ error }}
    </div>

    <div v-if="hasSearched && !isLoading" class="flex justify-between items-center mb-3">
      <span class="text-gray-600" aria-live="polite">
        Found {{ resultCount }} project(s)
      </span>
      <div class="flex items-center gap-2">
        <label class="text-gray-600 text-sm font-medium">
          <i class="pi pi-table mr-1"></i>Select Columns:
        </label>
        <MultiSelect
          v-model="selectedColumns"
          :options="columnOptions"
          optionLabel="header"
          :placeholder="`Columns (${selectedColumns.length}/${columnOptions.length})`"
          class="w-48"
          :maxSelectedLabels="0"
          selectedItemsLabel="{0} selected"
        >
        <template #option="{ option }">
          <div class="flex items-center gap-2">
            <i :class="option.icon" class="text-gray-500"></i>
            <span>{{ option.header }}</span>
          </div>
        </template>
        </MultiSelect>
      </div>
    </div>

    <DataTable
      :value="results"
      :loading="isLoading"
      showGridlines
      stripedRows
      responsiveLayout="scroll"
      v-if="showTable"
      paginator
      :rows="5"
      :rowsPerPageOptions="[5, 10, 20]"
      sortMode="single"
      removableSort
      paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      aria-label="Project search results"
      v-model:expandedRows="expandedRows"
      dataKey="id"
    >
      <template #empty>
        <div class="text-center p-4">No projects found.</div>
      </template>

      <Column expander style="width: 50px" />
      <Column v-if="isVisible('projectCode')" field="projectCode" header="Project ID" style="width: 120px" sortable />
      <Column v-if="isVisible('name')" field="name" header="Name" sortable />
      <Column v-if="isVisible('department')" field="department" header="Department" sortable />
      <Column v-if="isVisible('status')" field="status" header="Status" style="width: 120px" sortable>
        <template #body="{ data }">
          <StatusBadge :status="data.status" />
        </template>
      </Column>
      <Column v-if="isVisible('startDate')" field="startDate" header="Start Date" style="width: 120px" sortable>
        <template #body="{ data }">
          {{ formatDate(data.startDate) }}
        </template>
      </Column>
      <Column v-if="isVisible('endDate')" field="endDate" header="End Date" style="width: 120px" sortable>
        <template #body="{ data }">
          {{ data.endDate ? formatDate(data.endDate) : '-' }}
        </template>
      </Column>
      <Column v-if="isVisible('team')" header="Team" style="width: 80px; text-align: center">
        <template #body="{ data }">
          <span class="text-gray-600">
            {{ data.assignedEmployeeIds.length }}
          </span>
        </template>
      </Column>
      <Column v-if="isVisible('todos')" header="Todos" style="width: 100px; text-align: center">
        <template #body="{ data }">
          <template v-if="getTodoCounts(data.id).total > 0">
            <span
              class="inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full"
              :class="getTodoCounts(data.id).pending > 0 ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'"
            >
              {{ getTodoCounts(data.id).pending }}/{{ getTodoCounts(data.id).total }}
            </span>
          </template>
          <span v-else class="text-gray-400 text-sm">-</span>
        </template>
      </Column>

      <Column header="Action" style="width: 100px; text-align: center">
        <template #body="{ data }">
          <Button
            icon="pi pi-eye"
            class="p-button-rounded p-button-text p-button-sm"
            @click="viewProject(data.id)"
            v-tooltip.top="'View Project'"
            aria-label="View project details"
          />
        </template>
      </Column>

      <template #expansion="{ data }">
        <ProjectExpansionPanel
          :project="data"
          :employees="store.getProjectEmployees(data.id)"
          :todos="todoStore.getProjectTodos(data.id)"
          @toggle-todo="todoStore.toggleTodoComplete"
        />
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useProjectSearch } from '@/composables/useProjectSearch';
import { usePersistedColumns } from '@/composables/usePersistedColumns';
import { useProjectStore } from '@/stores/projectStore';
import { useTodoStore } from '@/stores/todoStore';
import { statusOptions } from '@/utils/statusUtils';
import StatusBadge from '@/components/StatusBadge.vue';
import ProjectExpansionPanel from '@/components/ProjectExpansionPanel.vue';

const router = useRouter();
const store = useProjectStore();
const todoStore = useTodoStore();

const {
  searchParams,
  results,
  isLoading,
  hasSearched,
  error,
  resultCount,
  showTable,
  performSearch,
  clearSearch,
  formatDate
} = useProjectSearch();

// Project code autocomplete
type ProjectCodeOption = { code: string; name: string };
const projectCodeSuggestions = ref<ProjectCodeOption[]>([]);

const searchProjectCodes = (event: { query: string }) => {
  projectCodeSuggestions.value = store.getProjectCodeSuggestions(event.query);
};

// Computed with getter/setter - converts between objects and strings for store
const projectCodesModel = computed({
  get: () => {
    return store.searchParams.projectCodes.map(code => ({ code, name: '' }));
  },
  set: (value: (string | ProjectCodeOption)[]) => {
    store.searchParams.projectCodes = value.map(v =>
      typeof v === 'string' ? v : v.code
    );
  }
});

const onProjectCodeSelect = () => {
  // Selection handled by v-model, this is for any additional logic if needed
};

const expandedRows = ref<Record<number, boolean>>({});

const columnOptions = [
  { field: 'projectCode', header: 'Project ID', icon: 'pi pi-hashtag' },
  { field: 'name', header: 'Name', icon: 'pi pi-tag' },
  { field: 'department', header: 'Department', icon: 'pi pi-building' },
  { field: 'status', header: 'Status', icon: 'pi pi-info-circle' },
  { field: 'startDate', header: 'Start Date', icon: 'pi pi-calendar' },
  { field: 'endDate', header: 'End Date', icon: 'pi pi-calendar-times' },
  { field: 'team', header: 'Team', icon: 'pi pi-users' },
  { field: 'todos', header: 'Todos', icon: 'pi pi-check-square' }
];

const { selectedColumns, isVisible } = usePersistedColumns(columnOptions, 'projectSearch_selectedColumns');

const todoCounts = computed(() => {
  const counts: Record<number, { total: number; pending: number }> = {};
  for (const todo of todoStore.todos) {
    if (!counts[todo.projectId]) {
      counts[todo.projectId] = { total: 0, pending: 0 };
    }
    counts[todo.projectId].total++;
    if (!todo.completed) {
      counts[todo.projectId].pending++;
    }
  }
  return counts;
});

const getTodoCounts = (projectId: number) =>
  todoCounts.value[projectId] || { total: 0, pending: 0 };

const viewProject = (id: number) => {
  router.push({ name: 'project-profile', params: { id: String(id) } });
};
</script>

<style scoped>
:deep(.p-datatable-striped .p-datatable-tbody > tr:nth-child(even)) {
  background-color: #f8fafc;
}

:deep(.p-datatable-striped .p-datatable-tbody > tr:nth-child(odd)) {
  background-color: #ffffff;
}

:deep(.p-datatable-striped .p-datatable-tbody > tr:hover) {
  background-color: #e0f2fe;
}
</style>
