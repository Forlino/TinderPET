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
        manualChunks: {
          // Separate vendor libraries into chunks
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-ui": [
            "@radix-ui/react-accordion",
            "@radix-ui/react-alert-dialog",
            "@radix-ui/react-avatar",
            "@radix-ui/react-button",
            "@radix-ui/react-card",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-label",
            "@radix-ui/react-popover",
            "@radix-ui/react-select",
            "@radix-ui/react-separator",
            "@radix-ui/react-switch",
            "@radix-ui/react-tabs",
            "@radix-ui/react-toast",
            "@radix-ui/react-tooltip",
          ],
          "vendor-animation": ["framer-motion"],
          "vendor-three": ["three", "@react-three/fiber", "@types/three"],
          "vendor-form": ["react-hook-form", "@hookform/resolvers", "zod"],
          "vendor-utils": [
            "class-variance-authority",
            "clsx",
            "tailwind-merge",
            "lucide-react",
          ],
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
    exclude: ["three", "@react-three/fiber"], // Heavy 3D libs - lazy load these
  },
}));
