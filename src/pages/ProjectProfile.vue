<template>
  <div>
    <div class="flex items-center mb-4">
      <Button
        icon="pi pi-arrow-left"
        class="p-button-text p-button-plain mr-3"
        @click="goBack"
        aria-label="Go back to search"
      />
      <h2 class="text-gray-700 m-0 text-xl font-semibold">
        <i class="pi pi-folder mr-2 text-primary-500"></i>Project Details
      </h2>
    </div>

    <div v-if="isLoading" class="text-center p-5" aria-live="polite">
      <i class="pi pi-spin pi-spinner text-4xl text-primary-500"></i>
      <p class="mt-3 text-gray-600">Loading project...</p>
    </div>

    <div
      v-else-if="error"
      class="p-3 mb-3 rounded-lg bg-red-100 text-red-700"
      role="alert"
      aria-live="assertive"
    >
      <i class="pi pi-exclamation-circle mr-2"></i>{{ error }}
    </div>

    <div v-else-if="project" class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Project Info Card -->
      <div class="lg:col-span-1">
        <div class="bg-white p-4 rounded-lg shadow-lg">
          <div class="text-center mb-4">
            <div
              class="bg-primary-500 rounded-full inline-flex items-center justify-center"
              style="width: 80px; height: 80px"
              role="img"
              :aria-label="`Icon for ${project.name}`"
            >
              <i class="pi pi-folder text-white text-3xl" aria-hidden="true"></i>
            </div>
          </div>

          <h3 class="text-center text-gray-900 mb-1 text-lg font-semibold">
            {{ project.name }}
          </h3>
          <p class="text-center text-gray-600 mt-0 mb-4">{{ project.department }}</p>

          <div class="border-t border-gray-200 pt-3">
            <div class="flex items-center mb-3">
              <i class="pi pi-hashtag text-primary-500 mr-3"></i>
              <div>
                <div class="text-gray-500 text-sm">Project ID</div>
                <div class="text-gray-900 font-medium font-mono">{{ project.projectCode }}</div>
              </div>
            </div>

            <div class="flex items-center mb-3">
              <i class="pi pi-calendar text-primary-500 mr-3"></i>
              <div>
                <div class="text-gray-500 text-sm">Start Date</div>
                <div class="text-gray-900 font-medium">{{ formatDate(project.startDate) }}</div>
              </div>
            </div>

            <div class="flex items-center mb-3">
              <i class="pi pi-calendar-times text-primary-500 mr-3"></i>
              <div>
                <div class="text-gray-500 text-sm">End Date</div>
                <div class="text-gray-900 font-medium">
                  {{ project.endDate ? formatDate(project.endDate) : 'Ongoing' }}
                </div>
              </div>
            </div>

            <div class="flex items-center">
              <i class="pi pi-circle-fill mr-3" :class="getStatusIconClass(project.status)"></i>
              <div>
                <div class="text-gray-500 text-sm">Status</div>
                <div class="font-medium">
                  <span
                    class="inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full"
                    :class="getStatusClass(project.status)"
                  >
                    {{ formatStatus(project.status) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Assigned Employees -->
          <div class="border-t border-gray-200 mt-4 pt-4">
            <h4 class="text-gray-700 font-semibold mb-3">
              <i class="pi pi-users mr-2"></i>Team Members ({{ projectEmployees.length }})
            </h4>
            <div v-if="projectEmployees.length === 0" class="text-gray-500 text-sm">
              No team members assigned.
            </div>
            <div v-else class="flex flex-col gap-2">
              <div
                v-for="emp in projectEmployees"
                :key="emp.id"
                class="flex items-center gap-2 text-sm"
              >
                <div
                  class="bg-primary-200 rounded-full w-6 h-6 flex items-center justify-center text-xs text-primary-800 font-semibold"
                >
                  {{ getInitials(emp.firstName, emp.lastName) }}
                </div>
                <span class="text-gray-700">{{ emp.firstName }} {{ emp.lastName }}</span>
                <span class="text-gray-400 text-xs">({{ emp.position }})</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Notes Section -->
      <div class="lg:col-span-2">
        <div class="bg-white p-4 rounded-lg shadow-lg">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-gray-900 m-0 text-lg font-semibold">
              <i class="pi pi-file-edit mr-2"></i>Notes
            </h3>
            <span class="text-gray-500">{{ notes.length }} note(s)</span>
          </div>

          <!-- Add Note Form -->
          <div class="mb-4">
            <textarea
              v-model="newNoteContent"
              class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows="3"
              placeholder="Add a note about this project..."
              style="resize: vertical"
              aria-label="New note content"
            ></textarea>
            <div class="flex justify-end mt-2">
              <Button
                label="Add Note"
                icon="pi pi-plus"
                @click="addNote"
                :disabled="!newNoteContent.trim()"
                class="p-button-sm"
                aria-label="Add new note"
              />
            </div>
          </div>

          <!-- Notes List -->
          <div v-if="notes.length === 0" class="text-center p-4 text-gray-500">
            <i class="pi pi-inbox text-4xl mb-3 block"></i>
            No notes yet. Add your first note above.
          </div>

          <div v-else class="flex flex-col gap-3">
            <div
              v-for="note in notes"
              :key="note.id"
              class="bg-gray-100 p-3 rounded-lg"
            >
              <div v-if="editingNoteId === note.id" class="mb-2">
                <textarea
                  v-model="editNoteContent"
                  class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows="2"
                  style="resize: vertical"
                  aria-label="Edit note content"
                ></textarea>
                <div class="flex justify-end gap-2 mt-2">
                  <Button
                    label="Cancel"
                    class="p-button-text p-button-sm"
                    @click="cancelEdit"
                    aria-label="Cancel editing"
                  />
                  <Button
                    label="Save"
                    class="p-button-sm"
                    @click="saveEdit(note.id)"
                    :disabled="!editNoteContent.trim()"
                    aria-label="Save note changes"
                  />
                </div>
              </div>

              <div v-else>
                <p class="text-gray-900 m-0 whitespace-pre-wrap">{{ note.content }}</p>
                <div class="flex justify-between items-center mt-2">
                  <small class="text-gray-500">
                    {{ formatDateTime(note.createdAt) }}
                    <span v-if="note.updatedAt !== note.createdAt">
                      (edited)
                    </span>
                  </small>
                  <div>
                    <Button
                      icon="pi pi-pencil"
                      class="p-button-rounded p-button-text p-button-sm"
                      @click="startEdit(note)"
                      aria-label="Edit note"
                      v-tooltip.top="'Edit'"
                    />
                    <Button
                      icon="pi pi-trash"
                      class="p-button-rounded p-button-text p-button-sm p-button-danger"
                      @click="confirmDeleteNote(note.id)"
                      aria-label="Delete note"
                      v-tooltip.top="'Delete'"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Todos Section -->
      <div class="lg:col-span-3">
        <div class="bg-white p-4 rounded-lg shadow-lg">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-gray-900 m-0 text-lg font-semibold">
              <i class="pi pi-check-square mr-2"></i>Todos
            </h3>
            <div class="flex items-center gap-3">
              <span class="text-gray-500">{{ todos.length }} todo(s)</span>
              <Button
                label="New Todo"
                icon="pi pi-plus"
                class="p-button-sm"
                @click="openNewTodoModal"
                aria-label="Create new todo"
              />
            </div>
          </div>

          <!-- Todos List -->
          <div v-if="todos.length === 0" class="text-center p-4 text-gray-500">
            <i class="pi pi-inbox text-4xl mb-3 block"></i>
            No todos for this project. Create a new todo above.
          </div>

          <div v-else class="flex flex-col gap-3">
            <div
              v-for="todo in todos"
              :key="todo.id"
              class="bg-gray-100 p-4 rounded-lg"
              :class="{ 'opacity-60': todo.completed }"
            >
              <div class="flex items-start gap-3">
                <!-- Checkbox -->
                <Checkbox
                  :modelValue="todo.completed"
                  @update:modelValue="toggleTodoComplete(todo.id)"
                  :binary="true"
                  class="mt-1"
                  :aria-label="todo.completed ? 'Mark as incomplete' : 'Mark as complete'"
                />

                <!-- Todo Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <span
                      class="text-gray-900 font-medium"
                      :class="{ 'line-through': todo.completed }"
                    >
                      {{ todo.title }}
                    </span>
                    <span
                      v-if="todo.completed"
                      class="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full"
                    >
                      Completed
                    </span>
                  </div>

                  <p
                    v-if="todo.description"
                    class="text-gray-600 text-sm m-0 mb-2"
                    :class="{ 'line-through': todo.completed }"
                  >
                    {{ todo.description }}
                  </p>

                  <div class="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div v-if="todo.dueDate" :class="getDueDateClass(todo)">
                      <i class="pi pi-calendar mr-1"></i>
                      Due: {{ formatDate(todo.dueDate) }}
                    </div>
                    <div>
                      <i class="pi pi-user mr-1"></i>
                      Assigned to: {{ todo.currentAssigneeName }}
                    </div>
                    <div>
                      <i class="pi pi-clock mr-1"></i>
                      Created: {{ formatDateTime(todo.createdAt) }}
                    </div>
                  </div>

                  <!-- Assignment History Preview -->
                  <div
                    v-if="todo.assignmentHistory.length > 1"
                    class="mt-2 text-xs text-gray-400"
                  >
                    <i class="pi pi-history mr-1"></i>
                    Reassigned {{ todo.assignmentHistory.length - 1 }} time(s)
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-1">
                  <Button
                    icon="pi pi-pencil"
                    class="p-button-rounded p-button-text p-button-sm"
                    @click="openEditTodoModal(todo)"
                    aria-label="Edit todo"
                    v-tooltip.top="'Edit'"
                  />
                  <Button
                    icon="pi pi-user-edit"
                    class="p-button-rounded p-button-text p-button-sm"
                    @click="openReassignTodoModal(todo)"
                    aria-label="Reassign todo"
                    v-tooltip.top="'Reassign'"
                  />
                  <Button
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-text p-button-sm p-button-danger"
                    @click="confirmDeleteTodo(todo.id)"
                    aria-label="Delete todo"
                    v-tooltip.top="'Delete'"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center p-5 text-gray-600">
      <i class="pi pi-folder-open text-4xl mb-3 block"></i>
      Project not found.
    </div>

    <!-- Todo Modal -->
    <TodoModal
      v-model:visible="showTodoModal"
      :todo="selectedTodo"
      :project-id="projectId ?? 0"
      :is-reassigning="isReassigning"
      @saved="handleTodoSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'
import { useProjectStore } from '@/stores/projectStore'
import { useTodoStore } from '@/stores/todoStore'
import { useNoteStore } from '@/stores/noteStore'
import { formatDate, formatDateTime } from '@/utils/dateFormatters'
import type { ProjectNote, Todo } from '@/models'
import TodoModal from '@/components/TodoModal.vue'

const router = useRouter()
const route = useRoute()
const store = useProjectStore()
const todoStore = useTodoStore()
const noteStore = useNoteStore()
const confirm = useConfirm()
const toast = useToast()

const { currentProject: project, isLoadingProject: isLoading, projectError: error } = storeToRefs(store)

const newNoteContent = ref('')
const editingNoteId = ref<number | null>(null)
const editNoteContent = ref('')

// Todo state
const showTodoModal = ref(false)
const selectedTodo = ref<Todo | null>(null)
const isReassigning = ref(false)

const projectId = computed(() => {
  const id = Number(route.params.id)
  return isNaN(id) ? null : id
})

const notes = computed(() => {
  if (projectId.value === null) return []
  return noteStore.getProjectNotes(projectId.value)
})

const todos = computed(() => {
  if (projectId.value === null) return []
  return todoStore.getProjectTodos(projectId.value)
})

const projectEmployees = computed(() => {
  if (projectId.value === null) return []
  return store.getProjectEmployees(projectId.value)
})

const getInitials = (firstName: string, lastName: string): string => {
  const first = firstName?.[0] || ''
  const last = lastName?.[0] || ''
  return (first + last).toUpperCase() || '?'
}

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

const getStatusIconClass = (status: string): string => {
  switch (status) {
    case 'active':
      return 'text-green-500'
    case 'on-hold':
      return 'text-yellow-500'
    case 'completed':
      return 'text-blue-500'
    default:
      return 'text-gray-500'
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

const loadProject = async () => {
  if (projectId.value === null) {
    return
  }
  await store.fetchProjectById(projectId.value)
}

onMounted(loadProject)

// Watch for route changes to reload project
watch(() => route.params.id, loadProject)

const goBack = () => {
  router.push({ name: 'search' })
}

const addNote = () => {
  if (newNoteContent.value.trim() && projectId.value !== null) {
    noteStore.addNote(projectId.value, newNoteContent.value.trim())
    newNoteContent.value = ''
  }
}

const startEdit = (note: ProjectNote) => {
  editingNoteId.value = note.id
  editNoteContent.value = note.content
}

const cancelEdit = () => {
  editingNoteId.value = null
  editNoteContent.value = ''
}

const saveEdit = (noteId: number) => {
  if (editNoteContent.value.trim() && projectId.value !== null) {
    noteStore.updateNote(projectId.value, noteId, editNoteContent.value.trim())
    cancelEdit()
  }
}

const confirmDeleteNote = (noteId: number) => {
  confirm.require({
    message: 'Are you sure you want to delete this note? This action cannot be undone.',
    header: 'Delete Note',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => {
      if (projectId.value !== null) {
        noteStore.deleteNote(projectId.value, noteId)
      }
    }
  })
}

// Todo functions
const openNewTodoModal = () => {
  selectedTodo.value = null
  isReassigning.value = false
  showTodoModal.value = true
}

const openEditTodoModal = (todo: Todo) => {
  selectedTodo.value = todo
  isReassigning.value = false
  showTodoModal.value = true
}

const openReassignTodoModal = (todo: Todo) => {
  selectedTodo.value = todo
  isReassigning.value = true
  showTodoModal.value = true
}

const toggleTodoComplete = (todoId: number) => {
  todoStore.toggleTodoComplete(todoId)
}

const confirmDeleteTodo = (todoId: number) => {
  confirm.require({
    message: 'Are you sure you want to delete this todo? This action cannot be undone.',
    header: 'Delete Todo',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => {
      todoStore.deleteTodo(todoId)
    }
  })
}

const handleTodoSaved = (newAssigneeName?: string) => {
  showTodoModal.value = false
  if (newAssigneeName) {
    toast.add({
      severity: 'success',
      summary: 'Todo Reassigned',
      detail: `Todo has been reassigned to ${newAssigneeName}`,
      life: 3000
    })
  }
}

const getDueDateClass = (todo: Todo): string => {
  if (todo.completed || !todo.dueDate) return ''
  const dueDate = new Date(todo.dueDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  dueDate.setHours(0, 0, 0, 0)

  if (dueDate < today) return 'text-red-600'
  if (dueDate.getTime() === today.getTime()) return 'text-orange-600'
  return ''
}
</script>
