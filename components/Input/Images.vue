<template>
  <InputWrapper :title="title">
    <Transition name="fade">
      <section
        class="fixed inset-0 z-50 flex items-center justify-center bg-blackTransparent p-2"
        v-if="imageSelector && value"
      >
        <div
          class="flex max-h-full w-full max-w-7xl flex-col overflow-y-auto rounded bg-background px-2 pb-2"
        >
          <FileSelector
            accept="image"
            @close="imageSelector = false"
            v-model="value"
          />
        </div>
      </section>
    </Transition>
    <div>
      <div
        class="relative flex h-96 w-full items-center gap-2 overflow-x-scroll"
      >
        <TransitionGroup name="fade">
          <div
            v-if="value"
            v-for="(image, index) in value"
            :key="image"
            class="relative flex h-full flex-shrink-0 items-center gap-1"
          >
            <div class="relative flex h-full overflow-hidden rounded">
              <button
                class="absolute right-0 top-0 flex size-8 items-center justify-center rounded-bl-sm bg-remove"
                @click="
                  () => {
                    if (!value) return;
                    value.splice(index, 1);
                  }
                "
              >
                <IconsX class="stroke-background" />
              </button>
              <button
                class="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-tl-sm bg-fill"
                v-if="index + 1 < value.length"
                @click="
                  () => {
                    if (!value || !(index + 1 < value.length)) return;
                    const temp = value[index];
                    value[index] = value[index + 1];
                    value[index + 1] = temp;
                  }
                "
              >
                <IconsArrowRight class="stroke-text" />
              </button>
              <button
                class="absolute bottom-0 left-0 flex size-8 items-center justify-center rounded-tr-sm bg-fill"
                v-if="index > 0"
                @click="
                  () => {
                    if (!value || !(index > 0)) return;
                    const temp = value[index];
                    value[index] = value[index - 1];
                    value[index - 1] = temp;
                  }
                "
              >
                <IconsArrowLeft class="stroke-text" />
              </button>
              <img
                class="max-w-3xl rounded"
                :src="mainStore.filePreviewer(image as string)"
              />
            </div>
          </div>

          <Button
            key="plus-button"
            class="size-14 !rounded-full"
            @click="imageSelector = true"
            ><IconsPlus
          /></Button>
        </TransitionGroup>
      </div>
    </div>
  </InputWrapper>
</template>

<script lang="ts" setup>
const mainStore = useMainStore();

defineProps<{
  title: string;
}>();

const value = defineModel<string[]>();
const imageSelector = ref(false);
</script>
