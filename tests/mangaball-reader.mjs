import test from 'node:test';
import assert from 'node:assert/strict';

process.env.REDIS_URL='redis://127.0.0.1:1';

const {mangaBallChapterPagesFromHtml}=await import('../lib/mangaball-provider.mjs');

test('extracts only reader pages from MangaBall-like public HTML',()=>{
  const html=`
    <html><body>
      <img src="https://mangaball.net/logo.png" alt="logo">
      <div class="reading-content">
        <img data-src="https://cdn.example.test/chapter/001.webp" alt="Page 1">
        <img data-src="https://cdn.example.test/chapter/002.webp" alt="Page 2">
        <img data-src="https://cdn.example.test/chapter/003.webp" alt="Page 3">
        <img src="https://cdn.example.test/ads/banner.webp" alt="advert banner">
      </div>
    </body></html>`;
  const pages=mangaBallChapterPagesFromHtml(html);
  assert.deepEqual(pages,[
    {index:1,url:'https://cdn.example.test/chapter/001.webp'},
    {index:2,url:'https://cdn.example.test/chapter/002.webp'},
    {index:3,url:'https://cdn.example.test/chapter/003.webp'},
  ]);
});

test('does not guess a reader from generic page imagery',()=>{
  const html='<main><img src="https://cdn.example.test/cover.webp" alt="Cover"></main>';
  assert.deepEqual(mangaBallChapterPagesFromHtml(html),[]);
});

test('deduplicates reader page URLs',()=>{
  const html=`<div id="readerarea">
    <img src="https://cdn.example.test/p1.webp">
    <img data-src="https://cdn.example.test/p1.webp">
    <img src="https://cdn.example.test/p2.webp">
  </div>`;
  assert.deepEqual(mangaBallChapterPagesFromHtml(html),[
    {index:1,url:'https://cdn.example.test/p1.webp'},
    {index:2,url:'https://cdn.example.test/p2.webp'},
  ]);
});
