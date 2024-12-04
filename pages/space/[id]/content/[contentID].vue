<template v-if="spaces[spaceID] && currentMap">
  <div class="flex justify-center px-4">
    <div class="flex w-full max-w-7xl flex-col gap-4 py-8">
      <div
        v-if="spaces[spaceID] && spaces[spaceID][contentID]"
        v-for="key in Object.keys(currentMap.fields)"
      >
        <Input
          :type="map.spaces[spaceID].fields[key]"
          v-model="spaces[spaceID][contentID][key]"
          :title="key"
          :key="key"
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
