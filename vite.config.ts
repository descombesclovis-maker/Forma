import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { contactMiddleware } from './server/contact-dev.mjs';

export default defineConfig(({ mode }) => {
  // Only VITE_ variables are published by Vite. All SMTP, bot and DB settings stay in Node.
  const settings = loadEnv(mode, process.cwd(), ['CONTACT_', 'TELEGRAM_', 'FORMA_FOUNDER_', 'VITE_FORMA_SUPABASE_']);
  for (const [key,value] of Object.entries(settings)) process.env[key] ??= value;
  return {
    plugins: [react(), {
      name: 'forma-contact-local',
      configureServer(server) { server.middlewares.use(contactMiddleware()); },
      configurePreviewServer(server) { server.middlewares.use(contactMiddleware()); },
    }],
    publicDir: 'public',
    server: { strictPort: true },
    preview: { strictPort: true },
  };
});
