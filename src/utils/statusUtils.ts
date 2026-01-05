import type { ProjectStatus } from '@/models';

interface StatusConfig {
  label: string;
  bgClass: string;
  iconClass: string;
}

const STATUS_CONFIG: Record<ProjectStatus | 'default', StatusConfig> = {
  active: {
    label: 'Active',
    bgClass: 'bg-green-100 text-green-800',
    iconClass: 'text-green-500'
  },
  'on-hold': {
    label: 'On Hold',
    bgClass: 'bg-yellow-100 text-yellow-800',
    iconClass: 'text-yellow-500'
  },
  completed: {
    label: 'Completed',
    bgClass: 'bg-blue-100 text-blue-800',
    iconClass: 'text-blue-500'
  },
  default: {
    label: '',
    bgClass: 'bg-gray-100 text-gray-800',
    iconClass: 'text-gray-500'
  }
};

export const getStatusConfig = (status: string): StatusConfig =>
  STATUS_CONFIG[status as ProjectStatus] ?? STATUS_CONFIG.default;

export const getStatusClass = (status: string): string =>
  getStatusConfig(status).bgClass;

export const getStatusIconClass = (status: string): string =>
  getStatusConfig(status).iconClass;

export const formatStatus = (status: string): string =>
  getStatusConfig(status).label || status;

export const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'On Hold', value: 'on-hold' },
  { label: 'Completed', value: 'completed' }
];
