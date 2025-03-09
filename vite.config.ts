import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

const HOST = 'http://management.bawab-ip.com/server/api';
const DEV_HOST = 'http://localhost/ipaz-server/api.php';

const HOST_SERVER = `http://management.bawab-ip.com/server/api`;
const DEV_SERVER = `http://localhost/ipaz-server`;

const IMAGE_SERVER = `/server/uploads/`;
const IMAGE_DEV = `http://localhost/ipaz-server/uploads/`;

const baseURL = process.env.NODE_ENV === 'production' ? HOST : DEV_HOST;
const serverURL = process.env.NODE_ENV === 'production' ? HOST_SERVER : DEV_SERVER;
const imageURL = process.env.NODE_ENV === 'production' ? IMAGE_SERVER : IMAGE_DEV;

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [solid()],

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  //
  // 1. prevent vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 3000,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
  define: {
    API_BASE_URL: JSON.stringify(baseURL),
    SERVER_URL: JSON.stringify(serverURL),
    IMAGE_URL: JSON.stringify(imageURL)
  },
}));
