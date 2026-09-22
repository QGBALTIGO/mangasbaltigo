import test from 'node:test';
import assert from 'node:assert/strict';

process.env.DATABASE_URL='postgres://mangas:mangas@127.0.0.1:1/mangas';
process.env.REDIS_URL='redis://127.0.0.1:1';
process.env.PERSIST_MEDIA_CACHE='false';

const {mangaBallChapterPagesFromHtml}=await import('../lib/mangaball-provider.mjs');

test('MangaBall chapter parser keeps reader pages and removes UI images',()=>{
  const html=`<html><body>
    <img src="https://cdn.example/logo.png" class="logo">
    <main id="readerarea">
      <img data-src="https://cdn.example/chapter/001.webp" width="900" height="1400">
      <img data-lazy-src="https://cdn.example/chapter/002.webp" width="900" height="1400">
      <img src="https://cdn.example/chapter/002.webp" width="900" height="1400">
      <img src="http://insecure.example/003.webp" width="900" height="1400">
    </main>
  </body></html>`;
  assert.deepEqual(mangaBallChapterPagesFromHtml(html),[
    {index:1,url:'https://cdn.example/chapter/001.webp'},
    {index:2,url:'https://cdn.example/chapter/002.webp'}
  ]);
});
