
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173,
    strictPort: false, // Allow fallback to other ports
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize bundle size
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('react-router')) {
              return 'router-vendor';
            }
            if (id.includes('@radix-ui')) {
              return 'ui-vendor';
            }
            if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) {
              return 'form-vendor';
            }
            if (id.includes('@tanstack/react-query')) {
              return 'query-vendor';
            }
            if (id.includes('@supabase')) {
              return 'supabase-vendor';
            }
            if (id.includes('lucide-react') || id.includes('@iconify')) {
              return 'icons-vendor';
            }
            if (id.includes('date-fns') || id.includes('moment')) {
              return 'date-vendor';
            }
            // Other vendor libraries
            return 'vendor';
          }

          // Feature-based chunks
          if (id.includes('src/pages/student')) {
            return 'student-pages';
          }
          if (id.includes('src/pages/owner')) {
            return 'owner-pages';
          }
          if (id.includes('src/pages/admin')) {
            return 'admin-pages';
          }
          if (id.includes('src/components/payment') || id.includes('src/utils/paystackIntegration')) {
            return 'payment';
          }
          if (id.includes('src/components/booking')) {
            return 'booking';
          }
          if (id.includes('src/components/property') || id.includes('src/components/properties')) {
            return 'property';
          }
          if (id.includes('src/services/database')) {
            return 'database';
          }
        },
        // Optimize asset naming
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || '')) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext || '')) {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable source maps for production debugging
    sourcemap: mode === 'production' ? 'hidden' : true,
    // Minification options (using esbuild for better performance)
    minify: 'esbuild',
    // Target modern browsers for better optimization
    target: 'esnext',
    // Enable CSS code splitting
    cssCodeSplit: true,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.ts'],
    globals: true,
    include: ['src/tests/**/*.{test,spec}.{ts,tsx}'],
  }
}));
