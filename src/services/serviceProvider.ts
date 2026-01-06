import { isMockMode } from '@/config';
import type { INoteService, ITodoService, IProjectService, IEmployeeService } from './interfaces';

import { mockNoteService } from './mock/mockNoteService';
import { mockTodoService } from './mock/mockTodoService';
import { mockProjectService } from './mock/mockProjectService';
import { mockEmployeeService } from './mock/mockEmployeeService';

import { apiNoteService } from './api/apiNoteService';
import { apiTodoService } from './api/apiTodoService';
import { apiProjectService } from './api/apiProjectService';
import { apiEmployeeService } from './api/apiEmployeeService';

export const noteService: INoteService = isMockMode() ? mockNoteService : apiNoteService;
export const todoService: ITodoService = isMockMode() ? mockTodoService : apiTodoService;
export const projectService: IProjectService = isMockMode() ? mockProjectService : apiProjectService;
export const employeeService: IEmployeeService = isMockMode() ? mockEmployeeService : apiEmployeeService;
