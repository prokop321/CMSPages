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
          value.push('/bucket/' + file.name);
        }
      "
      @remove="
        () => {
          value.splice(value.indexOf('/bucket/' + file.name), 1);
        }
      "
      :added="value.includes('/bucket/' + file.name)"
      :file="file"
    />
  </div>
</template>

<script setup lang="ts">
import { compressImage } from "lost-compressor";

const mainStore = useMainStore();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const props = defineProps<{
  accept: "image";
}>();

const value = defineModel<string[]>({ default: [] });

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
  input.accept = "image/jpg, image/jpeg, image/png";

  input.onchange = async (e) => {
    try {
      const target = e.target as HTMLInputElement;
      if (!target.files) return;
      const files = Array.from(target.files);
      const compressedImages = [];
      for (let i = 0; i < files.length; i++) {
        const image = files[i];
        const compressedImage = await compressImage(image, 2048, 0.8, "jpeg");
        if (!compressedImage) {
          console.error("Failed to compress image: " + image.name);
          continue;
        }
        compressedImages.push(compressedImage);
      }
      let fileURLs = await mainStore.uploadFiles(compressedImages, "image");
      value.value = value.value.concat(fileURLs);
    } catch (e) {
      alert(e);
    }
  };
  input.click();
};
</script>
