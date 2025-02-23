<template>
  <InputWrapper :title="title">
    <template v-if="value">
      <select v-model="value.day" class="w-24">
        <option v-for="day in 7" :value="day - 1" :key="day">
          {{ weekDays[day - 1] }}
        </option>
      </select>

      <input
        type="time"
        :value="dayMilsToTime(value.start)"
        class="w-24"
        @input="
          (e) => {
            if (!value) return;
            e;
            const parts = (e.target as HTMLInputElement).value.split(':');
            const hours = parseInt(parts[0]);
            const minutes = parseInt(parts[1]);
            const mils = (hours * 60 + minutes) * 60 * 1000;
            value.start = mils;
          }
        " />

      <div>
        <input
          type="number"
          placeholder="hours"
          class="w-24"
          :value="Math.floor(value.duration / 1000 / 60 / 60)"
          @input="
            (e) => {
              if (!value) return;
              let newHours = parseInt((e.target as HTMLInputElement).value);
              if (!newHours) newHours = 0;
              else if (newHours > 23) newHours = 23;
              else if (newHours < 0) newHours = 0;
              const newHourMils = newHours * 60 * 60 * 1000;
              const currentHoursMils =
                Math.floor(value.duration / 1000 / 60 / 60) * 60 * 60 * 1000;
              const newMils = value.duration - currentHoursMils + newHourMils;
              value = { ...value, duration: newMils };
            }
          "
        />
        <span>:</span>
        <input
          type="number"
          placeholder="minutes"
          class="w-24"
          :value="Math.floor((value.duration / 1000 / 60) % 60)"
          @input="
            (e) => {
              if (!value) return;
              let newMinutes = parseInt((e.target as HTMLInputElement).value);
              if (!newMinutes) newMinutes = 0;
              else if (newMinutes > 59) newMinutes = 59;
              else if (newMinutes < 0) newMinutes = 0;
              const currentHours = Math.floor(value.duration / 1000 / 60 / 60);
              newMinutes += currentHours * 60;
              const newMils = newMinutes * 60 * 1000;
              value.duration = newMils;
            }
          "
        /></div></template
  ></InputWrapper>
</template>

<script lang="ts" setup>
defineProps<{
  title: string;
}>();

const value = defineModel<TWeekSchedule>();

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const dayMilsToTime = (mils: number) => {
  const hours = Math.floor(mils / 3600000);
  const minutes = Math.floor((mils % 3600000) / 60000);
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};
</script>
