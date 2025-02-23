type TContentFieldTypes =
  | "date"
  | "string"
  | "markdown"
  | "images"
  | "weekSchedule";

type BucketMap = { [key: string]: Blob };

type AppStorage = {
  "map.app.json": Blob;
  bucket: BucketMap;
  content: {
    [key: string]: Blob;
  };
};

type SpacesMap = {
  spaces: {
    [key: string]: SpaceMap;
  };
  files: {
    [key: string]: FileMapObject;
  };
};

interface FileMapObject {
  added: number;
  type: "image";
}

interface FileInfo extends FileMapObject {
  name: string;
}

type SpaceMap = {
  keyGen?: string;
  fields: {
    [key: string]: TContentFieldTypes;
  };
};

type Spaces = {
  [key: string]: Space | null;
};

type Space = {
  [key: string]: {
    [key: string]: string | number | string[] | TWeekSchedule;
  };
};

type TWeekSchedule = {
  day: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  start: number;
  duration: number;
};
