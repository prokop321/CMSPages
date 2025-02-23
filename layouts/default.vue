<template>
  <nav
    class="sticky top-0 z-10 flex h-24 w-full items-center border-b-2 border-fill bg-background pr-2 sm:pr-8"
  >
    <NuxtLink
      to="/"
      class="group flex aspect-square h-full items-center justify-center border-r-2 border-fill hover:bg-fill"
      :class="{
        'bg-fill': home,
      }"
    >
      <IconsHome
        class="size-3/5 stroke-text group-hover:stroke-primary"
        :class="{
          'stroke-primary': home,
        }"
      />
    </NuxtLink>
    <div
      class="flex h-full flex-1 items-center gap-2 overflow-x-auto px-4 text-2xl font-bold"
    >
      <NuxtLink
        :to="'/space/' + spaceID"
        v-if="spaceID"
        class="flex-shrink-0 text-text"
        >/{{ spaceID }}</NuxtLink
      >
      <NuxtLink
        class="flex-shrink-0 text-text"
        :to="'/space/' + spaceID + '/content/' + contentID"
        v-if="contentID"
        >/{{ contentID }}</NuxtLink
      >
    </div>
    <Button
      @click="save"
      :class="{
        'opacity-50': saving,
      }"
    >
      {{ saving ? "Saving..." : "Save changes" }}
    </Button>
  </nav>
  <slot />
</template>

<script setup lang="ts">
const spaceID = computed(() => useRoute().params.id as string);
const contentID = computed(() => useRoute().params.contentID as string);
const home = computed(() => useRoute().path === "/");

const mainStore = useMainStore();

const { unsavedChanges } = storeToRefs(mainStore);

const saving = ref(false);
const save = async () => {
  if (saving.value) return;
  saving.value = true;
  const save = await mainStore.upload();
  saving.value = false;
  if (!save) alert("Failed to save, please try again");
  else alert("Saved successfully! It takes about 1 minute to see the changes");
};
</script>
