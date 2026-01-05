# ProjectSearch Component Setup Guide

This guide explains how to copy the ProjectSearch page component to another Vue 3 project.

## Prerequisites

Your target project must have:
- Vue 3 with Composition API
- TypeScript
- Pinia (state management)
- Vue Router
- PrimeVue (UI components)
- Tailwind CSS

## Required Dependencies

```bash
npm install pinia vue-router primevue primeicons axios
npm install -D tailwindcss postcss autoprefixer
```

## Files to Copy

Copy the following files maintaining the same directory structure:

### 1. Page
```
src/pages/
└── ProjectSearch.vue            # Main search page
```

### 2. Components
```
src/components/
├── StatusBadge.vue              # Status badge display
└── ProjectExpansionPanel.vue    # Expandable row content
```

### 3. Composables
```
src/composables/
├── useProjectSearch.ts          # Search logic wrapper
└── usePersistedColumns.ts       # Column selection with localStorage
```

### 4. Stores
```
src/stores/
├── projectStore.ts              # Project state management
├── todoStore.ts                 # Todo state management
└── employeeStore.ts             # Employee state management
```

### 5. Services
```
src/services/
├── projectService.ts            # Project & Employee API/mock service
├── todoService.ts               # Todo API/mock service
├── httpClient.ts                # Axios wrapper
└── index.ts                     # Service exports
```

### 6. Utilities
```
src/utils/
├── statusUtils.ts               # Status formatting/styling
├── dateFormatters.ts            # Date formatting helpers
├── arrayUtils.ts                # Array update helpers
└── mockUtils.ts                 # Mock delay/clone utilities
```

### 7. Models
```
src/models/
├── Project.ts                   # Project & ProjectStatus types
├── Employee.ts                  # Employee & EmployeeStatus types
├── Todo.ts                      # Todo & TodoAssignment types
├── SearchParams.ts              # Search params interface
└── index.ts                     # Model exports
```

### 8. Config
```
src/config/
├── dataSource.ts                # Mock/API toggle & helpers
└── index.ts                     # Config exports
```

### 9. Mock Data (Required for mock mode)
```
src/mocks/
├── mock_projects.ts             # Sample project data
├── mock_employees.ts            # Sample employee data
├── mock_todos.ts                # Sample todo data
└── index.ts                     # Mock exports
```

## Setup Steps

### Step 1: Copy Files

Copy all files from the sections above to your project.

### Step 2: Configure PrimeVue

In your `main.ts`:

```typescript
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import Tooltip from 'primevue/tooltip';

// PrimeVue components used by ProjectSearch
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import MultiSelect from 'primevue/multiselect';
import AutoComplete from 'primevue/autocomplete';
import Checkbox from 'primevue/checkbox';

// PrimeVue styles
import 'primevue/resources/themes/lara-light-blue/theme.css';
import 'primeicons/primeicons.css';

const app = createApp(App);

app.use(createPinia());
app.use(PrimeVue);

// Register components globally
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('Button', Button);
app.component('InputText', InputText);
app.component('Dropdown', Dropdown);
app.component('Calendar', Calendar);
app.component('MultiSelect', MultiSelect);
app.component('AutoComplete', AutoComplete);
app.component('Checkbox', Checkbox);

app.directive('tooltip', Tooltip);

app.mount('#app');
```

### Step 3: Configure Router

Add the route in your router config:

```typescript
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'search',
      component: () => import('@/pages/ProjectSearch.vue')
    }
  ]
});

export default router;
```

### Step 4: Initialize Stores

In your `App.vue`:

```vue
<script setup lang="ts">
import { onMounted } from 'vue';
import { useProjectStore } from '@/stores/projectStore';
import { useTodoStore } from '@/stores/todoStore';

const projectStore = useProjectStore();
const todoStore = useTodoStore();

onMounted(async () => {
  await Promise.all([
    projectStore.initialize(),
    todoStore.initialize()
  ]);
});
</script>
```

### Step 5: Configure Tailwind

Ensure your `tailwind.config.js` includes:

```javascript
module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          500: '#3b82f6',
          800: '#1e40af'
        }
      }
    }
  }
};
```

### Step 6: Configure Data Source

Edit `src/config/dataSource.ts` to toggle between mock and API modes:

```typescript
// Set to 'mock' for development, 'api' for production
export const DATA_SOURCE: 'mock' | 'api' = 'mock';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
```

## API Integration

When switching from mock to API mode, implement these endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/projects` | Get all projects |
| GET | `/projects/:id` | Get project by ID |
| GET | `/projects/search` | Search projects with query params |
| GET | `/employees` | Get all employees |
| GET | `/projects/:id/employees` | Get project employees |
| GET | `/todos` | Get all todos |
| GET | `/projects/:id/todos` | Get project todos |

## File Dependency Graph

```
ProjectSearch.vue
├── vue (ref, computed, watch)
├── vue-router (useRouter)
├── useProjectSearch.ts
│   ├── pinia (storeToRefs)
│   ├── projectStore.ts
│   └── dateFormatters.ts
├── usePersistedColumns.ts
├── projectStore.ts
│   ├── pinia (defineStore)
│   ├── employeeStore.ts
│   ├── projectService.ts
│   │   ├── httpClient.ts (axios)
│   │   ├── config (isMockMode)
│   │   ├── mocks (PROJECTS_DB, EMPLOYEES_DB)
│   │   └── mockUtils.ts
│   └── models (Project, SearchParams)
├── todoStore.ts
│   ├── pinia (defineStore)
│   ├── employeeStore.ts
│   ├── todoService.ts
│   │   ├── httpClient.ts (axios)
│   │   ├── config (isMockMode)
│   │   ├── mocks (TODOS_DB)
│   │   ├── projectService.ts (employeeService)
│   │   └── mockUtils.ts
│   ├── arrayUtils.ts
│   └── models (Todo)
├── statusUtils.ts
│   └── models (ProjectStatus)
├── StatusBadge.vue
│   └── statusUtils.ts
└── ProjectExpansionPanel.vue
    ├── dateFormatters.ts
    └── models (Project, Employee, Todo)
```

## Customization

### Modify Search Fields

Edit the form in `ProjectSearch.vue` template section and update `SearchParams` interface.

### Modify Table Columns

Edit `columnOptions` array in `ProjectSearch.vue`:

```typescript
const columnOptions = [
  { field: 'projectCode', header: 'Project ID', icon: 'pi pi-hashtag' },
  // Add/remove columns as needed
];
```

### Modify Status Options

Edit `src/utils/statusUtils.ts`:

```typescript
const STATUS_CONFIG = {
  active: { label: 'Active', bgClass: '...', iconClass: '...' },
  // Add custom statuses
};
```

### Modify Expansion Panel

Edit `ProjectExpansionPanel.vue` to customize the expanded row content.

## Troubleshooting

### PrimeVue components not rendering
Ensure components are registered globally in `main.ts` or imported locally in the component.

### TypeScript path aliases not working
Check `tsconfig.json` has path aliases configured:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### Styles not applying
1. Verify Tailwind CSS is configured correctly
2. Check PrimeVue theme is imported
3. Ensure `primeicons` is installed and imported

### Axios errors in mock mode
Mock mode doesn't make real HTTP requests, but `httpClient.ts` still requires axios to be installed for API mode fallback.
