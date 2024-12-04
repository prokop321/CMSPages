<template>
  <NuxtLink
    v-if="space"
    :to="space.link"
    class="flex h-20 items-center rounded-lg border-2 border-fill py-2 pl-6 pr-2 text-2xl no-underline hover:underline"
  >
    <h2 class="font-bold">
      {{ space.title }}
    </h2></NuxtLink
  >
  <div
    v-else
    class="flex h-20 items-center gap-2 rounded-lg border-2 border-fill py-2 pl-6 pr-2"
  >
    <input
      type="text"
      class="h-full flex-1 p-2"
      :placeholder="props.placeholder"
      :value="props.modelValue"
      @input="
        (e) => $emit('update:modelValue', (e.target as HTMLInputElement).value)
      "
    />
    <Button @click="$emit('create')">{{ createText || "Create" }}</Button>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  space?: {
    link: string;
    title: string;
  };
  placeholder?: string;
  modelValue?: string;
  createText?: string;
}>();

props;

defineEmits(["update:modelValue", "create"]);
</script>
