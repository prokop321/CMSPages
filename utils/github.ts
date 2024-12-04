import axios from "axios";

type structure = {
  [name: string]: structure | Blob | null;
};

type baseStructure = {
  [path: string]: string;
};

export const pushToGithub = async (
  structure: structure,
  config: { ghKey: string; ghUser: string; ghRepo: string },
): Promise<boolean> => {
  try {
    const runtimeConfig = useRuntimeConfig();

    const ghToken = config.ghKey;
    const ghUser = config.ghUser;
    const ghRepo = config.ghRepo;

    const files: baseStructure = {};
    const filesToDelete: string[] = [];

    const decodeLayer = async (layer: structure, path: string) => {
      for (const key in layer) {
        if (layer[key] === null) {
          filesToDelete.push(path + key);
        } else if (layer[key] instanceof Blob) {
          const base64 = await fileToBase64(layer[key] as File);
          files[path + key] = base64;
        } else {
          await decodeLayer(layer[key] as structure, path + key + "/");
        }
      }
    };

    await decodeLayer(structure, "");

    const sha = (
      await axios.get(
        "https://api.github.com/repos/" +
          ghUser +
          "/" +
          ghRepo +
          "/branches/main",
        {
          headers: {
            Authorization: "Bearer " + ghToken,
          },
        },
      )
    ).data.commit.sha;

    const filesShas: {
      path: string;
      mode: "100644" | "100644";
      type: "blob" | "blob";
      sha?: string;
    }[] = [];

    for (const key in files) {
      const file = files[key];
      const fileRequest = await axios.post(
        "https://api.github.com/repos/" + ghUser + "/" + ghRepo + "/git/blobs",
        {
          content: file,
          encoding: "base64",
        },
        {
          headers: {
            Authorization: "Bearer " + ghToken,
          },
        },
      );
      const fileSha = fileRequest.data.sha;
      filesShas.push({
        path: key,
        mode: "100644",
        type: "blob",
        sha: fileSha,
      });
    }

    // for (const path of filesToDelete) {
    //   filesShas.push({
    //     path: path,
    //     mode: "100644",
    //     type: "blob",
    //   });
    // }

    const tree = await axios.post(
      "https://api.github.com/repos/" + ghUser + "/" + ghRepo + "/git/trees",
      {
        base_tree: sha,
        tree: [...filesShas],
      },
      {
        headers: {
          Authorization: "Bearer " + ghToken,
        },
      },
    );

    const treeSha = tree.data.sha;
    const commit = await axios.post(
      "https://api.github.com/repos/" + ghUser + "/" + ghRepo + "/git/commits",
      {
        message: Date.now().toString(),
        tree: treeSha,
        parents: [sha],
      },
      {
        headers: {
          Authorization: "Bearer " + ghToken,
        },
      },
    );

    await axios.patch(
      "https://api.github.com/repos/" +
        ghUser +
        "/" +
        ghRepo +
        "/git/refs/heads/main",
      {
        sha: commit.data.sha,
      },
      {
        headers: {
          Authorization: "Bearer " + ghToken,
        },
      },
    );

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      resolve(base64.split(",")[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};
