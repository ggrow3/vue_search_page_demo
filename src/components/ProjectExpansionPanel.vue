<template>
  <div class="p-4 bg-gray-50">
    <div class="mb-3">
      <h4 class="text-gray-700 font-semibold mb-2">
        <i class="pi pi-info-circle mr-2"></i>Description
      </h4>
      <p class="text-gray-600 text-sm">{{ project.description }}</p>
    </div>

    <div class="mb-3">
      <h4 class="text-gray-700 font-semibold mb-2">
        <i class="pi pi-users mr-2"></i>Assigned Team Members
      </h4>
      <div v-if="employees.length === 0" class="text-gray-500 text-sm">
        No employees assigned to this project.
      </div>
      <div v-else class="flex flex-wrap gap-2">
        <span
          v-for="emp in employees"
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
      <div v-if="todos.length === 0" class="text-gray-500 text-sm">
        No todos for this project.
      </div>
      <div v-else class="flex flex-col gap-2">
        <div
          v-for="todo in todos"
          :key="todo.id"
          class="flex items-center gap-3 p-2 bg-white rounded border border-gray-200"
          :class="{ 'opacity-60': todo.completed }"
        >
          <Checkbox
            :modelValue="todo.completed"
            @update:modelValue="$emit('toggle-todo', todo.id)"
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

<script setup lang="ts">
import { formatDate } from '@/utils/dateFormatters';
import type { Project, Employee, Todo } from '@/models';

defineProps<{
  project: Project;
  employees: Employee[];
  todos: Todo[];
}>();

defineEmits<{
  'toggle-todo': [todoId: number];
}>();
</script>
