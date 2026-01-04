import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Employee, Todo } from '@/models'
import { todoService, employeeService } from '@/services'

// Re-export types for convenience
export type { Todo, TodoAssignment } from '@/models'

export const useTodoStore = defineStore('todo', () => {
  // State
  const todos = ref<Todo[]>([])
  const employees = ref<Employee[]>([])
  const isLoading = ref(false)

  // Getters
  const allEmployees = computed(() => employees.value)

  const getProjectTodos = (projectId: number): Todo[] => {
    return todos.value.filter(todo => todo.projectId === projectId)
  }

  const getEmployeeById = (id: number): Employee | undefined => {
    return employeeService.getByIdSync(id)
  }

  const getEmployeeName = (id: number): string => {
    return employeeService.getNameSync(id)
  }

  // Actions
  const initialize = async (): Promise<void> => {
    isLoading.value = true
    try {
      const [todoData, employeeData] = await Promise.all([
        todoService.getAll(),
        employeeService.getAll()
      ])
      todos.value = todoData
      employees.value = employeeData
    } finally {
      isLoading.value = false
    }
  }

  const loadProjectTodos = async (projectId: number): Promise<void> => {
    isLoading.value = true
    try {
      const projectTodos = await todoService.getByProjectId(projectId)
      // Merge with existing todos, replacing any with same id
      const otherTodos = todos.value.filter(t => t.projectId !== projectId)
      todos.value = [...otherTodos, ...projectTodos]
    } finally {
      isLoading.value = false
    }
  }

  const addTodo = async (
    projectId: number,
    title: string,
    description: string,
    dueDate: string | null,
    assigneeId: number,
    creatorId: number
  ): Promise<Todo> => {
    const todo = await todoService.create(projectId, title, description, dueDate, assigneeId, creatorId)
    todos.value.push(todo)
    return todo
  }

  const updateTodo = async (
    todoId: number,
    updates: { title?: string; description?: string; dueDate?: string | null }
  ): Promise<void> => {
    const updatedTodo = await todoService.update(todoId, updates)
    if (updatedTodo) {
      const index = todos.value.findIndex(t => t.id === todoId)
      if (index !== -1) {
        todos.value[index] = updatedTodo
      }
    }
  }

  const reassignTodo = async (todoId: number, newAssigneeId: number, reassignedById: number): Promise<void> => {
    const updatedTodo = await todoService.reassign(todoId, newAssigneeId, reassignedById)
    if (updatedTodo) {
      const index = todos.value.findIndex(t => t.id === todoId)
      if (index !== -1) {
        todos.value[index] = updatedTodo
      }
    }
  }

  const toggleTodoComplete = async (todoId: number): Promise<void> => {
    const updatedTodo = await todoService.toggleComplete(todoId)
    if (updatedTodo) {
      const index = todos.value.findIndex(t => t.id === todoId)
      if (index !== -1) {
        todos.value[index] = updatedTodo
      }
    }
  }

  const deleteTodo = async (todoId: number): Promise<void> => {
    const success = await todoService.delete(todoId)
    if (success) {
      const index = todos.value.findIndex(t => t.id === todoId)
      if (index !== -1) {
        todos.value.splice(index, 1)
      }
    }
  }

  return {
    // State
    todos,
    isLoading,

    // Getters
    allEmployees,
    getProjectTodos,
    getEmployeeById,
    getEmployeeName,

    // Actions
    initialize,
    loadProjectTodos,
    addTodo,
    updateTodo,
    reassignTodo,
    toggleTodoComplete,
    deleteTodo
  }
})
