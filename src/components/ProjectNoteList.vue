<template>
  <div class="bg-white p-4 rounded-lg shadow-lg">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-gray-900 m-0 text-lg font-semibold">
        <i class="pi pi-file-edit mr-2"></i>Notes
      </h3>
      <span class="text-gray-500">{{ notes.length }} note(s)</span>
    </div>

    <!-- Add Note Form -->
    <div class="mb-4">
      <textarea
        v-model="newNoteContent"
        class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        rows="3"
        placeholder="Add a note about this project..."
        style="resize: vertical"
        aria-label="New note content"
      ></textarea>
      <div class="flex justify-end mt-2">
        <Button
          label="Add Note"
          icon="pi pi-plus"
          @click="handleAdd"
          :disabled="!newNoteContent.trim()"
          class="p-button-sm"
          aria-label="Add new note"
        />
      </div>
    </div>

    <!-- Notes List -->
    <div v-if="notes.length === 0" class="text-center p-4 text-gray-500">
      <i class="pi pi-inbox text-4xl mb-3 block"></i>
      No notes yet. Add your first note above.
    </div>

    <div v-else class="flex flex-col gap-3">
      <div
        v-for="note in notes"
        :key="note.id"
        class="bg-gray-100 p-3 rounded-lg"
      >
        <div v-if="editingNoteId === note.id" class="mb-2">
          <textarea
            v-model="editNoteContent"
            class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            rows="2"
            style="resize: vertical"
            aria-label="Edit note content"
          ></textarea>
          <div class="flex justify-end gap-2 mt-2">
            <Button
              label="Cancel"
              class="p-button-text p-button-sm"
              @click="cancelEdit"
              aria-label="Cancel editing"
            />
            <Button
              label="Save"
              class="p-button-sm"
              @click="handleSaveEdit(note.id)"
              :disabled="!editNoteContent.trim()"
              aria-label="Save note changes"
            />
          </div>
        </div>

        <div v-else>
          <p class="text-gray-900 m-0 whitespace-pre-wrap">{{ note.content }}</p>
          <div class="flex justify-between items-center mt-2">
            <small class="text-gray-500">
              {{ formatDateTime(note.createdAt) }}
              <span v-if="note.updatedAt !== note.createdAt">
                (edited)
              </span>
            </small>
            <div>
              <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-text p-button-sm"
                @click="startEdit(note)"
                aria-label="Edit note"
                v-tooltip.top="'Edit'"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-text p-button-sm p-button-danger"
                @click="$emit('delete', note.id)"
                aria-label="Delete note"
                v-tooltip.top="'Delete'"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { formatDateTime } from '@/utils/dateFormatters';
import type { ProjectNote } from '@/models';

defineProps<{
  notes: ProjectNote[];
}>();

const emit = defineEmits<{
  'add': [content: string];
  'edit': [noteId: number, content: string];
  'delete': [noteId: number];
}>();

const newNoteContent = ref('');
const editingNoteId = ref<number | null>(null);
const editNoteContent = ref('');

const handleAdd = () => {
  if (newNoteContent.value.trim()) {
    emit('add', newNoteContent.value.trim());
    newNoteContent.value = '';
  }
};

const startEdit = (note: ProjectNote) => {
  editingNoteId.value = note.id;
  editNoteContent.value = note.content;
};

const cancelEdit = () => {
  editingNoteId.value = null;
  editNoteContent.value = '';
};

const handleSaveEdit = (noteId: number) => {
  if (editNoteContent.value.trim()) {
    emit('edit', noteId, editNoteContent.value.trim());
    cancelEdit();
  }
};
</script>
