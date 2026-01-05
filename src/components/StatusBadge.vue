<template>
  <span
    class="inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full"
    :class="statusClass"
  >
    {{ label }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getStatusConfig } from '@/utils/statusUtils';

const props = defineProps<{ status: string }>();

const config = computed(() => getStatusConfig(props.status));
const statusClass = computed(() => config.value.bgClass);
const label = computed(() => config.value.label || props.status);
</script>
