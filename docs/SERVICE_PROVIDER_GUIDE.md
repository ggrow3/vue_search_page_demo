# Service Provider & Mock Configuration Guide

This guide explains how the service provider works and how to configure mock vs API mode.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Your Application                          │
│                              │                                   │
│                    import { projectService }                     │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   services/index.ts                      │    │
│  │         (public exports - what you import)               │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │               services/serviceProvider.ts                │    │
│  │                                                          │    │
│  │   isMockMode() ──► checks URL query string first         │    │
│  │                    then falls back to DATA_SOURCE        │    │
│  │                              │                           │    │
│  │              ┌───────────────┴───────────────┐           │    │
│  │              ▼                               ▼           │    │
│  │     ┌──────────────┐                ┌──────────────┐     │    │
│  │     │  Mock Mode   │                │  API Mode    │     │    │
│  │     │  ?mock=true  │                │  ?api=true   │     │    │
│  │     └──────────────┘                └──────────────┘     │    │
│  └─────────────────────────────────────────────────────────┘    │
│              │                                   │               │
│              ▼                                   ▼               │
│  ┌────────────────────┐              ┌────────────────────┐     │
│  │   services/mock/   │              │   services/api/    │     │
│  │                    │              │                    │     │
│  │ • In-memory data   │              │ • HTTP requests    │     │
│  │ • Simulated delay  │              │ • Real backend     │     │
│  │ • No backend needed│              │ • httpClient.ts    │     │
│  └────────────────────┘              └────────────────────┘     │
│              │                                   │               │
│              ▼                                   ▼               │
│  ┌────────────────────┐              ┌────────────────────┐     │
│  │    src/mocks/      │              │   Your Backend     │     │
│  │   (mock data)      │              │   (REST API)       │     │
│  └────────────────────┘              └────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
```

## Configuration

### Method 1: URL Query String (Runtime)

Override the mode at runtime without code changes:

| URL | Mode | Description |
|-----|------|-------------|
| `http://localhost:5173/?mock` | Mock | Enable mock mode |
| `http://localhost:5173/?mock=true` | Mock | Enable mock mode |
| `http://localhost:5173/?mock=false` | API | Disable mock mode |
| `http://localhost:5173/?api` | API | Enable API mode |
| `http://localhost:5173/` | Default | Uses config file setting |

**Use cases:**
- Testing without backend: `?mock`
- Testing with backend: `?api`
- Demos and presentations: `?mock`
- Debugging API issues: switch between `?mock` and `?api`

### Method 2: Config File (Default)

Set the default mode in `src/config/dataSource.ts`:

```typescript
// Default is 'api' - app will use real backend
export const DATA_SOURCE = 'api' as DataSourceType;

// Change to 'mock' if you want mock mode by default
export const DATA_SOURCE = 'mock' as DataSourceType;
```

### Priority Order

1. URL query string (`?mock` or `?api`) - **highest priority**
2. Config file `DATA_SOURCE` - **fallback**

## How the Service Provider Works

### File: `src/services/serviceProvider.ts`

```typescript
import { isMockMode } from '@/config';
import type { IProjectService, ITodoService } from './interfaces';

// Import both implementations
import { mockProjectService } from './mock/mockProjectService';
import { apiProjectService } from './api/apiProjectService';
import { mockTodoService } from './mock/mockTodoService';
import { apiTodoService } from './api/apiTodoService';

// Inject the correct implementation based on mode
export const projectService: IProjectService = isMockMode()
  ? mockProjectService
  : apiProjectService;

export const todoService: ITodoService = isMockMode()
  ? mockTodoService
  : apiTodoService;
```

### File: `src/config/dataSource.ts`

