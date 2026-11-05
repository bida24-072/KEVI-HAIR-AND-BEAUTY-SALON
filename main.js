(()=>{
const D=window.KEVI,$=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const P=n=>'P'+n,days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const hh=h=>String(h).padStart(2,'0')+':00',fmt=m=>String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
const dur=m=>m>=60?Math.floor(m/60)+'h'+(m%60?' '+m%60+'m':''):m+'m';
const page=location.pathname.split('/').pop()||'index.html';
const nav=[['index.html','Home'],['services.html','Services'],['pricing.html','Pricing'],['team.html','Crew'],['contact.html','Contact']];
$('#site-header').innerHTML=`<div class="wrap bar"><a class="brand" href="index.html"><img src="logo.png" alt="KEVI Hair and Beauty logo" width="48" height="48"><span>KEVI<small>Hair &amp; Beauty</small></span></a><button class="burger" aria-label="Menu" aria-expanded="false">&#9776;</button><nav>${nav.map(([h,t])=>`<a href="${h}"${h==page?' aria-current="page"':''}>${t}</a>`).join('')}<a class="btn sm" href="booking.html">Book now</a></nav></div>`;
$('.burger').onclick=e=>{const o=$('#site-header').classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',o)};
$('#site-footer').innerHTML=`<div class="wrap foot"><div><strong>KEVI Hair &amp; Beauty</strong><br>${D.addr}<br>WhatsApp or call <a href="tel:+267${D.phone}">${D.phone}</a> / <a href="tel:+267${D.phone2}">${D.phone2}</a></div><div>${nav.map(([h,t])=>`<a href="${h}">${t}</a>`).join(' &nbsp; ')} &nbsp; <a href="booking.html">Book</a>${D.fb?` &nbsp; <a href="${D.fb}">Facebook</a>`:''}</div></div>`;
const list=(c,k)=>D.svc.filter(s=>s.cat==c.id).map(s=>`<li><span>${s.name}</span><span>${k=='p'?P(s.price):dur(s.mins)}</span></li>`).join('');
const R={
cats:()=>D.cats.map(c=>`<a class="card" href="services.html#${c.id}"><h3>${c.name}</h3><p>${c.blurb}</p><span class="from">From ${P(Math.min(...D.svc.filter(s=>s.cat==c.id).map(s=>s.price)))}</span></a>`).join(''),
hours:()=>[1,2,3,4,5,6,0].map(d=>`<li><span>${days[d]}</span><span>${D.hours[d]?hh(D.hours[d][0])+' - '+hh(D.hours[d][1]):'Closed'}</span></li>`).join(''),
detail:()=>D.cats.map(c=>`<section class="wrap cat" id="${c.id}"><div><h2>${c.name}</h2><p>${c.blurb}</p><p><a class="btn sm" href="booking.html">Book ${c.id=='nails'?'nails':c.id=='cut'?'a cut':'braids'}</a></p></div><ul class="list">${list(c)}</ul></section>`).join(''),
pricing:()=>D.cats.map(c=>`<div class="card"><h2>${c.name}</h2><ul class="list">${list(c,'p')}</ul></div>`).join(''),
crew:()=>D.crew.map(m=>`<div class="card"><div class="avatar">${m.photo?`<img src="${m.photo}" alt="${m.name}">`:m.name[0]}</div><h3>${m.name}</h3><p class="from">${m.role}</p><p>${m.bio}</p></div>`).join('')
};
$$('[data-r]').forEach(e=>e.innerHTML=R[e.dataset.r]());
$$('[data-phone]').forEach(e=>e.innerHTML=`<a class="btn sm" href="tel:+267${D.phone}">Call ${D.phone}</a> <a class="btn sm ghost" href="https://wa.me/${D.wa}">WhatsApp</a>`);
$$('[data-addr]').forEach(e=>e.textContent=D.addr);
if(!$('#booking'))return;
// ---- booking ----
const sel=new Set(),S=id=>D.svc.find(s=>s.id==id);let chosen=null;
const store=()=>{try{return JSON.parse(localStorage.kevi_b||'[]')}catch(e){return[]}};
const total=()=>[...sel].reduce((a,i)=>({p:a.p+S(i).price,m:a.m+S(i).mins}),{p:0,m:0});
const able=()=>D.crew.filter(c=>[...sel].every(i=>c.cats.includes(S(i).cat)));
const free=(d,m,len)=>($('#stylist').value?[$('#stylist').value]:able().map(c=>c.name)).find(n=>!store().some(b=>b.d==d&&b.who==n&&m<b.m+b.len&&b.m<m+len));
$('#svc').innerHTML=D.cats.map(c=>`<h3>${c.name}</h3>`+D.svc.filter(s=>s.cat==c.id).map(s=>`<label class="chk"><input type="checkbox" value="${s.id}"><span>${s.name}</span><em>${dur(s.mins)}, ${P(s.price)}</em></label>`).join('')).join('');
$('#date').min=new Date().toLocaleDateString('en-CA');
function stylists(){const k=$('#stylist').value,a=able();$('#stylist').innerHTML='<option value="">Anyone available</option>'+a.map(c=>`<option>${c.name}</option>`).join('');$('#stylist').value=a.some(c=>c.name==k)?k:''}
function sum(){const t=total();$('#sum').innerHTML=sel.size?`<strong>${sel.size} service${sel.size>1?'s':''}</strong>, about ${dur(t.m)}, estimated <strong>${P(t.p)}</strong>${able().length?'':'<br>No single stylist does all of these. Please book them separately.'}`:'No services chosen yet.'}
function slots(){chosen=null;const box=$('#slots'),d=$('#date').value,t=total();
if(!sel.size){box.innerHTML='<p class="hint">Choose at least one service first.</p>';return}
if(!d){box.innerHTML='<p class="hint">Pick a date to see available times.</p>';return}
const dt=new Date(d+'T00:00'),h=D.hours[dt.getDay()];
if(!h){box.innerHTML=`<p class="hint">We are closed on ${days[dt.getDay()]}s. Pick another day.</p>`;return}
const now=new Date(),out=[];
for(let m=h[0]*60;m+t.m<=h[1]*60;m+=30){const past=dt.toDateString()==now.toDateString()&&m<=now.getHours()*60+now.getMinutes();
out.push(`<button type="button" class="slot" data-m="${m}" aria-pressed="false" ${free(d,m,t.m)&&!past?'':'disabled'}>${fmt(m)}</button>`)}
box.innerHTML=out.join('')||'<p class="hint">These services take longer than one day\'s hours. Please call us.</p>'}
const refresh=()=>{stylists();sum();slots()};
$('#svc').onchange=e=>{e.target.checked?sel.add(e.target.value):sel.delete(e.target.value);refresh()};
$('#date').onchange=slots;$('#stylist').onchange=slots;
$('#slots').onclick=e=>{const b=e.target.closest('.slot');if(!b||b.disabled)return;$$('.slot').forEach(x=>x.setAttribute('aria-pressed','false'));b.setAttribute('aria-pressed','true');chosen=+b.dataset.m};
$('#go').onclick=()=>{const name=$('#name').value.trim(),ph=$('#phone').value.trim(),d=$('#date').value,err=$('#err');
if(!sel.size||!d||chosen==null||!name||ph.replace(/\D/g,'').length<7){err.textContent='Please choose a service, date and time, then enter your name and phone number.';return}
const t=total(),who=free(d,chosen,t.m);if(!who){err.textContent='That time was just taken. Please pick another.';slots();return}
err.textContent='';try{localStorage.kevi_b=JSON.stringify([...store(),{d,m:chosen,len:t.m,who}])}catch(e){}
const note=$('#note').value.trim(),msg=`Hi KEVI, I'd like to book:\n${[...sel].map(i=>'- '+S(i).name).join('\n')}\nDate: ${d} at ${fmt(chosen)}\nStylist: ${$('#stylist').value||'first available ('+who+')'}\nName: ${name}\nPhone: ${ph}\nEstimated: ${P(t.p)}${note?'\nNote: '+note:''}`;
const url=`https://wa.me/${D.wa}?text=${encodeURIComponent(msg)}`;
$('#booking').innerHTML=`<div class="card done"><h2>One last step, ${name}</h2><p>Send your request on WhatsApp so we can confirm your ${d} ${fmt(chosen)} appointment with ${who}.</p><p><a class="btn" href="${url}" target="_blank" rel="noopener">Send on WhatsApp</a></p><p class="hint">No WhatsApp? Call ${D.phone} or ${D.phone2}.</p></div>`;
window.open(url,'_blank')};
refresh();
})();
