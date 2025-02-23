export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path === "/setup") return;
  const mainStore = useMainStore();

  if (
    !mainStore.cmsConfig.default.ghKey ||
    !mainStore.cmsConfig.default.ghRepo ||
    !mainStore.cmsConfig.default.ghUser
  ) {
    useRouter().replace("/setup");
  }
});