```typescript
export type DataSourceType = 'mock' | 'api';

// Default mode
export const DATA_SOURCE = 'api' as DataSourceType;

// API base URL for API mode
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Check URL query string for runtime override
const getQueryStringMode = (): DataSourceType | null => {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);

  if (params.has('api')) return 'api';
  if (params.has('mock')) {
    const value = params.get('mock');
    return value === 'false' ? 'api' : 'mock';
  }
  return null;
};

// Exported functions - query string overrides config
export const isMockMode = (): boolean => (getQueryStringMode() ?? DATA_SOURCE) === 'mock';
export const isApiMode = (): boolean => (getQueryStringMode() ?? DATA_SOURCE) === 'api';
```

## Creating Mock Implementations

### Structure

```
src/services/mock/
├── mockProjectService.ts
├── mockTodoService.ts
├── mockEmployeeService.ts
└── mockNoteService.ts
```

### Template

```typescript
// src/services/mock/mockExampleService.ts
import type { Example } from '@/models';
import type { IExampleService } from '../interfaces';
import { EXAMPLES_DB } from '@/mocks';
import { delay, cloneArray } from '@/utils/mockUtils';

// Mutable copy of mock data
let mockExamples = cloneArray(EXAMPLES_DB);

export const mockExampleService: IExampleService = {
  // READ - return cloned data
  async getAll(): Promise<Example[]> {
    await delay();                    // Simulate network latency
    return [...mockExamples];         // Return copy, not reference
  },

  async getById(id: number): Promise<Example | null> {
    await delay();
    return mockExamples.find(e => e.id === id) || null;
  },

  // CREATE - add to mock array
  async create(data: CreateExampleDto): Promise<Example> {
    await delay();
    const example: Example = {
      id: Date.now(),                 // Generate unique ID
      ...data,
      createdAt: new Date().toISOString()
    };
    mockExamples.push(example);
    return example;
  },

  // UPDATE - modify in place
  async update(id: number, updates: Partial<Example>): Promise<Example | null> {
    await delay();
    const example = mockExamples.find(e => e.id === id);
    if (example) {
      Object.assign(example, updates);
      return { ...example };          // Return copy
    }
    return null;
  },

  // DELETE - remove from array
  async delete(id: number): Promise<boolean> {
    await delay();
    const index = mockExamples.findIndex(e => e.id === id);
    if (index !== -1) {
      mockExamples.splice(index, 1);
      return true;
    }
    return false;
  },

  // RESET - restore initial data
  resetMockData(): void {
    mockExamples = cloneArray(EXAMPLES_DB);
  }
};
```

### Mock Utilities

File: `src/utils/mockUtils.ts`

```typescript
// Simulate network delay
export const delay = (ms = 300): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

// Deep clone an array
export function cloneArray<T>(arr: T[]): T[] {
  return arr.map(item => structuredClone(item));
}

// Deep clone a grouped record (e.g., notes by projectId)
export function cloneGroupedArray<T>(record: Record<number, T[]>): Record<number, T[]> {
  const cloned: Record<number, T[]> = {};
  for (const [key, value] of Object.entries(record)) {
    cloned[Number(key)] = cloneArray(value);
  }
  return cloned;
}
```

## Creating Mock Data

### Structure

```
src/mocks/
├── mock_projects.ts
├── mock_employees.ts
├── mock_todos.ts
├── mock_notes.ts
└── index.ts
```

### Template

```typescript
// src/mocks/mock_examples.ts
import type { Example } from '@/models';

export const EXAMPLES_DB: Example[] = [
  {
    id: 1,
    name: 'Example One',
    description: 'First example item',
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 2,
    name: 'Example Two',
    description: 'Second example item',
    status: 'inactive',
    createdAt: '2024-02-20T14:30:00Z'
  }
];
```

### Export from Index

```typescript
// src/mocks/index.ts
export { PROJECTS_DB } from './mock_projects';
export { EMPLOYEES_DB } from './mock_employees';
export { TODOS_DB } from './mock_todos';
export { NOTES_DB } from './mock_notes';
export { EXAMPLES_DB } from './mock_examples';
```

## Creating API Implementations

### Structure

