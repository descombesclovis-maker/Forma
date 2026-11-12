#!/usr/bin/env node
/**
 * Read-only Vercel source recovery for FORMA.
 * Requires a locally authenticated Vercel CLI. Does NOT deploy, push or modify production.
 * Writes downloaded source ONLY to ./RECOVERED_FORMA until independently verified.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const DEPLOYMENT_ID = 'dpl_BPeJoGPWxSeE5kmpzF5WNCeTJdrp';
const PROJECT_HOST = 'forma-publier-maintenant.vercel.app';
const OUTPUT = path.resolve('RECOVERED_FORMA');
const teamId = process.env.FORMA_VERCEL_TEAM_ID || '';
const suffix = teamId ? '?teamId=' + encodeURIComponent(teamId) : '';
const cli = process.platform === 'win32' ? 'vercel.cmd' : 'vercel';

function api(route) {
  const r = spawnSync(cli, ['api', route, '--method', 'GET'], {
    encoding: 'utf8', windowsHide: true, maxBuffer: 48 * 1024 * 1024
  });
  if (r.error) throw new Error('Vercel CLI absent : installez-le (npm i -g vercel), puis vercel login.');
  if (r.status !== 0) throw new Error(
    'Accès Vercel refusé ou ressource introuvable. Connectez le compte qui possède FORMA : vercel login ; vercel switch. ' +
    'Détail CLI: ' + String(r.stderr || r.stdout).slice(0, 1000)
  );
  const stdout = String(r.stdout).trim();
  try { return JSON.parse(stdout); }
  catch { throw new Error('Réponse non JSON de Vercel. Vérifiez la version de la CLI et son support de "vercel api".'); }
}
function normalizeTree(tree, prefix = '') {
  const entries = [];
  for (const item of Array.isArray(tree) ? tree : (tree?.files || tree?.items || [])) {
    const name = item.name || '';
    const relative = prefix ? prefix + '/' + name : name;
    if (!relative || relative.includes('\0')) continue;
    if (item.type === 'directory' || item.type === 'dir') {
      entries.push(...normalizeTree(item.children || [], relative));
    } else if (item.type === 'file') {
      entries.push({ relative, uid: item.uid || item.id });
    }
  }
  return entries;
}
function safe(relative) {
  const normalized = path.posix.normalize(relative.replaceAll('\\', '/'));
  if (normalized.startsWith('/') || normalized === '..' || normalized.startsWith('../')
      || /^[A-Za-z]:/.test(normalized)) throw new Error('Chemin interdit : ' + relative);
  const segments = normalized.split('/');
  if (segments.includes('node_modules') || segments.includes('.vercel') || segments.includes('.git')) return false;
  if (segments.some(x => /^\.env(\.|$)/i.test(x))) return false;
  if (/\.(pem|p12|pfx|key)$/i.test(normalized)) return false;
  if (normalized.endsWith('vercel.json') && !segments.length) return true;
  return true;
}
function contentFromJson(r, file) {
  const encoded = r?.content ?? r?.data?.content ?? r?.file?.content;
  if (typeof encoded !== 'string') throw new Error('Réponse fichier invalide pour ' + file);
  if ((r?.encoding || 'base64') !== 'base64') throw new Error('Encodage inattendu pour ' + file);
  if (!/^[A-Za-z0-9+/=\r\n]*$/.test(encoded)) throw new Error('Base64 incorrect : ' + file);
  return Buffer.from(encoded, 'base64');
}
try {
  const deployment = api('/v13/deployments/' + DEPLOYMENT_ID + suffix);
  const hostname = deployment?.url || deployment?.deployment?.url || '';
  console.log('Déploiement identifié : ' + (hostname || DEPLOYMENT_ID));
  const tree = api('/v6/deployments/' + DEPLOYMENT_ID + '/files' + suffix);
  const files = normalizeTree(tree);
  if (!files.length) {
    throw new Error(
      'Aucune arborescence source fournie par Vercel. Ce déploiement peut être lié à Git : ' +
      'repérer son dépôt dans Vercel > Project > Settings > Git ou dans le champ gitSource du déploiement.'
    );
  }
  if (files.length < 10) throw new Error('Seulement ' + files.length + ' fichiers : source probablement incomplète, arrêt.');
  if (fs.existsSync(OUTPUT)) throw new Error('Le dossier RECOVERED_FORMA existe déjà ; sauvegardez-le avant un nouvel essai.');
  fs.mkdirSync(OUTPUT, {recursive:true});
  let recovered = 0;
  const errors = [];
  for (const f of files) {
    try {
      if (!safe(f.relative)) { console.log('Ignoré (secret/cache) : ' + f.relative); continue; }
      if (!f.uid) throw new Error('Identifiant de fichier manquant');
      const fileUrl = '/v8/deployments/' + DEPLOYMENT_ID +
        '/files/' + encodeURIComponent(f.uid) +
        '?path=' + encodeURIComponent(f.relative) + (teamId ? '&teamId=' + encodeURIComponent(teamId) : '');
      const data = contentFromJson(api(fileUrl), f.relative);
      const target = path.resolve(OUTPUT, f.relative);
      if (!target.startsWith(OUTPUT + path.sep)) throw new Error('Chemin dangereux');
      fs.mkdirSync(path.dirname(target), {recursive:true});
      fs.writeFileSync(target, data);
      recovered++;
      console.log('OK ' + f.relative + ' (' + data.length + ' octets)');
    } catch (e) { errors.push(f.relative + ': ' + e.message); }
  }
  if (errors.length) {
    fs.writeFileSync(path.join(OUTPUT, '_RECOVERY_ERRORS.txt'), errors.join('\n'));
    throw new Error(recovered + '/' + files.length + ' récupérés. Certains fichiers ont échoué. ' +
      'AUCUNE intégration Git à ce stade. Voir RECOVERED_FORMA/_RECOVERY_ERRORS.txt');
  }
  console.log('\n' + recovered + ' fichiers récupérés dans ' + OUTPUT);
  console.log('Étape suivante : vérifier composants, versions, médias et exécution locale AVANT de copier vers la racine.');
  console.log('Ne pas publier automatiquement : le site de production ne doit pas changer.');
} catch (err) {
  console.error('\nRECUPERATION ARRÊTÉE : ' + err.message);
  console.error('Compte ciblé : ' + PROJECT_HOST + '. Déploiement attendu : ' + DEPLOYMENT_ID);
  process.exitCode = 1;
}
