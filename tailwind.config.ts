import type { Config } from "tailwindcss";

const config: Config = {
  content: [],
  theme: {
    colors: {
      fill: "var(--fill-color)",
      primary: "var(--primary-color)",
      text: "var(--text-color)",
      darkFill: "var(--dark-fill-color)",
      background: "var(--background-color)",
      primaryDark: "var(--primary-dark-color)",
      blackTransparent: "var(--black-transparent-color)",
      remove: "var(--remove-color)",
      removeDark: "var(--remove-dark-color)",
    },
  },
};

export default config;