```
src/services/api/
├── apiProjectService.ts
├── apiTodoService.ts
├── apiEmployeeService.ts
└── apiNoteService.ts
```

### Template

```typescript
// src/services/api/apiExampleService.ts
import type { Example } from '@/models';
import type { IExampleService } from '../interfaces';
import { httpClient } from '../httpClient';

export const apiExampleService: IExampleService = {
  async getAll(): Promise<Example[]> {
    return httpClient.get<Example[]>('/examples');
  },

  async getById(id: number): Promise<Example | null> {
    try {
      return await httpClient.get<Example>(`/examples/${id}`);
    } catch {
      return null;
    }
  },

  async create(data: CreateExampleDto): Promise<Example> {
    return httpClient.post<Example>('/examples', data);
  },

  async update(id: number, updates: Partial<Example>): Promise<Example | null> {
    return httpClient.patch<Example>(`/examples/${id}`, updates);
  },

  async delete(id: number): Promise<boolean> {
    await httpClient.delete(`/examples/${id}`);
    return true;
  }
};
```

### HTTP Client

File: `src/services/httpClient.ts`

```typescript
import axios from 'axios';
import { API_BASE_URL } from '@/config';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000
});

export const httpClient = {
  get<T>(endpoint: string): Promise<T> {
    return axiosInstance.get<T>(endpoint).then(res => res.data);
  },
  post<T>(endpoint: string, data?: unknown): Promise<T> {
    return axiosInstance.post<T>(endpoint, data).then(res => res.data);
  },
  patch<T>(endpoint: string, data?: unknown): Promise<T> {
    return axiosInstance.patch<T>(endpoint, data).then(res => res.data);
  },
  delete<T>(endpoint: string): Promise<T> {
    return axiosInstance.delete<T>(endpoint).then(res => res.data);
  }
};
```

## Adding a New Service

### Quick Checklist

1. **Interface** - `src/services/interfaces/INewService.ts`
2. **Mock data** - `src/mocks/mock_new.ts`
3. **Mock implementation** - `src/services/mock/mockNewService.ts`
4. **API implementation** - `src/services/api/apiNewService.ts`
5. **Register** - `src/services/serviceProvider.ts`
6. **Export** - `src/services/index.ts`

### Registration Example

```typescript
// src/services/serviceProvider.ts
import { isMockMode } from '@/config';

// Import interfaces
import type { INewService } from './interfaces';

// Import implementations
import { mockNewService } from './mock/mockNewService';
import { apiNewService } from './api/apiNewService';

// Register service - isMockMode() determines which to use
export const newService: INewService = isMockMode()
  ? mockNewService
  : apiNewService;
```

```typescript
// src/services/index.ts
export { newService } from './serviceProvider';
export type { INewService } from './interfaces';
```

## Usage in Components

```typescript
// In any Vue component or composable
import { projectService, todoService } from '@/services';

// These work the same in mock or API mode
const projects = await projectService.getAll();
const todos = await todoService.getByProjectId(1);

// Reset mock data (only affects mock mode)
projectService.resetMockData?.();
```

## Environment Variables

For API mode, configure the backend URL:

```bash
# .env.local
VITE_API_BASE_URL=http://localhost:3000/api

# .env.production
VITE_API_BASE_URL=https://api.yoursite.com
```

## Testing Tips

### Switch Modes for Testing

```typescript
// In tests, use URL params or mock the config
describe('ProjectService', () => {
  beforeEach(() => {
    // Reset mock data before each test
    projectService.resetMockData?.();
  });

  it('should return all projects', async () => {
    const projects = await projectService.getAll();
    expect(projects.length).toBeGreaterThan(0);
  });
});
```

### Manual Testing

1. Start app: `npm run dev`
2. Test mock mode: `http://localhost:5173/?mock`
3. Test API mode: `http://localhost:5173/?api`
4. Check network tab - mock mode has no requests, API mode shows XHR calls
