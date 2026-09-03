const DB={
  coupons:[['DONNA10',10],['BELLA10',10],['LUXO15',15],['PODER15',15],['EXCLUSIVA20',20],['BELLA20',20],['VIP25',25],['DONNA25',25],['OURO30',30],['DB60',60]],
  couponDeadline:'10/10/2026',
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
    {id:'brinco-signature-03',name:'Brinco Signature 03',price:99.90,category:'Brincos',img:'assets/img/brinco-3.jpg',desc:'Cadastre o produto, descrição e valor.',material:'',care:''}
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
  modal(`<p class="eyebrow">Benefícios DonnaBella</p><h2>10 cupons disponíveis</h2><p class="muted">Todos os códigos abaixo ficam disponíveis até <b>${DB.couponDeadline}</b>. Toque em um código para copiar.</p><div class="coupon-grid">${DB.coupons.map(([c,d])=>`<button type="button" class="coupon-card" data-copy="${c}"><b>${c}</b><span>${d}% OFF</span><small>válido até ${DB.couponDeadline}</small></button>`).join('')}</div>`);
  closeDrawer();
  $$('[data-copy]').forEach(b=>b.onclick=async()=>{try{await navigator.clipboard.writeText(b.dataset.copy);b.querySelector('small').textContent='Código copiado ✓';}catch{b.querySelector('small').textContent='Código: '+b.dataset.copy;}b.classList.add('copied');});
}
function openCart(){
  let c=getCart(),total=c.reduce((a,x)=>a+x.price*x.qty,0);
  const body=c.length ? c.map(x=>`<div class="modal-line"><span>${escapeHTML(x.name)} × ${x.qty}</span><b>${money(x.price*x.qty)}</b></div>`).join('')+`<div class="modal-total"><span>Total</span><b>${money(total)}</b></div><button class="btn btn-gold" id="checkoutBtn" type="button">Finalizar pedido</button><a class="btn btn-dark" style="margin-top:10px" href="pedidos.html">Ver pedidos feitos</a>` : `<div class="empty-state"><div class="empty-mark">Donna</div><h3>Sua sacola está vazia.</h3><p>Escolha uma peça para começar.</p><a class="btn btn-dark" href="index.html#colecoes">Fazer pedido agora</a></div>`;
  modal(`<p class="eyebrow">Minha sacola</p><h2>Seus itens</h2>${body}`);
  $('#checkoutBtn')?.addEventListener('click',()=>{
    let c=getCart(); if(!c.length)return;
    let orders=[];try{orders=JSON.parse(localStorage.getItem('db_orders')||'[]')}catch{}
    const id='DB-'+Date.now().toString().slice(-6),total=c.reduce((a,x)=>a+x.price*x.qty,0);
    orders.unshift({id,date:new Date().toLocaleString('pt-BR'),items:c,total,status:'Recebido'});localStorage.setItem('db_orders',JSON.stringify(orders));localStorage.removeItem('db_cart');updateCart();closeModal();
    const text=encodeURIComponent(`Olá, DonnaBella! Quero finalizar o pedido ${id}. Total: ${money(total)}.`);
    window.open(DB.whatsapp+'?text='+text,'_blank'); toast('Pedido registrado. Abrimos o WhatsApp para finalizar.');
  });
}
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
function setupGlobal(){
 $$('[data-drawer-open]').forEach(b=>b.onclick=openDrawer);$$('[data-drawer-close]').forEach(b=>b.onclick=closeDrawer);$('#drawerOverlay')?.addEventListener('click',closeDrawer);
 $$('[data-orders-open]').forEach(b=>b.addEventListener('click',openOrders));$$('[data-coupons-open]').forEach(b=>b.addEventListener('click',openCoupons));
 $('#modal')?.addEventListener('click',e=>{if(e.target.id==='modal'||e.target.closest('[data-modal-close]'))closeModal();});
 $$('img').forEach(img=>img.addEventListener('error',()=>img.classList.add('img-missing')));
 updateCart();
}
document.addEventListener('DOMContentLoaded',()=>{setupGlobal();setupHero();setupCountdown();setupSearch();setupCartAndProducts();setupFavorites();setupReviews();setupNewsletter();setupTrend();setupLiveChat();setupProductPage();setupPagination();setupBrandIntro();});
window.DB_SOCIAL_LINKS=DB.socials;
