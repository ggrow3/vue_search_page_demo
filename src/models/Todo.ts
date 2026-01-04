export interface TodoAssignment {
  id: number
  assignedToId: number
  assignedToName: string
  assignedById: number
  assignedByName: string
  assignedAt: string
}

export interface Todo {
  id: number
  projectId: number
  title: string
  description: string
  dueDate: string | null
  completed: boolean
  createdAt: string
  updatedAt: string
  createdById: number
  createdByName: string
  currentAssigneeId: number
  currentAssigneeName: string
  assignmentHistory: TodoAssignment[]
}
