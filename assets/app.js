const DB={
  // Cadastro manual de cupons — adicione novos objetos aqui seguindo o mesmo formato.
  // code: código exato (case-sensitive) · percent: desconto % · usage: 'once' (uso único por cliente/navegador) ou 'unlimited'
  // validProducts: 'any' ou array de ids de produto · expires: 'DD/MM/AAAA' ou null
  coupons:[
    {code:'ANDREIA60',percent:60,usage:'once',validProducts:'any',expires:null}
  ],
  whatsapp:'https://wa.me/message/NK42IOHQYX3LF1',
  socials:{
    instagram:'https://www.instagram.com/amodonnabella?igsh=YXNvNWd6cWNpeDZ6&utm_source=qr',
    tiktok:'https://www.tiktok.com/@amodonnabella?_r=1',
    facebook:''
  },
  products:[
    {id:'oculos-sunset-bella',name:'Óculos Sunset Bella',price:69.90,oldPrice:289.90,category:'Óculos',img:'assets/img/oculos-sunset-bella-1.jpg',desc:'Armação em acetato translúcido rosé com ferragem dourada. Lentes polarizadas, com proteção UV400 e UVB.',material:'Acetato translúcido rosé, ferragem dourada, lentes polarizadas',care:'Guarde no case ao não usar. Limpe as lentes apenas com pano de microfibra seco ou levemente umedecido.',url:'produto-oculos-sunset-bella.html'},
    {id:'brinco-coracao',name:'Brinco Coração',price:59.90,category:'Brincos',img:'assets/img/brinco-coracao.jpg',desc:'Brinco de pressão em formato de coração, cravejado com cristais. Peça delicada, com fecho seguro para uso diário.',material:'Metal folheado, cristais',care:'Evite contato com perfume e água em excesso. Guarde em local seco.'},
    {id:'brinco-bella-02',name:'Brinco Bella 02',price:79.90,category:'Brincos',img:'assets/img/brinco-2.jpg',desc:'Cadastre o produto, descrição e valor.',material:'',care:''},
    {id:'brinco-signature-03',name:'Brinco Signature 03',price:99.90,category:'Brincos',img:'assets/img/brinco-3.jpg',desc:'Cadastre o produto, descrição e valor.',material:'',care:''},
    {id:'colar-classica',name:'Colar Clássica',price:48.90,category:'Colares',img:'assets/img/gargantilha-cristais.jpg',desc:'Colar da linha Clássica, cristais lapidados em corrente delicada. Peça atemporal para uso diário ou ocasiões especiais.',material:'Metal folheado, cristais lapidados',care:'Evite contato com perfume e água em excesso. Guarde em local seco, separado de outras peças.'},
    {id:'pingente-classica',name:'Pingente Clássica',price:29.99,category:'Colares',img:'assets/img/pingente-classica.jpg',desc:'Pingente da linha Clássica, para compor com correntes DonnaBella ou usar com a sua própria.',material:'Metal folheado',care:'Evite contato com perfume e água em excesso. Guarde em local seco.'}
  ]
};
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
function money(v){return Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}
function escapeHTML(v=''){return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
function modal(html){const m=$('#modal'); if(!m)return; $('#modalContent').innerHTML=html; m.classList.add('open'); document.body.classList.add('modal-open');}
function closeModal(){$('#modal')?.classList.remove('open');document.body.classList.remove('modal-open');}
function toast(t){let x=document.createElement('div');x.className='toast';x.textContent=t;document.body.appendChild(x);setTimeout(()=>x.remove(),2600);}
function getCart(){try{return JSON.parse(localStorage.getItem('db_cart')||'[]')}catch{return[]}}
function saveCart(c){localStorage.setItem('db_cart',JSON.stringify(c));updateCart();}
function updateCart(){let c=getCart(),n=c.reduce((a,x)=>a+x.qty,0); $$('#cartCount').forEach(x=>x.textContent=n);}
function closeDrawer(){ $('#drawer')?.classList.remove('open'); $('#drawerOverlay')?.classList.remove('open'); }
function openDrawer(){ $('#drawer')?.classList.add('open'); $('#drawerOverlay')?.classList.add('open'); }
function renderOrders(){
  let o=[]; try{o=JSON.parse(localStorage.getItem('db_orders')||'[]')}catch{}
  return o.length?o.map(x=>`<div class="order-card"><b>${escapeHTML(x.id)}</b><span>${escapeHTML(x.date)}</span><span>${escapeHTML(x.status)}</span><strong>${money(x.total)}</strong></div>`).join(''):`<div class="empty-state"><div class="empty-mark">Donna</div><h3>Nenhum pedido encontrado.</h3><p>Quando você fizer um pedido pelo site, ele aparecerá aqui.</p><a class="btn btn-dark" href="index.html#colecoes">Fazer pedido agora</a></div>`;
}
function openOrders(){modal(`<p class="eyebrow">Minha DonnaBella</p><h2>Pedidos feitos</h2><div>${renderOrders()}</div>`);closeDrawer();}
function openCoupons(){
  const used=getUsedCoupons();
  modal(`<p class="eyebrow">Benefícios DonnaBella</p><h2>Cupons disponíveis</h2><p class="muted">Cadastrados manualmente pela loja. Toque em um código para copiar.</p><div class="coupon-grid">${DB.coupons.map(c=>{
    const isUsed=c.usage==='once'&&used.includes(c.code);
    return `<button type="button" class="coupon-card${isUsed?' coupon-used':''}" ${isUsed?'disabled':`data-copy="${c.code}"`}><b>${c.code}</b><span>${c.percent}% OFF</span><small>${isUsed?'Já utilizado neste navegador':(c.usage==='once'?'Uso único por cliente':'Uso ilimitado')}</small></button>`;
  }).join('')}</div>`);
  closeDrawer();
  $$('[data-copy]').forEach(b=>b.onclick=async()=>{try{await navigator.clipboard.writeText(b.dataset.copy);b.querySelector('small').textContent='Código copiado ✓';}catch{b.querySelector('small').textContent='Código: '+b.dataset.copy;}b.classList.add('copied');});
}
function getUsedCoupons(){try{return JSON.parse(localStorage.getItem('db_used_coupons')||'[]')}catch{return[]}}
function markCouponUsed(code){let u=getUsedCoupons();if(!u.includes(code)){u.push(code);localStorage.setItem('db_used_coupons',JSON.stringify(u));}}
function isCouponUsed(code){return getUsedCoupons().includes(code);}
function findCoupon(rawCode){
  const code=String(rawCode||'').trim(); // exigência: código exato, case-sensitive
  const c=DB.coupons.find(x=>x.code===code);
  if(!c) return {ok:false,reason:'invalid'};
  if(c.usage==='once' && isCouponUsed(c.code)) return {ok:false,reason:'used'};
  if(c.expires){ const [d,m,y]=c.expires.split('/'); if(new Date(`${y}-${m}-${d}T23:59:59`)<new Date()) return {ok:false,reason:'expired'}; }
  return {ok:true,coupon:c};
}
function getAppliedCoupon(){try{return JSON.parse(localStorage.getItem('db_applied_coupon')||'null')}catch{return null}}
function setAppliedCoupon(v){ if(v) localStorage.setItem('db_applied_coupon',JSON.stringify(v)); else localStorage.removeItem('db_applied_coupon'); }

let _pendingCoupon=null; // {code,percent} aguardando escolha do produto, quando o carrinho tem 2+ itens
function cartCouponMsg(text,type){ return `<div class="coupon-msg ${type}">${escapeHTML(text)}</div>`; }

function renderCartModal(){
  let c=getCart(), applied=getAppliedCoupon();
  if(applied && (applied.itemIndex==null || applied.itemIndex>=c.length || c[applied.itemIndex]?.name!==applied.itemName)){ setAppliedCoupon(null); applied=null; }

  let total=0;
  const lines=c.map((x,i)=>{
    const lineBase=x.price*x.qty;
    let lineFinal=lineBase, tag='';
    if(applied && applied.itemIndex===i){
      lineFinal=Math.round(lineBase*(1-applied.percent/100)*100)/100;
      tag=`<span class="coupon-tag">${applied.code} · -${applied.percent}%</span>`;
    }
    total+=lineFinal;
    return `<div class="modal-line"><span>${escapeHTML(x.name)} × ${x.qty}${tag}</span><b>${applied&&applied.itemIndex===i?`<s>${money(lineBase)}</s> `:''}${money(lineFinal)}</b></div>`;
  }).join('');

  let couponBlock='';
  if(c.length){
    if(_pendingCoupon && !applied){
      couponBlock=`<div class="cart-coupon"><p class="cc-label">Cupom <b>${escapeHTML(_pendingCoupon.code)}</b> (${_pendingCoupon.percent}% OFF) — em qual produto deseja aplicar?</p>
        <div class="coupon-pick">${c.map((x,i)=>`<label class="coupon-pick-item"><input type="radio" name="couponPick" value="${i}">${escapeHTML(x.name)}</label>`).join('')}</div>
        <div class="cart-coupon-row"><button type="button" class="btn btn-dark" id="couponConfirmBtn" style="width:100%;justify-content:center">Confirmar produto</button></div>
        <button type="button" id="couponCancelBtn" class="coupon-cancel-link">Cancelar</button></div>`;
    } else if(applied){
      couponBlock=`<div class="cart-coupon"><p class="cc-label">Cupom aplicado</p><div class="cart-coupon-row"><span class="coupon-applied-chip">${escapeHTML(applied.code)} · -${applied.percent}% em "${escapeHTML(applied.itemName)}"</span><button type="button" id="couponRemoveBtn">Remover</button></div></div>`;
    } else {
      couponBlock=`<div class="cart-coupon"><p class="cc-label">Cupom promocional</p><div class="cart-coupon-row"><input id="couponInput" placeholder="Código do cupom" maxlength="30" autocapitalize="characters"><button type="button" id="couponApplyBtn">Aplicar</button></div><div id="couponMsg"></div></div>`;
    }
  }

  const body=c.length
    ? lines+couponBlock+`<div class="modal-total"><span>Total</span><b>${money(total)}</b></div><button class="btn btn-gold" id="checkoutBtn" type="button">Finalizar pedido</button><a class="btn btn-dark" style="margin-top:10px" href="pedidos.html">Ver pedidos feitos</a>`
    : `<div class="empty-state"><div class="empty-mark">Donna</div><h3>Sua sacola está vazia.</h3><p>Escolha uma peça para começar.</p><a class="btn btn-dark" href="index.html#colecoes">Fazer pedido agora</a></div>`;

  modal(`<p class="eyebrow">Minha sacola</p><h2>Seus itens</h2>${body}`);
  wireCartModal();
}

function wireCartModal(){
  $('#couponApplyBtn')?.addEventListener('click',()=>{
    const input=$('#couponInput'); const res=findCoupon(input.value);
    const msgEl=$('#couponMsg');
    if(!res.ok){
      const map={invalid:'Este cupom não está disponível. Verifique o código digitado ou escolha uma condição promocional válida.',used:'Este cupom já foi utilizado neste navegador e não pode ser usado novamente.',expired:'Este cupom expirou e não está mais disponível.'};
      msgEl.outerHTML=cartCouponMsg(map[res.reason]||map.invalid,'err');
      return;
    }
    const c=getCart();
    if(c.length===1){
      setAppliedCoupon({code:res.coupon.code,percent:res.coupon.percent,itemIndex:0,itemName:c[0].name});
      toast('Cupom aplicado com sucesso.');
      renderCartModal();
    } else {
      _pendingCoupon={code:res.coupon.code,percent:res.coupon.percent};
      renderCartModal();
    }
  });
  $('#couponConfirmBtn')?.addEventListener('click',()=>{
    const picked=$('input[name="couponPick"]:checked');
    if(!picked){ toast('Selecione um produto para aplicar o cupom.'); return; }
    const c=getCart(); const idx=Number(picked.value);
    setAppliedCoupon({code:_pendingCoupon.code,percent:_pendingCoupon.percent,itemIndex:idx,itemName:c[idx].name});
    _pendingCoupon=null;
    toast('Cupom aplicado com sucesso.');
    renderCartModal();
  });
  $('#couponCancelBtn')?.addEventListener('click',()=>{ _pendingCoupon=null; renderCartModal(); });
  $('#couponRemoveBtn')?.addEventListener('click',()=>{ setAppliedCoupon(null); renderCartModal(); });

  $('#checkoutBtn')?.addEventListener('click',()=>{
    let c=getCart(); if(!c.length)return;
    const applied=getAppliedCoupon();
    let orders=[];try{orders=JSON.parse(localStorage.getItem('db_orders')||'[]')}catch{}
    let total=0; c.forEach((x,i)=>{ const base=x.price*x.qty; total += (applied&&applied.itemIndex===i) ? base*(1-applied.percent/100) : base; });
    const id='DB-'+Date.now().toString().slice(-6);
    orders.unshift({id,date:new Date().toLocaleString('pt-BR'),items:c,total,coupon:applied?applied.code:null,status:'Recebido'});
    localStorage.setItem('db_orders',JSON.stringify(orders));
    if(applied){ markCouponUsed(applied.code); setAppliedCoupon(null); }
    localStorage.removeItem('db_cart'); _pendingCoupon=null; updateCart(); closeModal();
    const text=encodeURIComponent(`Olá, DonnaBella! Quero finalizar o pedido ${id}. Total: ${money(total)}.`);
    window.open(DB.whatsapp+'?text='+text,'_blank'); toast('Pedido registrado. Abrimos o WhatsApp para finalizar.');
  });
}
function openCart(){ _pendingCoupon=null; renderCartModal(); }
function setupHero(){
  const track=$('#heroTrack'); if(!track)return;
  let i=0; const slides=[...track.children],dots=$('#heroDots');
  const go=x=>{
    i=(x+slides.length)%slides.length;
    track.style.transform=`translate3d(-${i*100}%,0,0)`;
    $$('.hero-dot',dots).forEach((d,k)=>d.classList.toggle('active',k===i));
    slides.forEach((s,k)=>{
      s.setAttribute('aria-hidden',k===i?'false':'true');
      const vid=s.querySelector('.hero-video');
      if(vid){ if(k===i){ vid.currentTime=0; vid.play().catch(()=>{}); } else { vid.pause(); } }
    });
  };
  slides.forEach((_,x)=>{let b=document.createElement('button');b.type='button';b.className='hero-dot'+(x===0?' active':'');b.setAttribute('aria-label','Ir para slide '+(x+1));b.onclick=()=>go(x);dots?.appendChild(b);});
  $('#heroPrev')?.addEventListener('click',()=>go(i-1)); $('#heroNext')?.addEventListener('click',()=>go(i+1));
  let timer=setInterval(()=>go(i+1),6500); track.parentElement?.addEventListener('mouseenter',()=>clearInterval(timer)); track.parentElement?.addEventListener('mouseleave',()=>timer=setInterval(()=>go(i+1),6500));
  go(0);
}
function setupCountdown(){
  $$('[data-rolling-24h]').forEach(el=>{
    const CYCLE=24*3600*1000;
    let end=Number(localStorage.getItem('db_countdown_end')||0);
    if(!end||end<Date.now()){ end=Date.now()+CYCLE; localStorage.setItem('db_countdown_end',end); }
    const tick=()=>{
      let now=Date.now();
      if(end<=now){ while(end<=now) end+=CYCLE; localStorage.setItem('db_countdown_end',end); }
      let s=Math.max(0,Math.floor((end-now)/1000)),h=Math.floor(s/3600);s%=3600;let m=Math.floor(s/60);s%=60;
      $('[data-h]',el).textContent=String(h).padStart(2,'0');$('[data-m]',el).textContent=String(m).padStart(2,'0');$('[data-s]',el).textContent=String(s).padStart(2,'0');
    };
    tick();setInterval(tick,1000);
  });
  // compat: ainda soporta cronômetros antigos com data-deadline fixo, se algum ficar no site
  $$('[data-deadline]').forEach(el=>{const end=new Date(el.dataset.deadline).getTime();const tick=()=>{let t=Math.max(0,end-Date.now()),s=Math.floor(t/1000),d=Math.floor(s/86400);s%=86400;let h=Math.floor(s/3600);s%=3600;let m=Math.floor(s/60);s%=60; $('[data-d]',el)&&($('[data-d]',el).textContent=String(d).padStart(2,'0'));$('[data-h]',el).textContent=String(h).padStart(2,'0');$('[data-m]',el).textContent=String(m).padStart(2,'0');$('[data-s]',el).textContent=String(s).padStart(2,'0');};tick();setInterval(tick,1000);});
}
function getFavs(){try{return JSON.parse(localStorage.getItem('db_favs')||'[]')}catch{return[]}}
function saveFavs(f){localStorage.setItem('db_favs',JSON.stringify(f));}
function isFav(name){return getFavs().includes(name);}
function toggleFav(name){let f=getFavs();if(f.includes(name))f=f.filter(x=>x!==name);else f.push(name);saveFavs(f);}
function setupFavorites(){
  $$('[data-fav]').forEach(btn=>{
    const name=btn.dataset.fav;
    btn.classList.toggle('active',isFav(name));
    btn.addEventListener('click',(e)=>{
      e.preventDefault();e.stopPropagation();
      toggleFav(name);
      btn.classList.toggle('active');
      toast(isFav(name)?'Adicionado aos favoritos.':'Removido dos favoritos.');
    });
  });
}
function setupSearch(){
 const sp=$('#searchPanel'),si=$('#searchInput');$('#searchToggle')?.addEventListener('click',()=>{sp?.classList.toggle('open');si?.focus()});
 si?.addEventListener('input',()=>{let q=si.value.toLowerCase().trim();let items=[['Brincos','categoria-brincos.html'],['Laços','lacos.html'],['Óculos','categoria-oculos.html'],['Joias & acessórios','index.html#colecoes'],['Cupons','#cupons'],['Pedidos feitos','pedidos.html'],['Atendimento','atendimento.html'],['Redes sociais','redes.html'],['Sobre a DonnaBella','sobre.html'],['Guia de compra','guia.html']];let r=q?items.filter(x=>x[0].toLowerCase().includes(q)):items;$('#searchResults').innerHTML=r.map(x=>`<a href="${x[1]}">${x[0]}</a>`).join('')||'<p class="muted">Nenhum resultado.</p>';});
}
function setupCartAndProducts(){
 $$('[data-add-product]').forEach(b=>b.addEventListener('click',()=>{let c=getCart(),name=b.dataset.name,price=Number(b.dataset.price),it=c.find(x=>x.name===name);if(it)it.qty++;else c.push({name,price,qty:1});saveCart(c);toast('Produto adicionado à sacola.');}));
 $$('[data-cart-open]').forEach(b=>b.addEventListener('click',openCart));
}
function setupReviews(){
 const container=$('#reviewsList');
 let reviews=[];try{reviews=JSON.parse(localStorage.getItem('db_reviews')||'[]')}catch{}
 if(container){container.innerHTML=reviews.length?reviews.map(r=>`<article class="review-card"><div class="stars">★★★★★</div><h3>${escapeHTML(r.name)}</h3><p>${escapeHTML(r.text)}</p><small>Cliente DonnaBella</small></article>`).join(''):`<div class="review-empty"><div class="stars">★★★★★</div><h3>Sua experiência merece ser contada.</h3><p>Publique uma avaliação real após sua compra. Assim, a DonnaBella mantém uma comunidade autêntica e confiável.</p><button class="btn btn-dark" data-review-open type="button">Deixar avaliação</button></div>`;}
 $$('[data-review-open]').forEach(b=>b.onclick=()=>modal(`<p class="eyebrow">Sua experiência</p><h2>Deixe uma avaliação</h2><form id="reviewForm" class="review-form"><input required id="reviewName" maxlength="60" placeholder="Seu nome"><select id="reviewStars" aria-label="Nota"><option value="5">★★★★★ — 5 estrelas</option><option value="4">★★★★☆ — 4 estrelas</option><option value="3">★★★☆☆ — 3 estrelas</option><option value="2">★★☆☆☆ — 2 estrelas</option><option value="1">★☆☆☆☆ — 1 estrela</option></select><textarea required id="reviewText" maxlength="500" placeholder="Conte como foi sua experiência"></textarea><button class="btn btn-gold">Enviar avaliação</button></form>`));
 document.addEventListener('submit',e=>{if(e.target.id!=='reviewForm')return;e.preventDefault();let reviews=[];try{reviews=JSON.parse(localStorage.getItem('db_reviews')||'[]')}catch{}reviews.push({name:$('#reviewName').value.trim(),stars:Number($('#reviewStars').value),text:$('#reviewText').value.trim()});localStorage.setItem('db_reviews',JSON.stringify(reviews));closeModal();toast('Avaliação salva. Obrigado!');setupReviews();});
}
function setupNewsletter(){
 $('#newsletterForm')?.addEventListener('submit',e=>{e.preventDefault();const email=$('#newsletterEmail').value.trim();localStorage.setItem('db_email',email);e.target.querySelector('button').textContent='Cadastro realizado ✓';toast('Cadastro salvo neste navegador.');});
}
function setupTrend(){
 $$('[data-trend]').forEach(b=>b.addEventListener('click',()=>$('#trendTrack')?.scrollBy({left:b.dataset.trend==='next'?320:-320,behavior:'smooth'})));
}
function setupLiveChat(){
  if(document.getElementById('liveChatBadge')) return;
  const wrap=document.createElement('div');
  wrap.innerHTML=`
    <button class="live-chat-badge" id="liveChatBadge" aria-label="Abrir chat DonnaBella">
      <span class="lcb-mark">Donna<b>Bella</b></span>
      <span class="live-chat-dot" id="liveChatDot"></span>
    </button>
    <div class="live-chat-tooltip" id="liveChatTooltip">
      <button class="lct-close" id="liveChatTooltipClose" aria-label="Fechar">×</button>
      <b>DonnaBella</b>
      Olá, tudo bem por aí? Estou por aqui para ajudar na sua escolha. 💚
    </div>
    <div class="live-chat-panel" id="liveChatPanel">
      <div class="lcp-head">
        <span class="lcp-title">DonnaBella<small>Normalmente responde em minutos</small></span>
        <button id="liveChatClose" aria-label="Fechar chat">×</button>
      </div>
      <div class="lcp-body">
        <div class="lcp-msg">Olá! Sou o canal de atendimento da DonnaBella. Escolha uma opção abaixo ou fale direto com nossa equipe pelo WhatsApp.</div>
        <div class="lcp-quick">
          <button type="button" data-lc-action="whatsapp">Falar no WhatsApp agora</button>
          <button type="button" data-lc-action="colecoes">Ver categorias de produtos</button>
          <button type="button" data-lc-action="pedidos">Acompanhar meu pedido</button>
          <button type="button" data-lc-action="cupons">Ver cupons disponíveis</button>
        </div>
      </div>
      <form class="lcp-foot" id="liveChatForm">
        <input type="text" id="liveChatInput" placeholder="Escreva sua mensagem…" maxlength="300">
        <button type="submit" aria-label="Enviar">➤</button>
      </form>
    </div>`;
  document.body.appendChild(wrap);

  const badge=$('#liveChatBadge'),tooltip=$('#liveChatTooltip'),panel=$('#liveChatPanel'),dot=$('#liveChatDot');
  const openPanel=()=>{panel.classList.add('open');tooltip.classList.remove('open');dot.style.display='none';};
  const closePanel=()=>panel.classList.remove('open');
  badge.addEventListener('click',()=>{ panel.classList.contains('open') ? closePanel() : openPanel(); });
  $('#liveChatClose').addEventListener('click',closePanel);
  $('#liveChatTooltipClose').addEventListener('click',(e)=>{e.stopPropagation();tooltip.classList.remove('open');});
  tooltip.addEventListener('click',openPanel);

  if(!sessionStorage.getItem('db_chat_greeted')){
    setTimeout(()=>{ if(!panel.classList.contains('open')) tooltip.classList.add('open'); sessionStorage.setItem('db_chat_greeted','1'); },2200);
  } else { dot.style.display='none'; }

  $$('[data-lc-action]',panel).forEach(b=>b.addEventListener('click',()=>{
    const a=b.dataset.lcAction;
    if(a==='whatsapp') window.open(DB.whatsapp,'_blank');
    else if(a==='colecoes') window.location.href='index.html#colecoes';
    else if(a==='pedidos') window.location.href='pedidos.html';
    else if(a==='cupons'){ closePanel(); openCoupons(); }
  }));

  $('#liveChatForm').addEventListener('submit',(e)=>{
    e.preventDefault();
    const input=$('#liveChatInput'); const text=input.value.trim(); if(!text)return;
    const body=$('.lcp-body',panel);
    const userMsg=document.createElement('div');
    userMsg.className='lcp-msg'; userMsg.style.background='var(--green)'; userMsg.style.color='#fff'; userMsg.style.marginLeft='30px';
    userMsg.textContent=text;
    body.appendChild(userMsg);
    const reply=document.createElement('div');
    reply.className='lcp-msg';
    reply.textContent='Obrigada pela mensagem! Nossa equipe confirma esse tipo de dúvida com mais detalhe pelo WhatsApp — toque em "Falar no WhatsApp agora" acima para continuar por lá.';
    body.appendChild(reply);
    body.scrollTop=body.scrollHeight;
    input.value='';
  });
}
function getProductById(id){return DB.products.find(p=>p.id===id);}
function applyCoupon(code,price){
  const found=DB.coupons.find(([c])=>c.toUpperCase()===String(code).trim().toUpperCase());
  if(!found) return null;
  const [,pct]=found; return {pct,newPrice:Math.round(price*(1-pct/100)*100)/100};
}
function setupProductPage(){
  const mount=$('#productPage'); if(!mount) return;
  const id=new URLSearchParams(location.search).get('id');
  const p=id&&getProductById(id);
  if(!p){
    mount.innerHTML=`<div class="pd-notfound"><div class="empty-mark">Donna</div><h2>Produto não encontrado.</h2><p class="muted">Esse item pode ter sido removido ou o link está incorreto.</p><a class="btn btn-dark" href="index.html#colecoes">Ver coleções</a></div>`;
    return;
  }
  document.title=p.name+' | DonnaBella';
  $('#crumbCategory')&&($('#crumbCategory').textContent=p.category||'Produto');
  const off=p.oldPrice?Math.round((1-p.price/p.oldPrice)*100):null;
  mount.innerHTML=`<div class="pd-grid">
    <div class="pd-media">${off?`<span class="pd-badge-off">-${off}% OFF</span>`:''}<img src="${p.img}" alt="${escapeHTML(p.name)}"></div>
    <div class="pd-info">
      <p class="eyebrow">${escapeHTML(p.category||'DonnaBella')}</p>
      <h1>${escapeHTML(p.name)}</h1>
      <div class="pd-price-row">${p.oldPrice?`<span class="pd-old-price">${money(p.oldPrice)}</span>`:''}<span class="pd-price">${money(p.price)}</span></div>
      <p class="pd-desc">${escapeHTML(p.desc||'Cadastre a descrição deste produto.')}</p>
      ${p.material?`<div class="pd-spec"><b>Material</b><span>${escapeHTML(p.material)}</span></div>`:''}
      ${p.care?`<div class="pd-spec"><b>Cuidados</b><span>${escapeHTML(p.care)}</span></div>`:''}
      <div class="pd-actions">
        <button class="btn btn-gold" id="pdBuyNow" type="button">Comprar agora</button>
        <button class="btn btn-dark" id="pdAddCart" type="button">Adicionar à sacola</button>
        <button class="fav-btn pd-fav-inline" type="button" data-fav="${escapeHTML(p.name)}" aria-label="Favoritar ${escapeHTML(p.name)}"><svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.7-10-9.2C.4 8 2 4 6 4c2.2 0 3.8 1.3 6 4 2.2-2.7 3.8-4 6-4 4 0 5.6 4 4 7.8C19.5 16.3 12 21 12 21z"/></svg></button>
      </div>
      <div class="pd-coupon">
        <p>Tenho um cupom</p>
        <div class="pd-coupon-row"><input id="pdCouponInput" placeholder="Ex: DONNA10" maxlength="20"><button id="pdCouponBtn" type="button">Aplicar</button></div>
        <div class="pd-coupon-msg" id="pdCouponMsg"></div>
      </div>
    </div>
  </div>`;

  $('#pdAddCart').addEventListener('click',()=>{
    let c=getCart(),it=c.find(x=>x.name===p.name);
    if(it)it.qty++; else c.push({name:p.name,price:p.price,qty:1});
    saveCart(c); toast('Adicionado à sacola.');
  });
  $('#pdBuyNow').addEventListener('click',()=>{
    let c=getCart(),it=c.find(x=>x.name===p.name);
    if(it)it.qty++; else c.push({name:p.name,price:p.price,qty:1});
    saveCart(c); openCart();
  });
  $('#pdCouponBtn').addEventListener('click',()=>{
    const val=$('#pdCouponInput').value; const msg=$('#pdCouponMsg');
    const res=applyCoupon(val,p.price);
    if(res){ msg.className='pd-coupon-msg ok'; msg.textContent=`Cupom válido: -${res.pct}% • novo valor ${money(res.newPrice)}`; }
    else { msg.className='pd-coupon-msg err'; msg.textContent='Cupom inválido ou expirado.'; }
  });

  setupFavorites();
}
function setupPagination(){
  $$('.collection-grid[data-paginate]').forEach(grid=>{
    const perPage=Number(grid.dataset.paginate)||10;
    const cards=$$('.collection-card',grid);
    const pages=Math.ceil(cards.length/perPage);
    const pager=grid.nextElementSibling && grid.nextElementSibling.hasAttribute('data-pager') ? grid.nextElementSibling : null;
    let current=1;
    const render=()=>{
      cards.forEach((c,i)=>c.classList.toggle('pg-active', i>=(current-1)*perPage && i<current*perPage));
      if(!pager) return;
      let btns=`<button type="button" class="pager-arrow" data-pg="prev" ${current===1?'disabled':''}>‹</button>`;
      for(let p=1;p<=pages;p++) btns+=`<button type="button" class="${p===current?'active':''}" data-pg="${p}">${p}</button>`;
      btns+=`<button type="button" class="pager-arrow" data-pg="next" ${current===pages?'disabled':''}>›</button>`;
      pager.innerHTML=btns;
      $$('[data-pg]',pager).forEach(b=>b.addEventListener('click',()=>{
        const v=b.dataset.pg;
        if(v==='prev') current=Math.max(1,current-1);
        else if(v==='next') current=Math.min(pages,current+1);
        else current=Number(v);
        render();
        grid.scrollIntoView({behavior:'smooth',block:'start'});
      }));
    };
    render();
  });
}
function setupBrandIntro(){
  const intro=$('#brandIntro'); const header=$('.site-header');
  if(!intro) return;
  let collapsed=false;
  const check=()=>{
    const should=window.scrollY>60;
    if(should!==collapsed){
      collapsed=should;
      intro.classList.toggle('collapsed',collapsed);
      header?.classList.toggle('docked',collapsed);
    }
  };
  check();
  window.addEventListener('scroll',check,{passive:true});
}
function addSwipe(el,onLeft,onRight){
  let sx=0,sy=0,tracking=false;
  el.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;sy=e.touches[0].clientY;tracking=true;},{passive:true});
  el.addEventListener('touchend',e=>{
    if(!tracking) return; tracking=false;
    const dx=e.changedTouches[0].clientX-sx, dy=e.changedTouches[0].clientY-sy;
    if(Math.abs(dx)>36 && Math.abs(dx)>Math.abs(dy)){ dx<0?onLeft():onRight(); }
  },{passive:true});
}
function setupDbxCarousel(el){
  const groupsWrap=$('.dbx-groups',el); const groups=$$('.dbx-group',el);
  const dotsWrap=$('.dbx-dots',el);
  let i=0;
  groups.forEach((_,x)=>{const d=document.createElement('button');d.type='button';d.className='dbx-dot'+(x===0?' active':'');d.setAttribute('aria-label','Grupo '+(x+1));d.onclick=()=>go(x);dotsWrap?.appendChild(d);});
  const go=x=>{ i=(x+groups.length)%groups.length; groupsWrap.style.transform=`translateX(-${i*100}%)`; $$('.dbx-dot',dotsWrap).forEach((d,k)=>d.classList.toggle('active',k===i)); };
  $('.dbx-nav.prev',el)?.addEventListener('click',()=>go(i-1));
  $('.dbx-nav.next',el)?.addEventListener('click',()=>go(i+1));
  addSwipe(el,()=>go(i+1),()=>go(i-1));
}
function setupRiviera(el){
  const rows=$$('.riviera-row-inner',el);
  let i=0; const step=238; const maxSteps=Math.max(0,(rows[0]?$$('.riviera-card',rows[0]).length:0)-3);
  const go=x=>{ i=Math.max(0,Math.min(maxSteps,x)); rows.forEach((r,ri)=>{ r.style.transform=`translateX(-${i*step+(ri%2?26:0)}px)`; }); };
  $('.dbx-nav.prev',el)?.addEventListener('click',()=>go(i-1));
  $('.dbx-nav.next',el)?.addEventListener('click',()=>go(i+1));
  addSwipe(el,()=>go(i+1),()=>go(i-1));
  go(0);
}
function setupShowcases(){
  $$('.dbx-section .dbx-carousel').forEach(setupDbxCarousel);
  $$('.riviera-section .dbx-carousel').forEach(setupRiviera);
}
function pickRouletteCoupon(){ return DB.coupons[Math.floor(Math.random()*DB.coupons.length)]; }
function getGameState(){
  let s; try{s=JSON.parse(localStorage.getItem('db_game')||'null')}catch{s=null}
  if(!s) s={nextAvailable:0,spinsLeft:2};
  if(Date.now()>=s.nextAvailable){ s={nextAvailable:0,spinsLeft:2}; localStorage.setItem('db_game',JSON.stringify(s)); }
  return s;
}
function saveGameState(s){ localStorage.setItem('db_game',JSON.stringify(s)); }
function fmtRemaining(ms){
  const s=Math.max(0,Math.floor(ms/1000)); const h=Math.floor(s/3600),m=Math.floor((s%3600)/60);
  return `${h}h ${m}min`;
}
function shareCurrentPage(){
  const title='DonnaBella';
  const onProduct=/\/?produto(-[\w-]+)?\.html$/.test(location.pathname);
  const text=onProduct?'Olha essa peça da DonnaBella que encontrei — achei linda!':'Descobri a DonnaBella — joias e acessórios elegantes. Dá uma olhada!';
  return {title,text,url:location.href};
}
async function doShare(btnEl){
  const data=shareCurrentPage();
  try{
    if(navigator.share){ await navigator.share(data); }
    else { await navigator.clipboard.writeText(data.url); toast('Link copiado com sucesso.'); }
  }catch(e){ /* cliente cancelou o compartilhamento — nenhuma ação necessária */ }
}
function setupMinigame(){
  const btn=$('#mgSpinBtn'); if(!btn) return;
  const wheel=$('#mgWheel'), shelf=$('#mgShelf'), hand=$('#mgHand'), ticket=$('#mgTicket'), msg=$('#mgMessage');
  const codeEl=$('#mgCouponCode'), textEl=$('#mgMsgText');
  const statusEl=$('#mgStatus'), shareBtn=$('#mgShareBtn'), shareMsgEl=$('#mgShareMsg');
  let rotation=0, spinning=false;

  function renderStatus(){
    const s=getGameState();
    if(s.spinsLeft>0){
      statusEl.textContent=`Giros disponíveis hoje: ${s.spinsLeft} de 2`;
      btn.disabled=false;
    } else {
      statusEl.textContent=`Você já usou seus giros de hoje. Próximo giro em ${fmtRemaining(s.nextAvailable-Date.now())}.`;
      btn.disabled=true;
    }
    if(shareMsgEl) shareMsgEl.textContent='Compartilhe a DonnaBella com uma amiga.';
  }
  renderStatus();
  setInterval(renderStatus,30000);

  shareBtn?.addEventListener('click',()=>doShare(shareBtn));

  function resetScene(){
    $$('.mg-bag',shelf).forEach(b=>b.classList.remove('active'));
    hand.classList.remove('show'); hand.classList.add('retreat');
    ticket.classList.remove('show');
    msg.classList.remove('show');
  }

  btn.addEventListener('click',()=>{
    if(spinning) return;
    const s=getGameState(); if(s.spinsLeft<=0) return;
    spinning=true; btn.disabled=true; resetScene();
    const n=1+Math.floor(Math.random()*10);
    const segAngle=36, target=(n-1)*segAngle+segAngle/2;
    const spins=6*360;
    const currentMod=((rotation%360)+360)%360;
    let delta=(spins - ((currentMod+target)%360));
    if(delta<=0) delta+=360;
    rotation+=delta;
    wheel.style.transform=`rotate(${rotation}deg)`;

    const onWheelDone=()=>{
      wheel.removeEventListener('transitionend',onWheelDone);
      const bag=$(`.mg-bag[data-bag="${n}"]`,shelf);
      bag?.classList.add('active');
      setTimeout(()=>{
        hand.classList.remove('retreat'); hand.classList.add('show');
        ticket.classList.add('show');
        setTimeout(()=>{
          hand.classList.remove('show'); hand.classList.add('retreat');
          const prize=pickRouletteCoupon();
          const alreadyUsed=prize.usage==='once'&&isCouponUsed(prize.code);
          codeEl.textContent=prize.code;
          textEl.textContent=alreadyUsed
            ? `A sacola número ${n} trouxe o cupom ${prize.code} — mas ele já foi usado neste navegador.`
            : `Parabéns! A sacola número ${n} trouxe um cupom surpresa.`;
          msg.dataset.code=prize.code;
          msg.querySelector('#mgMsgSub')&&(msg.querySelector('#mgMsgSub').textContent=`${prize.percent}% OFF · obrigada por jogar com a gente ✦`);
          msg.classList.add('show');
          const st=getGameState(); st.spinsLeft=Math.max(0,st.spinsLeft-1);
          if(st.spinsLeft<=0) st.nextAvailable=Date.now()+24*3600*1000;
          saveGameState(st); renderStatus();
          spinning=false;
        },850);
      },1150);
    };
    wheel.addEventListener('transitionend',onWheelDone);
  });

  $('#mgUseCoupon')?.addEventListener('click',()=>{
    const code=msg.dataset.code||'';
    window.location.href='todos-produtos.html'+(code?('?cupom='+encodeURIComponent(code)):'');
  });
  $('#mgSaveCoupon')?.addEventListener('click',()=>{
    const code=msg.dataset.code; if(!code) return;
    let saved=[];try{saved=JSON.parse(localStorage.getItem('db_saved_coupons')||'[]')}catch{}
    if(!saved.includes(code)){ saved.push(code); localStorage.setItem('db_saved_coupons',JSON.stringify(saved)); }
    toast('Cupom guardado! Aplique-o na sua sacola quando quiser.');
  });
}
function setupGlobal(){
 $$('[data-drawer-open]').forEach(b=>b.onclick=openDrawer);$$('[data-drawer-close]').forEach(b=>b.onclick=closeDrawer);$('#drawerOverlay')?.addEventListener('click',closeDrawer);
 $$('[data-orders-open]').forEach(b=>b.addEventListener('click',openOrders));$$('[data-coupons-open]').forEach(b=>b.addEventListener('click',openCoupons));
 $('#modal')?.addEventListener('click',e=>{if(e.target.id==='modal'||e.target.closest('[data-modal-close]'))closeModal();});
 $$('img').forEach(img=>img.addEventListener('error',()=>img.classList.add('img-missing')));
 updateCart();
}
document.addEventListener('DOMContentLoaded',()=>{setupGlobal();setupHero();setupCountdown();setupSearch();setupCartAndProducts();setupFavorites();setupReviews();setupNewsletter();setupTrend();setupLiveChat();setupProductPage();setupPagination();setupBrandIntro();setupShowcases();setupMinigame();});
window.DB_SOCIAL_LINKS=DB.socials;
