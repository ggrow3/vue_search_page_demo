import type { Project } from '@/models'

export const PROJECTS_DB: Project[] = [
  { id: 2001, projectCode: '10234567', name: 'Website Redesign', description: 'Complete overhaul of company website with modern UI/UX', department: 'Engineering', startDate: '2024-01-15', endDate: '2024-06-30', status: 'active', assignedEmployeeIds: [1001, 1002, 1006] },
  { id: 2002, projectCode: '10345678', name: 'Q1 Marketing Campaign', description: 'Spring product launch marketing initiative', department: 'Marketing', startDate: '2024-02-01', endDate: '2024-04-30', status: 'completed', assignedEmployeeIds: [1003, 1008] },
  { id: 2003, projectCode: '10456789', name: 'Employee Onboarding System', description: 'New digital onboarding platform for new hires', department: 'HR', startDate: '2024-03-01', endDate: null, status: 'active', assignedEmployeeIds: [1004, 1010] },
  { id: 2004, projectCode: '10567890', name: 'Budget Analysis Tool', description: 'Internal tool for financial forecasting and budget tracking', department: 'Finance', startDate: '2024-01-01', endDate: '2024-12-31', status: 'active', assignedEmployeeIds: [1005] },
  { id: 2005, projectCode: '10678901', name: 'Mobile App Development', description: 'Native mobile application for customer engagement', department: 'Engineering', startDate: '2024-04-01', endDate: null, status: 'active', assignedEmployeeIds: [1001, 1002, 1009] },
  { id: 2006, projectCode: '10789012', name: 'Sales CRM Integration', description: 'Integrate new CRM system with existing sales tools', department: 'Sales', startDate: '2023-11-01', endDate: '2024-02-28', status: 'completed', assignedEmployeeIds: [1007] },
  { id: 2007, projectCode: '10890123', name: 'Cloud Migration', description: 'Migrate on-premise infrastructure to cloud services', department: 'Engineering', startDate: '2024-05-01', endDate: null, status: 'on-hold', assignedEmployeeIds: [1009, 1006] },
  { id: 2008, projectCode: '10901234', name: 'Brand Refresh', description: 'Update company branding and style guidelines', department: 'Marketing', startDate: '2024-06-01', endDate: '2024-09-30', status: 'active', assignedEmployeeIds: [1003, 1008] },
  { id: 2009, projectCode: '11012345', name: 'Performance Review System', description: 'Automated performance tracking and review system', department: 'HR', startDate: '2024-02-15', endDate: '2024-07-15', status: 'active', assignedEmployeeIds: [1010, 1004] },
  { id: 2010, projectCode: '11123456', name: 'API Gateway Implementation', description: 'Centralized API management and gateway service', department: 'Engineering', startDate: '2024-03-15', endDate: null, status: 'active', assignedEmployeeIds: [1001, 1009] }
]
