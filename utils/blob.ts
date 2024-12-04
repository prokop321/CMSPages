export function convert(spacesMap: SpacesMap, spaces: Spaces): AppStorage {
  const storage: AppStorage = {
    "map.app.json": new Blob([JSON.stringify(spacesMap)]),
    content: {},
    bucket: {},
  };

  return storage;
}
