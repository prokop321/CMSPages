<template>
  <section class="flex justify-center px-4">
    <div class="flex w-full max-w-7xl flex-col gap-12 py-8">
      <div class="flex flex-col gap-2">
        <h1 class="text-4xl font-bold">Let's config your CMS server</h1>
        <p class="mt-4 text-lg">
          Please provide your GitHub token and the repository name you want to
          use as a CMS server.
        </p>
      </div>

      <div class="flex flex-col items-start gap-6">
        <div class="w-full">
          <label class="block text-lg font-bold" for="gh-repo"
            >GitHub repository</label
          >
          <input
            class="h-12 w-full max-w-md rounded-t-lg border-b-2 border-text px-2 text-lg focus:border-primary focus:outline-none"
            type="text"
            id="gh-repo"
            placeholder="user/repo"
            v-model="ghREPONAME"
          />
        </div>
        <div class="w-full">
          <label class="block text-lg font-bold" for="gh-token"
            >GitHub token</label
          >
          <input
            class="h-12 w-full max-w-md rounded-t-lg border-b-2 border-text px-2 text-lg focus:border-primary focus:outline-none"
            type="text"
            id="gh-token"
            placeholder="ghp_1234567890"
            v-model="ghTOKEN"
          />
        </div>
        <div>
          <Button
            class="text-white h-12 w-full max-w-md rounded-lg bg-primary font-bold"
            @click="save"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const mainStore = useMainStore();

definePageMeta({
  layout: "blank",
});

const ghREPONAME = ref(
  mainStore.cmsConfig.default.ghUser || mainStore.cmsConfig.default.ghRepo
    ? mainStore.cmsConfig.default.ghUser +
        "/" +
        mainStore.cmsConfig.default.ghRepo
    : "",
);
const ghTOKEN = ref(mainStore.cmsConfig.default.ghKey || "");

const save = () => {
  mainStore.cmsConfig.default.ghUser = ghREPONAME.value.split("/")[0];
  mainStore.cmsConfig.default.ghRepo = ghREPONAME.value.split("/")[1];
  mainStore.cmsConfig.default.ghKey = ghTOKEN.value;
  useRouter().replace("/");
};
</script>
