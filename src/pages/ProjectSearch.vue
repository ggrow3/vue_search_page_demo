<template>
  <div>
    <h2 class="text-gray-700 mb-4 text-xl font-semibold">
      <i class="pi pi-folder mr-2 text-primary-500"></i>Project Search
    </h2>

    <form @submit.prevent="performSearch">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label for="projectCode" class="font-bold block mb-2">Project ID</label>
          <AutoComplete
            id="projectCode"
            v-model="searchParams.projectCode"
            :suggestions="projectCodeSuggestions"
            @complete="searchProjectCodes"
            optionLabel="code"
            placeholder="e.g. 10234567"
            class="w-full"
            inputClass="w-full"
          >
            <template #option="{ option }">
              <div class="flex flex-col">
                <span class="font-semibold">{{ option.code }}</span>
                <span class="text-gray-500 text-sm">{{ option.name }}</span>
              </div>
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
          <label for="status" class="font-bold block mb-2">Status</label>
          <Dropdown
            id="status"
            v-model="searchParams.status"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="All Statuses"
            class="w-full"
            showClear
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
      <Column v-if="isColumnVisible('projectCode')" field="projectCode" header="Project ID" style="width: 120px" sortable />
      <Column v-if="isColumnVisible('name')" field="name" header="Name" sortable />
      <Column v-if="isColumnVisible('department')" field="department" header="Department" sortable />
      <Column v-if="isColumnVisible('status')" field="status" header="Status" style="width: 120px" sortable>
        <template #body="{ data }">
          <span
            class="inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full"
            :class="getStatusClass(data.status)"
          >
            {{ formatStatus(data.status) }}
          </span>
        </template>
      </Column>
      <Column v-if="isColumnVisible('startDate')" field="startDate" header="Start Date" style="width: 120px" sortable>
        <template #body="{ data }">
          {{ formatDate(data.startDate) }}
        </template>
      </Column>
      <Column v-if="isColumnVisible('endDate')" field="endDate" header="End Date" style="width: 120px" sortable>
        <template #body="{ data }">
          {{ data.endDate ? formatDate(data.endDate) : '-' }}
        </template>
      </Column>
      <Column v-if="isColumnVisible('team')" header="Team" style="width: 80px; text-align: center">
        <template #body="{ data }">
          <span class="text-gray-600">
            {{ data.assignedEmployeeIds.length }}
          </span>
        </template>
      </Column>
      <Column v-if="isColumnVisible('todos')" header="Todos" style="width: 100px; text-align: center">
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
        <div class="p-4 bg-gray-50">
          <div class="mb-3">
            <h4 class="text-gray-700 font-semibold mb-2">
              <i class="pi pi-info-circle mr-2"></i>Description
            </h4>
            <p class="text-gray-600 text-sm">{{ data.description }}</p>
          </div>

          <div class="mb-3">
            <h4 class="text-gray-700 font-semibold mb-2">
              <i class="pi pi-users mr-2"></i>Assigned Team Members
            </h4>
            <div v-if="getProjectEmployees(data.id).length === 0" class="text-gray-500 text-sm">
              No employees assigned to this project.
            </div>
            <div v-else class="flex flex-wrap gap-2">
              <span
                v-for="emp in getProjectEmployees(data.id)"
                :key="emp.id"
                class="bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full"
              >
                {{ emp.firstName }} {{ emp.lastName }}
              </span>
            </div>
          </div>

          <div>
            <h4 class="text-gray-700 font-semibold mb-2">
              <i class="pi pi-check-square mr-2"></i>Todos
            </h4>
            <div v-if="getProjectTodos(data.id).length === 0" class="text-gray-500 text-sm">
              No todos for this project.
            </div>
            <div v-else class="flex flex-col gap-2">
              <div
                v-for="todo in getProjectTodos(data.id)"
                :key="todo.id"
                class="flex items-center gap-3 p-2 bg-white rounded border border-gray-200"
                :class="{ 'opacity-60': todo.completed }"
              >
                <Checkbox
                  :modelValue="todo.completed"
                  @update:modelValue="toggleTodoComplete(todo.id)"
                  :binary="true"
                  :aria-label="todo.completed ? 'Mark as incomplete' : 'Mark as complete'"
                />
                <div class="flex-1">
                  <span :class="{ 'line-through': todo.completed }">{{ todo.title }}</span>
                  <span class="text-gray-500 text-xs ml-2">
                    ({{ todo.currentAssigneeName }})
                  </span>
                  <span v-if="todo.dueDate" class="text-gray-500 text-xs ml-2">
                    Due: {{ formatDate(todo.dueDate) }}
                  </span>
                </div>
                <span
                  v-if="todo.completed"
                  class="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full"
                >
                  Done
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useProjectSearch } from '@/composables/useProjectSearch'
import { useProjectStore } from '@/stores/projectStore'
import { useTodoStore } from '@/stores/todoStore'
import type { Todo, Employee } from '@/models'

