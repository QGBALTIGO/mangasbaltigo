'use strict';
(function(){
  if(window.__MANGAS_BALTIGO_V62__)return;
  window.__MANGAS_BALTIGO_V62__=true;
  var app=document.getElementById('app');
  if(!app)return;
  var brand='Mangás Baltigo',libKey='mangas-baltigo:library:v1',progressKey='mangas-baltigo:progress:v1',state={page:1,q:'',busy:false,mode:'vertical'};

  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function slug(v){return String(v||'manga').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,80)||'manga'}
  function name(m){return typeof m.title==='string'?m.title:(m.title&& (m.title.userPreferred||m.title.english||m.title.romaji))||m.titleRomaji||'Mangá'}
  function cover(m){return m.cover||(m.coverImage&&(m.coverImage.extraLarge||m.coverImage.large))||''}
  function json(key,fallback){try{var x=JSON.parse(localStorage.getItem(key)||'');return x&&typeof x==='object'?x:fallback}catch(e){return fallback}}
  function save(key,val){try{localStorage.setItem(key,JSON.stringify(val))}catch(e){}}
  function base(){var x=document.querySelector('base');try{return new URL(x?x.getAttribute('href'):'/',location.origin).pathname.replace(/\/+$/,'')}catch(e){return''}}
  function route(){
    var u=new URL(location.href),p=u.searchParams.get('p');
    if(p)return p.split('?')[0].replace(/\/+$/,'')||'/';
    var b=base(),x=u.pathname;if(b&&b!=='/'&&x.indexOf(b)===0)x=x.slice(b.length)||'/';
    return x.replace(/\/+$/,'')||'/'
  }
  function url(path,params){
    var b=base(),pages=location.hostname.endsWith('github.io')||(b&&b!=='/'),u=new URL(pages?(b||'')+'/':path,location.origin),k;
    if(pages)u.searchParams.set('p',path);
    params=params||{};for(k in params)if(params[k]!=null&&params[k]!=='')u.searchParams.set(k,String(params[k]));
    return u.pathname+u.search
  }
  function go(path,params,replace){
    history[replace?'replaceState':'pushState']({mb62:true},'',url(path,params));
    mount();window.scrollTo({top:0,behavior:'auto'})
  }
  function api(path){
    var origin=String((window.__ANINEXUS_CONFIG__&&window.__ANINEXUS_CONFIG__.apiOrigin)||'').replace(/\/+$/,'');
    return fetch((origin||'')+path,{headers:{accept:'application/json'}}).then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.json()})
  }
  function ico(n){
    var d={home:'M3 10.7 12 3l9 7.7V21h-6v-6H9v6H3Z',search:'M20 20l-4.3-4.3M10.8 17a6.2 6.2 0 1 1 0-12.4 6.2 6.2 0 0 1 0 12.4Z',grid:'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',clock:'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4v5l3 2',book:'M5 4h10a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Zm3 16V7a3 3 0 0 0-3-3',heart:'M20.8 4.7a5.5 5.5 0 0 0-7.8 0L12 5.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.5a5.5 5.5 0 0 0 0-7.8Z',arrow:'M5 12h14m-5-5 5 5-5 5',close:'M6 6l12 12M18 6 6 18'};
    return '<svg class="mb62-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="'+d[n]+'"/></svg>'
  }
  function section(k,h,p,href){
    return '<header class="mb62-section-head"><div><small>'+esc(k)+'</small><h2>'+esc(h)+'</h2><p>'+esc(p||'')+'</p></div>'+(href?'<a data-mb-route="'+href+'" href="'+esc(url(href))+'">Ver tudo '+ico('arrow')+'</a>':'')+'</header>'
  }
  function format(v){var x=String(v||'MANGA').toUpperCase();return x==='MANHWA'?'Manhwa':x==='MANHUA'?'Manhua':x==='ONE_SHOT'?'One-shot':'Mangá'}
  function lib(){return json(libKey,{})}
  function inLib(id){return !!lib()[String(id)]}
  function toggle(id,m){
    var x=lib(),k=String(id),adding=!x[k];
    if(adding)x[k]={id:Number(id),title:m.title||'Mangá',cover:m.cover||'',addedAt:Date.now()};else delete x[k];
    save(libKey,x);
    document.querySelectorAll('[data-mb-library="'+CSS.escape(k)+'"]').forEach(function(b){b.classList.toggle('is-active',adding)});
    if(adding)window.dispatchEvent(new CustomEvent('aninexus:manga-add-request',{detail:{id:Number(id),media:{id:Number(id),title:m.title,cover:m.cover}}}))
  }
  function card(m){
    var t=name(m),c=cover(m),href='/manga/'+slug(t)+'-'+m.id,ch=m.latestChapter||'';
    return '<article class="mb62-card" data-mb-open="'+Number(m.id)+'" data-title="'+esc(t)+'"><div class="mb62-card-cover">'+
      (c?'<img src="'+esc(c)+'" alt="'+esc(t)+'" loading="lazy" decoding="async">':'<span class="mb62-cover-fallback">MB</span>')+
      '<span class="mb62-format">'+format(m.format)+'</span>'+(ch?'<span class="mb62-chapter">Cap. '+esc(ch)+'</span>':'')+
      '<button class="mb62-heart '+(inLib(m.id)?'is-active':'')+'" type="button" data-mb-library="'+Number(m.id)+'" data-title="'+esc(t)+'" data-cover="'+esc(c)+'">'+ico('heart')+'</button></div>'+
      '<h3><a data-mb-route="'+href+'" href="'+esc(url(href))+'">'+esc(t)+'</a></h3><p>'+(m.updatedLabel?esc(m.updatedLabel):'Disponível no catálogo')+'</p></article>'
  }
  function rail(items){return items&&items.length?'<div class="mb62-rail">'+items.map(card).join('')+'</div>':empty('Nenhum título disponível','A fonte não retornou itens para esta seção.')}
  function grid(items){return items&&items.length?'<div class="mb62-grid">'+items.map(card).join('')+'</div>':empty('Nenhum mangá encontrado','Tente outro termo de busca.')}
  function empty(h,p){return '<div class="mb62-empty"><span class="mb62-mark">B</span><strong>'+esc(h)+'</strong><p>'+esc(p)+'</p></div>'}
  function err(){return '<div class="mb62-error"><strong>Não foi possível carregar</strong><p>Tente novamente em alguns instantes.</p><button data-mb-retry>Tentar novamente</button></div>'}
  function updates(items){
    if(!items||!items.length)return empty('Sem atualizações','Nenhum capítulo novo foi encontrado agora.');
    return '<div class="mb62-updates-list">'+items.map(function(m){var t=name(m),c=cover(m),href='/manga/'+slug(t)+'-'+m.id;return '<a class="mb62-update-row" data-mb-route="'+href+'" href="'+esc(url(href))+'"><div>'+(c?'<img src="'+esc(c)+'" alt="">':'')+'</div><section><small>NOVO CAPÍTULO</small><strong>'+esc(t)+'</strong><span>'+(m.latestChapter?'Capítulo '+esc(m.latestChapter):esc(m.updatedLabel||'Atualizado'))+'</span></section>'+ico('arrow')+'</a>'}).join('')+'</div>'
  }

  function chrome(){
    document.body.classList.add('mb62-site');
    var top=document.querySelector('#topbar .topbar-inner');
    if(top&&!top.dataset.mb62){top.dataset.mb62='1';top.innerHTML='<a class="mb62-brand" data-mb-route="/" href="'+url('/')+'"><span class="mb62-mark">B</span><span><strong>Mangás</strong><b>Baltigo</b></span></a><nav class="mb62-nav"><a data-mb-route="/" href="'+url('/')+'">Início</a><a data-mb-route="/mangas" href="'+url('/mangas')+'">Catálogo</a><a data-mb-route="/mangas/atualizacoes" href="'+url('/mangas/atualizacoes')+'">Novos capítulos</a><a data-mb-route="/minha-biblioteca" href="'+url('/minha-biblioteca')+'">Biblioteca</a></nav><div class="mb62-actions"><button class="mb62-icon-button" data-mb-search>'+ico('search')+'</button><button class="mb62-account" data-action="login">Entrar</button></div>'}
    var foot=document.querySelector('.site-footer');
    if(foot&&!foot.dataset.mb62){foot.dataset.mb62='1';foot.innerHTML='<div class="shell mb62-footer"><div><a class="mb62-brand" data-mb-route="/" href="'+url('/')+'"><span class="mb62-mark">B</span><span><strong>Mangás</strong><b>Baltigo</b></span></a><p>Descubra mangás, manhwas e manhuas, acompanhe capítulos e organize sua biblioteca.</p></div><div><strong>Explorar</strong><a data-mb-route="/mangas" href="'+url('/mangas')+'">Catálogo</a><a data-mb-route="/mangas/atualizacoes" href="'+url('/mangas/atualizacoes')+'">Atualizações</a><a data-mb-route="/minha-biblioteca" href="'+url('/minha-biblioteca')+'">Biblioteca</a></div><div><strong>Fonte</strong><p>Catálogo conectado ao MangaBall. A disponibilidade depende da fonte original.</p></div></div>'}
    if(!document.getElementById('mb62MobileNav'))document.body.insertAdjacentHTML('beforeend','<nav class="mb62-mobile-nav" id="mb62MobileNav"><a data-mb-route="/" href="'+url('/')+'">'+ico('home')+'<span>Início</span></a><a data-mb-route="/mangas" href="'+url('/mangas')+'">'+ico('grid')+'<span>Catálogo</span></a><a data-mb-route="/mangas/atualizacoes" href="'+url('/mangas/atualizacoes')+'">'+ico('clock')+'<span>Novos</span></a><a data-mb-route="/minha-biblioteca" href="'+url('/minha-biblioteca')+'">'+ico('book')+'<span>Biblioteca</span></a></nav>');
    active()
  }
  function active(){var p=route();document.querySelectorAll('[data-mb-route]').forEach(function(a){var x=a.dataset.mbRoute,on=x==='/'?p==='/':x==='/mangas'?(p==='/mangas'||p.indexOf('/manga/')===0):p===x;a.classList.toggle('is-active',on)})}

  function home(){
    document.title=brand+' — mangás, manhwas e manhuas';
    app.innerHTML='<main class="mb62-home"><section class="mb62-hero"><div class="shell mb62-hero-grid"><div class="mb62-hero-copy"><small>CATÁLOGO ATUALIZADO</small><h1>Seu próximo mangá <em>começa aqui.</em></h1><p>Descubra obras, acompanhe capítulos e mantenha sua leitura organizada em uma experiência feita para celular e desktop.</p><div class="mb62-hero-actions"><a class="mb62-primary" data-mb-route="/mangas" href="'+url('/mangas')+'">Explorar catálogo '+ico('arrow')+'</a><button data-mb-search>Pesquisar '+ico('search')+'</button></div></div><div class="mb62-hero-feature" id="mb62Feature"></div></div></section><section class="mb62-section"><div class="shell">'+section('AGORA','Últimos capítulos','Atualizações mais recentes encontradas na fonte.','/mangas/atualizacoes')+'<div id="mb62Updates"></div></div></section><section class="mb62-section mb62-soft"><div class="shell">'+section('PARA VOCÊ','Títulos recomendados','Uma seleção para encontrar sua próxima leitura.','/mangas')+'<div id="mb62Recommended"></div></div></section><section class="mb62-section"><div class="shell">'+section('EM ALTA','Mais vistos','Destaques atuais do catálogo.','/mangas')+'<div id="mb62Top"></div></div></section></main>';
    api('/api/mangaball/home').then(function(d){if(route()!=='/')return;var f=(d.recommended&&d.recommended[0])||(d.top&&d.top[0])||(d.updates&&d.updates[0]);var box=document.getElementById('mb62Feature');if(f){var t=name(f),c=cover(f),href='/manga/'+slug(t)+'-'+f.id;box.innerHTML='<article class="mb62-feature-card" style="--mb62-hero-art:url(\''+esc(c)+'\')"><div class="mb62-hero-art">'+(c?'<img src="'+esc(c)+'" alt="">':'')+'</div><div class="mb62-feature-copy"><small>DESTAQUE BALTIGO</small><h2>'+esc(t)+'</h2><p>'+(f.latestChapter?'Capítulo '+esc(f.latestChapter)+' disponível':'Descubra esta obra no catálogo')+'</p><a data-mb-route="'+href+'" href="'+url(href)+'">Abrir obra '+ico('arrow')+'</a></div></article>'}else box.innerHTML=empty('Explore o catálogo','Novos destaques aparecerão aqui.');
      document.getElementById('mb62Updates').innerHTML=updates((d.updates||[]).slice(0,12));
      document.getElementById('mb62Recommended').innerHTML=rail((d.recommended||d.all||[]).slice(0,14));
      document.getElementById('mb62Top').innerHTML=rail((d.top||d.all||[]).slice(0,14))
    }).catch(function(){['mb62Feature','mb62Updates','mb62Recommended','mb62Top'].forEach(function(id){var n=document.getElementById(id);if(n)n.innerHTML=err()})})
  }
  function catalog(){
    var u=new URL(location.href);state.page=Math.max(1,Number(u.searchParams.get('pagina')||1));state.q=u.searchParams.get('busca')||'';
    document.title='Catálogo | '+brand;
    app.innerHTML='<main class="mb62-catalog"><section class="mb62-page-hero"><div class="shell"><small>EXPLORE</small><h1>Catálogo de mangás</h1><p>Busque títulos do acervo MangaBall em uma interface limpa e rápida.</p></div></section><div class="mb62-catalog-toolbar"><div class="shell"><form class="mb62-catalog-search" data-mb-catalog-form>'+ico('search')+'<input name="busca" value="'+esc(state.q)+'" placeholder="Pesquisar mangá, manhwa ou manhua"></form></div></div><section class="mb62-section"><div class="shell"><div id="mb62Catalog"></div><div id="mb62Pagination"></div></div></section></main>';
    loadCatalog()
  }
  function loadCatalog(){
    var node=document.getElementById('mb62Catalog');if(!node)return;node.innerHTML='<div class="mb62-loading">Carregando catálogo…</div>';
    api('/api/reading?page='+state.page+'&perPage=24'+(state.q?'&search='+encodeURIComponent(state.q):'')).then(function(d){node.innerHTML=grid(d.items||[]);var p=d.pageInfo||{},pages='';if(p.currentPage>1)pages+='<button data-mb-page="'+(p.currentPage-1)+'">Anterior</button>';pages+='<span>Página '+(p.currentPage||state.page)+(p.lastPage?' de '+p.lastPage:'')+'</span>';if(p.hasNextPage)pages+='<button data-mb-page="'+((p.currentPage||state.page)+1)+'">Próxima</button>';document.getElementById('mb62Pagination').innerHTML='<div class="mb62-pagination">'+pages+'</div>'}).catch(function(){node.innerHTML=err()})
  }
  function updatePage(){
    document.title='Novos capítulos | '+brand;
    app.innerHTML='<main class="mb62-updates-page"><section class="mb62-page-hero"><div class="shell"><small>ATUALIZAÇÕES</small><h1>Novos capítulos</h1><p>Acompanhe as obras atualizadas recentemente.</p></div></section><section class="mb62-section"><div class="shell"><div id="mb62UpdatePage"></div></div></section></main>';
    api('/api/mangaball/updates?page=1&perPage=40').then(function(d){document.getElementById('mb62UpdatePage').innerHTML=updates(d.items||d.updates||[])}).catch(function(){document.getElementById('mb62UpdatePage').innerHTML=err()})
  }
  function detail(id){
    document.title='Mangá | '+brand;app.innerHTML='<main class="mb62-detail-loading"><div class="mb62-loading">Carregando obra…</div></main>';
    api('/api/manga/'+id).then(function(m){if(route().indexOf('/manga/')!==0)return;var t=name(m),c=cover(m),chs=m.chapterLinks||[],first=chs[0],desc=String(m.description||'Sem sinopse disponível.').replace(/<[^>]+>/g,' ');
      document.title=t+' | '+brand;
      app.innerHTML='<main class="mb62-detail"><section class="mb62-detail-hero" style="--mb62-detail-art:url(\''+esc(c)+'\')"><div class="shell mb62-detail-grid"><div class="mb62-detail-cover">'+(c?'<img src="'+esc(c)+'" alt="'+esc(t)+'">':'<span class="mb62-cover-fallback">MB</span>')+'</div><div class="mb62-detail-copy"><a class="mb62-back" data-mb-route="/mangas" href="'+url('/mangas')+'">← Catálogo</a><small>MANGABALL · '+format(m.format)+'</small><h1>'+esc(t)+'</h1><div class="mb62-detail-meta">'+(m.latestChapter?'<span>Cap. '+esc(m.latestChapter)+'</span>':'')+'</div><p>'+esc(desc.slice(0,900))+'</p><div class="mb62-detail-actions">'+(first?'<a class="mb62-primary" data-mb-route="/ler/'+id+'/'+encodeURIComponent(first.number)+'" href="'+url('/ler/'+id+'/'+encodeURIComponent(first.number))+'">Ler capítulo '+esc(first.number)+'</a>':'')+'<button class="mb62-save '+(inLib(id)?'is-active':'')+'" data-mb-library="'+id+'" data-title="'+esc(t)+'" data-cover="'+esc(c)+'">'+ico('heart')+' Biblioteca</button>'+(m.sourceUrl?'<a class="mb62-source" href="'+esc(m.sourceUrl)+'" target="_blank" rel="noopener">MangaBall</a>':'')+'</div></div></div></section><section class="mb62-section"><div class="shell mb62-detail-body"><div>'+section('LEITURA','Capítulos',chs.length?chs.length+' capítulos encontrados.':'Nenhum capítulo retornado.')+(chs.length?'<div class="mb62-chapters">'+chs.map(function(ch){var r='/ler/'+id+'/'+encodeURIComponent(ch.number);return '<a data-mb-route="'+r+'" href="'+url(r)+'"><span><small>CAPÍTULO</small><strong>Capítulo '+esc(ch.number)+'</strong></span>'+ico('arrow')+'</a>'}).join('')+'</div>':empty('Capítulos indisponíveis','Consulte a obra na fonte original.'))+'</div><aside class="mb62-detail-aside"><div><small>SOBRE A OBRA</small><p>Fonte: MangaBall</p><p>Formato: '+format(m.format)+'</p></div></aside></div></section></main>'
    }).catch(function(){app.innerHTML='<main class="mb62-not-found">'+err()+'</main>'})
  }
  function reader(id,ch){
    document.body.classList.add('mb62-reader-open');document.title='Capítulo '+ch+' | '+brand;
    app.innerHTML='<main class="mb62-reader"><header class="mb62-reader-head"><a data-mb-route="/manga/manga-'+id+'" href="'+url('/manga/manga-'+id)+'">← Obra</a><div><small>LEITOR BALTIGO</small><strong>Capítulo '+esc(ch)+'</strong></div><div class="mb62-reader-tools"><button data-mb-mode="vertical" class="is-active">Vertical</button><button data-mb-mode="paged">Página</button></div></header><div class="mb62-reader-pages" id="mb62Reader"><div class="mb62-loading">Carregando páginas…</div></div></main>';
    api('/api/manga/'+id+'/chapter?number='+encodeURIComponent(ch)).then(function(d){var pages=d.pages||[],root=document.getElementById('mb62Reader');if(!root)return;if(!pages.length){root.innerHTML='<div class="mb62-reader-fallback"><div><span class="mb62-mark">B</span><h2>Leitura interna indisponível</h2><p>A fonte não expôs as páginas deste capítulo nesta consulta. Nenhuma proteção será contornada.</p>'+(d.sourceUrl?'<a class="mb62-primary" href="'+esc(d.sourceUrl)+'" target="_blank" rel="noopener">Abrir na fonte</a>':'')+'</div></div>';return}root.innerHTML='<div class="mb62-pages mb62-pages-vertical" id="mb62Pages">'+pages.map(function(p,i){return '<figure><img src="'+esc(p.url)+'" alt="Página '+(i+1)+'" loading="'+(i<2?'eager':'lazy')+'" referrerpolicy="no-referrer"></figure>'}).join('')+'</div><footer class="mb62-reader-foot"><strong>Fim do capítulo '+esc(ch)+'</strong>'+(d.nextChapter?'<a data-mb-route="/ler/'+id+'/'+encodeURIComponent(d.nextChapter.number)+'" href="'+url('/ler/'+id+'/'+encodeURIComponent(d.nextChapter.number))+'">Próximo capítulo '+ico('arrow')+'</a>':'')+'</footer>';var l=lib()[String(id)]||{};save(progressKey,Object.assign(json(progressKey,{}),{[String(id)]:{id:id,title:d.title||l.title||'Mangá',cover:d.cover||l.cover||'',chapter:ch,page:1,totalPages:pages.length,percent:0,updatedAt:Date.now()}}))}).catch(function(){var r=document.getElementById('mb62Reader');if(r)r.innerHTML=err()})
  }
  function library(){
    document.title='Minha biblioteca | '+brand;var x=Object.values(lib()).sort(function(a,b){return(b.addedAt||0)-(a.addedAt||0)});
    app.innerHTML='<main class="mb62-library"><section class="mb62-page-hero"><div class="shell"><small>SUA COLEÇÃO</small><h1>Minha biblioteca</h1><p>Títulos salvos neste dispositivo.</p></div></section><section class="mb62-section"><div class="shell">'+(x.length?'<div class="mb62-grid">'+x.map(function(m){return card(m)}).join('')+'</div>':empty('Sua biblioteca está vazia','Adicione obras pelo catálogo.'))+'</div></section></main>'
  }
  function notFound(){app.innerHTML='<main class="mb62-not-found"><div class="shell"><span class="mb62-mark">B</span><h1>Página não encontrada</h1><a class="mb62-primary" data-mb-route="/" href="'+url('/')+'">Voltar ao início</a></div></main>'}

  function mount(){
    if(state.busy)return;state.busy=true;
    document.body.classList.remove('mb62-reader-open');chrome();
    var p=route(),m;
    if(p==='/')home();else if(p==='/mangas')catalog();else if(p==='/mangas/atualizacoes')updatePage();else if(p==='/minha-biblioteca'||p==='/meus-mangas')library();else if((m=p.match(/^\/manga\/(?:.+-)?(\d+)$/)))detail(Number(m[1]));else if((m=p.match(/^\/ler\/(\d+)\/(.+)$/)))reader(Number(m[1]),decodeURIComponent(m[2]));else if(/^\/(?:animes?|filmes|temporadas|programacao)(?:\/|$)/.test(p))go('/mangas',{},true);else notFound();
    active();state.busy=false
  }
  document.addEventListener('click',function(e){
    var a=e.target.closest('[data-mb-route]');if(a&&!e.metaKey&&!e.ctrlKey&&!e.shiftKey){e.preventDefault();go(a.dataset.mbRoute);return}
    var c=e.target.closest('[data-mb-open]');if(c&&!e.target.closest('a,button')){go('/manga/'+slug(c.dataset.title)+'-'+c.dataset.mbOpen);return}
    var l=e.target.closest('[data-mb-library]');if(l){e.preventDefault();e.stopPropagation();toggle(l.dataset.mbLibrary,{title:l.dataset.title,cover:l.dataset.cover});if(route()==='/minha-biblioteca')library();return}
    var s=e.target.closest('[data-mb-search]');if(s){e.preventDefault();var q=prompt('Qual mangá você quer encontrar?');if(q)go('/mangas',{busca:q});return}
    var pg=e.target.closest('[data-mb-page]');if(pg){state.page=Number(pg.dataset.mbPage);go('/mangas',{busca:state.q,pagina:state.page},true);return}
    var mode=e.target.closest('[data-mb-mode]');if(mode){var pages=document.getElementById('mb62Pages');if(pages){state.mode=mode.dataset.mbMode;pages.className='mb62-pages mb62-pages-'+state.mode;document.querySelectorAll('[data-mb-mode]').forEach(function(b){b.classList.toggle('is-active',b===mode)})}return}
    var retry=e.target.closest('[data-mb-retry]');if(retry)mount()
  });
  document.addEventListener('submit',function(e){var f=e.target.closest('[data-mb-catalog-form]');if(!f)return;e.preventDefault();state.q=String(new FormData(f).get('busca')||'').trim();state.page=1;go('/mangas',{busca:state.q},true)});
  window.addEventListener('popstate',mount);
  window.addEventListener('mangasbaltigo:navigate',mount);
  window.MangasBaltigoGo=go;
  mount();
})();