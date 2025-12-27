import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "localhost", // Use localhost for your computer
    port: 5173,        // You can change this to 5173 (standard Vite port) if you prefer
  },
  plugins: [react()],  // Removed componentTagger() which is only for Lovable
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // This fixes the @ imports from your first message
    },
  },
});