<template>
  <InputWrapper :title="title">
    <input
      v-model="value"
      type="text"
      class="h-12 w-full max-w-md rounded-t-lg border-b-2 border-text px-2 text-lg focus:border-primary focus:outline-none"
  /></InputWrapper>
</template>

<script lang="ts" setup>
defineProps<{
  title: string;
}>();

const value = defineModel<string>();
</script>
