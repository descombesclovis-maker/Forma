// Vite uses Connect; the production entry point receives the same request via Vercel.
import { handleContact } from "./contact.mjs";

export function contactMiddleware(handle = handleContact()) {
  return async (req, res, next) => {
    const url = new URL(req.url || "/", "http://localhost");
    if (url.pathname !== "/api/contact") return next();
    res.status = status => { res.statusCode = status; return res; };
    res.json = data => { res.setHeader("Content-Type", "application/json"); res.end(JSON.stringify(data)); };
    req.query = Object.fromEntries(url.searchParams);
    if (req.method === "POST") {
      let size = 0;
      const chunks = [];
      for await (const chunk of req) {
        size += chunk.length;
        if (size > 32000) return res.status(413).json({recorded:false});
        chunks.push(chunk);
      }
      try { req.body = JSON.parse(Buffer.concat(chunks).toString()); }
      catch { return res.status(400).json({recorded:false}); }
    }
    return handle(req, res);
  };
}
