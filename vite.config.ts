import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Enable minification and tree shaking
    minify: "esbuild",

    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Split vendor libraries into separate chunks
          if (id.includes("node_modules")) {
            if (
              id.includes("react") ||
              id.includes("react-dom") ||
              id.includes("react-router")
            ) {
              return "vendor-react";
            }
            if (id.includes("@radix-ui") || id.includes("lucide-react")) {
              return "vendor-ui";
            }
            if (id.includes("framer-motion")) {
              return "vendor-animation";
            }
            if (id.includes("three") || id.includes("@react-three/fiber")) {
              return "vendor-three";
            }
            if (id.includes("react-hook-form") || id.includes("zod")) {
              return "vendor-form";
            }
            if (
              id.includes("clsx") ||
              id.includes("tailwind-merge") ||
              id.includes("class-variance-authority")
            ) {
              return "vendor-utils";
            }
            return "vendor-other";
          }
        },
      },
    },

    // Optimize assets
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb

    // Enable source maps only in development
    sourcemap: mode === "development",

    // Target modern browsers for better optimization
    target: "esnext",
  },

  // Optimize dependencies
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "framer-motion",
      "lucide-react",
      "clsx",
      "tailwind-merge",
    ],
    exclude: ["three", "@react-three/fiber", "@types/three"], // Heavy 3D libs - lazy load these
  },
}));
