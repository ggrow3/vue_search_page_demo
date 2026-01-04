import type { Todo } from '@/models'

export const TODOS_DB: Todo[] = [
  {
    id: 3001,
    projectId: 2001,
    title: 'Design homepage mockup',
    description: 'Create wireframes and high-fidelity mockups for the new homepage layout',
    dueDate: '2024-02-15',
    completed: true,
    createdAt: '2024-01-16T09:00:00Z',
    updatedAt: '2024-02-10T14:30:00Z',
    createdById: 1002,
    createdByName: 'Sarah Johnson',
    currentAssigneeId: 1001,
    currentAssigneeName: 'John Smith',
    assignmentHistory: [
      { id: 3101, assignedToId: 1001, assignedToName: 'John Smith', assignedById: 1002, assignedByName: 'Sarah Johnson', assignedAt: '2024-01-16T09:00:00Z' }
    ]
  },
  {
    id: 3002,
    projectId: 2001,
    title: 'Implement responsive navigation',
    description: 'Build mobile-friendly navigation component with hamburger menu',
    dueDate: '2024-03-01',
    completed: false,
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-02-25T16:00:00Z',
    createdById: 1002,
    createdByName: 'Sarah Johnson',
    currentAssigneeId: 1006,
    currentAssigneeName: 'Jessica Davis',
    assignmentHistory: [
      { id: 3102, assignedToId: 1001, assignedToName: 'John Smith', assignedById: 1002, assignedByName: 'Sarah Johnson', assignedAt: '2024-01-20T10:30:00Z' },
      { id: 3103, assignedToId: 1006, assignedToName: 'Jessica Davis', assignedById: 1002, assignedByName: 'Sarah Johnson', assignedAt: '2024-02-15T11:00:00Z' }
    ]
  },
  {
    id: 3003,
    projectId: 2001,
    title: 'Write unit tests for API endpoints',
    description: 'Create comprehensive test suite for all new REST endpoints',
    dueDate: '2024-04-15',
    completed: false,
    createdAt: '2024-02-01T08:00:00Z',
    updatedAt: '2024-02-01T08:00:00Z',
    createdById: 1002,
    createdByName: 'Sarah Johnson',
    currentAssigneeId: 1006,
    currentAssigneeName: 'Jessica Davis',
    assignmentHistory: [
      { id: 3104, assignedToId: 1006, assignedToName: 'Jessica Davis', assignedById: 1002, assignedByName: 'Sarah Johnson', assignedAt: '2024-02-01T08:00:00Z' }
    ]
  },
  {
    id: 3004,
    projectId: 2003,
    title: 'Create onboarding checklist template',
    description: 'Design a standard checklist for new employee onboarding process',
    dueDate: '2024-03-15',
    completed: true,
    createdAt: '2024-03-02T09:00:00Z',
    updatedAt: '2024-03-12T17:00:00Z',
    createdById: 1010,
    createdByName: 'Jennifer Taylor',
    currentAssigneeId: 1004,
    currentAssigneeName: 'Emily Brown',
    assignmentHistory: [
      { id: 3105, assignedToId: 1004, assignedToName: 'Emily Brown', assignedById: 1010, assignedByName: 'Jennifer Taylor', assignedAt: '2024-03-02T09:00:00Z' }
    ]
  },
  {
    id: 3005,
    projectId: 2003,
    title: 'Set up document signing integration',
    description: 'Integrate DocuSign API for digital document signing workflow',
    dueDate: '2024-04-30',
    completed: false,
    createdAt: '2024-03-10T11:00:00Z',
    updatedAt: '2024-03-10T11:00:00Z',
    createdById: 1010,
    createdByName: 'Jennifer Taylor',
    currentAssigneeId: 1010,
    currentAssigneeName: 'Jennifer Taylor',
    assignmentHistory: [
      { id: 3106, assignedToId: 1010, assignedToName: 'Jennifer Taylor', assignedById: 1010, assignedByName: 'Jennifer Taylor', assignedAt: '2024-03-10T11:00:00Z' }
    ]
  },
  {
    id: 3006,
    projectId: 2005,
    title: 'Design app icon and splash screen',
    description: 'Create branding assets for iOS and Android app stores',
    dueDate: '2024-04-15',
    completed: true,
    createdAt: '2024-04-02T10:00:00Z',
    updatedAt: '2024-04-14T15:00:00Z',
    createdById: 1001,
    createdByName: 'John Smith',
    currentAssigneeId: 1002,
    currentAssigneeName: 'Sarah Johnson',
    assignmentHistory: [
      { id: 3107, assignedToId: 1002, assignedToName: 'Sarah Johnson', assignedById: 1001, assignedByName: 'John Smith', assignedAt: '2024-04-02T10:00:00Z' }
    ]
  },
  {
    id: 3007,
    projectId: 2005,
    title: 'Implement push notifications',
    description: 'Set up Firebase Cloud Messaging for push notification support',
    dueDate: '2024-05-30',
    completed: false,
    createdAt: '2024-04-20T14:00:00Z',
    updatedAt: '2024-04-20T14:00:00Z',
    createdById: 1002,
    createdByName: 'Sarah Johnson',
    currentAssigneeId: 1009,
    currentAssigneeName: 'Christopher Moore',
    assignmentHistory: [
      { id: 3108, assignedToId: 1009, assignedToName: 'Christopher Moore', assignedById: 1002, assignedByName: 'Sarah Johnson', assignedAt: '2024-04-20T14:00:00Z' }
    ]
  },
  {
    id: 3008,
    projectId: 2007,
    title: 'Audit current infrastructure',
    description: 'Document all existing on-premise servers and their configurations',
    dueDate: '2024-05-15',
    completed: true,
    createdAt: '2024-05-02T09:00:00Z',
    updatedAt: '2024-05-14T18:00:00Z',
    createdById: 1009,
    createdByName: 'Christopher Moore',
    currentAssigneeId: 1009,
    currentAssigneeName: 'Christopher Moore',
    assignmentHistory: [
      { id: 3109, assignedToId: 1009, assignedToName: 'Christopher Moore', assignedById: 1009, assignedByName: 'Christopher Moore', assignedAt: '2024-05-02T09:00:00Z' }
    ]
  },
  {
    id: 3009,
    projectId: 2008,
    title: 'Update logo variations',
    description: 'Create new logo versions for different use cases (dark mode, favicon, etc.)',
    dueDate: '2024-07-01',
    completed: false,
    createdAt: '2024-06-05T10:00:00Z',
    updatedAt: '2024-06-05T10:00:00Z',
    createdById: 1003,
    createdByName: 'Michael Williams',
    currentAssigneeId: 1008,
    currentAssigneeName: 'Amanda Wilson',
    assignmentHistory: [
      { id: 3110, assignedToId: 1008, assignedToName: 'Amanda Wilson', assignedById: 1003, assignedByName: 'Michael Williams', assignedAt: '2024-06-05T10:00:00Z' }
    ]
  },
  {
    id: 3010,
    projectId: 2010,
    title: 'Configure rate limiting',
    description: 'Implement request rate limiting to prevent API abuse',
    dueDate: '2024-04-01',
    completed: true,
    createdAt: '2024-03-20T08:30:00Z',
    updatedAt: '2024-03-30T16:00:00Z',
    createdById: 1001,
    createdByName: 'John Smith',
    currentAssigneeId: 1009,
    currentAssigneeName: 'Christopher Moore',
    assignmentHistory: [
      { id: 3111, assignedToId: 1009, assignedToName: 'Christopher Moore', assignedById: 1001, assignedByName: 'John Smith', assignedAt: '2024-03-20T08:30:00Z' }
    ]
  }
]