const router = useRouter()
const store = useProjectStore()
const todoStore = useTodoStore()

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
} = useProjectSearch()

const expandedRows = ref<Record<number, boolean>>({})

// Column selection
interface ColumnOption {
  field: string
  header: string
  icon: string
}

const STORAGE_KEY = 'projectSearch_selectedColumns'

const columnOptions: ColumnOption[] = [
  { field: 'projectCode', header: 'Project ID', icon: 'pi pi-hashtag' },
  { field: 'name', header: 'Name', icon: 'pi pi-tag' },
  { field: 'department', header: 'Department', icon: 'pi pi-building' },
  { field: 'status', header: 'Status', icon: 'pi pi-info-circle' },
  { field: 'startDate', header: 'Start Date', icon: 'pi pi-calendar' },
  { field: 'endDate', header: 'End Date', icon: 'pi pi-calendar-times' },
  { field: 'team', header: 'Team', icon: 'pi pi-users' },
  { field: 'todos', header: 'Todos', icon: 'pi pi-check-square' }
]

// Load saved columns from localStorage or default to all columns
const loadSavedColumns = (): ColumnOption[] => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      const savedFields: string[] = JSON.parse(saved)
      const columns = columnOptions.filter(col => savedFields.includes(col.field))
      return columns.length > 0 ? columns : [...columnOptions]
    } catch {
      return [...columnOptions]
    }
  }
  return [...columnOptions]
}

const selectedColumns = ref<ColumnOption[]>(loadSavedColumns())

// Save to localStorage when columns change
watch(selectedColumns, (newColumns) => {
  const fields = newColumns.map(col => col.field)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(fields))
}, { deep: true })

const isColumnVisible = (field: string): boolean => {
  return selectedColumns.value.some(col => col.field === field)
}

// Autocomplete for project code
const projectCodeSuggestions = ref<{ code: string; name: string }[]>([])

const searchProjectCodes = (event: { query: string }) => {
  projectCodeSuggestions.value = store.getProjectCodeSuggestions(event.query)
}

// When user selects from autocomplete, extract just the code string
watch(() => searchParams.value.projectCode, (newValue) => {
  if (typeof newValue === 'object' && newValue !== null && 'code' in newValue) {
    searchParams.value.projectCode = (newValue as { code: string }).code
  }
})

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'On Hold', value: 'on-hold' },
  { label: 'Completed', value: 'completed' }
]

const getStatusClass = (status: string): string => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'on-hold':
      return 'bg-yellow-100 text-yellow-800'
    case 'completed':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const formatStatus = (status: string): string => {
  switch (status) {
    case 'active':
      return 'Active'
    case 'on-hold':
      return 'On Hold'
    case 'completed':
      return 'Completed'
    default:
      return status
  }
}

const getProjectTodos = (projectId: number): Todo[] => {
  return todoStore.getProjectTodos(projectId)
}

const getProjectEmployees = (projectId: number): Employee[] => {
  return store.getProjectEmployees(projectId)
}

// Pre-compute todo counts for all projects to avoid repeated filtering
const todoCounts = computed(() => {
  const counts: Record<number, { total: number; pending: number }> = {}
  for (const todo of todoStore.todos) {
    if (!counts[todo.projectId]) {
      counts[todo.projectId] = { total: 0, pending: 0 }
    }
    counts[todo.projectId].total++
    if (!todo.completed) {
      counts[todo.projectId].pending++
    }
  }
  return counts
})

const getTodoCounts = (projectId: number): { total: number; pending: number } => {
  return todoCounts.value[projectId] || { total: 0, pending: 0 }
}

const toggleTodoComplete = (todoId: number) => {
  todoStore.toggleTodoComplete(todoId)
}

const viewProject = (id: number) => {
  router.push({ name: 'project-profile', params: { id: String(id) } })
}
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
