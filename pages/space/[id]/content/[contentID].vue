<template>
  <main class="flex justify-center px-4" v-if="errorLoadingSpace">
    <div
      class="flex w-full max-w-7xl flex-col items-start justify-center gap-4 py-8"
    >
      <div>
        <p>code: 404</p>
        <p>space-id: {{ spaceID }}</p>
        <p>content-id: {{ contentID }}</p>
      </div>
      <h1 class="text-2xl font-bold">Error loading space of this content</h1>
      <p>It seems like this space doesn't exists</p>
      <Button link-to="/">Go home</Button>
    </div>
  </main>
  <main class="flex justify-center px-4" v-else-if="loading">
    <div
      class="flex w-full max-w-7xl flex-col items-center justify-center gap-4 py-8"
    >
      <p>Loading content...</p>
    </div>
  </main>

  <div
    v-else-if="currentMap && spaces[spaceID]"
    class="flex justify-center px-4"
  >
    <div class="flex w-full max-w-7xl flex-col gap-4 py-8">
      <div
        v-if="spaces[spaceID]![contentID]"
        v-for="key in Object.keys(currentMap.fields)"
      >
        <InputString
          v-if="map.spaces[spaceID].fields[key] === 'string'"
          :title="key"
          v-model="spaces[spaceID]![contentID][key] as string"
          :key="key + '-string'"
        />
        <InputDate
          v-else-if="map.spaces[spaceID].fields[key] === 'date'"
          v-model="spaces[spaceID]![contentID][key] as string"
          :title="key"
          :key="key + '-date'"
        />

        <InputMarkdown
          v-else-if="map.spaces[spaceID].fields[key] === 'markdown'"
          v-model="spaces[spaceID]![contentID][key] as string"
          :title="key"
          :key="key + '-markdown'"
        />
        <InputImages
          v-else-if="map.spaces[spaceID].fields[key] === 'images'"
          v-model="spaces[spaceID]![contentID][key] as string[]"
          :title="key"
          :key="key + '-images'"
        />

        <InputWeekSchedule
          v-else-if="map.spaces[spaceID].fields[key] === 'weekSchedule'"
          v-model="spaces[spaceID]![contentID][key] as TWeekSchedule"
          :title="key"
          :key="key + '-weekSchedule'"
        />
      </div>
      <div>
        <Button class="bg-remove hover:bg-removeDark" @click="deleteEntry"
          >Delete {{ contentID }}</Button
        >
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
const loading = ref(true);
const errorLoadingSpace = ref(false);

const spaceID = useRoute().params.id as string;
const contentID = useRoute().params.contentID as string;

const mainStore = useMainStore();
const { map, spaces } = storeToRefs(mainStore);

const currentMap = computed(() => {
  return map.value.spaces[spaceID];
});

const deleteEntry = () => {
  if (!spaces.value[spaceID]) return;
  delete spaces.value[spaceID][contentID];
  useRouter().push(`/space/${spaceID}`);
};

onMounted(async () => {
  const res = await mainStore.loadContent(spaceID);
  loading.value = false;
  if (!res) {
    errorLoadingSpace.value = true;
  }
});
</script>
