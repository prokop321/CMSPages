<template>
  <div class="relative size-96 overflow-hidden rounded bg-fill">
    <img
      class="h-full w-full object-contain"
      :src="mainStore.filePreviewer('/bucket/' + file.name)"
    />

    <template v-if="added !== undefined">
      <div
        v-if="added"
        class="absolute inset-0 flex items-center justify-center bg-blackTransparent"
      >
        <Button
          class="bg-remove hover:bg-removeDark"
          @click="
            () => {
              emit('remove');
            }
          "
        >
          Unselect</Button
        >
      </div>
      <div
        v-else
        class="absolute inset-0 flex items-center justify-center bg-blackTransparent opacity-0 hover:opacity-100"
      >
        <Button
          @click="
            () => {
              emit('add');
            }
          "
        >
          Select</Button
        >
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
const mainStore = useMainStore();

const props = defineProps<{
  file: FileInfo;
  added?: boolean;
}>();

const emit = defineEmits(["add", "remove"]);
</script>
