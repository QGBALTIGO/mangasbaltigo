import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../server.mjs', import.meta.url), 'utf8');
const routes = [
  '/api/miniapp/v1/health',
  '/api/miniapp/v1/home',
  '/api/miniapp/v1/catalog',
  '/api/miniapp/v1/reading',
  '/api/miniapp/v1/anime/:id',
  '/api/mangaball/home',
  '/api/mangaball/updates',
  '/api/manga/:id/chapter',
];

for (const route of routes) {
  const matches = source.split(route).length - 1;
  assert.equal(matches, 1, `expected exactly one route for ${route}, got ${matches}`);
}

assert.match(source, /const miniappEnvelope=data=>\(\{ok:true,apiVersion:'1',source:'mangas-baltigo'/);
assert.match(source, /const getHomePayload=async\(\)=>cacheRemember\('home:mangaball:v1'/);
assert.match(source, /mangaBallChapterByInternalId/);
assert.match(source, /ANIME_DISABLED/);

console.log('Mangás Baltigo Mini App API v1 contract: OK');
