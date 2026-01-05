import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { Todo } from '@/models';
import { todoService } from '@/services';
import { useEmployeeStore } from './employeeStore';
import { updateItemById, removeItemById } from '@/utils/arrayUtils';

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<Todo[]>([]);
  const isLoading = ref(false);

  const employeeStore = useEmployeeStore();

  const getProjectTodos = (projectId: number): Todo[] =>
    todos.value.filter(todo => todo.projectId === projectId);

  const getEmployeeById = (id: number) => employeeStore.byId(id);
  const getEmployeeName = (id: number) => employeeStore.getName(id);

  const initialize = async (): Promise<void> => {
    isLoading.value = true;
    try {
      await employeeStore.initialize();
      todos.value = await todoService.getAll();
    } finally {
      isLoading.value = false;
    }
  };

  const loadProjectTodos = async (projectId: number): Promise<void> => {
    isLoading.value = true;
    try {
      const projectTodos = await todoService.getByProjectId(projectId);
      const otherTodos = todos.value.filter(t => t.projectId !== projectId);
      todos.value = [...otherTodos, ...projectTodos];
    } finally {
      isLoading.value = false;
    }
  };

  const addTodo = async (
    projectId: number,
    title: string,
    description: string,
    dueDate: string | null,
    assigneeId: number,
    creatorId: number
  ): Promise<Todo> => {
    const todo = await todoService.create(projectId, title, description, dueDate, assigneeId, creatorId);
    todos.value.push(todo);
    return todo;
  };

  const updateTodo = async (
    todoId: number,
    updates: { title?: string; description?: string; dueDate?: string | null }
  ): Promise<boolean> => {
    const todo = todos.value.find(t => t.id === todoId);
    if (todo?.completed) return false;
    const updatedTodo = await todoService.update(todoId, updates);
    return updateItemById(todos.value, todoId, updatedTodo);
  };

  const reassignTodo = async (todoId: number, newAssigneeId: number, reassignedById: number): Promise<boolean> => {
    const todo = todos.value.find(t => t.id === todoId);
    if (todo?.completed) return false;
    const updatedTodo = await todoService.reassign(todoId, newAssigneeId, reassignedById);
    return updateItemById(todos.value, todoId, updatedTodo);
  };

  const toggleTodoComplete = async (todoId: number): Promise<boolean> => {
    const updatedTodo = await todoService.toggleComplete(todoId);
    return updateItemById(todos.value, todoId, updatedTodo);
  };

  const deleteTodo = async (todoId: number): Promise<void> => {
    const success = await todoService.delete(todoId);
    if (success) removeItemById(todos.value, todoId);
  };

  return {
    todos,
    isLoading,
    allEmployees: employeeStore.employees,
    getProjectTodos,
    getEmployeeById,
    getEmployeeName,
    initialize,
    loadProjectTodos,
    addTodo,
    updateTodo,
    reassignTodo,
    toggleTodoComplete,
    deleteTodo
  };
});
