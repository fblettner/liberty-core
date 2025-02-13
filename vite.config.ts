import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import path from 'path';

export default defineConfig({
  plugins: [react(), dts()],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "LibertyCore",
      fileName: (format) => `liberty-core.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
  resolve: {
    alias: {
      // Map '@' to the 'src' directory for absolute imports
     // '@': path.resolve(__dirname, 'src'),
      "@ly_types": path.resolve(__dirname, 'src/types'),
      "@ly_utils": path.resolve(__dirname, 'src/utils'),
      "@ly_styles": path.resolve(__dirname, 'src/styles'),
      "@ly_translations": path.resolve(__dirname, 'src/translations'),
      "@ly_common": path.resolve(__dirname, 'src/common'),
      "@ly_charts": path.resolve(__dirname, 'src/charts'),
    },
  },
});