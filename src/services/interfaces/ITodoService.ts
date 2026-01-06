import type { Todo } from '@/models';

export interface ITodoService {
  getByProjectId(projectId: number): Promise<Todo[]>;
  getAll(): Promise<Todo[]>;
  create(
    projectId: number,
    title: string,
    description: string,
    dueDate: string | null,
    assigneeId: number,
    creatorId: number
  ): Promise<Todo>;
  update(
    todoId: number,
    updates: { title?: string; description?: string; dueDate?: string | null }
  ): Promise<Todo | null>;
  reassign(todoId: number, newAssigneeId: number, reassignedById: number): Promise<Todo | null>;
  toggleComplete(todoId: number): Promise<Todo | null>;
  delete(todoId: number): Promise<boolean>;
  resetMockData?(): void;
}
