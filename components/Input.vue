<template>
  <div class="flex flex-col gap-1">
    <h3 class="text-xl font-bold">{{ title }}</h3>

    <div v-if="type === 'string'">
      <input
        :value="props.modelValue"
        type="text"
        class="h-12 w-full max-w-md rounded-t-lg border-b-2 border-text px-2 text-lg focus:border-primary focus:outline-none"
        @input="
          (e) => emit('update:modelValue', (e.target as HTMLInputElement).value)
        "
      />
    </div>
    <div v-if="value.date">
      <input
        :value="value.date.toISOString().split('T')[0]"
        type="date"
        class=""
        @input="
          (e) => {
            const date = new Date((e.target as HTMLInputElement).value);
            const unix = date.getTime();
            emit('update:modelValue', unix);
          }
        "
      />
      <input
        type="time"
        :value="value.date.toISOString().split('T')[1].split('.')[0]"
        class=""
        @input="
          (e) => {
            const parts = (e.target as HTMLInputElement).value.split(':');
            const date = new Date(value.date || Date.now());
            const hours = parseInt(parts[0]) || 0;
            const minutes = parseInt(parts[1]) || 0;

            date.setHours(hours);
            date.setMinutes(minutes);
            const unix = date.getTime();
            emit('update:modelValue', unix);
          }
        "
      />
    </div>
    <div v-else-if="type === 'markdown'" class="flex gap-4">
      <textarea
        class="min-h-24 w-full flex-1 rounded-t-lg border-b-2 border-text px-3 text-lg focus:border-primary focus:outline-none"
        :value="props.modelValue as string"
        @input="
          (e) => emit('update:modelValue', (e.target as HTMLInputElement).value)
        "
      />
      <div class="flex flex-1 flex-col gap-4">
        <h4 class="text-darkFill">preview:</h4>
        <MDC
          class="markdown"
          v-if="props.modelValue"
          :value="props.modelValue.toString()"
        />
      </div>
    </div>

    <div v-if="value.weekSchedule">
      <select
        v-model="value.weekSchedule.day"
        class="w-24"
        @change="emit('update:modelValue', value.weekSchedule)"
      >
        <option v-for="day in 7" :value="day - 1" :key="day">
          {{ weekDays[day - 1] }}
        </option>
      </select>

      <input
        type="time"
        :value="dayMilsToTime(value.weekSchedule.start)"
        class="w-24"
        @input="
          (e) => {
            if (!value.weekSchedule) return;
            const parts = (e.target as HTMLInputElement).value.split(':');
            const hours = parseInt(parts[0]);
            const minutes = parseInt(parts[1]);
            const mils = (hours * 60 + minutes) * 60 * 1000;
            emit('update:modelValue', {
              day: value.weekSchedule!.day,
              start: mils,
              duration: value.weekSchedule.duration,
            });
          }
        "
      />

      <div>
        <input
          type="number"
          placeholder="hours"
          class="w-24"
          :value="Math.floor(value.weekSchedule.duration / 1000 / 60 / 60)"
          @input="
            (e) => {
              if (!value.weekSchedule) return;
              let newHours = parseInt((e.target as HTMLInputElement).value);
              if (newHours > 23) newHours = 23;

              const newMils = newHours * 60 * 60 * 1000;
              emit('update:modelValue', {
                day: value.weekSchedule.day,
                start: value.weekSchedule.start,
                duration: newMils,
              });
            }
          "
        />
        <span>:</span>
        <input
          type="number"
          placeholder="minutes"
          class="w-24"
          :value="Math.floor((value.weekSchedule.duration / 1000 / 60) % 60)"
          @input="
            (e) => {
              if (!value.weekSchedule) return;
              let newMinutes = parseInt((e.target as HTMLInputElement).value);
              if (!newMinutes) newMinutes = 0;
              if (newMinutes > 59) newMinutes = 59;

              const currentHours = Math.floor(
                value.weekSchedule.duration / 1000 / 60 / 60,
              );
              newMinutes += currentHours * 60;

              const newMils = newMinutes * 60 * 1000;

              emit('update:modelValue', {
                day: value.weekSchedule!.day,
                start: value.weekSchedule!.start,
                duration: newMils,
              });
            }
          "
        />
      </div>
    </div>

    <!-- images -->
    <template v-else-if="value.images" class="flex gap-4">
      <Transition name="fade">
        <section
          class="fixed inset-0 z-50 flex items-center justify-center bg-blackTransparent p-2"
          v-if="imageSelector"
        >
          <div
            class="flex max-h-full w-full max-w-7xl flex-col overflow-y-auto rounded bg-background px-2 pb-2"
          >
            <FilesSelector
              accept="image"
              @update:model-value="(e) => emit('update:modelValue', e)"
              @close="imageSelector = false"
              :model-value="value.images"
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
              :key="image"
              class="relative flex h-full flex-shrink-0 items-center gap-1"
              v-for="(image, index) in modelValue"
            >
              <div class="relative flex h-full overflow-hidden rounded">
                <button
                  class="absolute right-0 top-0 flex size-8 items-center justify-center rounded-bl-sm bg-remove"
                  @click="
                    () => {
                      const newImages = [...(modelValue as string[])];
                      newImages.splice(index, 1);
                      emit('update:modelValue', newImages);
                    }
                  "
                >
                  <IconsX class="stroke-background" />
                </button>
                <button
                  class="absolute bottom-0 right-0 flex size-8 items-center justify-center rounded-tl-sm bg-fill"
                  v-if="index !== (modelValue as string[]).length - 1"
                  @click="
                    () => {
                      if (index === (modelValue as string[]).length - 1) return;
                      const newImages = [...(modelValue as string[])];
                      const temp = newImages[index];
                      newImages[index] = newImages[index + 1];
                      newImages[index + 1] = temp;
                      emit('update:modelValue', newImages);
                    }
                  "
                >
                  <IconsArrowRight class="stroke-text" />
                </button>
                <button
                  class="absolute bottom-0 left-0 flex size-8 items-center justify-center rounded-tr-sm bg-fill"
                  v-if="index !== 0"
                  @click="
                    () => {
                      if (index === 0) return;
                      const newImages = [...(modelValue as string[])];
                      const temp = newImages[index];
                      newImages[index] = newImages[index - 1];
                      newImages[index - 1] = temp;
                      emit('update:modelValue', newImages);
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

            <Button class="size-14 !rounded-full" @click="imageSelector = true"
              ><IconsPlus
            /></Button>
          </TransitionGroup>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
const imageSelector = ref(false);
const mainStore = useMainStore();

const dayMilsToTime = (mils: number) => {
  const hours = Math.floor(mils / 3600000);
  const minutes = Math.floor((mils % 3600000) / 60000);
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const props = defineProps<{
  title: string;
  type: TContentFieldTypes;
  modelValue?:
    | string
    | number
    | string[]
    | { day: number; start: number; duration: number };
}>();

const emit = defineEmits<{
  (
    e: "update:modelValue",
    value:
      | string
      | number
      | string[]
      | {
          day: number;
          start: number;
          duration: number;
        },
  ): void;
}>();

const value = computed<{
  date?: Date;
  images?: string[];
  string?: string;
  markdown?: string;
  weekSchedule?: {
    day: number;
    start: number;
    duration: number;
  };
}>(() => {
  const modelValue = props.modelValue;

  if (props.type === "date") {
    if (!modelValue) {
      return {
        date: new Date(),
      };
    }
    if (typeof modelValue === "number") {
      return {
        date: new Date(modelValue),
      };
    }
    console.error("Invalid date value");
    return {};
  }

  if (props.type === "images") {
    if (!props.modelValue) {
      return {
        images: [],
      };
    }
    if (
      Array.isArray(props.modelValue) &&
      props.modelValue.every((v) => typeof v === "string")
    ) {
      return {
        images: props.modelValue,
      };
    }
    console.error("Invalid images value");
    return {};
  }
  if (props.type === "string" || props.type === "markdown") {
    if (props.modelValue === undefined) {
      return {
        [props.type]: "",
      };
    }
    if (typeof props.modelValue === "string") {
      return {
        [props.type]: props.modelValue,
      };
    }
    console.error("Invalid " + props.type + " value");
    return {};
  }
  if (props.type === "weekSchedule") {
    if (
      modelValue &&
      typeof modelValue === "object" &&
      "day" in modelValue &&
      "start" in modelValue &&
      "duration" in modelValue
    ) {
      return {
        weekSchedule: {
          day: modelValue.day,
          start: modelValue.start,
          duration: modelValue.duration,
        },
      };
    }
    return {
      weekSchedule: {
        day: 0,
        start: 0,
        duration: 0,
      },
    };
  }
  return {};
});
</script>

<style lang="scss">
.markdown {
  h1 {
    font-size: 3rem;
  }
  h2 {
    font-size: 2.5rem;
  }
  h3 {
    font-size: 2rem;
  }
  h4 {
    font-size: 1.5rem;
  }
  h5 {
    font-size: 1.25rem;
  }
  h6 {
    font-size: 1rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-weight: bold;
    > a {
      color: inherit;
    }
  }
  a {
    text-decoration: none;
  }

  p {
    font-size: 1rem;
  }
  ul {
    list-style-type: disc;
  }
  ol {
    list-style-type: decimal;
  }
  blockquote {
    border-left: 2px solid #ccc;
    margin-left: 0;
    padding-left: 10px;
  }
  pre {
    background-color: #f4f4f4;
    padding: 1em;
    overflow: auto;
  }
}
</style>
