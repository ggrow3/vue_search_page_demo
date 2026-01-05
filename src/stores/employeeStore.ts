import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { Employee } from '@/models';
import { employeeService } from '@/services';

export const useEmployeeStore = defineStore('employee', () => {
  const employees = ref<Employee[]>([]);
  const isLoaded = ref(false);

  const byId = (id: number): Employee | undefined =>
    employees.value.find(e => e.id === id);

  const getName = (id: number): string => {
    const emp = byId(id);
    return emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown';
  };

  const initialize = async (): Promise<void> => {
    if (isLoaded.value) return;
    employees.value = await employeeService.getAll();
    isLoaded.value = true;
  };

  return {
    employees,
    isLoaded,
    byId,
    getName,
    initialize
  };
});
