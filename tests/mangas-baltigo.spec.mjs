import {test,expect} from '@playwright/test';

const ORIGIN=process.env.MANGAS_BALTIGO_E2E_ORIGIN||'http://qgbaltigo.github.io:4173/mangasbaltigo/';
const pageUrl=route=>route==='/'?ORIGIN:`${ORIGIN}?p=${encodeURIComponent(route)}`;
const cover='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600"><rect width="400" height="600" fill="#123"/><text x="40" y="300" fill="white" font-size="36">MANGA</text></svg>');
const manga=(id,title,format='MANGA')=>({id,title,titleRomaji:title,cover,format,status:'RELEASING',latestChapter:String(10+id%5),updatedLabel:'hoje',genres:['Ação','Fantasia'],description:'Uma obra de teste para validar a experiência Mangás Baltigo.',source:'MANGABALL',sourceUrl:'https://mangaball.net/title-detail/test-aaaaaaaaaaaaaaaaaaaaaaaa'});

async function mockApis(page){
  const one=manga(123,'Mangá Baltigo Teste'),two=manga(456,'Manhwa Baltigo','MANHWA');
  await page.route('**/api/**',route=>{
    const u=new URL(route.request().url()),path=u.pathname;
    if(path==='/api/mangaball/home')return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({recommended:[one,two],top:[two,one],updates:[one,two],season:[two,one],all:[one,two]})});
    if(path==='/api/mangaball/updates')return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({items:[one,two],pageInfo:{total:2,currentPage:1,lastPage:1,hasNextPage:false}})});
    if(path==='/api/reading'||path==='/api/catalog')return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({items:[one,two],pageInfo:{total:2,currentPage:1,lastPage:1,hasNextPage:false}})});
    if(path==='/api/manga/123/chapter')return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({source:'MANGABALL',mangaId:123,title:one.title,chapter:u.searchParams.get('number')||'12',sourceUrl:one.sourceUrl+'/chapter-12',pages:[{index:1,url:cover},{index:2,url:cover+'%23page2'}],previousChapter:{number:'11'},nextChapter:{number:'13'}})});
    if(path==='/api/manga/123')return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({...one,seasonYear:2026,chapterLinks:[{number:'12',label:'Chapter 12',url:one.sourceUrl+'/chapter-12'},{number:'11',label:'Chapter 11',url:one.sourceUrl+'/chapter-11'}]})});
    if(path==='/api/home')return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({source:'MANGABALL',season:[one,two],schedule:[],top:[one,two],popular:[one,two],reading:[one,two],topReading:[one,two],soon:[one,two],updates:[one,two]})});
    if(path.startsWith('/api/me'))return route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({items:[],mangaList:[],favorites:[],list:[],impressions:[]})});
    return route.fulfill({status:200,contentType:'application/json',body:'{}'});
  });
  await page.route('https://graphql.anilist.co/**',route=>route.fulfill({status:200,contentType:'application/json',body:'{"data":{"Page":{"media":[]}}}'}));
}

test.beforeEach(async({page})=>{await mockApis(page)});

test('home renders the Mangás Baltigo discovery experience',async({page})=>{
  await page.goto(pageUrl('/'),{waitUntil:'domcontentloaded'});
  const home=page.locator('.mb62-home');
  await expect(home).toBeVisible({timeout:30000});
  await expect(page.getByRole('heading',{name:/Seu próximo mangá/i})).toBeVisible();
  await expect(page.locator('.brand').first()).toContainText('Mangás Baltigo');
  await expect(home.locator('.mb62-card').first()).toBeVisible();
  await expect(home).toContainText('Atualizados agora');
  await expect(home).toContainText('Recomendados');
});

test('catalog supports manga format filtering and responsive cards',async({page})=>{
  await page.goto(pageUrl('/mangas'),{waitUntil:'domcontentloaded'});
  const catalog=page.locator('.mb62-catalog');
  await expect(catalog).toBeVisible({timeout:30000});
  await expect(catalog.locator('.mb62-card')).toHaveCount(2);
  await catalog.locator('[data-format="MANHWA"]').click();
  await expect(catalog.locator('[data-format="MANHWA"]')).toHaveClass(/active/);
  const input=catalog.locator('#mb62cat');
  await input.fill('Baltigo');
  await input.press('Enter');
  await expect(catalog.locator('.mb62-card').first()).toBeVisible();
});

test('detail opens the internal chapter reader with public pages',async({page})=>{
  await page.goto(pageUrl('/manga/manga-baltigo-teste-123'),{waitUntil:'domcontentloaded'});
  const detail=page.locator('.mb62-detail');
  await expect(detail).toBeVisible({timeout:30000});
  await expect(detail.getByRole('heading',{name:'Mangá Baltigo Teste'})).toBeVisible();
  await expect(detail.locator('.mb62-chapter-row')).toHaveCount(2);
  await detail.locator('[data-read="12"]').click();
  await expect(page.locator('.mb62-reader')).toBeVisible({timeout:30000});
  await expect(page.locator('.mb62-reader-pages img')).toHaveCount(2);
  await expect(page.locator('.mb62-reader-title')).toContainText('Capítulo 12');
});

test('mobile home has a two-column catalog and no horizontal overflow',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await page.goto(pageUrl('/'),{waitUntil:'domcontentloaded'});
  await expect(page.locator('.mb62-home')).toBeVisible({timeout:30000});
  const metrics=await page.evaluate(()=>{
    const grid=document.querySelector('.mb62-grid');
    return{overflow:document.documentElement.scrollWidth-window.innerWidth,columns:grid?getComputedStyle(grid).gridTemplateColumns.split(' ').length:0};
  });
  expect(metrics.overflow).toBeLessThanOrEqual(2);
  expect(metrics.columns).toBe(2);
});
