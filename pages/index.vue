<template>
  <div class="flex justify-center px-4">
    <div class="relative flex w-full max-w-7xl flex-col gap-4 py-8">
      <div>
        <SelectorButton
          :active="display === 'content'"
          @click="display = 'content'"
        >
          Content
        </SelectorButton>
        <SelectorButton
          :active="display === 'files'"
          @click="display = 'files'"
        >
          Files
        </SelectorButton>
      </div>

      <div v-if="display === 'content'" class="grid gap-2 md:grid-cols-2">
        <Chip
          :space="{
            title: el,
            link: '/space/' + el,
          }"
          v-for="el in Object.keys(map.spaces)"
        >
        </Chip>
        <Chip
          v-model="newSpaceID"
          placeholder="New space"
          @create="
            () => {
              createSpace();
            }
          "
        />
      </div>
      <div v-else class="flex flex-col justify-center">
        <div class="flex items-center justify-between px-2 py-4">
          <h3 class="text-xl font-bold">
            {{
              selectedFiles.length === 0
                ? Object.keys(mainStore.map.files).length + " files in total"
                : selectedFiles.length +
                  ((selectedFiles.length === 1 ? " file" : " files") +
                    " selected")
            }}
          </h3>
          <div class="flex gap-1">
            <template v-if="selectedFiles.length">
              <Button
                @click="
                  () => {
                    mainStore.deleteFiles(selectedFiles);
                    selectedFiles = [];
                  }
                "
                type="red"
                >Delete selected</Button
              >

              <Button @click="selectedFiles = []">Clear selection</Button>
            </template>
            <Button
              v-else
              @click="
                () => {
                  selectedFiles = Object.keys(mainStore.map.files);
                }
              "
              >Select all</Button
            >
          </div>
        </div>
        <div class="grid grid-cols-3 gap-2 md:grid-cols-4">
          <FilePreviewer
            @add="
              () => {
                selectedFiles.push(file.name);
              }
            "
            @remove="
              () => {
                selectedFiles.splice(selectedFiles.indexOf(file.name), 1);
              }
            "
            :added="selectedFiles.includes(file.name)"
            :file="file"
            v-for="file in Object.keys(mainStore.map.files).map((fileKey) => {
              const file: FileInfo = {
                ...mainStore.map.files[fileKey],
                name: fileKey,
              };
              return file;
            })"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useMainStore } from "../stores/main";

const display = ref<"content" | "files">("content");
const mainStore = useMainStore();
const { map, spaces } = storeToRefs(mainStore);

const selectedFiles = ref<string[]>([]);

const createSpace = () => {
  if (!newSpaceID.value) return alert("Space ID cannot be empty");
  const normalizedSpaceID = normalize(newSpaceID.value);

  if (map.value.spaces[normalizedSpaceID]) {
    newSpaceID.value = normalizedSpaceID;
    return alert("Space with this ID already exists");
  }

  map.value.spaces[normalizedSpaceID] = {
    fields: {},
  };
  spaces.value[normalizedSpaceID] = {};

  useRouter().push("/space/" + normalizedSpaceID);
};

const newSpaceID = ref<string>("");
</script>
