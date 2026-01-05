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
                  <StatusBadge :status="project.status" />
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
        <ProjectNoteList
          :notes="notes"
          @add="handleAddNote"
          @edit="handleEditNote"
          @delete="confirmDeleteNote"
        />
      </div>

      <!-- Todos Section -->
      <div class="lg:col-span-3">
        <ProjectTodoList
          :todos="todos"
          @create="openTodoModal('create')"
          @edit="(todo) => openTodoModal('edit', todo)"
          @reassign="(todo) => openTodoModal('reassign', todo)"
          @delete="confirmDeleteTodo"
          @toggle="todoStore.toggleTodoComplete"
        />
      </div>
    </div>

    <div v-else class="text-center p-5 text-gray-600">
      <i class="pi pi-folder-open text-4xl mb-3 block"></i>
      Project not found.
    </div>

    <!-- Todo Modal -->
    <TodoModal
      v-model:visible="modalState.visible"
      :todo="modalState.todo"
      :project-id="projectId ?? 0"
      :is-reassigning="modalState.mode === 'reassign'"
      @saved="handleTodoSaved"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { useProjectStore } from '@/stores/projectStore';
import { useTodoStore } from '@/stores/todoStore';
import { useNoteStore } from '@/stores/noteStore';
import { formatDate } from '@/utils/dateFormatters';
import { getStatusIconClass } from '@/utils/statusUtils';
import type { Todo } from '@/models';
import TodoModal from '@/components/TodoModal.vue';
import StatusBadge from '@/components/StatusBadge.vue';
import ProjectTodoList from '@/components/ProjectTodoList.vue';
import ProjectNoteList from '@/components/ProjectNoteList.vue';

type ModalMode = 'create' | 'edit' | 'reassign';

const router = useRouter();
const route = useRoute();
const store = useProjectStore();
const todoStore = useTodoStore();
const noteStore = useNoteStore();
const confirm = useConfirm();
const toast = useToast();

const { currentProject: project, isLoadingProject: isLoading, projectError: error } = storeToRefs(store);

// Consolidated modal state
const modalState = ref<{ visible: boolean; todo: Todo | null; mode: ModalMode }>({
  visible: false,
  todo: null,
  mode: 'create'
});

const projectId = computed(() => {
  const id = Number(route.params.id);
  return isNaN(id) ? null : id;
});

const notes = computed(() =>
  projectId.value !== null ? noteStore.getProjectNotes(projectId.value) : []
);

const todos = computed(() =>
  projectId.value !== null ? todoStore.getProjectTodos(projectId.value) : []
);

const projectEmployees = computed(() =>
  projectId.value !== null ? store.getProjectEmployees(projectId.value) : []
);

const getInitials = (firstName: string, lastName: string): string =>
  ((firstName?.[0] || '') + (lastName?.[0] || '')).toUpperCase() || '?';

const loadProject = async () => {
  if (projectId.value !== null) {
    await store.fetchProjectById(projectId.value);
  }
};

onMounted(loadProject);
watch(() => route.params.id, loadProject);

const goBack = () => router.push({ name: 'search' });

const handleAddNote = (content: string) => {
  if (projectId.value !== null) {
    noteStore.addNote(projectId.value, content);
  }
};

const handleEditNote = (noteId: number, content: string) => {
  if (projectId.value !== null) {
    noteStore.updateNote(projectId.value, noteId, content);
  }
};

const confirmDeleteNote = (noteId: number) => {
  confirm.require({
    message: 'Are you sure you want to delete this note? This action cannot be undone.',
    header: 'Delete Note',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => {
      if (projectId.value !== null) {
        noteStore.deleteNote(projectId.value, noteId);
      }
    }
  });
};

const openTodoModal = (mode: ModalMode, todo: Todo | null = null) => {
  modalState.value = { visible: true, todo, mode };
};

const confirmDeleteTodo = (todoId: number) => {
  confirm.require({
    message: 'Are you sure you want to delete this todo? This action cannot be undone.',
    header: 'Delete Todo',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => todoStore.deleteTodo(todoId)
  });
};

const handleTodoSaved = (newAssigneeName?: string) => {
  modalState.value.visible = false;
  if (newAssigneeName) {
    toast.add({
      severity: 'success',
      summary: 'Todo Reassigned',
      detail: `Todo has been reassigned to ${newAssigneeName}`,
      life: 3000
    });
  }
};
</script>
