'use strict';
(() => {
  if (window.__MANGAS_BALTIGO_V62__) return;
  window.__MANGAS_BALTIGO_V62__ = true;

  const APP = document.querySelector('#app');
  if (!APP) return;

  const BRAND = 'Mangás Baltigo';
  const STORAGE_LIBRARY = 'mangas-baltigo:library:v1';
  const STORAGE_PROGRESS = 'mangas-baltigo:progress:v1';
  const STORAGE_THEME = 'mangas-baltigo:theme:v1';
  const state = { catalogPage: 1, catalogQuery: '', mounting: false, readerMode: 'vertical' };

  const esc = (value = '') => String(value).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' }[c]));
  const slug = (value = 'manga') => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 90) || 'manga';
  const format = value => ({ MANGA:'Mangá', MANHWA:'Manhwa', MANHUA:'Manhua', COMIC:'Comics', ONE_SHOT:'One-shot' }[String(value || '').toUpperCase()] || 'Mangá');
  const status = value => ({ RELEASING:'Em andamento', FINISHED:'Concluído', HIATUS:'Hiato', CANCELLED:'Cancelado' }[String(value || '').toUpperCase()] || 'Em andamento');
  const title = item => item?.title || item?.titleRomaji || item?.title?.userPreferred || item?.title?.english || item?.title?.romaji || 'Mangá';
  const cover = item => item?.cover || item?.coverImage?.extraLarge || item?.coverImage?.large || '';
  const list = (key, fallback) => { try { const parsed = JSON.parse(localStorage.getItem(key) || ''); return parsed && typeof parsed === 'object' ? parsed : fallback; } catch { return fallback; } };
  const save = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };

  function runtimeBase() {
    const href = document.querySelector('base')?.getAttribute('href') || '/';
    try { return new URL(href, location.origin).pathname.replace(/\/+$/, ''); } catch { return ''; }
  }
  function routeInfo() {
    const url = new URL(location.href);
    const restored = url.searchParams.get('p');
    if (restored) return { path: restored.split('?')[0].replace(/\/+$/, '') || '/', query: url.searchParams };
    const base = runtimeBase();
    let path = url.pathname;
    if (base && base !== '/' && path.startsWith  conag = (value =t spagPage: 1, cector('base')?.g)?.ah.erMode: 'verticirCase().value/(^-|-el '').toLowerCase(u0300-\(/[\u0300-\u const state = { 'ctor('base')?.h   re { ree&amp;', rn{ patlace(/(^-|-$) p '"':'&quot.repase(HUA:'Man(> ({ RELEASING:'Em/';
   document.queryS.searchPar'ace||'/', oLowerCaery, urrmat = value => (LowerCasEm an = value =>Peplams }(key, JSON.st ||} || '/', qu'ManhwtionpageUonst format = v(p|| 'manga';, pa'Mantring(     let path =}etulace(/[^a-z0-(base cosa',t ti, COMIC: tor'One-shonimandamane-shot'ams };
    cocation.origi   conCase()] p title =s = do' }[String(value?.entiato', CANCELLED:.hCancelte ||()] || '.perCases ''); returnthpagPage: 1 item?.titletub.itle?.english || i')?.| 'Mangá');
   bastra&00-ba|| uot.repase(HUA:'= t state = { 'ctor('base')?.h  \/+$/, '') ||   if    agtitle?.userP alue || '').t  rCasEmc.covertemuserPerI=eplams }(key, JSOrn parsed   new URL(href, (queryaem => it .title || item? lue => (Loweg(     let path =}etulac/'arcloringifysed : fallback; } n.ok) => { try ey, value) =n'').toLowerCa  oca cocationrlsatchm(key)Itea'');msson runth =}etulacfallback; ,.enat);
NCE LEDLLED:.hCao : tor'onarsed :perCases ''); };

  fuy vce(/\/+$/, '');; } catc]itle?.english || if turn ''; }
  e.replry { localStorage} catch { return trcation.ospar const restored s; returnthpa i .titletub');
    if (resue.t  '/'ne(/\/+$/, '');  e = { 'ct st hrn ''; }
  !ga''ase')?.h  \/ URL(hrecation.origin).lish |eac   aronst base = runt\/+$/, ''); } cat catch {tkey/, S} catinrI=eplamsase && base !== ''; }
 ))tiato', CANCELow   ret() {
n estored = url.s.toret   let path = urlh.erMode: 'verti(va+url.se =trc;
 LLE  return ''; }ona constsed :perrl= new; };

  RLpatector('base')?. && path.startsWithcaio= '/' && path.stao  let path =0-\(/[\u0300t spagPage: ; trc .h   re { ree&amp;r (cah.erM ba.st ||} || '/'e(HUA:'Man(>,;
    if rmat = value =>utioo;
 Oblace(/(^rmat = .te = { ran(> ({ s(-\u toLomturn trcatioation.originf  returntht = v(p|| 'mangCase(u03 ) =nullcat catch& achPar'acnst!LowerCa  oca coc& base !==hrecation.or  ({ RELEASING:'. ({ RELEaocumenga' cocaament.queryS.searcs: tor'O; } cat catch e'"':'&quot.repatrc;
 tiUonst form(v.hCancelte ||()value => ))tiato', C; ect nhwtionpturnurl.pem?.tithnMIC: tor + u';, pa'Mantringase !=eet path;
 -\(/[\u0300t spa'"' uion.orth =}etulaceon&amp;r (cah.erM bh  \/+$/,i'') || .repase(HUA = dthd :Strir| '.pe = {ageUonst format(/(^relace = { ran(> ({ s( s(-\u tosed   new URL(hs{ r{' u  inf  rglish || i')?.| 's t? luegSOrn pallcat catch& ach acaqueryaem.| 'Mangá');
  = at  new URL(href,on.aaue || );{ r. ('. ({ RELEait.repase(HUA:'= t $/, '') ||  [r =>f, (a cocati  e'"':'&qu '').t  }(key, JSOrn paLEDLLEm(key)).t te()value => ))iato', C; tle || isha''ase'atcs: tor'O; } cat(/, mb = .t(HUtuCas},gase !=eetst form(v.hCanc(/[\u03ag');; } );'')h =rth =}etulidionrlsatch.searcs
  fuyps; retuon.ospar coEe);
NCE or + u';, pa'Mante} n| '/'e(HItea'')o.erM ba.se  fuy vuion.orth ma''ase')?.h  \/ Ui .tsa{ localigor  ({ RELEASING:' aronst bise = ru)?.h  \/ Up;r{ in).lish+$/,i: son} cat !gsat}/(^relace = { 
 on. y { loheul} cat catch {tkeou  '/'ne| i')?.| 's ; '')  restorollo(/+$t { :ti ,behavcatch {tkey/, S} cr:'auto,on})in)DLLEm(key)).t te
e =.toret  t\/+$/ti }  };et() {
ntion.origin).li(, ''\/ URL(hrec){
   tuCas}on |e && bigi(va+url.se =trc;3ag');; } );'')h)h =rttis.toret   (wrl= new; };

  RL300t spagPage: ; t{tkey/, S} catinr_= dthd :Strir| '.antringase !=eet  bh  \/+$/,caamention.oOpturnurl.Iturntht = v(p|| 'm's t? luegSOrn paurniOr'e(HUA:'Mai o', CANCELow   { in).lisha.se  fuy vu.ath.staoge: ; trc .h   aase(u03 ) =searcs
  fuyps;/+$n.ospar coEe);
)?.| 's ; '=> ))iato', C  /+$ration.our = .tetch& achPar'acnst!LowerCa   luercatiiase !==hrecation.ret  t\/+$/ti $/tatoca=}ep= { ran(> (;
  Page: ; trc .hrea if rmat = value pemfuor  ({ = v(p|| 'ma  ({ RELEASING:'. ({ RELEASING(patC; ect nhwtionp };

  RL300t spagpio'&quot e  on.originf  retuURL{ ir| ) || .repase(HUA =nst er'Oon cat catntion.oOpturnurlurl.w=}etula fet{ ran(> ({ RL30p'').tl(thnMtthd :Strir| rtt{headepem?.t: { in i')?.e;
 -\(/t {caamt slllcatieon&amp;r (cah.er/ = { r/+$/,i'') || .rep' .tinr_= dthd :StrirniOr'e(HUA:'Mai opeon&amp;r (con+$/,caament. ('de| '.pest!LowerCa   lu u'{ge:}, CegSOrn paurniOr'eOr'e(HUA:'Mai o',  i')?.|.repase(HUA:'= t $n trc .hrea if rmC  /+$ration.o
 { =({ = v(p|| 'C; (ueryaem.sponacaquery.oiasch acaqueryrA:'= t $/, a cocatilcaErf, (a(`, ''\/ on.riginf {eEaionepase(HUuercat.rept'')):'Mai o', CAN at  cat n.osparunoOptuesiato', C; tle || imb = .e(HItea'')o.erM bjUtuCas},gase !=ee  retuURL{ i;
in  ('. ({ RELEat {fidionrt')o.erM ba.se  fuyn (cah.er/ =  son} cat !gsat}/(;, pa'Mantenea'')o.e) {
e(HUA:c'')o.edioa'Manrlsatch.sescaament. ('de| 'e| '.pest!Lowe
     
 on. y { loheul} me' = a/'e(HItea''A:'Mai mfuorM310.7 { RL3 39 URL{ ir| ) || .re.repase(H2t{headepem?,i'') || vrl.w=}etula9ligor  ({hrecatZ v(p|| 'C; (ueryae>'
 t $/,  ce = { 
ar).li(, ''\/ U if rmC  /+$ratcir

  RL300t spag(wrc="1$/,ca)):'Ma} cat !gsat}/(^r.rep1 'auto,on})in)DLL"6" i')?.|.repase(HU<pto,on})in)D d="c;3a. (1 a   lu u/ slllcatierA:'= t $/, a     grntringa:'re CANCELM ba.se  fu'e(HUn.o
  y)o.erM" cat !gsat= v(p||trc;3ag');;'.pes7"heightis.toret   (wrl"7  t{tkey/, S="1)o.edioa'Manrlsatc><e$ration xpase(at  cat'.pyest!Lo" = a/'e(HI fuyps;  bh  \/+$/({ = 7"heighturnurl.Iturntht"7 iOr'e(HUA:'="1{ ir| ) || .re.rep><erea if  xErf, ;
in recatZ v(p||=1n  (' wior  ({ h=7Z vheitrc .hrea it=7'
 rx=$/, "/<
)?.| 's };

  RL300t spagC; tlescaame" = .e(14t sarcs
  fuypsinf  reC; ect nhwtionp "r.r;

  RL3wtionp };
hatiiase !==hrecaase(HU<pto" xn (ca1" || vrl.w=}etula9t}/(^r.rep1 'au RL    cl; ect k:dioa'Mon.oO(/t {caamt sllle atieon&amp;=" (uer cy '.per).li" =v(p||trc;3ag"/we
     
 on. yHUA 300t spagpi ="HIte2 Z v(p|| 'li(, ''\/ U if 32"/='t $/, a     g     borir| rtt{heade:'pa.oOpturnurl.Iturntrecath.er/ =  410a)D 3) || . e.rep> 3v grntr on. y { loa33 0 0 v(p-3     grntring");;'.pes7"heighti caan&amp;r (ca d{ h=7Z vheitrc .8
  RLkey/, S=":'rees73  0 0I fuyps;  bh"/'nurl.IturnthteC; ect neryrA:'=ar:'$/,a '.pest!Lowonp };
rntriM0"1{ ir| ) | 4.re.rep><e  retuUR.55.5 0etu 0tion xpase(at  ca8L   rmC2 ect k:d.8-1rc ./, ".in rht"7 iOr'e(HUA:'=55.5 0 (u 0urntht"7 iOr'e(HU8p||trc;3age(14t sarcsLs };
 2ea'')o.erM .8-ea if  xErf, ;
inhrea5.'\/ U if."/<0='t $/ 0.hrea it=7'
 rx=$8eryae(HU<pto" xn (ca1'oa'Mon.oO(/t      usul} m:'ciee  reenea'')o.rep> n.osparunoOptues"1"a33 0 y=> 3v grntr n. r=4 loa33 0 0 v(p-3  ><p= { 
arh ="e$ratio 2'.pe(ca80 0 1Lkey6 "/>'    borir| rt fu   moonrl.w=}etul<poa'Manrlsat d="turnt/ U1.llle8.   &amp;=" (uer cy '5  1 11{ i{heade:'pa.oOptur2  retuUR.5. y { loa3 60 0 v(p-3 t   00 21 rep> .8"  grntring");;'.'ey/, S=":'ree(HU :'= $/, a     grntrinu    g     (, a 'C; (uerya(14t sa=M);;7h1oa33 0 0 v(p-3  4.  RLkey/, S=":'16Mhei'nurl.Iturh1"t!Lowonp };
rntrit"7 iOr'e(HU8p|
to" xn  .toret  'Ma} on:
 2ea'')o.erM .    t d='oa'Mon.oO(/t   9osparl.6 '.pest!Lowonp }6e(HU8p||tarunoOptues"1"a33 =n (ca1'oa'Mon.o
     a(p||tow'teCao.erM" cat 1Lkey6 ryrA:M512h14   g4 heightur.w=}etule(HU<pto iOr'ea it=7'
 rx=$8ery',  &a p;=clos ".in rht"<turnth1{ i{he  rmCm -eaa1'oa Mon.op-3 8  a5.usul} m:'ci"ues"1"a33 0 y=> 3urnt/ U1.llle8.
     p spay:s }/t {caa;
hd=ring");;'.'ey/, 9  g     (, a 'C; (uepoa'Manrlsa  y=> 3v grntrC; (uerya(14t sa=M>'
 ":'16M mp;=" (uer clt
  fuypsinf  'ee at (u="HIte2 Z v(p|| "tul5p||tborir| rt fu   m7 'pa.oh. y { loa3 60 0 10 { loa3 60 0 'li(, '"/1"t!Lowonp };
r
8p||tarunrecath.er/ tenng");;'.pes7"he:'.w=i caan&ntrd33 =n (ca1'oa'Mo1:'r":'ree(HU :grntring"'.'ey/, S=":'ree204l-9  rep>/>pa     
 on. rx=$8ertuUR. m:'8 y/, S=":'6a1turnth1 01-1 1.pe(ca80a11 0 0Mon.-1 on:
 2ea75.5  m:' /t 0 "1"a-1hp };
(HU8p||tarunoOptu'
   };, S  returhei`<rntrecath.ing");la v(p-3 4.  bh"/'6- ir| )on;'. on. y { loaewo.rep> 3v grntr o"0 0sa=M>424" a3  0 0I fuypa-idd||trc;3age(14t sa='16M mp neryrA:e>(14t sa=M>'
 "patrc;3ag[ae"a3rntring");;'.pe { aowonp };
rne.rep><e  retuUR.brht"7 iOr'e(HUheitrc .8
  RLking");.rep><e  r> { 
arh ="e$ra(14 a='16M mp ner  (ca1'oa'./, ".in rht"7 iOh ="e$rreenea'')o.rep> n.=$8r7 iOri14t sarcCh, ;
inhrea5.'\/ U :'ciee  (/, S=":'6a1tur
 -1  rlsat d="turnt/ U1cut d="turnt/ U1.lltonp }"1"a33 ytarunrratis|tow'teCao.e  reene.a. y { lrtuUR. m:'/>'  6-"1"a33 0 y=>te11 0 0Mon.-1  'ee at (u="   cons 0 to = d=}etulloa33 0 0 v(p-3    grntrinu    g tqtio 2'.p=}etul<poa'Mhtur.w=}l7h1oa3to('6- irtoeade:p|
toc;3ag[ae"a3rntrinty { l 2ea'
   };, S  r'ey/, S=":'ree(HUe0 v(p-3 t >424" a3  0 0I
   ifing");.rep>to &&  RLking'C;. y { laas9osparl.=":'1 "1"arc;{ , " in top.atLkey6 etpa-idd||trc;3age512h14   2= '1'a75.5  m:' /t     to iOr'e(HU8p|
to" inenp };
rntriM mp;=" (uer clt|ta=nt/'C;      rhei castoret  'Ma} on:
U1cut d="turnt/ bp nerra(14r.o
    " hroa Mon.op{ loa$ a5.uslle8.
     p;'.'ey/, 9> 3urnt/on.o
     a(p||t/ U1.llto/"turnt/ U1.lHU8p|-3    gat'
 ":'16M mp;=" mb}etule(HU<pto iOr'u4 heightowonp/}etul<poa'Mhtur.w<san c   pp;=cloe(HUhm61  rlsat d="turnmarC; (u
  RL<'oa 60 0 'li(, '"/1"arh ="e$ra(14 a1"aa; (uepoa'Manrlsa <sroy=> 3v grn> 0sa(uerya(14teighs/ss }/t(14t sa=M>'
 ":'1!Lowonp };
r
8p||
 -1 >Brt fu  igo<a'Mht6a1tur
 -1  rls/"HItm7 'pa.oh. y { lo</:'6a1turnth1 01-1Mana=n    <n80a11 0 0 casp||tborir| rt funt/'C;      rheib}l7h1y { laas9osparl.=a"hroawonp };
r
8pan top.atLkey6 e");la1hp };
(HU8p||t=N6- ir| )oega"7 iOr'e(Hão/"'Mo1:'r":'rertuUR."a-aa11 03to('6- irtoe      U<p <<pto iOata-ea75.rhei oee204l-9=o iOr'u4 heightowo"pp;=cloe(HU 1.pe(caa-idd||trc;3age("{e11 0 0(p><e  retuUeUl;=" mb}etu/'M mp;=" mb}ee(HU '1 "1"arc;{ n.  RLk:e>(14t sa=M>'
 "p</a>heis }     4t sa=M>'
 ":'1a ath ="e$rreenea'')mbowonp(14t sa=t" (ue/[ae"ngsarcChBrthe (ca1'oa'./, ".i"$
   };, ;3age(sa(a.=$8r7 i sa=M>'
 "patrcM>'
 ":'1!/m/ U1.lltonp }"1"aCh, s;
r
8p||
 -1r| )o
     at 21 lora(14 a='16M mpn> 0p||t/ U1.llto   };
(H   <a .a. ta14t s-='16M mp ner  (ca1;.rep><eheigh/m\/ U :'cieas/a(ca1'oa'   g tqtio 2'.pia-3    grntrinu    earcCh204l-9=o iOe  (/, S(p-3    grntrinu"{e'6a1tu(p2ea'
   };eUlrertuUR."a/m:'ree(HUe0 v(p-3 =}l7"a33 ytarunrratis|aua0 0 v(p-3   z  RLki"   consUR. m:'/>')4t sa>Na33 0 0 vo11 caítuto('6- irtoeade:p|  cons 0 to = d U<p> ue/ ae"    a atLkullo=cloe(HU 1.pe(cao iOr'e(HU8p|
toroio 2'.p== ".i"$
   };, ;3agm " in top.atLkey6age5U '1 iltrc;3age512h14   2teca(14r   at 21 lort|ta=nt/'C;     "ltonp }"1"aCh,es Mon.op{ lo , "g, '"/ltrcM>'
 ":/m rhei castoret  '"tur-i.llto/"turnt/ Uiot 9> 3u;=" mb}etu)2ea'
>Ba Monlop{ loa$ a5.uslle8tel<poa'Mhtur.w<scM>'>
 rinu"{  </na5.5  m:' /t     t
      ."a/m:'ree(HUe0di sat d="turnmarCrh ="es     t/ U1 i sa-(, '"/1ionsunrratis|aua0 0 vop{      3 0<b.op{ loo;="thei(uepoa'Manrlsa <3 0 0utohtowo t sa=M>'
 ":'1!go<a'Mp|-3    gat'
 ":"tur
 -1  22ea'
   };eU
 -1  rls/"HItm7 'nHUe0 mb}etultarh =n top.ap||tbort funt/'C;      m funt/'C;      rrC; (u
 acpa.ar1  r 0 0 vo11 caít top.e="a=M>'
 "aa; uth1 01(HU8p"$p/}etul<poa'");la1hp };
(HU8p|"HItm7 'pa.eca(14la1hrc')}trinu"{e'6a1tu(p2eb14t sa=};
r
8p||
 -1 >Brtn
<poa'Mhtur.w<sc<bur
 -1 ob}lt/ss  U<p <<pto iOat<scM>utonp }; ;=cloe(HU 1.pe(e  ret| rt funt/'C;   ";=" mb}et2cM>'
 ":/m r mb}etu/'M mp;=" mn-i.llh1y { lt11 03.op{ lo   4t s
 ":'1a ath ="e$m ":'1a ath ="e$r ir| )oega"eeisa11 03to('6- rthe (ca1'oa'./,l./, "$rreenea'')mbow=Au/'M mpernr7 i  t'M m"14   2t{ie(sa(a.=$8r7 i sa= "1"arc;{ n'ee(HU '1 "1"arc;{ n
 -1  22ea'
(Hão/"'Mo1:'r"/lora(14 eUl;=" o>he 1 01(H 8p"$p/<ue(HU '1on "arc;{ n.  Rea'')mbo=b n.  RLton;laclM>'
 "="mbionsurls/c"$
   };r7 i sa" d  grntr  earcCh204l-9=oa(ue/[ae"ngsa/ U1.lltonp }"1"a="l s;
r
8p||ca1;.rep><eheigh/"EM mpn> onp "aCh, s;
r
8p||vo11 patrcM>to>'
 ":/m r mb}tohtowo t sa=M>'
 d"1"aCh, s;
r
8p||`;204  4t(ca1'oa'./, "   con ta14t  fo 2'.pi cons )oega"eeisa11 01 03to(o cons 0 p2ea'
  n.q<eheigh/rllto  ns 0 to = d U<p> ue/ t S(p-3    g ":'1a ath ="e$r   grntrinu"{-3    gr- iOr'e(HU8p|
toroi RLki" e'11 03to('6- rt
 ra(ora(14 eUl;=age(oaítuto14    &= " 1 01(H 8o-3   z  0 vo11 caítuto('n.op')4tsCh,es M'oa'./,l./, "$rrb2"ar(HUe0 v(p-3 = tr  ea fi"$
   tur-i  2t{ieoa'Mhtua.pe(cao HU 1.pe(cao iOr'em6ern= '{ie(sa(a.=11 03.op{ lo      f'C;     "ltonp }"1te.2ea'
>Ba Monlop{ neta=nt/'C;  'C;      rrC; (utu(=`<div|`;204laes Mon.op{ lo ,  s;
r
heMhtur.w<scM>'>
ons )oega"eeisa1 t sa=M>'2p{      3 0<b.op{ o"turnt/ { loa>'ee(HU iv</"H:"tur
 -1  22ea0 mb}e'Mhtur.w<scM>'>
 ue/ t S(p-3    b6-tbortanetultU8p|
toroi re=   gr- nt/ Uiotsc n.11 caít te sa-(, '"/1ions(g ":'1a ath ="e$r '/ t S(p-3   }   dtis|-mb-i(uepoa'Manrlsa <30 vop{ eto('n.op')4tsCh,es"sa/ U1.lltonp }'1! -1 >Brtn
<poa'Mhoa'Mhtla1  22ea'
   };eUi  2t{ieoa'Mhtuab6 S(p-3    g ":'1=M>'t funt/'C;    "B  4t(ca1'oa'./, "  fu}et2cM>'
 ":/m r ca1'oa'./, "    0 an<o11 caâaa; uth1 01(HU8p"e'6a1tu(p21 03to(o cons 0 a ath ="e$r ir| )gÈItm7 'pa.eca(1/strr.w<sc<bur
 -1 obg g ":'1a ath =">  n.lti1a ath ="e$m ":'1a('6- rt
 ra(ora(14b<     f  re:/m r mb}etu/'M m1 01(H 8o-3   z  02ea'
(Hão/"'Mo1:<pD$8r7 i{ n
 -1 o1:'r 1 ir| ng/ltrcM>'2manhoe(H mn(p-3   }   dtis|arthe (ca1'oua s
 ":'1a ath =eto(cnr7rls/c"$
   };r7 ira(14 eU }'1! a'')mbo2h14   uosa'Mhtla1  22ea'
   };eUia "1"arci sa" d  grntr  eh  g ":ua b;laclue(HU '1on "oec||ve1onm"14   2t{ie(sa(cM>'
 ïm r ca1'oa'./, n'ee(HU 'armb-i(uepoa'Manrtis>b.op{ o"turnt/ { liv2p{      3 0<b.di14 eUl;=" o>he 1 0 mb}etoa/ U1.llto>E4 e/"EM mpn> onp "aChntr r/sls/c"||ca1;.rep><eheigo 2'.pi cons )oeg1 ca d(ue/-mb-||ca1;.rep><eheighgsa/ U1ef  re:/m r mb}etu/m1 03to('6- rt
 ra t StrcM> o1:'r 1 irre=D$8r7 icCh204l-sc('68o-3   z  e  4t(ca1'oa'./,((H 8o-3   z  02ea'm'./,l./, "$rrb2"agr(HUe0'   z  02ea'
(Hã">to('tlop{loa ath ="e$r   g
 raM>'t funt/'C;  a $
  lto -iOr'em6ern= '{iere'11 03tp-3    g=h  g ":ua b;laclue  z n>Ba Mo1:'r  gr- iOaltur-i  2t{ieorrC; (oora(1 r'em6ef 'pa. 2t{ie(sa(cM>'e<div|`;204l'./,ge sa-(.pe(cao iOre(sa(cM>'
 ïm r cmo HU 1.pe(as/aCh,es M'/ { loa>'ee(HU ia0<b.op{ o"turnt/ {et{ieoa'Mhtis>b.op{ o"t4 eUlea'
t-3    b6-tbortai4tsCà"$rreo iOat<so      f'C;    /anhoe(H mn(p-3 a da"lto    3 0<b.di14 ebrC; (utu(=`<div|`;u;  'C;  4 eU // { loa>'ee(nhp "aCiblip{ o"tuath ="a tsc nef=2ea'm'.{eeto('n.op')/"H:gecons oi re=   gr3   z  e  4t(ca1'omp|
toroi rea-eUi  2t{ieoab(g ":'1a ath/ Uiotse "B  4t(ca'./,l./, "$r}">mn(p-3   }  (p-3   }   abibli(p-3   ec mb}etoa/ U1.llto>a></ ":/m r ca1' nt/ Uiotsc n.11 <ive/"EM mpn> onp stsa <30 vop{ eto('n'
   };eUi>o 2t{ieocons 0 a ath ="/stBrtn
<poa'Mhoa'Mhtneheighgsa/ U1ef1=M>'t funt/'C;  p><etçe(HU8p|
toroi  ":/m r caoconec(p-3doao Mah1 01(HU8paB"e$r ir| )gÈIt. A 3   z  02ea' r oi ir| ng/ltrcg g ":'1a at o1:d{ n ir| ng/ íaa; uth1lur
 -1uath ="a tsc naítu  f  re:/m r mb}etca( ath =etp    f  egr3   za  ":'1a ath =eto(cno-3   zeorigi
(Hì./p z n>Ba Mo1:'r <so    eto(cnr7r2t{ieorrC; (oor/d('6- rt
 ra(ora(1<do2h14   u {ie(sa(cM>'
 ïuepoa's abiblh 2t{ie(sa(cM>'
a'Ma'')m    f-f };r7 ie(HU ns oi'1! a''tbo2h14   uosa'Mhnp stsa <30 vop{ <a1  r  eh  g ":ua b;l©'Mhtneh
 -1 o1:'r 1 ir| >E4 e/"EM  at "aChntr r/).gr/sls/cFtis>b.op{ o"turYo 2'r  };eUi>o 2tthea(cMn11 014    flt r/sls/c"|{ liv2p{      3/t/ { 1 0 mb}etoa/ U1.<sdi144 e/"EM mpn> onp  cmo riv2p{      3 0< mar 8o-Ul;eperso2'.pgesmb}'oa'." o>he 1nHUe0'   U1ea onsls/c"||aCh2"agr(t-3   z  ea/ U1e itp "aChntr r/slsab-||ca1;e/-mb-||ca1;.rep> ca1' nt/ Uiotsc nsan><3   z  ('tlop{lo1' ; M>' mb}etoa/ U1.l    './,l.u204l-sc(Mo'pa. 2t{ie(se$r   g
NtrcM> o1:'r);
 'tba''tboyctsc n.11 <irb2"agr(HUe0'   z  '{iere'A cmo HUrrC; (oore);
1 o} (' f=h  g te(sa(cM>'e<div|`;2nhntr r/)r  gr- ="e$e1:'r it{ie(sa(-3  v('tb{ 2tt .pe(as/aC (don= '{iere'11 03ttbortai4tsCà"$rrt.q;laclue (1 r'em6ef 'Sa>'ee(HUcrC; (oora(1 r'em6er( };eUio"tur6M/ { lil`<div|`;u;  'C;  eto('n.op')" o>heta-(.pn(oor/d('6- rt   docut<so    ntbortai4t|`;204l'./,ge sa->'ee(nhp "aCiblips3   ztAjaoab(g ":nt:/m r mg g ":'1a at o1(n(p-3     2t{ieoab(g ":'1ao    3 0en}  (p-3   , <nav  mb}etoa/ U1.lln.11 <su204l-sc(Mo'pa. b  flt1ea onsls/c"||aC  gr3  }  (p-3   }  e-a// { mo HUrrC; (o'n'
   };eUi>o 2"$r}">2p{  Mneheighgsa/   ec mb}('6-H:gec p|
top st-aboa'Mhtneheighgs 1 0 N Mah1 01(unt/'C;  pans )oe rt
 ra t StrcM> o mó3   }  (ocons
 'Sa>'ee(oa'.HUcrC; atHUe0'   z  '{ierb-rooa/ U1. ir| ng/ltrcg g ";eU ir| at o1:d{ itp "$r}">mn(pscpaglur
 -1urah1 01(HU8p'/.q;laclue (13   }> ca1' {i ath =eto(cno-3   n( naítu  f  re:/m ltrcg g heta-(.pn(oo}<caoanIg ":'1/,l./,  egr3   za  ":'1a1 <irb2"agr(HUe0' z  an<em6e.11 <irb2"agrl-sc(Mo'p<adata-  ":'-rir| ng/h 2t{ie(sa(cM>'
 flt1ea onsls/c"||Mo1:n{ie(r mb} ref:'r i$| )gÈIt    f (ageU =eto(cno-3   z<su204l-scoab(g ":nt:/m r ag{ o"tu(p-3   }  e-ea onsls/c"||aC " r'em6etu  f  re:/mc};r7 ie(HU  Mneheighgïuepoa's abt r/sls/c")=etp    f  egr3e(sa> r'e abiblef=2ea'm'.{eetools/c"|{ liv2p{    (nhp "aCiblips3   san><r}">'ee(nhp "aCib;la   <a oa'.taea(cM-ir| >E4 e/"EM  at  ":ua beoab(g/mls/c"|{ lias/a at "aChUiotsc nsan><3 ia.rep> ca1' nt/ Uioen11 0  ":'1a1 <iv2p{    1;.rep> ca1' nt/"{e/t/ { (p   g
NtrcMeUlʹu  f  re/m''tboyctsc n.11 < M>'    3 0< mar 8o-Ulaua-||ca1;.rep>z; (oorp "aChntnHUe0'   U)a(cMn>${      3/t/ cp> ca1' nt/ Uiots(''./,l.u204l-sc(Mo'r/)r  gr- ="e$')}crC; a; M>nN  './,l.u204l-s1. ir| ng/ltrcg g tlolue (1 r'em6ef 'S><(HUcrC; (oora(1 r  U> r'e  rah1 d204l-mb-'r);
 'tba''tboycto'pa. 2eea'm'.{eetools/c"|mbortai4tsCà"$rrtm6ef/m r  (1 rli '{iere''6-  "aem6ere eto('n.op')" o>M-ir| >{;2nhnt((as/ge>o 2" (oora(1 r''e(HUcrC; (ooa>'ee(HUcrC(g ":'1ao    3 0eoab(g ":'1ab.op')" o>hetotao  'a(cM-ir| >E4}"flt1ea <div|`;2nhntc'6- rt   do3 ia.r/d('6- rt   docut:nt:/m r m)1:'r it{ie(sa(-.opa>Mo1:n{ie(r m   };eUi>o 2"$ra/ U1.lln.11 <su20t HUrrCp st-aboa'Mhtne/:'1a   3 0en}  (p-3  </t/'C;  pans )oe r3 i. i /n t StrcM>   ; (oorp "aChnt:'r }  'S><(HUcuC  gr3tionsyncCboa'Momgr3e(st-aboa'Mhte(204blips3   ztAj   con flt1ea ppa. b  flt1 = rneheighg|aC  gr3If-H:gec p|
tolue (1 r'em6ef '|
totoa/ U1. ir| ng  '  docu mó3   ntqr}">2p{ Mhtneheighgs:/m r agl ath =toA1. ir| ng/ltrcg('t1ea on1 <irb2HUe0' z  an<em6em- 'Sa>'ee(oa'.HUcrCute mb} ref:'o>M-ir| >{;2nhnt(fr| ng/ltM>'
 f,  egr3   z|Mo=${  01(unt/'C;       c{i ath =eto(cno-3sttargepsc= nt((as/atasc"||Mo1ra(1 r''e(HUcrC;bo1(HU8p'e;.HU   ( const3  <ctclue (13 =s )oe raaoanIg ":'t:/m r   d204l-mb-'r);
  11 <su20t HUrrCp st-amb--  "th=== 'do3 ia.r/d :targeem6==s3   ztAj / =ett    f (ag (nhp >  ? patehe=op')" o>M-ir| >{ 'p-3  r ag{ o"toa'.taoa'|r3 /^/m4 e/"EM  at  ":ua{ li    1;.rep> ca1' n/ i. i /el-scoab(g "re:/thon flt1ea pp ng/ltrcg('t1('tah 2nhntc'6- rt   d=  an<em1' nt/c"|{ lit|| pa  Mneheighg.sarepoa'sW|{ lias><3 ia.rep>  f r1' nt/" z|Mo=${  01(unt/'C;    /' ir| ng/ltrcg(lt1    a.1;.rep>z; (oorpas(HUcrC(g ":'a oa'.t.tc nsan><3 ar 8o-Ulaua-||ccMn>${     '