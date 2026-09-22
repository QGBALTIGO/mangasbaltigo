import crypto from 'node:crypto';
import { load as loadHtml } from 'cheerio';
import { cacheRemember } from './cache.mjs';

const ORIGIN=(process.env.MANGABALL_ORIGIN||'https://mangaball.net').replace(/\/+$/,'');
const TIMEOUT=Math.max(3000,Math.min(15000,Number(process.env.MANGABALL_TIMEOUT_MS||9000)));
const MAX_HTML=2_500_000;

function absolute(value){
  try{const u=new URL(String(value||''),ORIGIN);return u.protocol==='https:'&&u.hostname===new URL(ORIGIN).hostname?u.href:''}catch{return''}
}
function clean(value,max=500){return String(value||'').replace(/\s+/g,' ').trim().slice(0,max)}
function textOf($,selector){return clean($(selector).first().text(),1000)}
function sourceIdFromUrl(value){
  const match=String(value||'').match(/\/title-detail\/[^/?#]*-([a-f0-9]{24})(?:\/|$|[?#])/i);
  return match?.[1]?.toLowerCase()||'';
}
function internalId(sourceId){
  const hex=crypto.createHash('sha256').update(String(sourceId)).digest('hex').slice(0,13);
  return Number(BigInt('0x'+hex)%BigInt('9000000000000000'))+100000000000000;
}
function slugFromUrl(value){try{return new URL(value).pathname.split('/').filter(Boolean).at(-1)||''}catch{return''}}
function statusFromText(text){
  if(/completed|complete|finished/i.test(text))return'FINISHED';
  if(/cancelled|canceled/i.test(text))return'CANCELLED';
  if(/hiatus/i.test(text))return'HIATUS';
  return'RELEASING';
}
function formatFromText(text){
  if(/manhwa/i.test(text))return'MANHWA';
  if(/manhua/i.test(text))return'MANHUA';
  if(/comics?/i.test(text))return'COMIC';
  if(/one[- ]?shot/i.test(text))return'ONE_SHOT';
  return'MANGA';
}
async function html(url){
  const target=absolute(url);
  if(!target)throw new Error('invalid MangaBall URL');
  const ctl=new AbortController(),timer=setTimeout(()=>ctl.abort(),TIMEOUT);
  try{
    const response=await fetch(target,{
      headers:{
        accept:'text/html,application/xhtml+xml',
        'accept-language':'en-US,en;q=0.8',
        'user-agent':'AniNexus-MangaBall/1.0 (+https://github.com/QGBALTIGO/mangasbaltigo)'
      },
      credentials:'omit',
      redirect:'follow',
      signal:ctl.signal
    });
    if(!response.ok)throw new Error(`MangaBall upstream ${response.status}`);
    const final=new URL(response.url);
    if(final.hostname!==new URL(ORIGIN).hostname)throw new Error('unexpected MangaBall redirect');
    const type=String(response.headers.get('content-type')||'');
    if(!type.includes('text/html'))throw new Error('invalid MangaBall content type');
    const size=Number(response.headers.get('content-length')||0);
    if(size>MAX_HTML)throw new Error('MangaBall response too large');
    const body=await response.text();
    if(body.length>MAX_HTML)throw new Error('MangaBall response too large');
    return body;
  }finally{clearTimeout(timer)}
}
function itemFromAnchor($,anchor){
  const a=$(anchor),href=absolute(a.attr('href')),sourceId=sourceIdFromUrl(href);
  if(!sourceId)return null;
  const container=a.closest('article,.card,.item,.manga-item,.title-item,.row,.col,.swiper-slide,li,div').first();
  const image=absolute(container.find('img').first().attr('src')||container.find('img').first().attr('data-src')||a.find('img').first().attr('src'));
  let title=clean(a.attr('title')||a.find('img').first().attr('alt')||a.text(),300);
  if(!title)title=clean(container.find('h1,h2,h3,h4,h5,h6,strong,.title').first().text(),300);
  if(!title)return null;
  const body=clean(container.text(),2000);
  const chapter=body.match(/(?:chapter|chap(?:ter)?|ch\.?|cap[ií]tulo)\s*([0-9]+(?:\.[0-9]+)?(?:[^\s,;|]*)?)/i)?.[1]||null;
  const updated=body.match(/(?:updated|ago|today|yesterday|\d+[hdwmy]\s+ago)/i)?.[0]||null;
  return{
    id:internalId(sourceId),sourceId,source:'MANGABALL',sourceUrl:href,slug:slugFromUrl(href),mediaType:'MANGA',
    title,titleRomaji:title,titleNative:'',cover:image,banner:'',description:'',genres:[],tags:[],
    format:formatFromText(body),status:statusFromText(body),chapters:null,volumes:null,seasonYear:null,
    latestChapter:chapter,updatedLabel:updated,metricsSource:'mangaball'
  };
}
function collectTitles(markup){
  const $=loadHtml(markup),seen=new Set(),items=[];
  $('a[href*="/title-detail/"]').each((_,el)=>{
    const item=itemFromAnchor($,el);
    if(!item||seen.has(item.sourceId))return;
    seen.add(item.sourceId);items.push(item);
  });
  return items;
}
function section(markup,needles=[]){
  const $=loadHtml(markup);
  for(const needle of needles){
    const heading=$('h1,h2,h3,h4,h5,h6').filter((_,el)=>$(el).text().toLowerCase().includes(needle.toLowerCase())).first();
    if(!heading.length)continue;
    const scope=heading.closest('section,.section,.container,.row,div').first();
    const html=scope.html();
    if(html&&sourceIdFromUrl(html)||/title-detail/i.test(html||''))return collectTitles($.html(scope));
  }
  return[];
}
function pageLink(markup,labels=[]){
  const $=loadHtml(markup);
  for(const label of labels){
    const a=$('a[href]').filter((_,el)=>clean($(el).text(),120).toLowerCase().includes(label.toLowerCase())).first();
    const href=absolute(a.attr('href'));if(href)return href;
  }
  return'';
}
export async function mangaBallHome(){
  return cacheRemember('mangaball:home:v2',900,async()=>{
    const markup=await html(ORIGIN+'/');
    const all=collectTitles(markup);
    return{
      recommended:section(markup,['titles recommended','recommended']).slice(0,24),
      top:section(markup,['top viewed titles','top viewed']).slice(0,24),
      updates:section(markup,['latest updates','new chapters']).slice(0,40),
      season:section(markup,['popular this season']).slice(0,24),
      all:all.slice(0,80),
      links:{
        advanced:pageLink(markup,['advanced search'])||ORIGIN+'/search-advanced/',
        recent:pageLink(markup,['recently added']),
        chapters:pageLink(markup,['new chapters'])
      }
    };
  },{staleTtl:86400});
}
async function listing(kind='catalog'){
  const home=await mangaBallHome();
  const url=kind==='updates'?home.links.chapters:kind==='recent'?home.links.recent:home.links.advanced;
  if(!url)return kind==='updates'?home.updates:home.all;
  try{
    const markup=await html(url),items=collectTitles(markup);
    return items.length?items:(kind==='updates'?home.updates:home.all);
  }catch{return kind==='updates'?home.updates:home.all}
}
export async function mangaBallCatalog(opts={}){
  const page=Math.max(1,Math.min(100,Number(opts.page||1))),perPage=Math.max(1,Math.min(30,Number(opts.perPage||24)));
  const search=clean(opts.search,120).toLowerCase();
  const kind=String(opts.kind||'catalog');
  const format=clean(opts.format,24).toUpperCase();
  const status=clean(opts.status,24).toUpperCase();
  const key='mangaball:list:v4:'+JSON.stringify({page,perPage,search,kind,format,status});
  return cacheRemember(key,search?300:1200,async()=>{
    let items=await listing(kind);
    const home=await mangaBallHome();
    const merged=[...items,...home.all,...home.updates,...home.top,...home.recommended,...home.season];
    const byId=new Map();
    for(const item of merged)if(item?.sourceId&&!byId.has(item.sourceId))byId.set(item.sourceId,item);
    items=[...byId.values()];
    if(search)items=items.filter(item=>[item.title,item.titleRomaji,item.titleNative,item.slug].some(v=>String(v||'').toLowerCase().includes(search)));
    if(['MANGA','MANHWA','MANHUA','COMIC','ONE_SHOT'].includes(format))items=items.filter(item=>item.format===format);
    if(['RELEASING','FINISHED','HIATUS','CANCELLED'].includes(status))items=items.filter(item=>item.status===status);
    const total=items.length,start=(page-1)*perPage,paged=items.slice(start,start+perPage);
    return{source:'MANGABALL',pageInfo:{total,currentPage:page,lastPage:Math.max(1,Math.ceil(total/perPage)),hasNextPage:start+perPage<total},items:paged};
  },{staleTtl:86400});
}
export async function mangaBallUpdates(opts={}){
  return mangaBallCatalog({...opts,kind:'updates'});
}
export async function mangaBallDetailBySourceId(sourceId){
  const id=String(sourceId||'').toLowerCase();
  if(!/^[a-f0-9]{24}$/.test(id))throw new Error('invalid MangaBall source id');
  return cacheRemember('mangaball:detail:v3:'+id,1800,async()=>{
    const home=await mangaBallHome();
    const cached=[...home.all,...home.updates,...home.top,...home.recommended,...home.season].find(item=>item.sourceId===id);
    const url=cached?.sourceUrl;
    if(!url)throw new Error('MangaBall title not discovered');
    const markup=await html(url),$=loadHtml(markup);
    const fullText=clean($('body').text(),30000);
    const title=clean($('h1,h2,h3,h4,h5,h6').filter((_,el)=>clean($(el).text(),400)&&!/^mangaball$/i.test(clean($(el).text(),400))).first().text(),300)||cached.title;
    const cover=absolute($('meta[property="og:image"]').attr('content')||$('img[alt]').filter((_,el)=>clean($(el).attr('alt'),300)===title).first().attr('src'))||cached.cover;
    const desc=clean($('meta[property="og:description"]').attr('content'),5000)||(()=>{
      const h=$('h1,h2,h3,h4,h5,h6').filter((_,el)=>/description/i.test($(el).text())).first();
      return clean(h.nextAll('p,div').first().text(),5000);
    })();
    const published=fullText.match(/Published:\s*(\d{4})/i)?.[1];
    const statusText=fullText.match(/\b(Ongoing|Completed|Cancelled|Canceled|Hiatus)\b/i)?.[1]||'';
    const chapterLinks=[];
    $('a[href]').each((_,el)=>{
      const href=absolute($(el).attr('href')),label=clean($(el).text(),300);
      if(!href||!/(chapter|chap|read)/i.test(href+' '+label))return;
      const number=label.match(/(?:chapter|chap(?:ter)?|ch\.?|cap[ií]tulo)\s*([0-9]+(?:\.[0-9]+)?)/i)?.[1];
      if(number)chapterLinks.push({number,label,url:href});
    });
    const genres=[];
    $('a[href*="tag"],a[href*="genre"]').each((_,el)=>{const g=clean($(el).text(),80);if(g&&!genres.includes(g))genres.push(g)});
    return{
      ...cached,id:internalId(id),sourceId:id,source:'MANGABALL',sourceUrl:url,title,cover,description:desc,
      status:statusFromText(statusText),format:formatFromText(fullText),seasonYear:published?Number(published):null,
      genres:genres.slice(0,30),chapters:chapterLinks.length||cached.chapters||null,chapterLinks:chapterLinks.slice(0,500),
      updatedLabel:fullText.match(/Updated\s+([^\n]{1,40})/i)?.[1]||cached.updatedLabel||null
    };
  },{staleTtl:86400});
}
export async function mangaBallDetailByInternalId(id){
  const numeric=Number(id);if(!Number.isSafeInteger(numeric))throw new Error('invalid MangaBall id');
  const home=await mangaBallHome();
  const source=[...home.all,...home.updates,...home.top,...home.recommended,...home.season].find(item=>Number(item.id)===numeric);
  if(!source)throw new Error('MangaBall title not found');
  return mangaBallDetailBySourceId(source.sourceId);
}

function chapterKey(value){
  return clean(value,40).toLowerCase().replace(/^chapter\s*/i,'').replace(/^cap(?:itulo|ítulo)?\s*/i,'').trim();
}
function chapterImageUrl(value){
  try{
    const url=new URL(String(value||'').trim(),ORIGIN);
    return url.protocol==='https:'?url.href:'';
  }catch{return''}
}
function chapterImageCandidate($,img){
  const node=$(img);
  const attrs=['data-src','data-lazy-src','data-original','data-url','src'];
  for(const attr of attrs){
    const found=chapterImageUrl(node.attr(attr));
    if(found)return found;
  }
  const srcset=String(node.attr('srcset')||'').split(',').map(item=>item.trim().split(/\s+/)[0]).filter(Boolean);
  for(const value of srcset){
    const found=chapterImageUrl(value);
    if(found)return found;
  }
  return'';
}
export function mangaBallChapterPagesFromHtml(markup){
  const $=loadHtml(String(markup||'')),selectors=[
    '#readerarea img','.reading-content img','.chapter-content img','.reader-area img',
    '.page-break img','[data-page] img','.pages img','main img'
  ];
  let candidates=[];
  for(const selector of selectors){
    const found=$(selector).toArray();
    if(found.length>=2){candidates=found;break}
    if(found.length>candidates.length)candidates=found;
  }
  if(!candidates.length)candidates=$('img').toArray();
  const seen=new Set(),pages=[];
  for(const img of candidates){
    const node=$(img),url=chapterImageCandidate($,img);
    if(!url||seen.has(url))continue;
    const hint=[node.attr('alt'),node.attr('class'),node.attr('id'),url].filter(Boolean).join(' ');
    if(/(?:logo|avatar|favicon|sprite|icon|banner|advert|doubleclick|googleads|tracking|pixel|loader|loading)/i.test(hint))continue;
    const width=Number(node.attr('width')||0),height=Number(node.attr('height')||0);
    if(width&&height&&width<180&&height<180)continue;
    seen.add(url);pages.push({index:pages.length+1,url});
  }
  return pages.slice(0,500);
}
export async function mangaBallChapterByInternalId(id,chapterNumber){
  const numeric=Number(id);
  if(!Number.isSafeInteger(numeric))throw new Error('invalid MangaBall id');
  const wanted=chapterKey(chapterNumber);
  if(!/^[0-9a-z._-]{1,40}$/i.test(wanted))throw new Error('invalid MangaBall chapter');
  const detail=await mangaBallDetailByInternalId(numeric);
  const chapters=Array.isArray(detail.chapterLinks)?detail.chapterLinks:[];
  const index=chapters.findIndex(ch=>chapterKey(ch?.number)===wanted);
  if(index<0)throw new Error('MangaBall chapter not found');
  const selected=chapters[index],sourceUrl=absolute(selected.url);
  if(!sourceUrl)throw new Error('invalid MangaBall chapter URL');
  return cacheRemember('mangaball:chapter:v1:'+detail.sourceId+':'+wanted,1800,async()=>{
    const markup=await html(sourceUrl),pages=mangaBallChapterPagesFromHtml(markup);
    const prev=chapters[index+1]||null,next=chapters[index-1]||null;
    return{
      source:'MANGABALL',mangaId:numeric,sourceId:detail.sourceId,title:detail.title,cover:detail.cover,
      chapter:selected.number,label:selected.label||('Capítulo '+selected.number),sourceUrl,pages,
      previousChapter:prev?{number:prev.number,label:prev.label||''}:null,
      nextChapter:next?{number:next.number,label:next.label||''}:null
    };
  },{staleTtl:86400});
}

export const mangaBallInternalId=internalId;
