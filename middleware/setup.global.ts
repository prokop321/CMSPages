export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path === "/setup") return;
  const mainStore = useMainStore();

  if (
    !mainStore.cmsConfig.ghKey ||
    !mainStore.cmsConfig.ghRepo ||
    !mainStore.cmsConfig.ghUser
  ) {
    useRouter().replace("/setup");
  }
});
