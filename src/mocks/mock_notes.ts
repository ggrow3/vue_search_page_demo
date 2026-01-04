import type { ProjectNote } from '@/models'

export const NOTES_DB: Record<number, ProjectNote[]> = {
  2001: [
    { id: 4001, projectId: 2001, content: 'Kickoff meeting completed. Team aligned on project goals and timeline.', createdAt: '2024-01-15T10:00:00Z', updatedAt: '2024-01-15T10:00:00Z' },
    { id: 4002, projectId: 2001, content: 'Design phase approved by stakeholders. Moving to development sprint 1.', createdAt: '2024-02-01T14:30:00Z', updatedAt: '2024-02-01T14:30:00Z' },
    { id: 4003, projectId: 2001, content: 'Client requested additional accessibility features. Added to backlog.', createdAt: '2024-02-20T09:15:00Z', updatedAt: '2024-02-20T09:15:00Z' }
  ],
  2002: [
    { id: 4004, projectId: 2002, content: 'Campaign launched successfully. Initial metrics looking positive.', createdAt: '2024-02-05T11:00:00Z', updatedAt: '2024-02-05T11:00:00Z' },
    { id: 4005, projectId: 2002, content: 'Mid-campaign review: 25% increase in engagement compared to Q4.', createdAt: '2024-03-15T16:00:00Z', updatedAt: '2024-03-15T16:00:00Z' }
  ],
  2003: [
    { id: 4006, projectId: 2003, content: 'Requirements gathering phase complete. 15 stakeholder interviews conducted.', createdAt: '2024-03-05T10:00:00Z', updatedAt: '2024-03-05T10:00:00Z' },
    { id: 4007, projectId: 2003, content: 'Integration with existing HRIS system confirmed. API documentation received.', createdAt: '2024-03-20T13:30:00Z', updatedAt: '2024-03-20T13:30:00Z' }
  ],
  2004: [
    { id: 4008, projectId: 2004, content: 'Initial prototype demo to finance team. Positive feedback received.', createdAt: '2024-02-15T15:00:00Z', updatedAt: '2024-02-15T15:00:00Z' }
  ],
  2005: [
    { id: 4009, projectId: 2005, content: 'App architecture finalized. Using React Native for cross-platform development.', createdAt: '2024-04-05T09:00:00Z', updatedAt: '2024-04-05T09:00:00Z' },
    { id: 4010, projectId: 2005, content: 'Beta testing group identified. 50 internal users signed up.', createdAt: '2024-05-10T11:30:00Z', updatedAt: '2024-05-10T11:30:00Z' },
    { id: 4011, projectId: 2005, content: 'Push notification service selected: Firebase Cloud Messaging.', createdAt: '2024-05-20T14:00:00Z', updatedAt: '2024-05-20T14:00:00Z' }
  ],
  2006: [
    { id: 4012, projectId: 2006, content: 'CRM integration completed ahead of schedule. Training sessions planned.', createdAt: '2024-02-10T10:00:00Z', updatedAt: '2024-02-10T10:00:00Z' }
  ],
  2007: [
    { id: 4013, projectId: 2007, content: 'Project on hold pending budget approval for Q3.', createdAt: '2024-05-20T09:00:00Z', updatedAt: '2024-05-20T09:00:00Z' },
    { id: 4014, projectId: 2007, content: 'Infrastructure audit completed. 12 servers identified for migration.', createdAt: '2024-05-15T16:00:00Z', updatedAt: '2024-05-15T16:00:00Z' }
  ],
  2008: [
    { id: 4015, projectId: 2008, content: 'Brand guidelines document draft ready for review.', createdAt: '2024-06-15T10:30:00Z', updatedAt: '2024-06-15T10:30:00Z' },
    { id: 4016, projectId: 2008, content: 'Color palette finalized. Moving to typography selection.', createdAt: '2024-07-01T14:00:00Z', updatedAt: '2024-07-01T14:00:00Z' }
  ],
  2009: [
    { id: 4017, projectId: 2009, content: 'Performance criteria defined with department heads.', createdAt: '2024-02-20T11:00:00Z', updatedAt: '2024-02-20T11:00:00Z' },
    { id: 4018, projectId: 2009, content: 'Self-assessment module design approved.', createdAt: '2024-04-10T15:30:00Z', updatedAt: '2024-04-10T15:30:00Z' }
  ],
  2010: [
    { id: 4019, projectId: 2010, content: 'API Gateway vendor evaluation complete. Selected Kong Gateway.', createdAt: '2024-03-20T09:00:00Z', updatedAt: '2024-03-20T09:00:00Z' },
    { id: 4020, projectId: 2010, content: 'Rate limiting and authentication policies documented.', createdAt: '2024-04-05T13:00:00Z', updatedAt: '2024-04-05T13:00:00Z' },
    { id: 4021, projectId: 2010, content: 'Staging environment deployed. Testing in progress.', createdAt: '2024-04-25T10:00:00Z', updatedAt: '2024-04-25T10:00:00Z' }
  ]
}
