# ProjectProfile Component Setup Guide

This guide explains how to implement a Project Profile page with Todos and Notes functionality, including action links and router configuration.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Complete Files List](#complete-files-list)
4. [Setup Steps](#setup-steps)
5. [Core Concepts](#core-concepts)
6. [Implementing Todos](#implementing-todos)
7. [Implementing Notes](#implementing-notes)
8. [Feature Comparison](#feature-comparison)
9. [API Integration](#api-integration)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Technologies

| Technology | Minimum Version | Purpose |
|------------|-----------------|---------|
| Vue | 3.3+ | Framework (Composition API, typed emits) |
| TypeScript | 5.0+ | Type safety |
| Pinia | 2.1+ | State management |
| Vue Router | 4.2+ | Client-side routing |
| PrimeVue | 3.40+ | UI components |
| Tailwind CSS | 3.3+ | Styling |

### Install Dependencies

```bash
# Core dependencies
npm install vue@^3.3 pinia@^2.1 vue-router@^4.2 primevue@^3.40 primeicons axios

# Dev dependencies
npm install -D tailwindcss@^3.3 postcss autoprefixer typescript@^5.0
```

### Initialize Tailwind CSS

```bash
npx tailwindcss init -p
```

Update `tailwind.config.js`:

```javascript
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
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

Add Tailwind directives to your CSS:

```css
/* src/assets/main.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Quick Start

Follow these steps to get the Profile page working:

1. **Copy all files** from the [Complete Files List](#complete-files-list)
2. **Configure router** - Add route for `/project/:id`
3. **Register PrimeVue components** in `main.ts`
4. **Initialize stores** in `App.vue`
5. **Add global components** (`Toast`, `ConfirmDialog`) to `App.vue`

Minimal working example:

```typescript
// 1. Router: src/router/index.ts
const routes = [
  { path: '/', name: 'search', component: ProjectSearch },
  { path: '/project/:id', name: 'project-profile', component: ProjectProfile, props: true }
];

// 2. Navigate from search to profile:
router.push({ name: 'project-profile', params: { id: '123' } });

// 3. Read route param in profile:
const route = useRoute();
const projectId = computed(() => Number(route.params.id));
```

---

## Complete Files List

> **Important:** This is the authoritative list of all files needed. Copy these files maintaining the directory structure.

```
src/
├── pages/
│   └── ProjectProfile.vue              # Main profile page
│
├── components/
│   ├── StatusBadge.vue                 # Project status display
│   ├── ProjectTodoList.vue             # Todo list with actions
│   ├── ProjectNoteList.vue             # Note list with inline editing
│   └── TodoModal.vue                   # Create/edit/reassign todo modal
│
├── models/
│   ├── Project.ts                      # Project & ProjectStatus types
│   ├── Employee.ts                     # Employee & EmployeeStatus types
│   ├── Todo.ts                         # Todo & TodoAssignment types
│   ├── ProjectNote.ts                  # ProjectNote type
│   ├── SearchParams.ts                 # Search parameters type
│   └── index.ts                        # Model exports
│
├── stores/
│   ├── projectStore.ts                 # Project state & actions
│   ├── todoStore.ts                    # Todo CRUD operations
│   ├── noteStore.ts                    # Note CRUD operations
│   └── employeeStore.ts                # Employee data management
│
├── services/
│   ├── projectService.ts               # Project API/mock service
│   ├── todoService.ts                  # Todo API/mock service
│   ├── noteService.ts                  # Note API/mock service
│   ├── httpClient.ts                   # Axios wrapper
│   └── index.ts                        # Service exports
│
├── composables/
│   ├── useProjectSearch.ts             # Search logic (if using search)
│   └── usePersistedColumns.ts          # Column persistence (optional)
│
├── utils/
│   ├── statusUtils.ts                  # Status formatting/colors
│   ├── dateFormatters.ts               # formatDate, formatDateTime
│   ├── arrayUtils.ts                   # updateItemById, removeItemById
│   └── mockUtils.ts                    # simulateDelay, deepClone
│
├── mocks/
│   ├── mock_projects.ts                # Sample project data
│   ├── mock_employees.ts               # Sample employee data
│   ├── mock_todos.ts                   # Sample todo data
│   ├── mock_notes.ts                   # Sample note data
│   └── index.ts                        # Mock exports
│
├── config/
│   ├── dataSource.ts                   # Mock/API mode toggle
│   └── index.ts                        # Config exports
│
└── router/
    └── index.ts                        # Route definitions
```

---

## Setup Steps

### Step 1: Configure Router

Create `src/router/index.ts`:

```typescript
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';
import ProjectSearch from '@/pages/ProjectSearch.vue';
import ProjectProfile from '@/pages/ProjectProfile.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'search',
    component: ProjectSearch
  },
  {
    path: '/project/:id',
    name: 'project-profile',
    component: ProjectProfile,
    props: true  // Pass route.params as props
  },
  {
    // Optional: 404 handler
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
```

**Key Router Concepts:**

| Property | Description |
|----------|-------------|
| `path: '/project/:id'` | Dynamic route with `id` parameter |
| `name: 'project-profile'` | Named route for programmatic navigation |
| `props: true` | Passes `route.params` as component props |

### Step 2: Configure main.ts

```typescript
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';

// PrimeVue Components
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import Dialog from 'primevue/dialog';
import Textarea from 'primevue/textarea';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';

// Styles
import 'primevue/resources/themes/lara-light-blue/theme.css';
import 'primeicons/primeicons.css';
import './assets/main.css';

import App from './App.vue';
import router from './router';

const app = createApp(App);

// Plugins
app.use(createPinia());
app.use(router);
app.use(PrimeVue);
app.use(ConfirmationService);
app.use(ToastService);

// Global Components
app.component('Button', Button);
app.component('Checkbox', Checkbox);
app.component('Dialog', Dialog);
app.component('Textarea', Textarea);
app.component('InputText', InputText);
app.component('Dropdown', Dropdown);
app.component('Calendar', Calendar);
app.component('ConfirmDialog', ConfirmDialog);
app.component('Toast', Toast);

// Directives
app.directive('tooltip', Tooltip);

app.mount('#app');
```

### Step 3: Configure App.vue

```vue
<script setup lang="ts">
import { onMounted } from 'vue';
import { useProjectStore } from '@/stores/projectStore';
import { useTodoStore } from '@/stores/todoStore';

const projectStore = useProjectStore();
const todoStore = useTodoStore();

onMounted(async () => {
  // Initialize stores on app load
  await Promise.all([
    projectStore.initialize(),
    todoStore.initialize()
  ]);
  // Note: noteStore loads per-project, not globally
});
</script>

<template>
  <!-- Global components required for confirmations and notifications -->
  <Toast position="top-right" />
  <ConfirmDialog />

  <!-- Router outlet -->
  <RouterView />
</template>
```

### Step 4: Configure tsconfig.json

Ensure path aliases are configured:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "types": ["vite/client"]
  },
  "include": ["src/**/*.ts", "src/**/*.vue"]
}
```

---

## Core Concepts

### Action Links: Two Patterns

This application uses two patterns for handling user actions:

#### Pattern 1: Router-Based Navigation

Used when clicking should navigate to a different page.

```vue
<template>
  <!-- In search results table -->
  <Button
    icon="pi pi-eye"
    @click="viewProject(data.id)"
    v-tooltip.top="'View Project'"
  />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const viewProject = (id: number) => {
  // Navigate to profile page with project ID
  router.push({
    name: 'project-profile',
    params: { id: String(id) }
  });
};
</script>
```

#### Pattern 2: Event-Based Actions

Used for CRUD operations that don't require navigation.

```vue
<!-- Child component emits events -->
<template>
  <Button icon="pi pi-pencil" @click="$emit('edit', todo)" />
  <Button icon="pi pi-trash" @click="$emit('delete', todo.id)" />
</template>

<script setup lang="ts">
// Typed emit syntax: 'eventName': [payloadType]
// The array defines the event payload types
defineEmits<{
  'edit': [todo: Todo];       // Emits todo object
  'delete': [todoId: number]; // Emits just the ID
}>();
</script>
```

```vue
<!-- Parent component handles events -->
<template>
  <ProjectTodoList
    :todos="todos"
    @edit="openEditModal"
    @delete="confirmDelete"
  />
</template>
```

### Navigation Flow

```
┌─────────────────────────────────────────────────────────────┐
│                         App.vue                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                    <RouterView />                      │  │
│  │                                                        │  │
│  │   Route: /                    Route: /project/:id      │  │
│  │   ┌──────────────────┐       ┌──────────────────┐     │  │
│  │   │ ProjectSearch    │       │ ProjectProfile   │     │  │
│  │   │                  │       │                  │     │  │
│  │   │ [View] ──────────┼──────►│ [Back] ─────────┼──┐  │  │
│  │   │                  │       │                  │  │  │  │
│  │   └──────────────────┘       └──────────────────┘  │  │  │
│  │          ▲                                          │  │  │
│  │          └──────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Navigation Steps:**

1. User clicks "View" → `router.push({ name: 'project-profile', params: { id: '123' } })`
2. URL changes to `/project/123`
3. Router matches route, loads `ProjectProfile.vue`
4. Component reads param: `const projectId = computed(() => Number(route.params.id))`
5. Component fetches data: `store.fetchProjectById(projectId.value)`
6. User clicks "Back" → `router.push({ name: 'search' })`

### ProjectProfile Component Structure

```typescript
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { useProjectStore } from '@/stores/projectStore';
import { useTodoStore } from '@/stores/todoStore';
import { useNoteStore } from '@/stores/noteStore';

// Router
const router = useRouter();  // For navigation
const route = useRoute();    // For reading params

// Stores
const projectStore = useProjectStore();
const todoStore = useTodoStore();
const noteStore = useNoteStore();

// PrimeVue services
const confirm = useConfirm();
const toast = useToast();

// Reactive store state
const { currentProject: project, isLoadingProject: isLoading } = storeToRefs(projectStore);

// Get project ID from route (with validation)
const projectId = computed(() => {
  const id = Number(route.params.id);
  return isNaN(id) ? null : id;
});

// Computed data from stores
const todos = computed(() =>
  projectId.value ? todoStore.getProjectTodos(projectId.value) : []
);

const notes = computed(() =>
  projectId.value ? noteStore.getProjectNotes(projectId.value) : []
);

// Load data on mount
const loadProject = async () => {
  if (projectId.value !== null) {
    await projectStore.fetchProjectById(projectId.value);
  }
};

onMounted(loadProject);

// Reload when navigating between profiles (e.g., /project/1 → /project/2)
watch(() => route.params.id, loadProject);

// Navigation
const goBack = () => router.push({ name: 'search' });
```

---

## Implementing Todos

> **Files needed:** See [Complete Files List](#complete-files-list) - specifically `ProjectTodoList.vue`, `TodoModal.vue`, `Todo.ts`, `todoStore.ts`, `todoService.ts`, `mock_todos.ts`

Todos are tasks assigned to team members with support for create, edit, reassign, complete, and delete operations.

### Todo Data Model

```typescript
// src/models/Todo.ts

export interface TodoAssignment {
  id: number;
  assignedToId: number;
  assignedToName: string;
  assignedById: number;
  assignedByName: string;
  assignedAt: string;  // ISO date string
}

export interface Todo {
  id: number;
  projectId: number;
  title: string;
  description: string;
  dueDate: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  createdById: number;
  createdByName: string;
  currentAssigneeId: number;
  currentAssigneeName: string;
  assignmentHistory: TodoAssignment[];  // Tracks all reassignments
}
```

### Todo Store with Error Handling

```typescript
// src/stores/todoStore.ts

import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { Todo } from '@/models';
import { todoService } from '@/services';
import { updateItemById, removeItemById } from '@/utils/arrayUtils';

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<Todo[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const getProjectTodos = (projectId: number): Todo[] =>
    todos.value.filter(todo => todo.projectId === projectId);

  const initialize = async (): Promise<void> => {
    isLoading.value = true;
    error.value = null;
    try {
      todos.value = await todoService.getAll();
    } catch (e) {
      error.value = 'Failed to load todos';
      console.error('Todo initialization error:', e);
    } finally {
      isLoading.value = false;
    }
  };

  const addTodo = async (
    projectId: number,
    title: string,
    description: string,
    dueDate: string | null,
    assigneeId: number,
    creatorId: number
  ): Promise<Todo | null> => {
    error.value = null;
    try {
      const todo = await todoService.create(
        projectId, title, description, dueDate, assigneeId, creatorId
      );
      todos.value.push(todo);
      return todo;
    } catch (e) {
      error.value = 'Failed to create todo';
      console.error('Add todo error:', e);
      return null;
    }
  };

  const updateTodo = async (
    todoId: number,
    updates: { title?: string; description?: string; dueDate?: string | null }
  ): Promise<boolean> => {
    const todo = todos.value.find(t => t.id === todoId);
    if (todo?.completed) {
      error.value = 'Cannot edit completed todos';
      return false;
    }

    error.value = null;
    try {
      const updatedTodo = await todoService.update(todoId, updates);
      return updateItemById(todos.value, todoId, updatedTodo);
    } catch (e) {
      error.value = 'Failed to update todo';
      console.error('Update todo error:', e);
      return false;
    }
  };

  const reassignTodo = async (
    todoId: number,
    newAssigneeId: number,
    reassignedById: number
  ): Promise<boolean> => {
    const todo = todos.value.find(t => t.id === todoId);
    if (todo?.completed) {
      error.value = 'Cannot reassign completed todos';
      return false;
    }

    error.value = null;
    try {
      const updatedTodo = await todoService.reassign(todoId, newAssigneeId, reassignedById);
      return updateItemById(todos.value, todoId, updatedTodo);
    } catch (e) {
      error.value = 'Failed to reassign todo';
      console.error('Reassign todo error:', e);
      return false;
    }
  };

  const toggleTodoComplete = async (todoId: number): Promise<boolean> => {
    error.value = null;
    try {
      const updatedTodo = await todoService.toggleComplete(todoId);
      return updateItemById(todos.value, todoId, updatedTodo);
    } catch (e) {
      error.value = 'Failed to toggle todo';
      console.error('Toggle todo error:', e);
      return false;
    }
  };

  const deleteTodo = async (todoId: number): Promise<boolean> => {
    error.value = null;
    try {
      const success = await todoService.delete(todoId);
      if (success) {
        removeItemById(todos.value, todoId);
      }
      return success;
    } catch (e) {
      error.value = 'Failed to delete todo';
      console.error('Delete todo error:', e);
      return false;
    }
  };

  return {
    todos,
    isLoading,
    error,
    getProjectTodos,
    initialize,
    addTodo,
    updateTodo,
    reassignTodo,
    toggleTodoComplete,
    deleteTodo
  };
});
```

### Using Todos in ProjectProfile

```vue
<template>
  <ProjectTodoList
    :todos="todos"
    @create="openTodoModal('create')"
    @edit="(todo) => openTodoModal('edit', todo)"
    @reassign="(todo) => openTodoModal('reassign', todo)"
    @delete="confirmDeleteTodo"
    @toggle="todoStore.toggleTodoComplete"
  />

  <TodoModal
    v-model:visible="modalState.visible"
    :todo="modalState.todo"
    :project-id="projectId ?? 0"
    :is-reassigning="modalState.mode === 'reassign'"
    @saved="handleTodoSaved"
  />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { useTodoStore } from '@/stores/todoStore';
import type { Todo } from '@/models';
import ProjectTodoList from '@/components/ProjectTodoList.vue';
import TodoModal from '@/components/TodoModal.vue';

const todoStore = useTodoStore();
const confirm = useConfirm();
const toast = useToast();

type ModalMode = 'create' | 'edit' | 'reassign';

const modalState = ref<{ visible: boolean; todo: Todo | null; mode: ModalMode }>({
  visible: false,
  todo: null,
  mode: 'create'
});

const todos = computed(() => todoStore.getProjectTodos(projectId));

const openTodoModal = (mode: ModalMode, todo: Todo | null = null) => {
  modalState.value = { visible: true, todo, mode };
};

const confirmDeleteTodo = (todoId: number) => {
  confirm.require({
    message: 'Are you sure you want to delete this todo? This action cannot be undone.',
    header: 'Delete Todo',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const success = await todoStore.deleteTodo(todoId);
      if (success) {
        toast.add({ severity: 'success', summary: 'Deleted', detail: 'Todo deleted', life: 3000 });
      }
    }
  });
};

const handleTodoSaved = (newAssigneeName?: string) => {
  modalState.value.visible = false;
  if (newAssigneeName) {
    toast.add({
      severity: 'success',
      summary: 'Reassigned',
      detail: `Todo reassigned to ${newAssigneeName}`,
      life: 3000
    });
  }
};
</script>
```

---

## Implementing Notes

> **Files needed:** See [Complete Files List](#complete-files-list) - specifically `ProjectNoteList.vue`, `ProjectNote.ts`, `noteStore.ts`, `noteService.ts`, `mock_notes.ts`

Notes are simple text entries for project documentation with inline editing.

### Note Data Model

```typescript
// src/models/ProjectNote.ts

export interface ProjectNote {
  id: number;
  projectId: number;
  content: string;
  createdAt: string;  // ISO date string
  updatedAt: string;  // ISO date string
}
```

### Note Store with Error Handling

```typescript
// src/stores/noteStore.ts

import { reactive, ref } from 'vue';
import { defineStore } from 'pinia';
import type { ProjectNote } from '@/models';
import { noteService } from '@/services';
import { updateItemById, removeItemById } from '@/utils/arrayUtils';

export const useNoteStore = defineStore('note', () => {
  // Notes stored by projectId for efficient lookup
  const notes = reactive<Record<number, ProjectNote[]>>({});
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const getProjectNotes = (projectId: number): ProjectNote[] =>
    notes[projectId] || [];

  const getNoteCount = (projectId: number): number =>
    notes[projectId]?.length || 0;

  const loadProjectNotes = async (projectId: number): Promise<void> => {
    isLoading.value = true;
    error.value = null;
    try {
      notes[projectId] = await noteService.getByProjectId(projectId);
    } catch (e) {
      error.value = 'Failed to load notes';
      console.error('Load notes error:', e);
    } finally {
      isLoading.value = false;
    }
  };

  const addNote = async (projectId: number, content: string): Promise<ProjectNote | null> => {
    error.value = null;
    try {
      const note = await noteService.create(projectId, content);
      if (!notes[projectId]) {
        notes[projectId] = [];
      }
      notes[projectId].unshift(note);  // Newest first
      return note;
    } catch (e) {
      error.value = 'Failed to create note';
      console.error('Add note error:', e);
      return null;
    }
  };

  const updateNote = async (
    projectId: number,
    noteId: number,
    content: string
  ): Promise<boolean> => {
    error.value = null;
    try {
      const updatedNote = await noteService.update(projectId, noteId, content);
      if (notes[projectId]) {
        return updateItemById(notes[projectId], noteId, updatedNote);
      }
      return false;
    } catch (e) {
      error.value = 'Failed to update note';
      console.error('Update note error:', e);
      return false;
    }
  };

  const deleteNote = async (projectId: number, noteId: number): Promise<boolean> => {
    error.value = null;
    try {
      const success = await noteService.delete(projectId, noteId);
      if (success && notes[projectId]) {
        removeItemById(notes[projectId], noteId);
      }
      return success;
    } catch (e) {
      error.value = 'Failed to delete note';
      console.error('Delete note error:', e);
      return false;
    }
  };

  return {
    notes,
    isLoading,
    error,
    getProjectNotes,
    getNoteCount,
    loadProjectNotes,
    addNote,
    updateNote,
    deleteNote
  };
});
```

### Using Notes in ProjectProfile

```vue
<template>
  <ProjectNoteList
    :notes="notes"
    @add="handleAddNote"
    @edit="handleEditNote"
    @delete="confirmDeleteNote"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { useNoteStore } from '@/stores/noteStore';
import ProjectNoteList from '@/components/ProjectNoteList.vue';

const noteStore = useNoteStore();
const confirm = useConfirm();
const toast = useToast();

const notes = computed(() => noteStore.getProjectNotes(projectId));

const handleAddNote = async (content: string) => {
  const note = await noteStore.addNote(projectId, content);
  if (note) {
    toast.add({ severity: 'success', summary: 'Added', detail: 'Note added', life: 3000 });
  }
};

const handleEditNote = async (noteId: number, content: string) => {
  const success = await noteStore.updateNote(projectId, noteId, content);
  if (success) {
    toast.add({ severity: 'success', summary: 'Updated', detail: 'Note updated', life: 3000 });
  }
};

const confirmDeleteNote = (noteId: number) => {
  confirm.require({
    message: 'Are you sure you want to delete this note? This action cannot be undone.',
    header: 'Delete Note',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      const success = await noteStore.deleteNote(projectId, noteId);
      if (success) {
        toast.add({ severity: 'success', summary: 'Deleted', detail: 'Note deleted', life: 3000 });
      }
    }
  });
};
</script>
```

---

## Feature Comparison

| Feature | Todos | Notes |
|---------|-------|-------|
| **Purpose** | Task tracking with assignments | Free-form documentation |
| **Data Structure** | Complex (assignee, due date, history) | Simple (content only) |
| **Editing UI** | Modal dialog | Inline editing |
| **Assignment** | Required (tracks history) | Not applicable |
| **Completion** | Checkbox toggle | Not applicable |
| **Store Pattern** | Single `ref<Todo[]>` | `reactive<Record<number, Note[]>>` |
| **Initialization** | Global (on app load) | Per-project (on demand) |

---

## API Integration

When switching from mock to API mode, update `src/config/dataSource.ts`:

```typescript
export const DATA_SOURCE: 'mock' | 'api' = 'api';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
```

### Required Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/projects/:id` | Get project by ID | - | `Project` |
| GET | `/projects/:id/employees` | Get team members | - | `Employee[]` |
| GET | `/todos` | Get all todos | - | `Todo[]` |
| GET | `/projects/:id/todos` | Get project todos | - | `Todo[]` |
| POST | `/projects/:id/todos` | Create todo | `{ title, description, dueDate, assigneeId }` | `Todo` |
| PUT | `/todos/:id` | Update todo | `{ title?, description?, dueDate? }` | `Todo` |
| PUT | `/todos/:id/reassign` | Reassign todo | `{ assigneeId, reassignedById }` | `Todo` |
| PUT | `/todos/:id/toggle` | Toggle complete | - | `Todo` |
| DELETE | `/todos/:id` | Delete todo | - | `{ success: boolean }` |
| GET | `/projects/:id/notes` | Get project notes | - | `ProjectNote[]` |
| POST | `/projects/:id/notes` | Create note | `{ content }` | `ProjectNote` |
| PUT | `/notes/:id` | Update note | `{ content }` | `ProjectNote` |
| DELETE | `/notes/:id` | Delete note | - | `{ success: boolean }` |

---

## Troubleshooting

### Route params are undefined

**Problem:** `route.params.id` returns `undefined`

**Solutions:**
1. Ensure route has `:id` in path: `path: '/project/:id'`
2. Add `props: true` to route config
3. Use `useRoute()` inside `<script setup>`

### Page doesn't update when navigating between profiles

**Problem:** Going from `/project/1` to `/project/2` doesn't reload data

**Solution:** Watch the route param:
```typescript
watch(() => route.params.id, () => {
  loadProject();
});
```

### Confirm dialog not showing

**Problem:** `confirm.require()` does nothing

**Solutions:**
1. Add `<ConfirmDialog />` to `App.vue` template
2. Register `ConfirmationService` in `main.ts`: `app.use(ConfirmationService)`
3. Import correctly: `import { useConfirm } from 'primevue/useconfirm'`

### Toast notifications not appearing

**Problem:** `toast.add()` does nothing

**Solutions:**
1. Add `<Toast />` to `App.vue` template
2. Register `ToastService` in `main.ts`: `app.use(ToastService)`
3. Import correctly: `import { useToast } from 'primevue/usetoast'`

### Module not found errors

**Problem:** `Cannot find module '@/stores/...'`

**Solutions:**
1. Check `tsconfig.json` has path aliases:
   ```json
   "paths": { "@/*": ["src/*"] }
   ```
2. Check `vite.config.ts` has matching alias:
   ```typescript
   resolve: {
     alias: { '@': path.resolve(__dirname, 'src') }
   }
   ```

### PrimeVue components not rendering

**Problem:** Components show as unknown elements

**Solutions:**
1. Register components globally in `main.ts`
2. Or import locally in each component:
   ```typescript
   import Button from 'primevue/button';
   ```

### Tailwind classes not applying

**Problem:** Tailwind utility classes have no effect

**Solutions:**
1. Run `npx tailwindcss init -p`
2. Check `tailwind.config.js` has correct content paths
3. Import Tailwind in your CSS:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
4. Verify CSS file is imported in `main.ts`

### TypeScript errors with typed emits

**Problem:** `defineEmits` syntax errors

**Solution:** Ensure Vue 3.3+ and correct syntax:
```typescript
// Correct syntax for typed emits
defineEmits<{
  'eventName': [payload: PayloadType];  // Array syntax for payload
  'noPayload': [];                       // Empty array for no payload
}>();
```

---

## Learning Resources

- [Vue Router Documentation](https://router.vuejs.org/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [PrimeVue Components](https://primevue.org/)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
