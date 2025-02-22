<template>
  <div
    v-if="spaces[spaceID] && currentMap && spaces[spaceID][contentID]"
    class="flex justify-center px-4"
  >
    <div class="flex w-full max-w-7xl flex-col gap-4 py-8">
      <div
        v-if="spaces[spaceID] && spaces[spaceID][contentID]"
        v-for="key in Object.keys(currentMap.fields)"
      >
        <InputString
          v-if="map.spaces[spaceID].fields[key] === 'string'"
          :title="key"
          v-model="spaces[spaceID][contentID][key]"
          :key="key + '-string'"
        />
        <InputDate
          v-else-if="map.spaces[spaceID].fields[key] === 'date'"
          v-model="spaces[spaceID][contentID][key]"
          :title="key"
          :key="key + '-date'"
        />

        <InputMarkdown
          v-else-if="map.spaces[spaceID].fields[key] === 'markdown'"
          v-model="spaces[spaceID][contentID][key]"
          :title="key"
          :key="key + '-markdown'"
        />
        <InputImages
          v-else-if="map.spaces[spaceID].fields[key] === 'images'"
          v-model="spaces[spaceID][contentID][key]"
          :title="key"
          :key="key + '-images'"
        />

        <InputWeekSchedule
          v-else-if="map.spaces[spaceID].fields[key] === 'weekSchedule'"
          v-model="spaces[spaceID][contentID][key]"
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
const spaceID = useRoute().params.id as string;
const contentID = useRoute().params.contentID as string;

const mainStore = useMainStore();
const { map, spaces } = storeToRefs(mainStore);

const currentMap = computed(() => {
  return map.value.spaces[spaceID];
});

const deleteEntry = () => {
  delete spaces.value[spaceID][contentID];
  useRouter().push(`/space/${spaceID}`);
};

onMounted(() => {
  mainStore.loadContent(spaceID);
});
</script>
