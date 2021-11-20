import vue from "@vitejs/plugin-vue";
import path from "path";

/**
 * @type {import('vite').UserConfig}
 */
export default {
  resolve: {
    alias: { "@": path.resolve("src") },
  },
  plugins: [vue()],
  server: {
    port: 8080,
  },
};
