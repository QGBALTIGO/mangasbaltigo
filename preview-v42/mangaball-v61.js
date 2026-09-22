'use strict';
(() => {
  if (window.__ANINEXUS_MANGABALL_V61__) return;
  window.__ANINEXUS_MANGABALL_V61__ = true;

  const app=document.querySelector('#app');
  const IS_PAGES=location.hostname.endsWith('github.io');
  const BASE=IS_PAGES?'/AniNexus':'';
  const state={page:1,search:'',busy:false};

  const esc=(v='')=>String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
  function route(){const u=new URL(location.href),p=u.searchParams.get('p');if(p)return p.split('?')[0].replace(/\/+$/,'')||'/';let path=u.pathname;if(IS_PAGES)path=path.replace(/^\/AniNexus/,'')||'/';return path.replace(/\/+$/,'')||'/'}
  function go(path){if(IS_PAGES)location.assign(`${BASE}/?p=${encodeURIComponent(path)}`);else if(!window.AniNexusGo?.(path))location.assign(path)}
  async function api(path){const r=await fetch(path,{headers:{accept:'application/json'}});if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.json()}
  function title(m){return m?.title||m?.titleRomaji||'Mangá'}
  function cover(m){return m?.cover||''}
  function format(m){return ({MANHWA:'Manhwa',MANHUA:'Manhua',COMIC:'Comics',ONE_SHOT:'One-shot',MANGA:'Mangá'})[m?.format]||'Mangá'}
  function card(m){const name=title(m);return `<article class="nx42-manga-card" tabindex="0" data-mb-open="${Number(m.id)}" data-title="${esc(name)}"><div class="nx42-manga-poster">${cover(m)?`<img src="${esc(cover(m))}" alt="${esc(name)}" loading="lazy" decoding="async">`:''}<span class="format">${esc(format(m))}</span></div><h3>${esc(name)}</h3><p>${esc([m.latestChapter?`Cap. ${m.latestChapter}`:null,m.updatedLabel||null].filter(Boolean).join(' · ')||'Disponível no MangaBall')}</p></article>`}
  function wire(root=document){root.querySelectorAll('[data-mb-open]').forEach(el=>{const open=()=>go(`/manga/${String(el.dataset.title||'manga').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'').slice(0,80)}-${el.dataset.mbOpen}`);el.onclick=e=>{if(!e.target.closest('button,a'))open()};el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open()}}})}
  function grid(items){return items?.length?`<div class="nx42-manga-grid">${items.map(card).join('')}</div>`:'<div class="nx21-empty"><strong>Nenhum mangá encontrado</strong><span>O catálogo mostra somente obras encontradas no MangaBall.</span></div>'}

  async function catalog(){
    if(route()!=='/mangas'||!app)return;
    document.title='Catálogo de Mangás | AniNexus';
    app.innerHTML=`<main class="nx42-manga-page"><section class="nx42-manga-hero"><div class="shell"><small>ACERVO MANGABALL</small><h1>Catálogo de Mangás</h1><p>Somente títulos disponíveis no acervo do MangaBall.</p><div class="nx42-manga-tools"><label class="search-field"><input id="mbSearch" type="search" placeholder="Pesquisar no acervo MangaBall" value="${esc(state.search)}"></label></div></div></section><section class="nx42-manga-body"><div class="shell"><div id="mbCatalog"><div class="nx21-skeleton" style="height:320px"></div></div><div class="pagination" id="mbPages"></div></div></section></main>`;
    const load=async()=>{if(state.busy)return;state.busy=true;const root=document.querySelector('#mbCatalog');try{const q=new URLSearchParams({page:String(state.page),perPage:'24'});if(state.search)q.set('search',state.search);const data=await api('/api/reading?'+q);if(route()!=='/mangas')return;root.innerHTML=grid(data.items||[]);wire(root);const pi=data.pageInfo||{};document.querySelector('#mbPages').innerHTML=`<button type="button" data-mb-prev ${state.page<=1?'disabled':''}>Anterior</button><span>Página ${state.page} de ${pi.lastPage||1}</span><button type="button" data-mb-next ${!pi.hasNextPage?'disabled':''}>Próxima</button>`;document.querySelector('[data-mb-prev]')?.addEventListener('click',()=>{state.page=Math.max(1,state.page-1);load()});document.querySelector('[data-mb-next]')?.addEventListener('click',()=>{state.page++;load()})}catch{root.innerHTML='<div class="nx21-error"><strong>Não foi possível consultar o MangaBall agora.</strong><span>O AniNexus não mistura resultados de outras fontes.</span></div>'}finally{state.busy=false}};
    let timer;document.querySelector('#mbSearch').oninput=e=>{clearTimeout(timer);timer=setTimeout(()=>{state.search=e.target.value.trim();state.page=1;load()},350)};await load();
  }

  async function updates(){
    if(route()!=='/mangas/atualizacoes'||!app)return;
    document.title='Atualizações de Mangás | AniNexus';
    app.innerHTML=`<main class="nx42-manga-page"><section class="nx42-manga-hero"><div class="shell"><small>MANGABALL · NEW CHAPTERS</small><h1>Atualizações</h1><p>Obras e capítulos atualizados recentemente no MangaBall. Esta seção substitui a antiga Programação de animes.</p></div></section><section class="nx42-manga-body"><div class="shell"><header class="nx42-manga-head"><h2>Últimas atualizações</h2><a href="/mangas" data-link>Ver catálogo</a></header><div id="mbUpdates"><div class="nx21-skeleton" style="height:320px"></div></div></div></section></main>`;
    try{const data=await api('/api/mangaball/updates?page=1&perPage=30');if(route()!=='/mangas/atualizacoes')return;const root=document.querySelector('#mbUpdates');root.innerHTML=grid(data.items||[]);wire(root)}catch{document.querySelector('#mbUpdates').innerHTML='<div class="nx21-error"><strong>As atualizações do MangaBall não carregaram agora.</strong></div>'}
  }

  async function detail(){
    const p=route(),match=p.match(/^\/manga\/.+-(\d+)$/);if(!match||!app)return;
    const id=Number(match[1]);app.innerHTML='<main class="nx42-manga-page"><section class="nx42-manga-body"><div class="shell"><div class="nx21-skeleton" style="height:520px"></div></div></section></main>';
    try{const m=await api('/api/manga/'+id);if(route()!==p)return;document.title=`${title(m)} | AniNexus`;const chapters=(m.chapterLinks||[]).slice(0,100);app.innerHTML=`<article><section class="detail-hero"><div class="shell detail-inner"><div class="detail-cover">${cover(m)?`<img src="${esc(cover(m))}" alt="${esc(title(m))}">`:''}</div><div class="detail-copy"><div class="alt">MANGABALL</div><h1>${esc(title(m))}</h1><div class="detail-meta"><span class="meta">${esc(format(m))}</span><span class="meta">${esc(m.status||'')}</span>${m.seasonYear?`<span class="meta">${m.seasonYear}</span>`:''}</div><p>${esc(m.description||'Sem sinopse disponível.')}</p><div class="detail-actions"><button class="btn primary" type="button" data-list="${id}">Adicionar à lista</button>${m.sourceUrl?`<a class="btn" href="${esc(m.sourceUrl)}" target="_blank" rel="noopener noreferrer">Ver no MangaBall</a>`:''}</div></div></div></section><section class="section"><div class="shell"><div class="section-head"><div><h2>Capítulos</h2><p>${chapters.length?chapters.length+' capítulos identificados nesta consulta':'Capítulos disponíveis na fonte'}</p></div></div>${chapters.length?`<div class="nx-mb-chapters">${chapters.map(ch=>`<a href="${esc(ch.url)}" target="_blank" rel="noopener noreferrer"><strong>Capítulo ${esc(ch.number)}</strong><span>${esc(ch.label)}</span></a>`).join('')}</div>`:'<div class="nx21-empty"><strong>A lista de capítulos não veio no HTML público.</strong><span>Use “Ver no MangaBall” para consultar a obra diretamente na fonte.</span></div>'}</div></section></article>`;document.querySelector('[data-list]')?.addEventListener('click',()=>window.dispatchEvent(new CustomEvent('aninexus:manga-add-request',{detail:{id,media:m}})))}catch{app.innerHTML='<main class="nx42-manga-page"><section class="nx42-manga-body"><div class="shell"><div class="nx21-error"><strong>Este título não pôde ser carregado do MangaBall.</strong><a href="/mangas">Voltar ao catálogo</a></div></div></section></main>'}
  }

  function chrome(){
    const nav=document.querySelector('.main-nav');
    if(nav&&!nav.querySelector('[data-nav="updates"]')){const manga=nav.querySelector('[data-nav="manga"]');manga?.insertAdjacentHTML('afterend','<a href="/mangas/atualizacoes" data-link data-nav="updates"><span data-icon="calendar"></span>Atualizações</a>')}
    const drawer=document.querySelector('.drawer-nav-grid');
    if(drawer&&!drawer.querySelector('[data-drawer-nav="updates"]')){const manga=drawer.querySelector('[data-drawer-nav="manga"]');manga?.insertAdjacentHTML('afterend','<a href="/mangas/atualizacoes" data-link data-drawer-nav="updates"><i class="drawer-card-icon tone-blue" data-icon="calendar"></i><strong>Atualizações</strong><span data-icon="arrow"></span></a>')}
  }
  function active(){const p=route();document.querySelectorAll('[data-nav],[data-drawer-nav]').forEach(a=>{const k=a.dataset.nav||a.dataset.drawerNav;const on=k==='manga'?(p==='/mangas'||p.startsWith('/manga/')):k==='updates'&&p==='/mangas/atualizacoes';if(k==='manga'||k==='updates'){a.classList.toggle('active',on);on?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current')}})}
  async function mount(){chrome();active();const p=route();if(p==='/mangas')return catalog();if(p==='/mangas/atualizacoes')return updates();if(/^\/manga\/.+-\d+$/.test(p))return detail()}
  document.addEventListener('DOMContentLoaded',()=>setTimeout(mount,10));
  for(const ev of ['popstate','aninexus:navigate','aninexus:route-ready'])addEventListener(ev,()=>setTimeout(mount,10));
})();