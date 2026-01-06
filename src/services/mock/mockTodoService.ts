import type { Todo } from '@/models';
import type { ITodoService } from '../interfaces';
import { TODOS_DB } from '@/mocks';
import { delay, cloneArray } from '@/utils/mockUtils';
import { mockEmployeeService } from './mockEmployeeService';

let mockTodos = cloneArray(TODOS_DB);

export const mockTodoService: ITodoService = {
  async getByProjectId(projectId: number): Promise<Todo[]> {
    await delay();
    return mockTodos.filter(t => t.projectId === projectId);
  },

  async getAll(): Promise<Todo[]> {
    await delay();
    return [...mockTodos];
  },

  async create(
    projectId: number,
    title: string,
    description: string,
    dueDate: string | null,
    assigneeId: number,
    creatorId: number
  ): Promise<Todo> {
    await delay();
    const now = new Date().toISOString();
    const assigneeName = mockEmployeeService.getNameSync(assigneeId);
    const creatorName = mockEmployeeService.getNameSync(creatorId);

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
    };
    mockTodos.push(todo);
    return todo;
  },

  async update(
    todoId: number,
    updates: { title?: string; description?: string; dueDate?: string | null }
  ): Promise<Todo | null> {
    await delay();
    const todo = mockTodos.find(t => t.id === todoId);
    if (todo) {
      if (updates.title !== undefined) todo.title = updates.title;
      if (updates.description !== undefined) todo.description = updates.description;
      if (updates.dueDate !== undefined) todo.dueDate = updates.dueDate;
      todo.updatedAt = new Date().toISOString();
      return { ...todo };
    }
    return null;
  },

  async reassign(todoId: number, newAssigneeId: number, reassignedById: number): Promise<Todo | null> {
    await delay();
    const todo = mockTodos.find(t => t.id === todoId);
    if (todo) {
      const newAssigneeName = mockEmployeeService.getNameSync(newAssigneeId);
      const reassignerName = mockEmployeeService.getNameSync(reassignedById);
      const now = new Date().toISOString();

      todo.assignmentHistory.push({
        id: Date.now(),
        assignedToId: newAssigneeId,
        assignedToName: newAssigneeName,
        assignedById: reassignedById,
        assignedByName: reassignerName,
        assignedAt: now
      });

      todo.currentAssigneeId = newAssigneeId;
      todo.currentAssigneeName = newAssigneeName;
      todo.updatedAt = now;
      return { ...todo };
    }
    return null;
  },

  async toggleComplete(todoId: number): Promise<Todo | null> {
    await delay();
    const todo = mockTodos.find(t => t.id === todoId);
    if (todo) {
      todo.completed = !todo.completed;
      todo.updatedAt = new Date().toISOString();
      return { ...todo };
    }
    return null;
  },

  async delete(todoId: number): Promise<boolean> {
    await delay();
    const index = mockTodos.findIndex(t => t.id === todoId);
    if (index !== -1) {
      mockTodos.splice(index, 1);
      return true;
    }
    return false;
  },

  resetMockData(): void {
    mockTodos = cloneArray(TODOS_DB);
  }
};
