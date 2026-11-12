#!/usr/bin/env node
/** Local preview of a captured production build; no dependencies or deployment. */
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
const root=path.resolve('forma-public-build');
const port=Number(process.env.PORT||4179);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.json':'application/json','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.ico':'image/x-icon','.webp':'image/webp','.avif':'image/avif','.gif':'image/gif','.woff':'font/woff','.woff2':'font/woff2','.ttf':'font/ttf','.mp4':'video/mp4','.webm':'video/webm','.wasm':'application/wasm','.glb':'model/gltf-binary'};
if(!fs.existsSync(path.join(root,'index.html'))) {console.error('Missing forma-public-build/index.html: run capture script first.');process.exit(1);}
http.createServer((req,res)=>{
 try {
  const url = new URL(req.url||'/', 'http://localhost');
  let pathname = decodeURIComponent(url.pathname);
  if (pathname.includes('\\') || pathname.split('/').includes('..')) throw new Error('Invalid path');
  let dest = path.resolve(root, '.'+pathname);
  if (!(dest===root || dest.startsWith(root+path.sep))) throw new Error('Invalid path');
  if (fs.existsSync(dest) && fs.statSync(dest).isDirectory()) dest=path.join(dest,'index.html');
  if (!fs.existsSync(dest) && !path.extname(pathname)) dest=path.join(root,'index.html');
  if (!fs.existsSync(dest) || !fs.statSync(dest).isFile()) {res.writeHead(404);res.end('Not Found');return;}
  res.setHeader('Content-Type',types[path.extname(dest).toLowerCase()]||'application/octet-stream');
  res.setHeader('Cache-Control','no-store');
  fs.createReadStream(dest).pipe(res);
 } catch {res.writeHead(400);res.end('Bad Request');}
}).listen(port,'127.0.0.1',()=>console.log('FORMA public-build preview: http://127.0.0.1:'+port));
