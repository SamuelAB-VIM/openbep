/* OpenBEP translation runtime.
   The dictionary (translations/canbim_strings.csv) is keyed by the exact English text.
   trText() finds the translation of one piece of English text:
   1. the exact sentence;
   2. the sentence with its numbers and dates replaced by {1}, {2}... ("Issues ({1})");
      numbers are copied as they are (section numbers and IFC 4.3 must keep their dot);
   3. a list whose every part is in the dictionary ("Walls, Concept" or "A · B · C");
   4. several sentences, each of them in the dictionary;
   5. "Label: rest" when both the label and the rest are in the dictionary.
   Text with no letters stays as is; a leading "· " or a trailing ":" is kept around the
   translation (French gets its no-break space before the colon).
   It returns null when nothing matches, so the page keeps the English.
   build_i18n.py copies the block between the I18NCORE markers into app/bep-builder.html. */
/*I18NCORE*/
const I18N_NUM=/\bv\d+(?:\.\d+)+\b|\b\d{4}-\d{2}-\d{2}\b|(?<![\w.,])\d+(?:\.\d+)?(?![\w])/g, I18N_LEAD=/^([·:;,.–—-]\s*)(.+)$/s;
function i18nKey(k){const m=k.match(I18N_LEAD); if(m) k=m[2]; if(/[^:]:$/.test(k)) k=k.slice(0,-1).trim(); let i=0; return k.replace(I18N_NUM,()=>'{'+(++i)+'}')}
function trText(k,T,L){if(!k) return null; if(!/[A-Za-z]/.test(k)) return k; if(T[k]) return T[k];
  let m=k.match(I18N_LEAD); if(m){const t=trText(m[2],T,L); return t&&m[1]+t}
  if(/[^:]:$/.test(k)){const t=trText(k.slice(0,-1).trim(),T,L); return t&&t+(L==='fr'?'\u00a0:':':')}
  const nums=k.match(I18N_NUM); if(nums){const t=T[i18nKey(k)]; if(t) return t.replace(/\{(\d+)\}/g,(x,i)=>nums[i-1]==null?x:nums[i-1])}
  for(const sep of [' · ','; ',', ']) if(k.includes(sep)){const out=k.split(sep).map(p=>trText(p.trim(),T,L)); if(out.every(Boolean)) return out.join(sep)}
  const ss=k.split(/(?<=[.!?]) (?=[A-Z])/); if(ss.length>1){const out=ss.map(p=>trText(p,T,L)); if(out.every(Boolean)) return out.join(' ')}
  for(let c=k.indexOf(': ');c>0;c=k.indexOf(': ',c+1)){const h=k.slice(0,c), th=T[h+':']||((x=>x&&x+(L==='fr'?'\u00a0:':':'))(trText(h,T,L))), tr=th&&trText(k.slice(c+2).trim(),T,L); if(tr) return th+' '+tr}
  return null}
/*/I18NCORE*/

/* Page runtime, for every site page except the BEP Builder (which has its own).
   Load translations/strings.js first, then this file. Pick the language with
   <select data-i18n-lang></select> anywhere on the page, or ?lang=fr in the address.
   Mark anything that must stay as typed (names, codes) with data-notr. */
(function(){
  if(typeof document==='undefined') return;
  const TABLE=window.OPENBEP_STRINGS||{}, LANGS=window.OPENBEP_LANGS||{en:'English'}, KEY='openbep-lang';
  const ATTRS=['placeholder','aria-label','title','alt'], ORIG=new WeakMap(), SEEN=new Set();
  let L=new URLSearchParams(location.search).get('lang');
  try{L=L||localStorage.getItem(KEY)}catch(e){}
  if(!LANGS[L]) L=(navigator.language||'').slice(0,2)==='fr'&&LANGS.fr?'fr':'en';
  const ok=n=>{const p=n.parentNode; return p&&!/^(SCRIPT|STYLE|TEXTAREA)$/.test(p.nodeName)&&!(p.closest&&p.closest('[data-notr]'))};
  function run(root){const T=TABLE[L]||{};
    const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>ok(n)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT});
    let n; while((n=w.nextNode())){if(!ORIG.has(n)) ORIG.set(n,n.nodeValue); const o=ORIG.get(n), k=o.trim(); if(!k||!/[A-Za-z]/.test(k)) continue;
      SEEN.add(k); const x=L!=='en'&&trText(k,T,L), nv=x?o.replace(k,x):o; if(n.nodeValue!==nv) n.nodeValue=nv}
    if(root.querySelectorAll) [root,...root.querySelectorAll(ATTRS.map(a=>'['+a+']').join(','))].forEach(el=>{if(!el.getAttribute||el.closest('[data-notr]')) return;
      ATTRS.forEach(a=>{const dk='tr'+a.replace('-',''); let o=el.dataset[dk]; if(o==null){o=el.getAttribute(a); if(o==null) return; el.dataset[dk]=o}
        const k=o.trim(); if(!k) return; SEEN.add(k); el.setAttribute(a,(L!=='en'&&trText(k,T,L))||o)})})}
  let busy=false;
  function all(){busy=true; document.documentElement.lang=L; if(document.title){const t=document.querySelector('title'); if(t) run(t)} run(document.body);
    document.querySelectorAll('select[data-i18n-lang]').forEach(s=>{if(!s.options.length) s.innerHTML=Object.entries(LANGS).map(([k,v])=>`<option value="${k}">${v}</option>`).join(''); s.value=L}); busy=false}
  window.openbepSetLang=l=>{if(!LANGS[l]) return; L=l; try{localStorage.setItem(KEY,l)}catch(e){} all()};
  window.openbepStrings=()=>[...SEEN];
  document.addEventListener('change',e=>{if(e.target.matches&&e.target.matches('select[data-i18n-lang]')) window.openbepSetLang(e.target.value)});
  const start=()=>{all(); new MutationObserver(ms=>{if(busy) return; busy=true; ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1) run(n); else if(n.nodeType===3&&n.parentNode) run(n.parentNode)})); busy=false}).observe(document.body,{childList:true,subtree:true})};
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start); else start();
})();
