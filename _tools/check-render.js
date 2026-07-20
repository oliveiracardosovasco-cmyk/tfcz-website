const {JSDOM, VirtualConsole} = require(require('path').join(process.cwd(),'node_modules','jsdom'));
const fs=require('fs'), path=require('path');
const DIR='/sessions/nice-fervent-shannon/mnt/TFCZ/01_Web/website-v2';
const pages=['index.html','mitglied.html','tfcz-training.html','tfcz-firmenevents.html','tfcz-geschichte.html','tfcz-ueber-uns.html','tfcz-regeln.html','tfcz-medien.html','login.html'];
(async()=>{
 for(const pg of pages){
  const fp=path.join(DIR,pg); if(!fs.existsSync(fp)){console.log(`SKIP ${pg} (fehlt)`);continue;}
  const errors=[];
  const vc=new VirtualConsole();
  vc.on('jsdomError',e=>{const m=(e.detail&&e.detail.message||e.message||'');const st=(e.detail&&e.detail.stack)||'';if(/getContext|setTransform|canvas|Not implemented|responseStart/i.test(m))return;if(/https?:\/\//.test(st) && !/file:\/\//.test(st))return;errors.push(m);});
  const dom=new JSDOM(fs.readFileSync(fp,'utf8'),{
    runScripts:'dangerously', resources:'usable', url:'file://'+fp+'',
    pretendToBeVisual:true, virtualConsole:vc,
    beforeParse(w){
      w.matchMedia=w.matchMedia||(q=>({matches:false,media:q,addListener(){},removeListener(){},addEventListener(){},removeEventListener(){}}));
      w.IntersectionObserver=class{constructor(cb){this.cb=cb;} observe(el){this.cb([{isIntersecting:true,target:el}],this);} unobserve(){} disconnect(){}};
      w.scrollTo=w.scrollTo||function(){};try{["scrollTo","scrollBy","scrollIntoView"].forEach(function(m){w.Element.prototype[m]=function(){};});}catch(e){}try{w.HTMLCanvasElement.prototype.getContext=function(){return new Proxy({canvas:{width:0,height:0}},{get:function(t,p){return (p in t)?t[p]:function(){};}});};}catch(e){}
      w.requestAnimationFrame=w.requestAnimationFrame||(cb=>setTimeout(()=>cb(Date.now()),0));
    }
  });
  // etwas Zeit für DOMContentLoaded/load-Handler
  await new Promise(r=>setTimeout(r,1400));
  const doc=dom.window.document;
  const rev=doc.querySelectorAll('.reveal');
  const revIn=doc.querySelectorAll('.reveal.in');
  const bodyText=(doc.body&&doc.body.textContent||'').replace(/\s+/g,' ').trim();
  const revealOK = rev.length===0 || revIn.length>0;
  const status = (errors.length===0 && revealOK && bodyText.length>50)?'OK ':'FAIL';
  console.log(`${status} ${pg.padEnd(26)} | text:${String(bodyText.length).padStart(5)} | reveal ${revIn.length}/${rev.length} | errs:${errors.length}${errors.length?(' -> '+errors.slice(0,2).join(' || ')):''}`);
  dom.window.close();
 }
})();
