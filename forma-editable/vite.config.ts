import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Serve the captured public assets from the repo without any Vercel dependency.
  publicDir: 'public',
  server: { strictPort: true },
  preview: { strictPort: true },
});
