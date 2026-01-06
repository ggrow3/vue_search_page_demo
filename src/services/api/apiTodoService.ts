import type { Todo } from '@/models';
import type { ITodoService } from '../interfaces';
import { httpClient } from '../httpClient';

export const apiTodoService: ITodoService = {
  async getByProjectId(projectId: number): Promise<Todo[]> {
    return httpClient.get<Todo[]>(`/projects/${projectId}/todos`);
  },

  async getAll(): Promise<Todo[]> {
    return httpClient.get<Todo[]>('/todos');
  },

  async create(
    projectId: number,
    title: string,
    description: string,
    dueDate: string | null,
    assigneeId: number,
    creatorId: number
  ): Promise<Todo> {
    return httpClient.post<Todo>('/todos', {
      projectId,
      title,
      description,
      dueDate,
      assigneeId,
      creatorId
    });
  },

  async update(
    todoId: number,
    updates: { title?: string; description?: string; dueDate?: string | null }
  ): Promise<Todo | null> {
    return httpClient.patch<Todo>(`/todos/${todoId}`, updates);
  },

  async reassign(todoId: number, newAssigneeId: number, reassignedById: number): Promise<Todo | null> {
    return httpClient.patch<Todo>(`/todos/${todoId}/reassign`, {
      newAssigneeId,
      reassignedById
    });
  },

  async toggleComplete(todoId: number): Promise<Todo | null> {
    return httpClient.patch<Todo>(`/todos/${todoId}/toggle`, {});
  },

  async delete(todoId: number): Promise<boolean> {
    await httpClient.delete(`/todos/${todoId}`);
    return true;
  }
};
