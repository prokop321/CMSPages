<template>
  <div class="flex justify-center px-4">
    <div class="relative flex w-full max-w-7xl flex-col gap-4 py-8">
      <div class="flex border-b-2 border-fill">
        <SelectorButton :active="!settings" @click="settings = false">
          Content
        </SelectorButton>
        <SelectorButton :active="settings" @click="settings = true">
          Settings
        </SelectorButton>
      </div>

      <template v-if="map.spaces[spaceID]">
        <div class="flex flex-col items-start gap-4" v-if="settings">
          <div
            class="flex w-full max-w-2xl flex-col items-start gap-0.5 overflow-hidden rounded-lg border-2 border-darkFill bg-darkFill"
          >
            <div class="flex h-16 w-full gap-0.5 bg-fill px-2">
              <div class="flex w-12 items-center justify-center p-1">
                <p class="text-center font-bold">key gen</p>
              </div>
              <div
                style="flex: 5"
                class="flex items-center justify-center font-bold"
              >
                <p class="text-center">key</p>
              </div>
              <div
                style="flex: 2"
                class="flex items-center justify-center font-bold"
              >
                <p class="text-center">type</p>
              </div>
              <div class="flex-1"></div>
            </div>
            <div
              v-for="el in Object.keys(map.spaces[spaceID].fields)"
              class="w-full bg-background px-2"
            >
              <div class="flex h-16 w-full gap-0.5 bg-fill">
                <div
                  class="flex w-12 items-center justify-center bg-background p-1"
                >
                  <input
                    type="checkbox"
                    v-if="map.spaces[spaceID].fields[el] === 'string'"
                    @change="
                      (e) => {
                        const val = (e.target as HTMLInputElement).checked;
                        if (val) map.spaces[spaceID].keyGen = el;
                        else if (map.spaces[spaceID].keyGen === el)
                          map.spaces[spaceID].keyGen = undefined;
                      }
                    "
                    :checked="el === map.spaces[spaceID].keyGen"
                  />
                </div>
                <div
                  style="flex: 5"
                  class="flex items-center bg-background px-2"
                >
                  <h4>
                    {{ el }}
                  </h4>
                </div>
                <div
                  style="flex: 2"
                  class="flex items-center bg-background px-2"
                >
                  <select
                    :value="map.spaces[spaceID].fields[el]"
                    @change="
                      (e) => {
                        map.spaces[spaceID].fields[el] = (
                          e.target as HTMLSelectElement
                        ).value as TContentFieldTypes;
                      }
                    "
                  >
                    <option
                      v-for="el in [
                        'string',
                        'markdown',
                        'date',
                        'images',
                        'weekSchedule',
                      ]"
                      :value="el"
                    >
                      {{ el }}
                    </option>
                  </select>
                </div>
                <div class="flex flex-1 justify-center bg-background">
                  <button
                    class="text-remove underline"
                    @click="
                      () => {
                        delete map.spaces[spaceID].fields[el];
                        if (map.spaces[spaceID].keyGen === el)
                          map.spaces[spaceID].keyGen = undefined;
                        for (const key in spaces.value[spaceID]) {
                          delete spaces[spaceID][key];
                        }
                      }
                    "
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
            <div class="w-full bg-background px-2">
              <div class="flex h-16 gap-0.5 bg-fill">
                <div
                  class="flex w-12 items-center justify-center bg-background"
                ></div>
                <div
                  style="flex: 5"
                  class="flex w-40 items-center bg-background px-2"
                >
                  <input
                    type="text"
                    class="w-full"
                    placeholder="new field key"
                    v-model="newInputKey"
                  />
                </div>
                <div
                  style="flex: 2"
                  class="flex items-center bg-background px-2"
                >
                  <select
                    :value="newInputType"
                    @change="
                      (e) => {
                        newInputType = (e.target as HTMLSelectElement)
                          .value as TContentFieldTypes;
                      }
                    "
                  >
                    <option
                      v-for="el in [
                        'string',
                        'markdown',
                        'date',
                        'images',
                        'weekSchedule',
                      ]"
                      :value="el"
                    >
                      {{ el }}
                    </option>
                  </select>
                </div>
                <div class="flex flex-1 justify-center bg-background">
                  <button
                    class="text-primary underline"
                    @click="
                      () => {
                        map.spaces[spaceID].fields[newInputKey] = newInputType;
                        newInputKey = '';
                        newInputType = 'string';
                      }
                    "
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <Button
              type="red"
              @click="
                async () => {
                  mainStore.deleteSpace(spaceID);
                  useRouter().replace('/');
                }
              "
            >
              Delete " {{ spaceID }}" space
            </Button>
          </div>
        </div>

        <template v-else>
          <div class="grid gap-2 md:grid-cols-2">
            <Chip
              v-if="space"
              :space="{
                link: '/space/' + spaceID + '/content/' + el,
                title: el,
              }"
              v-for="el in Object.keys(space)"
            />
            <Chip
              v-model="newContentID"
              @create="addContent"
              :placeholder="
                'new content ' +
                (map.spaces[spaceID].keyGen ? map.spaces[spaceID].keyGen : 'id')
              "
            />
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const newContentID = ref<string>("");
const settings = ref(false);

const addContent = () => {
  if (!newContentID.value) return alert("Content ID cannot be empty");

  const normalized = normalize(newContentID.value);

  if (!spaces.value[spaceID]) spaces.value[spaceID] = {};

  let index;
  if (space.value[normalized]) {
    index = 2;
    while (space.value[`${normalized}-${index}`]) {
      index++;
    }
  }

  let finalID = index ? `${normalized}-${index}` : normalized;

  const obj: { [key: string]: any } = {};
  for (const key in map.value.spaces[spaceID].fields) {
    if (map.value.spaces[spaceID].keyGen === key) {
      obj[key] = newContentID.value;
      continue;
    }
    if (map.value.spaces[spaceID].fields[key] === "images") {
      obj[key] = [];
      continue;
    } else if (map.value.spaces[spaceID].fields[key] === "weekSchedule") {
      obj[key] = {
        day: 0,
        start: 0,
        duration: 0,
      };
      continue;
    }
    obj[key] = "";
  }

  spaces.value[spaceID][finalID] = obj;
  newContentID.value = "";
  useRouter().push("/space/" + spaceID + "/content/" + finalID);
};

const newInputKey = ref<string>("");
const newInputType = ref<TContentFieldTypes>("string");

const spaceID = useRoute().params.id as string;

const mainStore = useMainStore();

const { spaces, map } = storeToRefs(mainStore);

const space = computed(() => spaces.value[spaceID]);

const loaded = ref(false);

onMounted(async () => {
  await mainStore.loadContent(spaceID);
  loaded.value = true;
});
</script>
