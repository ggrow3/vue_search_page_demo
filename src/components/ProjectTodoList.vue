<template>
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
          @click="$emit('create')"
          aria-label="Create new todo"
        />
      </div>
    </div>

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
          <Checkbox
            :modelValue="todo.completed"
            @update:modelValue="$emit('toggle', todo.id)"
            :binary="true"
            class="mt-1"
            :aria-label="todo.completed ? 'Mark as incomplete' : 'Mark as complete'"
          />

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

            <div
              v-if="todo.assignmentHistory.length > 1"
              class="mt-2 text-xs text-gray-400"
            >
              <i class="pi pi-history mr-1"></i>
              Reassigned {{ todo.assignmentHistory.length - 1 }} time(s)
            </div>
          </div>

          <div class="flex gap-1">
            <Button
              icon="pi pi-pencil"
              class="p-button-rounded p-button-text p-button-sm"
              @click="$emit('edit', todo)"
              :disabled="todo.completed"
              aria-label="Edit todo"
              v-tooltip.top="todo.completed ? 'Cannot edit completed todo' : 'Edit'"
            />
            <Button
              icon="pi pi-user-edit"
              class="p-button-rounded p-button-text p-button-sm"
              @click="$emit('reassign', todo)"
              :disabled="todo.completed"
              aria-label="Reassign todo"
              v-tooltip.top="todo.completed ? 'Cannot reassign completed todo' : 'Reassign'"
            />
            <Button
              icon="pi pi-trash"
              class="p-button-rounded p-button-text p-button-sm p-button-danger"
              @click="$emit('delete', todo.id)"
              aria-label="Delete todo"
              v-tooltip.top="'Delete'"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate, formatDateTime } from '@/utils/dateFormatters';
import type { Todo } from '@/models';

defineProps<{
  todos: Todo[];
}>();

defineEmits<{
  'create': [];
  'edit': [todo: Todo];
  'reassign': [todo: Todo];
  'delete': [todoId: number];
  'toggle': [todoId: number];
}>();

const getDueDateClass = (todo: Todo): string => {
  if (todo.completed || !todo.dueDate) return '';
  const dueDate = new Date(todo.dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);

  if (dueDate < today) return 'text-red-600';
  if (dueDate.getTime() === today.getTime()) return 'text-orange-600';
  return '';
};
</script>
