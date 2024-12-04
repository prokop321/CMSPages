<template>
  <button
    v-if="!props.linkTo"
    :class="
      type === 'red'
        ? {
            'bg-remove': true,
            'hover:bg-removeDark': true,
          }
        : {
            'bg-primary': true,
            'hover:bg-primaryDark': true,
          }
    "
    class="flex h-14 items-center justify-center rounded-xl border-primary p-4 text-background"
  >
    <slot />
  </button>
  <NuxtLink
    v-else
    :to="props.linkTo"
    :class="
      type === 'red'
        ? {
            'bg-remove': true,
            'hover:bg-removeDark': true,
          }
        : {
            'bg-primary': true,
            'hover:bg-primaryDark': true,
          }
    "
    class="flex h-14 items-center justify-center rounded-xl border-primary p-4 text-background"
  >
    <slot />
  </NuxtLink>
</template>

<script lang="ts" setup>
const props = defineProps<{
  linkTo?: string;
  type?: "red";
}>();
</script>
