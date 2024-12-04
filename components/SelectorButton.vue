<template>
  <button
    :class="{
      '!text-primary': active,
    }"
    class="relative rounded-t px-6 py-4 text-xl font-bold text-text hover:bg-fill"
    @click="$emit('click')"
  >
    <div
      v-if="active"
      class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
    ></div>
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  active: boolean;
}>();

const emit = defineEmits(["click"]);
</script>
