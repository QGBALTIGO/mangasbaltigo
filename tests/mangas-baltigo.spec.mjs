import {test,expect} from '@playwright/test';

const ORIGIN=process.env.ANINEXUS_E2E_ORIGIN||'http://qgbaltigo.github.io:4173/mangasbaltigo/';
const pixel='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
const manga=(id,title='Mangá Baltigo '+id)=>({id,title,cover:pixel,format:'MANGA',status:'RELEASING',latestChapter:String(20+id%5),updatedLabel:'agora'});
const home={updates:[manga(1,'Solo Leveling'),manga(2,'One Piece')],recommended:[manga(3,'Dandadan'),manga(4,'Sakamoto Days')],top:[manga(5,'Jujutsu Kaisen'),manga(6,'Berserk')]};

async function mockApi(page){
  await page.route('**/api/mangaball/home',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(home)}));
  await page.route('**/api/mangaball/updates**',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({items:home.updates})}));
  await page.route('**/api/reading**',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({items:[manga(7,'Chainsaw Man'),manga(8,'Frieren'),manga(9,'Blue Lock')],pageInfo:{currentPage:1,lastPage:1,hasNextPage:false,total:3}})}));
  await page.route(/\/api\/manga\/7\/chapter.*/,r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({mangaId:7,title:'Chainsaw Man',cover:pixel,chapter:'24',pages:[{index:1,url:pixel},{index:2,url:pixel}],nextChapter:{number:'25'}})}));
  await page.route('**/api/manga/7',r=>r.fulfill({status:200,contentType:'application/json',body:JSON.stringify({...manga(7,'Chainsaw Man'),description:'Demônios, caçadores e uma vida nada comum.',sourceUrl:'https://mangaball.net/',chapterLinks:[{number:'24',label:'Capítulo 24'},{number:'23',label:'Capítulo 23'}]})}));
}

test('Mangás Baltigo home, catalog, detail and reader work as one flow',async({page})=>{
  await mockApi(page);
  await page.goto(ORIGIN+'?p=%2F',{waitUntil:'domcontentloaded'});
  await expect(page.locator('.mb62-home')).toBeVisible({timeout:30000});
  await expect(page.locator('.mb62-brand').first()).toContainText('Mangás');
  await expect(page.locator('.mb62-hero h1')).toContainText('Seu próximo mangá');
  await expect(page.locator('.mb62-update-row')).toHaveCount(2);

  await page.locator('.mb62-nav [data-mb-route="/mangas"]').click();
  await expect(page.locator('.mb62-catalog')).toBeVisible();
  await expect(page.locator('.mb62-card')).toHaveCount(3);

  await page.locator('.mb62-card').first().locator('h3 a').click();
  await expect(page.locator('.mb62-detail')).toBeVisible();
  await expect(page.getByRole('heading',{name:'Chainsaw Man'})).toBeVisible();
  await expect(page.locator('.mb62-chapters a')).toHaveCount(2);

  await page.locator('.mb62-chapters a').first().click();
  await expect(page.locator('.mb62-reader')).toBeVisible();
  await expect(page.locator('#mb62Pages img')).toHaveCount(2);
});

test('mobile navigation is usable without horizontal overflow',async({page})=>{
  await page.setViewportSize({width:390,height:844});
  await mockApi(page);
  await page.goto(ORIGIN+'?p=%2F',{waitUntil:'domcontentloaded'});
  await expect(page.locator('.mb62-mobile-nav')).toBeVisible({timeout:30000});
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(2);
  await page.locator('.mb62-mobile-nav [data-mb-route="/mangas"]').click();
  await expect(page.locator('.mb62-catalog')).toBeVisible();
  await expect(page.locator('.mb62-grid')).toBeVisible();
});
