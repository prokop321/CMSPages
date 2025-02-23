<template>
  <div class="sticky top-0 z-10 flex justify-between gap-2 bg-background py-4">
    <Button @click="uploadFiles">Upload new images</Button>
    <Button @click="$emit('close')">Done</Button>
  </div>
  <div class="flex flex-wrap gap-2">
    <FilePreviewer
      :key="file.name"
      v-for="file in files"
      @add="
        () => {
          emit('update:modelValue', [
            ...(props.modelValue || []),
            '/bucket/' + file.name,
          ]);
        }
      "
      @remove="
        () => {
          emit(
            'update:modelValue',
            (props.modelValue || []).filter(
              (v) => v !== '/bucket/' + file.name,
            ),
          );
        }
      "
      :added="modelValue.includes('/bucket/' + file.name)"
      :file="file"
    />
  </div>
</template>

<script setup lang="ts">
import { compressImage } from "lost-compressor";

const mainStore = useMainStore();

const emit = defineEmits<{
  (e: "update:modelValue", value: string[]): void;
  (e: "close"): void;
}>();

const props = defineProps<{
  modelValue: string[];
  accept: "image";
}>();

const files = computed<FileInfo[]>(() => {
  return Object.keys(mainStore.map.files || {})
    .filter((f) => {
      return mainStore.map.files[f].type === props.accept;
    })
    .sort((a, b) => mainStore.map.files[b].added - mainStore.map.files[a].added)
    .map((f) => {
      const file: FileInfo = {
        name: f,
        added: mainStore.map.files[f].added,
        type: props.accept,
      };
      return file;
    });
});

const uploadFiles = () => {
  const input = document.createElement("input");
  input.type = "file";
  input.multiple = true;
  input.accept = "image/*,image/heic,image/heif";

  input.onchange = async (e) => {
    const target = e.target as HTMLInputElement;
    if (!target.files) return;
    const files = Array.from(target.files);
    const compressedImages = [];
    for (let i = 0; i < files.length; i++) {
      const image = files[i];
      const compressedImage = await compressImage(image, 2048, 0.8, "jpeg");
      if (!compressedImage) continue;
      compressedImages.push(compressedImage);
    }
    let names = await mainStore.uploadFiles(compressedImages, "image");
    const convertedNames = names.map((name) => `/bucket/${name}`);
    emit("update:modelValue", [
      ...(props.modelValue as string[]),
      ...convertedNames,
    ]);
  };
  input.click();
};
</script>
