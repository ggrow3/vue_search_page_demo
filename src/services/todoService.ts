import type { Todo } from '@/models'
import { isMockMode } from '@/config'
import { TODOS_DB } from '@/mocks'
import { httpClient } from './httpClient'
import { employeeService } from './projectService'

// Local state for mock mode
let mockTodos: Todo[] = [...TODOS_DB]

const simulateDelay = (ms: number = 300): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms))

export const todoService = {
  async getByProjectId(projectId: number): Promise<Todo[]> {
    if (isMockMode()) {
      await simulateDelay()
      return mockTodos.filter(t => t.projectId === projectId)
    }
    return httpClient.get<Todo[]>(`/projects/${projectId}/todos`)
  },

  async getAll(): Promise<Todo[]> {
    if (isMockMode()) {
      await simulateDelay()
      return [...mockTodos]
    }
    return httpClient.get<Todo[]>('/todos')
  },

  async create(
    projectId: number,
    title: string,
    description: string,
    dueDate: string | null,
    assigneeId: number,
    creatorId: number
  ): Promise<Todo> {
    if (isMockMode()) {
      await simulateDelay()
      const now = new Date().toISOString()
      const assigneeName = employeeService.getNameSync(assigneeId)
      const creatorName = employeeService.getNameSync(creatorId)

      const todo: Todo = {
        id: Date.now(),
        projectId,
        title,
        description,
        dueDate,
        completed: false,
        createdAt: now,
        updatedAt: now,
        createdById: creatorId,
        createdByName: creatorName,
        currentAssigneeId: assigneeId,
        currentAssigneeName: assigneeName,
        assignmentHistory: [{
          id: Date.now(),
          assignedToId: assigneeId,
          assignedToName: assigneeName,
          assignedById: creatorId,
          assignedByName: creatorName,
          assignedAt: now
        }]
      }
      mockTodos.push(todo)
      return todo
    }
    return httpClient.post<Todo>('/todos', {
      projectId,
      title,
      description,
      dueDate,
      assigneeId,
      creatorId
    })
  },

  async update(
    todoId: number,
    updates: { title?: string; description?: string; dueDate?: string | null }
  ): Promise<Todo | null> {
    if (isMockMode()) {
      await simulateDelay()
      const todo = mockTodos.find(t => t.id === todoId)
      if (todo) {
        if (updates.title !== undefined) todo.title = updates.title
        if (updates.description !== undefined) todo.description = updates.description
        if (updates.dueDate !== undefined) todo.dueDate = updates.dueDate
        todo.updatedAt = new Date().toISOString()
        return { ...todo }
      }
      return null
    }
    return httpClient.patch<Todo>(`/todos/${todoId}`, updates)
  },

  async reassign(todoId: number, newAssigneeId: number, reassignedById: number): Promise<Todo | null> {
    if (isMockMode()) {
      await simulateDelay()
      const todo = mockTodos.find(t => t.id === todoId)
      if (todo) {
        const newAssigneeName = employeeService.getNameSync(newAssigneeId)
        const reassignerName = employeeService.getNameSync(reassignedById)
        const now = new Date().toISOString()

        todo.assignmentHistory.push({
          id: Date.now(),
          assignedToId: newAssigneeId,
          assignedToName: newAssigneeName,
          assignedById: reassignedById,
          assignedByName: reassignerName,
          assignedAt: now
        })

        todo.currentAssigneeId = newAssigneeId
        todo.currentAssigneeName = newAssigneeName
        todo.updatedAt = now
        return { ...todo }
      }
      return null
    }
    return httpClient.patch<Todo>(`/todos/${todoId}/reassign`, {
      newAssigneeId,
      reassignedById
    })
  },

  async toggleComplete(todoId: number): Promise<Todo | null> {
    if (isMockMode()) {
      await simulateDelay()
      const todo = mockTodos.find(t => t.id === todoId)
      if (todo) {
        todo.completed = !todo.completed
        todo.updatedAt = new Date().toISOString()
        return { ...todo }
      }
      return null
    }
    return httpClient.patch<Todo>(`/todos/${todoId}/toggle`, {})
  },

  async delete(todoId: number): Promise<boolean> {
    if (isMockMode()) {
      await simulateDelay()
      const index = mockTodos.findIndex(t => t.id === todoId)
      if (index !== -1) {
        mockTodos.splice(index, 1)
        return true
      }
      return false
    }
    await httpClient.delete(`/todos/${todoId}`)
    return true
  },

  // Reset mock data (useful for testing)
  resetMockData(): void {
    mockTodos = [...TODOS_DB]
  }
}
