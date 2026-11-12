#!/usr/bin/env node
/**
 * FORMA: capture only public HTML, CSS, JS, and static resources of the live site.
 * This captures a COMPILED DISTRIBUTION, NOT the original React source.
 * Read-only HTTP requests; no Vercel credentials; never deploys or pushes Git.
 *
 * Usage: node scripts/capture-forma-public.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const BASE = new URL('https://forma-publier-maintenant.vercel.app/');
const DEST = path.resolve('forma-public-build');
const MAX_FILES = 450;
const MAX_TOTAL_BYTES = 140 * 1024 * 1024;
const MAX_SINGLE_BYTES = 32 * 1024 * 1024;
const ASSET = /\.(?:m?js|css|json|png|jpe?g|gif|webp|avif|svg|ico|woff2?|ttf|otf|mp4|webm|glb|gltf|wasm|webmanifest|txt)$/i;

const queue = [BASE.toString()];
const seen = new Set();
const successes = [];
const failures = [];
let total = 0;

function add(raw, parent) {
  if (typeof raw !== 'string') return;
  raw = raw.replaceAll('&amp;', '&').trim();
  if (!raw || raw[0] === '#' || /^(?:data|blob|javascript|mailto|tel):/i.test(raw)) return;
  let url;
  try { url = new URL(raw, parent); } catch { return; }
  if (url.protocol !== 'https:' || url.origin !== BASE.origin) return;
  if (!ASSET.test(url.pathname)) return;
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/_next/data/')) return;
  url.search = ''; url.hash = '';
  const href = url.toString();
  if (!seen.has(href) && !queue.includes(href)) queue.push(href);
}

function discover(text, parent) {
  const patterns = [
    /\b(?:src|href|poster|content)\s*=\s*["']([^"'<>]+)["']/g,
    /\burl\(\s*["']?([^)"']+)["']?\s*\)/g,
    /\b(?:import\s*\(|from\s*|new\s+URL\s*\()\s*["']([^"']+)["']/g,
    /["'`]((?:\/|\.\.?\/)[^"'\s`]+?\.(?:m?js|css|json|png|jpe?g|gif|webp|avif|svg|ico|woff2?|ttf|otf|mp4|webm|glb|gltf|wasm)(?:\?[^"'`\s]*)?)["'`]/g,
    /\b(?:srcset)\s*=\s*["']([^"']+)["']/g
  ];
  for (let i = 0; i < patterns.length; i++) {
    for (const match of text.matchAll(patterns[i])) {
      if (i === 4) {
        for (const part of match[1].split(',')) add(part.trim().split(/\s+/)[0], parent);
      } else add(match[1], parent);
    }
  }
}

function safeTarget(url) {
  let rel;
  try { rel = decodeURIComponent(url.pathname.slice(1)); }
  catch { throw new Error('Invalid URI encoding'); }
  if (!rel) rel = 'index.html';
  if (rel.includes('\\') || rel.split('/').some(s => s === '..' || s === '.'))
    throw new Error('Unsafe resource path');
  const target = path.resolve(DEST, rel);
  if (!target.startsWith(DEST + path.sep)) throw new Error('Unsafe path');
  return {rel, target};
}

async function capture(href) {
  const url = new URL(href);
  const {rel, target} = safeTarget(url);
  const response = await fetch(url, {
    redirect: 'follow',
    headers: {'User-Agent': 'Mozilla/5.0 (compatible; FORMA-public-archive/1.0)'},
    signal: AbortSignal.timeout(18000)
  });
  if (!response.ok) throw new Error('HTTP ' + response.status);
  if (new URL(response.url).origin !== BASE.origin) throw new Error('Cross-origin redirect');
  const declared = Number(response.headers.get('content-length') || '0');
  if (declared > MAX_SINGLE_BYTES) throw new Error('File too large');
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length > MAX_SINGLE_BYTES || total + bytes.length > MAX_TOTAL_BYTES)
    throw new Error('Archive size limit reached');
  const type = response.headers.get('content-type') || '';
  if (rel === 'index.html') {
    const html = bytes.toString('utf8');
    if (!type.includes('html') || !/forma/i.test(html) || /Vercel Authentication|Authentication Required|Log in to Vercel/i.test(html))
      throw new Error('Home page is not the public FORMA site; aborted');
  }
  fs.mkdirSync(path.dirname(target), {recursive: true});
  fs.writeFileSync(target, bytes);
  total += bytes.length;
  successes.push({path:rel, bytes:bytes.length, contentType:type});
  const textual = /\.(?:html|js|mjs|css|json|svg|txt|webmanifest)$/i.test(rel) || /(?:text\/|javascript|json)/i.test(type);
  if (textual && bytes.length <= 10 * 1024 * 1024) discover(bytes.toString('utf8'), href);
  process.stdout.write('  OK ' + rel + ' (' + bytes.length + ' bytes)\n');
}

if (fs.existsSync(DEST)) {
  console.error('Refusing to overwrite existing directory:', DEST);
  process.exit(1);
}
fs.mkdirSync(DEST, {recursive: true});
while (queue.length && seen.size < MAX_FILES) {
  const href = queue.shift();
  if (seen.has(href)) continue;
  seen.add(href);
  try {
    await capture(href);
  } catch (err) {
    failures.push({url:href, reason:String(err.message || err)});
    console.error('  FAILED', href, String(err.message || err));
    if (href === BASE.toString()) break;
  }
}
const summary = {
  timestamp:new Date().toISOString(),
  liveUrl:BASE.toString(),
  kind:'public-compiled-distribution-not-original-source',
  sourceMaps:'not recovered unless publicly linked in assets',
  entriesDownloaded:successes.length,
  totalBytes:total,
  limitReached:queue.length > 0,
  downloaded:successes,
  failed:failures
};
fs.writeFileSync(path.join(DEST,'_CAPTURE_REPORT.json'), JSON.stringify(summary,null,2));
console.log('\nPublic capture completed:', successes.length, 'downloaded,', failures.length, 'failed.');
console.log('Saved at:', DEST);
console.log('IMPORTANT: this is a compiled snapshot, NOT editable original source code.');
console.log('Next: visually inspect, test navigation/options, and reconstruct an editable project.');
if (!successes.some(x => x.path === 'index.html') || !successes.some(x => /\.(?:m?js)$/.test(x.path))) {
  console.error('Capture incomplete: missing home page or JS bundle.');
  process.exitCode = 1;
}
