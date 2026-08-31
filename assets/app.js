const DB={
 coupons:[['DONNA10',10],['BELLA10',10],['LUXO15',15],['PODER15',15],['EXCLUSIVA20',20],['BELLA20',20],['VIP25',25],['DONNA25',25],['OURO30',30],['DB60',60]],
 socials:{instagram:'',tiktok:'',facebook:''}
};
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
function money(v){return Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}
function modal(html){$('#modalContent').innerHTML=html;$('#modal').classList.add('open');document.body.classList.add('modal-open');}
function closeModal(){$('#modal')?.classList.remove('open');document.body.classList.remove('modal-open');}

document.addEventListener('DOMContentLoaded',()=>{
 // drawer
 const drawer=$('#drawer'), overlay=$('#drawerOverlay'); const openDrawer=()=>{drawer?.classList.add('open');overlay?.classList.add('open');}; const closeDrawer=()=>{drawer?.classList.remove('open');overlay?.classList.remove('open');};
 $$('[data-drawer-open]').forEach(b=>b.onclick=openDrawer); $$('[data-drawer-close]').forEach(b=>b.onclick=closeDrawer); overlay?.addEventListener('click',closeDrawer);
 // hero
 const track=$('#heroTrack'); if(track){let i=0,n=track.children.length,dots=$('#heroDots'); for(let x=0;x<n;x++){let b=document.createElement('button');b.className=x?'hero-dot':'hero-dot active';b.onclick=()=>go(x);dots.appendChild(b);} const go=x=>{i=(x+n)%n;track.style.transform=`translateX(-${i*100}%)`;$$('.hero-dot').forEach((d,k)=>d.classList.toggle('active',k===i));}; $('#heroPrev')?.addEventListener('click',()=>go(i-1));$('#heroNext')?.addEventListener('click',()=>go(i+1)); setInterval(()=>go(i+1),7000); const v=$('.hero-video'); v?.play().catch(()=>{}); }
 // fixed countdown
 $$('[data-deadline]').forEach(el=>{const end=new Date(el.dataset.deadline).getTime();const tick=()=>{let t=Math.max(0,end-Date.now());let s=Math.floor(t/1000);let d=Math.floor(s/86400);s%=86400;let h=Math.floor(s/3600);s%=3600;let m=Math.floor(s/60);s%=60; $('[data-d]',el).textContent=String(d).padStart(2,'0');$('[data-h]',el).textContent=String(h).padStart(2,'0');$('[data-m]',el).textContent=String(m).padStart(2,'0');$('[data-s]',el).textContent=String(s).padStart(2,'0');};tick();setInterval(tick,1000);});
 // search
 const sp=$('#searchPanel'), si=$('#searchInput'); $('#searchToggle')?.addEventListener('click',()=>sp.classList.toggle('open')); si?.addEventListener('input',()=>{let q=si.value.toLowerCase().trim();let items=['Brincos','Laços','Óculos','Joias & acessórios','Cupons','Pedidos','Atendimento'];$('#searchResults').innerHTML=(q?items.filter(x=>x.toLowerCase().includes(q)):items).map(x=>`<a href="${x==='Brincos'?'categoria-brincos.html':x==='Laços'?'lacos.html':x==='Óculos'?'categoria-oculos.html':x==='Cupons'?'#cupons':x==='Pedidos'?'pedidos.html':'#colecoes'}">${x}</a>`).join('')||'<p>Nenhum resultado.</p>';});
 // cart
 function getCart(){return JSON.parse(localStorage.getItem('db_cart')||'[]');} function saveCart(c){localStorage.setItem('db_cart',JSON.stringify(c));updateCart();}
 function updateCart(){let c=getCart(),n=c.reduce((a,x)=>a+x.qty,0);$$('#cartCount').forEach(x=>x.textContent=n);}
 $$('[data-add-product]').forEach(b=>b.addEventListener('click',()=>{let c=getCart(),name=b.dataset.name,price=Number(b.dataset.price),it=c.find(x=>x.name===name);if(it)it.qty++;else c.push({name,price,qty:1});saveCart(c);toast('Produto adicionado à sacola.');}));
 $$('[data-cart-open]').forEach(b=>b.addEventListener('click',()=>{let c=getCart();modal(`<p class="eyebrow">Minha sacola</p><h2>Seus itens</h2>${c.length?c.map((x,i)=>`<div class="modal-line"><span>${x.name} × ${x.qty}</span><b>${money(x.price*x.qty)}</b></div>`).join('')+'<div class="modal-total"><span>Total</span><b>'+money(c.reduce((a,x)=>a+x.price*x.qty,0))+'</b></div><button class="btn btn-gold" id="checkoutBtn">Registrar pedido</button>`:'<div class="empty-state"><div class="empty-mark">DB</div><h3>Sua sacola está vazia.</h3><p>Escolha uma peça para começar.</p><a class="btn btn-dark" href="#colecoes">Fazer pedido agora</a></div>')}`); $('#checkoutBtn')?.addEventListener('click',()=>{let c=getCart();if(!c.length)return;let orders=JSON.parse(localStorage.getItem('db_orders')||'[]');orders.unshift({id:'DB-'+Date.now().toString().slice(-6),date:new Date().toLocaleString('pt-BR'),items:c,total:c.reduce((a,x)=>a+x.price*x.qty,0),status:'Recebido'});localStorage.setItem('db_orders',JSON.stringify(orders));localStorage.removeItem('db_cart');updateCart();closeModal();toast('Pedido registrado no histórico deste navegador.');});}));
 // orders
 $$('[data-orders-open]').forEach(b=>b.addEventListener('click',()=>{let o=JSON.parse(localStorage.getItem('db_orders')||'[]');modal(`<p class="eyebrow">Minha conta</p><h2>Pedidos feitos</h2>${o.length?o.map(x=>`<div class="order-card"><b>${x.id}</b><span>${x.date}</span><span>${x.status}</span><strong>${money(x.total)}</strong></div>`).join(''):'<div class="empty-state"><div class="empty-mark">Donna</div><h3>Nenhum pedido encontrado.</h3><p>Quando você fizer um pedido pelo site, ele aparecerá aqui.</p><a class="btn btn-dark" href="#colecoes">Fazer pedido agora</a></div>'}`);closeDrawer();}));
 // coupons
 $$('[data-coupons-open]').forEach(b=>b.addEventListener('click',()=>{modal(`<p class="eyebrow">Benefícios</p><h2>10 cupons até 10/10/2026</h2><p class="muted">Copie o código desejado. A aplicação financeira real depende do checkout conectado à loja.</p><div class="coupon-grid">${DB.coupons.map(([c,d])=>`<button class="coupon-card" data-copy="${c}"><b>${c}</b><span>${d}% OFF</span><small>válido até 10/10/2026</small></button>`).join('')}</div>`);closeDrawer();$$('[data-copy]').forEach(b=>b.onclick=()=>{navigator.clipboard?.writeText(b.dataset.copy);b.classList.add('copied');b.querySelector('small').textContent='Copiado ✓';});}));
 // price tool
 const pi=$('#priceInput'),dp=$('#discountedPrice'),ip=$('#installmentPrice'); const calc=()=>{let v=Number(pi?.value||0),p=v*.4;dp.textContent=money(p);ip.textContent=money(p/12);};pi?.addEventListener('input',calc);calc();
 // newsletter
 $('#newsletterForm')?.addEventListener('submit',e=>{e.preventDefault();localStorage.setItem('db_email',$('#newsletterEmail').value);e.target.querySelector('button').textContent='Cadastrado ✓';toast('Cadastro salvo neste navegador.');});
 // review - safe: collects real customer reviews locally, doesn't fabricate them
 $$('[data-review-open]').forEach(b=>b.onclick=()=>modal(`<p class="eyebrow">Sua experiência</p><h2>Deixe uma avaliação</h2><form id="reviewForm" class="review-form"><input required id="reviewName" placeholder="Seu nome"><select id="reviewStars"><option>5</option><option>4</option><option>3</option><option>2</option><option>1</option></select><textarea required id="reviewText" placeholder="Conte como foi sua experiência"></textarea><button class="btn btn-gold">Enviar avaliação</button></form>`));
 document.addEventListener('submit',e=>{if(e.target.id==='reviewForm'){e.preventDefault();let reviews=JSON.parse(localStorage.getItem('db_reviews')||'[]');reviews.push({name:$('#reviewName').value,stars:Number($('#reviewStars').value),text:$('#reviewText').value});localStorage.setItem('db_reviews',JSON.stringify(reviews));closeModal();toast('Avaliação salva.');}});
 $('#modal')?.addEventListener('click',e=>{if(e.target.id==='modal')closeModal();}); $$('[data-modal-close]').forEach(b=>b.onclick=closeModal); updateCart();
 // trend carousel scroll
 $$('[data-trend]').forEach(b=>b.onclick=()=>$('#trendTrack')?.scrollBy({left:b.dataset.trend==='next'?310:-310,behavior:'smooth'}));
});
function toast(t){let x=document.createElement('div');x.className='toast';x.textContent=t;document.body.appendChild(x);setTimeout(()=>x.remove(),2600);}

// Redes sociais: depois de inserir os URLs oficiais acima, os botões podem usá-los em qualquer página.
window.DB_SOCIAL_LINKS = DB.socials;
