<template>
  <InputWrapper :title="title">
    <div class="flex gap-4">
      <div class="flex flex-1">
        <textarea
          class="min-h-24 w-full flex-1 rounded-t-lg border-b-2 border-text px-3 text-lg focus:border-primary focus:outline-none"
          v-model="value"
        />
      </div>
      <div class="flex flex-1 flex-col gap-4">
        <h4 class="text-darkFill">preview:</h4>
        <MDC v-if="value" class="markdown" :value="value" />
      </div></div
  ></InputWrapper>
</template>

<script lang="ts" setup>
defineProps<{
  title: string;
}>();

const value = defineModel<string>();
</script>
