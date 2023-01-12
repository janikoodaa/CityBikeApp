// https://vitejs.dev/config/
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
     plugins: [react()],
     server: { open: true },
});

// For https, add one import, and define plugins and server like below:
// import basicSsl from "@vitejs/plugin-basic-ssl";

// export default defineConfig({
//      plugins: [react(), basicSsl()],
//      server: { open: true, https: true },
// });
