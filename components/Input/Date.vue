<template>
  <InputWrapper :title="title">
    <input type="date" :value="date" @input="updateDate" />
    <input type="time" :value="time" @input="updateTime" />
  </InputWrapper>
</template>

<script lang="ts" setup>
defineProps<{
  title: string;
}>();

const value = defineModel<string>();

const stableISO = computed(() => {
  if (!value.value || typeof value.value !== "string") {
    const date = new Date();
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date.toISOString();
  }
  return value.value;
});

const date = computed(() => {
  return stableISO.value.split("T")[0];
});

const time = computed(() => {
  let hours: any = new Date(stableISO.value).getHours();
  let minutes: any = new Date(stableISO.value).getMinutes();
  if (minutes < 10) minutes = `0${minutes}`;

  if (hours < 10) hours = `0${hours}`;
  return `${hours}:${minutes}`;
});

const updateDate = (e: Event) => {
  const valueAsDate = (e.target as HTMLInputElement).value;
  const newDate = new Date(stableISO.value);
  newDate.setFullYear(parseInt(valueAsDate.split("-")[0]));
  newDate.setMonth(parseInt(valueAsDate.split("-")[1]) - 1);
  newDate.setDate(parseInt(valueAsDate.split("-")[2]));
  const date = newDate.toISOString();
  if (!date) return;
  value.value = date;
};

const updateTime = (e: Event) => {
  const valueAsTime = (e.target as HTMLInputElement).value;
  console.log(valueAsTime);
  const newDate = new Date(stableISO.value);
  newDate.setHours(parseInt(valueAsTime.split(":")[0]));
  newDate.setMinutes(parseInt(valueAsTime.split(":")[1]));
  const date = newDate.toISOString();
  if (!date) return;
  value.value = date;
};
</script>
