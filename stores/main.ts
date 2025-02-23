import axios from "axios";

export const useMainStore = defineStore("main", () => {
  const cmsConfig = reactive({
    ghUser: "",
    ghRepo: "",
    ghKey: "",
  });

  const unsavedChanges = ref(false);

  const map = ref<SpacesMap>({ spaces: {}, files: {} });
  const bucket = ref<{ [key: string]: Blob | null }>({});
  const spaces = ref<Spaces>({});

  const appPrefix = computed(
    () => "https://" + cmsConfig.ghUser + ".github.io/" + cmsConfig.ghRepo,
  );

  const loadContent = async (id: string): Promise<Space | false> => {
    try {
      if (spaces.value[id]) return spaces.value[id];
      const contentFetch = await axios(
        "https://" +
          cmsConfig.ghUser +
          ".github.io/" +
          cmsConfig.ghRepo +
          "/content/" +
          id +
          ".json",
      ).catch((e) => {
        console.error(e);
      });

      if (contentFetch && contentFetch.data) {
        spaces.value[id] = contentFetch.data;
        return contentFetch.data;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const uploadFiles = async (
    files: File[],
    contentType: "image",
  ): Promise<string[]> => {
    if (!map.value.files) map.value.files = {};
    const fileURLs: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const fileFullName = file.name;
      const fileParts = fileFullName.split(".");
      const fileName = fileParts[0].replace(" ", "-");
      const fileType = fileParts[fileParts.length - 1];
      let fileNameIndex = 0;

      // Check if file with same name exists
      while (
        map.value.files[
          fileName + (fileNameIndex ? "-" + fileNameIndex : "") + "." + fileType
        ]
      ) {
        fileNameIndex++;
      }

      const finalFileName =
        fileName + (fileNameIndex ? "-" + fileNameIndex : "") + "." + fileType;

      bucket.value[finalFileName] = file;

      map.value.files[finalFileName] = {
        added: Date.now(),
        type: contentType,
      };

      fileURLs.push("/bucket/" + finalFileName);
    }
    return fileURLs;
  };

  const deleteFiles = async (fileNames: string[]) => {
    for (let i = 0; i < fileNames.length; i++) {
      delete bucket.value[fileNames[i]];
      delete map.value.files[fileNames[i]];
      bucket.value[fileNames[i]] = null;
    }
  };

  const createSpace = (id: string) => {
    if (map.value.spaces[id]) return;
    spaces.value[id] = {};
    map.value.spaces[id] = {
      fields: {},
    };
  };

  const deleteSpace = (id: string) => {
    if (!map.value.spaces[id]) return;
    delete map.value.spaces[id];
    spaces.value[id] = null;
  };

  const filePreviewer = (fileURl: string): string => {
    if (!fileURl.startsWith("/bucket/")) return fileURl;
    const fileParts = fileURl.split("/");
    const fileName = fileParts[fileParts.length - 1];
    if (bucket.value[fileName])
      return URL.createObjectURL(bucket.value[fileName]);
    return appPrefix.value + fileURl;
  };

  const upload = async (): Promise<boolean> => {
    const structure: { [name: string]: Blob } = {};
    const spaceCopy = JSON.parse(JSON.stringify(spaces.value));

    for (const key in spaces.value) {
      const blob = new Blob([JSON.stringify(spaceCopy[key])], {
        type: "application/json",
      });
      structure[key + ".json"] = blob;
    }

    const mapFile = new Blob([JSON.stringify(map.value)], {
      type: "application/json",
    });

    return await pushToGithub(
      {
        "map.app.json": mapFile,
        content: structure,
        bucket: bucket.value,
      },
      {
        ghKey: cmsConfig.ghKey,
        ghUser: cmsConfig.ghUser,
        ghRepo: cmsConfig.ghRepo,
      },
    );
  };

  const loadLocal = async () => {
    const localConfig = localStorage.getItem("cmsConfig");
    if (localConfig) {
      Object.assign(cmsConfig, JSON.parse(localConfig));
    }
  };

  watch(
    cmsConfig,
    async () => {
      localStorage.setItem("cmsConfig", JSON.stringify(cmsConfig));
      try {
        const mapFetch = await axios(
          "https://" +
            cmsConfig.ghUser +
            ".github.io/" +
            cmsConfig.ghRepo +
            "/map.app.json?time=" +
            Date.now(),
          {},
        );
        if (mapFetch.data) {
          map.value = mapFetch.data;
        }
      } catch (e) {}
    },
    { deep: true },
  );

  loadLocal();

  return {
    unsavedChanges,
    filePreviewer,
    deleteSpace,
    bucket,
    upload,
    spaces,
    appPrefix,
    loadContent,
    uploadFiles,
    createSpace,
    cmsConfig,
    map,
    deleteFiles,
  };
});
