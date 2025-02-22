<template>
  <div class="flex flex-col gap-1">
    <h3 class="text-xl font-bold">{{ title }}</h3>
    <slot />
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  title: string;
}>();
</script>
