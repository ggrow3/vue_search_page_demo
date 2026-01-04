<template>
  <Dialog
    :visible="visible"
    @update:visible="$emit('update:visible', $event)"
    :header="isReassigning ? 'Reassign Todo' : (isEditing ? 'Edit Todo' : 'New Todo')"
    :modal="true"
    :closable="true"
    :style="{ width: '500px' }"
  >
    <div class="flex flex-col gap-4">
      <!-- Title -->
      <div v-if="!isReassigning">
        <label for="todoTitle" class="block font-bold mb-2">Title</label>
        <InputText
          id="todoTitle"
          v-model="form.title"
          class="w-full"
          placeholder="Enter todo title"
        />
      </div>

      <!-- Description -->
      <div v-if="!isReassigning">
        <label for="todoDescription" class="block font-bold mb-2">Description</label>
        <Textarea
          id="todoDescription"
          v-model="form.description"
          rows="3"
          class="w-full"
          placeholder="Enter description"
        />
      </div>

      <!-- Due Date -->
      <div v-if="!isReassigning">
        <label for="todoDueDate" class="block font-bold mb-2">Due Date</label>
        <Calendar
          id="todoDueDate"
          v-model="form.dueDate"
          dateFormat="mm/dd/yy"
          placeholder="Select due date"
          showIcon
          showButtonBar
          :minDate="new Date()"
        />
      </div>

      <!-- Assignee -->
      <div>
        <label for="todoAssignee" class="block font-bold mb-2">
          {{ isReassigning ? 'Reassign To' : 'Assign To' }}
        </label>
        <Dropdown
          id="todoAssignee"
          v-model="form.assigneeId"
          :options="employees"
          optionLabel="fullName"
          optionValue="id"
          placeholder="Select employee"
          class="w-full"
        />
        <small v-if="isSameAssignee" class="text-orange-600 mt-1 block">
          <i class="pi pi-exclamation-triangle mr-1"></i>
          Please select a different employee to reassign
        </small>
      </div>

      <!-- Assignment History (only shown when reassigning) -->
      <div v-if="isReassigning && todo && todo.assignmentHistory.length > 0">
        <label class="block font-bold mb-2">Assignment History</label>
        <div class="bg-gray-100 rounded-lg p-3 max-h-40 overflow-y-auto">
          <div
            v-for="(assignment, index) in todo.assignmentHistory"
            :key="assignment.id"
            class="text-sm"
            :class="{ 'border-b border-gray-200 pb-2 mb-2': index < todo.assignmentHistory.length - 1 }"
          >
            <div class="text-gray-900">
              <i class="pi pi-user mr-1"></i>
              {{ assignment.assignedToName }}
            </div>
            <div class="text-gray-500 text-xs">
              Assigned by {{ assignment.assignedByName }} on {{ formatDateTime(assignment.assignedAt) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button
          label="Cancel"
          class="p-button-text"
          @click="$emit('update:visible', false)"
        />
        <Button
          :label="isReassigning ? 'Reassign' : (isEditing ? 'Update' : 'Create')"
          @click="handleSubmit"
          :disabled="!isFormValid"
        />
      </div>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import { useTodoStore } from '@/stores/todoStore'
import { formatDateTime } from '@/utils/dateFormatters'
import type { Todo } from '@/models'

interface Props {
  visible: boolean
  todo?: Todo | null
  projectId: number
  isReassigning?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  todo: null,
  isReassigning: false
})

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'saved': [newAssigneeName?: string]
}>()

const projectStore = useProjectStore()
const todoStore = useTodoStore()

const form = ref({
  title: '',
  description: '',
  dueDate: null as Date | null,
  assigneeId: null as number | null
})

const employees = computed(() => {
  return todoStore.allEmployees.map(emp => ({
    id: emp.id,
    fullName: `${emp.firstName} ${emp.lastName}`
  }))
})

const isEditing = computed(() => !!props.todo && !props.isReassigning)

const isSameAssignee = computed(() => {
  return props.isReassigning && props.todo && form.value.assigneeId === props.todo.currentAssigneeId
})

const isFormValid = computed(() => {
  if (props.isReassigning) {
    return form.value.assigneeId !== null && !isSameAssignee.value
  }
  return form.value.title.trim() !== '' && form.value.assigneeId !== null
})

// Get first employee from the project as default assignee for new todos
const getDefaultAssignee = (): number | null => {
  const project = projectStore.getProjectById(props.projectId)
  if (project && project.assignedEmployeeIds.length > 0) {
    return project.assignedEmployeeIds[0]
  }
  return employees.value.length > 0 ? employees.value[0].id : null
}

// Reset form when modal opens
watch(() => props.visible, (newVal) => {
  if (newVal) {
    if (props.todo) {
      form.value = {
        title: props.todo.title,
        description: props.todo.description,
        dueDate: props.todo.dueDate ? new Date(props.todo.dueDate) : null,
        assigneeId: props.todo.currentAssigneeId
      }
    } else {
      form.value = {
        title: '',
        description: '',
        dueDate: null,
        assigneeId: getDefaultAssignee()
      }
    }
  }
})

const getAssigneeName = (assigneeId: number): string => {
  const employee = employees.value.find(e => e.id === assigneeId)
  return employee?.fullName || 'Unknown'
}

const handleSubmit = () => {
  if (!isFormValid.value) return

  const dueDateStr = form.value.dueDate ? form.value.dueDate.toISOString().split('T')[0] : null
  let newAssigneeName: string | undefined

  // Get first employee from project as the "creator" for tracking purposes
  const creatorId = getDefaultAssignee() || form.value.assigneeId!

  if (props.isReassigning && props.todo) {
    // Reassign todo
    todoStore.reassignTodo(props.todo.id, form.value.assigneeId!, creatorId)
    newAssigneeName = getAssigneeName(form.value.assigneeId!)
  } else if (isEditing.value && props.todo) {
    // Update existing todo
    todoStore.updateTodo(props.todo.id, {
      title: form.value.title,
      description: form.value.description,
      dueDate: dueDateStr
    })
    // If assignee changed, also reassign
    if (form.value.assigneeId !== props.todo.currentAssigneeId) {
      todoStore.reassignTodo(props.todo.id, form.value.assigneeId!, creatorId)
      newAssigneeName = getAssigneeName(form.value.assigneeId!)
    }
  } else {
    // Create new todo
    todoStore.addTodo(
      props.projectId,
      form.value.title,
      form.value.description,
      dueDateStr,
      form.value.assigneeId!,
      creatorId
    )
  }

  emit('saved', newAssigneeName)
  emit('update:visible', false)
}
</script>
