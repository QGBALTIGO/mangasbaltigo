'use strict';
(() => {
  if (window.__ANINEXUS_MANGA_ONLY__) return;
  window.__ANINEXUS_MANGA_ONLY__ = true;

  const IS_PAGES = location.hostname.endsWith('github.io');
  const BASE = IS_PAGES ? '/AniNexus' : '';
  const LEGACY_ANIME = [
    /^\/anime\//,
    /^\/animes(?:\/|$)/,
    /^\/melhores-animes-para-assistir$/,
    /^\/animes-mais-/,
    /^\/listas-de-animes$/,
    /^\/filmes-de-anime$/,
    /^\/meus-animes$/,
    /^\/anime-awards$/,
    /^\/descubra$/
  ];

  function route() {
    const url = new URL(location.href);
    const restored = url.searchParams.get('p');
    if (restored) return restored.split('?')[0].replace(/\/+$/, '') || '/';
    let path = url.pathname;
    if (IS_PAGES) path = path.replace(/^\/AniNexus/, '') || '/';
    return path.replace(/\/+$/, '') || '/';
  }

  function navigate(path, replace = true) {
    if (IS_PAGES) {
      const target = `${BASE}/?p=${encodeURIComponent(path)}`;
      replace ? location.replace(target) : location.assign(target);
      return;
    }
    if (window.AniNexusGo?.(path) === true) return;
    replace ? location.replace(path) : location.assign(path);
  }

  function enforceRoute() {
    const path = route();
    if (LEGACY_ANIME.some(rx => rx.test(path))) {
      navigate(path === '/meus-animes' ? '/meus-mangas' : '/mangas');
      return true;
    }
    return false;
  }

  function esc(value='') {
    return String(value).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  }
  function title(item) {
    return item?.title?.userPreferred || item?.title?.english || item?.title?.romaji || item?.title || 'Mangá';
  }
  function cover(item) {
    return item?.coverImage?.extraLarge || item?.coverImage?.large || item?.cover || '';
  }
  function score(item) {
    const n = Number(item?.averageScore || item?.score || 0);
    return n ? (n / 10).toFixed(1).replace('.0','') : '';
  }
  function slug(value='manga') {
    return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'').slice(0,90) || 'manga';
  }
  async function mangaPage(sort, perPage = 12) {
    const q = new URLSearchParams({page:'1',perPage:String(perPage),sort});
    try {
      const res = await fetch('/api/reading?' + q);
      if (res.ok) return res.json();
    } catch {}
    const query = `query($page:Int,$perPage:Int,$sort:[MediaSort]){Page(page:$page,perPage:$perPage){media(type:MANGA,isAdult:false,sort:$sort){id title{romaji english userPreferred} coverImage{extraLarge large} averageScore format genres chapters volumes status startDate{year month day}}}}`;
    const res = await fetch('https://graphql.anilist.co',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({query,variables:{page:1,perPage,sort:[sort]}})});
    const body = await res.json();
    return {items:body?.data?.Page?.media || []};
  }
  function card(item) {
    const name = title(item);
    return `<article class="media-card nx-manga-only-card" tabindex="0" data-manga-only-open="${Number(item.id)}" data-title="${esc(name)}">
      <div class="media-poster"><img loading="lazy" decoding="async" src="${esc(cover(item))}" alt="${esc(name)}">${score(item)?`<span class="score">★ ${score(item)}</span>`:''}<span class="format">${item.format==='ONE_SHOT'?'One-shot':'Mangá'}</span></div>
      <h3>${esc(name)}</h3><p>${esc((item.genres||[]).slice(0,2).join(', '))}</p>
    </article>`;
  }
  function rail(items) {
    return `<div class="media-grid">${items.map(card).join('')}</div>`;
  }
  function wireCards(root=document) {
    root.querySelectorAll('[data-manga-only-open]').forEach(el => {
      const open = () => navigate(`/manga/${slug(el.dataset.title)}-${el.dataset.mangaOnlyOpen}`, false);
      el.addEventListener('click', e => { if (!e.target.closest('button,a')) open(); });
      el.addEventListener('keydown', e => { if (e.key==='Enter' || e.key===' ') { e.preventDefault(); open(); } });
    });
  }

  async function mountHome() {
    if (route() !== '/') return;
    const app = document.querySelector('#app');
    if (!app) return;
    document.title = 'AniNexus — seu universo mangá';
    app.innerHTML = `
      <main class="nx-manga-only-home">
        <section class="hero">
          <div class="shell hero-inner">
            <div class="hero-copy">
              <div class="eyebrow">📚 SEU UNIVERSO MANGÁ</div>
              <h1>Descubra. Leia.<br><span class="accent">Acompanhe.</span></h1>
              <p>Catálogo de mangás, lançamentos, rankings, progresso de leitura, avaliações e comunidade em português.</p>
              <div class="hero-actions"><a class="btn primary" href="/mangas" data-link>Explorar mangás →</a><a class="btn" href="/meus-mangas" data-link>Minha biblioteca</a></div>
            </div>
            <div class="hero-art">
              <div class="float-card a">Leitura<b>Capítulos e volumes</b></div>
              <div class="hero-logo"><img src="./assets/logo.png" alt="AniNexus"></div>
              <div class="float-card b">Biblioteca<b>Progresso e notas</b></div>
              <div class="float-card c">Descubra<b>Novos mangás</b></div>
            </div>
          </div>
        </section>
        <section class="community-bar"><div class="shell community-inner"><span class="live-dot"></span><strong>Comunidade de leitores</strong><div class="activity-stream"><div class="activity"><i>MG</i><span>descubra mangás em alta</span></div><div class="activity"><i>CP</i><span>acompanhe seu progresso por capítulos</span></div><div class="activity"><i>★</i><span>avalie suas leituras</span></div></div></div></section>
        <section class="section"><div class="shell"><div class="section-head"><div><h2>Mangás em alta</h2><p>Os títulos que mais estão chamando atenção agora.</p></div><a href="/mangas" data-link>Ver catálogo</a></div><div id="nxMangaTrending"><div class="loading" style="height:280px"></div></div></div></section>
        <section class="section soft"><div class="shell"><div class="section-head"><div><h2>Mais bem avaliados</h2><p>Obras com destaque entre leitores.</p></div><a href="/mangas" data-link>Explorar</a></div><div id="nxMangaTop"><div class="loading" style="height:280px"></div></div></div></section>
        <section class="section"><div class="shell"><div class="section-head"><div><h2>Lançamentos e novidades</h2><p>Mangás recentes para colocar na sua lista.</p></div><a href="/mangas" data-link>Ver mais</a></div><div id="nxMangaNew"><div class="loading" style="height:280px"></div></div></div></section>
      </main>`;
    try {
      const [trending, top, recent] = await Promise.all([
        mangaPage('TRENDING_DESC'),
        mangaPage('SCORE_DESC'),
        mangaPage('START_DATE_DESC')
      ]);
      if (route() !== '/') return;
      document.querySelector('#nxMangaTrending').innerHTML = rail(trending.items || []);
      document.querySelector('#nxMangaTop').innerHTML = rail(top.items || []);
      document.querySelector('#nxMangaNew').innerHTML = rail(recent.items || []);
      wireCards(app);
    } catch {
      for (const id of ['nxMangaTrending','nxMangaTop','nxMangaNew']) {
        const el=document.getElementById(id);
        if(el) el.innerHTML='<div class="nx21-empty"><strong>Não foi possível carregar os mangás agora.</strong><span>Tente novamente em instantes.</span></div>';
      }
    }
  }

  function rewriteChrome() {
    document.querySelectorAll('[data-nav="anime"],[data-nav="season"],[data-nav="schedule"],[data-drawer-nav="anime"],[data-drawer-nav="season"],[data-drawer-nav="schedule"]').forEach(el => el.remove());
    document.querySelectorAll('[data-search-kind="ANIME"]').forEach(el => el.remove());
    const mangaSearch = document.querySelector('[data-search-kind="MANGA"]');
    if (mangaSearch) {
      mangaSearch.classList.add('active');
      mangaSearch.setAttribute('aria-pressed','true');
      if (window.getComputedStyle(mangaSearch).display !== 'none') setTimeout(() => mangaSearch.click(), 0);
    }
    const input=document.querySelector('#searchInput');
    if(input){input.placeholder='Busque mangás pelo título';input.setAttribute('aria-label','Pesquisar mangás');}
    const label=document.querySelector('label[for="searchInput"]');
    if(label)label.textContent='Mangá ou usuário';
    document.querySelectorAll('.drawer-kicker').forEach(el=>el.textContent='SEU UNIVERSO MANGÁ');
    document.querySelectorAll('.drawer-library-link small').forEach(el=>el.textContent='Mangás, favoritos e progresso de leitura');
    document.querySelectorAll('.footer-col').forEach(col => {
      const heading=col.querySelector('h3')?.textContent?.trim();
      if(heading==='Animes'){
        col.innerHTML='<h3>Mangás</h3><a href="/mangas" data-link>Catálogo de Mangás</a><a href="/meus-mangas" data-link>Meus Mangás</a><a href="/mangas" data-link>Mangás em Alta</a><a href="/mangas" data-link>Mais Bem Avaliados</a><a href="/comunidade" data-link>Comunidade</a>';
      }
      if(heading==='Listas'){
        col.innerHTML='<h3>Leitura</h3><a href="/minha-biblioteca" data-link>Minha Biblioteca</a><a href="/meus-mangas" data-link>Meus Mangás</a><a href="/mangas" data-link>Descobrir Mangás</a><a href="/noticias" data-link>Notícias</a><a href="/comunidade" data-link>Comunidade</a>';
      }
    });
  }

  function rewriteVisibleCopy(root=document.body) {
    if (!root) return;
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    const nodes=[];
    while(walker.nextNode()) nodes.push(walker.currentNode);
    for(const node of nodes){
      if(node.parentElement?.closest('script,style')) continue;
      let value=node.nodeValue;
      value=value.replace(/seu universo anime/gi,'seu universo mangá')
        .replace(/mundo anime/gi,'mundo dos mangás')
        .replace(/animes e mangás/gi,'mangás')
        .replace(/animes, mangás e favoritos/gi,'mangás, favoritos e progresso')
        .replace(/animes, mangás/gi,'mangás')
        .replace(/anime brasileira/gi,'mangá brasileira');
      if(value!==node.nodeValue) node.nodeValue=value;
    }
  }

  function apply() {
    if (enforceRoute()) return;
    rewriteChrome();
    rewriteVisibleCopy();
    if (route() === '/') void mountHome();
  }

  const observer=new MutationObserver(() => {
    rewriteChrome();
    rewriteVisibleCopy();
  });
  document.addEventListener('DOMContentLoaded', () => {
    apply();
    observer.observe(document.body,{subtree:true,childList:true});
  });
  for (const ev of ['popstate','aninexus:navigate','aninexus:route-ready']) addEventListener(ev, () => setTimeout(apply, 0));
})();