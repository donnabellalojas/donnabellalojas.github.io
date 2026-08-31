// ===================== DonnaBella — shared behavior =====================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold:.12 });
    revealEls.forEach(el=>io.observe(el));
  } else { revealEls.forEach(el=>el.classList.add('in')); }

  /* ---------- hamburger drawer ---------- */
  const drawer = document.getElementById('drawer');
  const overlay = document.getElementById('drawerOverlay');
  const openBtns = document.querySelectorAll('[data-drawer-open]');
  const closeBtns = document.querySelectorAll('[data-drawer-close]');
  const openDrawer = () => { drawer?.classList.add('open'); overlay?.classList.add('open'); document.body.style.overflow='hidden'; };
  const closeDrawer = () => { drawer?.classList.remove('open'); overlay?.classList.remove('open'); document.body.style.overflow=''; };
  openBtns.forEach(b=>b.addEventListener('click', openDrawer));
  closeBtns.forEach(b=>b.addEventListener('click', closeDrawer));
  overlay?.addEventListener('click', closeDrawer);

  /* ---------- search: instant demo search ---------- */
  const DEMO_PRODUCTS = [
    { name:'Argola Sussurro — Brinco Inox', price:'R$ 79,90', url:'categoria-brincos.html' },
    { name:'Gota Alma — Brinco Inox', price:'R$ 69,90', url:'categoria-brincos.html' },
    { name:'Ponto de Luz — Brinco Inox', price:'R$ 59,90', url:'categoria-brincos.html' },
    { name:'Petit Bella — Brinco Inox', price:'R$ 49,90', url:'categoria-brincos.html' },
    { name:'Argola Ouro Rosé', price:'a partir de R$ 19,90', url:'categoria-brincos.html' },
    { name:'Brinco Gota com Pedra', price:'a partir de R$ 19,90', url:'categoria-brincos.html' },
    { name:'Gargantilha Riviera', price:'consultar', url:'index.html#gargantilhas' },
    { name:'Coleção Clássica — Conjunto', price:'consultar', url:'index.html#classica' },
    { name:'Óculos Sunset Bella — Sol de Verão', price:'R$ 69,90', url:'categoria-oculos.html' },
    { name:'Óculos Riviera UV', price:'consultar', url:'categoria-oculos.html' },
    { name:'Laço Florzinha Infantil', price:'consultar', url:'index.html#lacos' },
  ];
  const searchToggle = document.getElementById('searchToggle');
  const searchPanel = document.getElementById('searchPanel');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');

  function renderResults(query){
    if(!searchResults) return;
    searchResults.innerHTML = '';
    const q = query.trim().toLowerCase();
    if(!q){ searchResults.innerHTML = '<div class="search-empty">Digite o nome do produto…</div>'; return; }
    const matches = DEMO_PRODUCTS.filter(p => p.name.toLowerCase().includes(q));
    if(matches.length === 0){ searchResults.innerHTML = '<div class="search-empty">Nada encontrado. Tente outro termo.</div>'; return; }
    matches.forEach(p=>{
      const a = document.createElement('a');
      a.href = p.url;
      a.innerHTML = `<span>${p.name}</span><span class="sr-price">${p.price}</span>`;
      searchResults.appendChild(a);
    });
  }
  searchToggle?.addEventListener('click', (e)=>{
    e.stopPropagation();
    searchPanel.classList.toggle('open');
    if(searchPanel.classList.contains('open')){ renderResults(''); searchInput?.focus(); }
  });
  searchInput?.addEventListener('input', (e)=> renderResults(e.target.value));
  document.addEventListener('click', (e)=>{
    if(searchPanel && !searchPanel.contains(e.target) && e.target !== searchToggle){ searchPanel.classList.remove('open'); }
  });

  /* ---------- category block dropdowns ---------- */
  document.querySelectorAll('.cb-toggle').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      e.preventDefault();
      const block = btn.closest('.cat-block');
      const wasOpen = block.classList.contains('open');
      document.querySelectorAll('.cat-block.open').forEach(b=> b!==block && b.classList.remove('open'));
      block.classList.toggle('open', !wasOpen);
    });
  });

  /* ---------- filter panel toggle (category page) ---------- */
  const filterToggle = document.getElementById('filterToggle');
  const filterPanel = document.getElementById('filterPanel');
  filterToggle?.addEventListener('click', ()=> filterPanel?.classList.toggle('open'));

  const sortToggle = document.getElementById('sortToggle');
  sortToggle?.addEventListener('click', ()=>{
    const grid = document.getElementById('productGrid');
    if(!grid) return;
    const cards = Array.from(grid.children);
    const asc = sortToggle.dataset.dir !== 'asc';
    cards.sort((a,b)=>{
      const pa = parseFloat(a.dataset.price), pb = parseFloat(b.dataset.price);
      return asc ? pa-pb : pb-pa;
    });
    cards.forEach(c=>grid.appendChild(c));
    sortToggle.dataset.dir = asc ? 'asc' : 'desc';
    sortToggle.querySelector('span').textContent = asc ? 'Menor preço' : 'Maior preço';
  });

  /* ---------- hero carousel ---------- */
  const track = document.getElementById('heroTrack');
  if(track){
    const slides = track.children.length;
    let idx = 0;
    const dotsWrap = document.getElementById('heroDots');
    const dots = [];
    for(let i=0;i<slides;i++){
      const d = document.createElement('button');
      d.className = 'hero-dot' + (i===0?' active':'');
      d.setAttribute('aria-label', 'Slide ' + (i+1));
      d.addEventListener('click', ()=> go(i));
      dotsWrap.appendChild(d);
      dots.push(d);
    }
    function go(i){
      idx = (i + slides) % slides;
      track.style.transform = `translateX(-${idx*100}%)`;
      dots.forEach((d,n)=> d.classList.toggle('active', n===idx));
    }
    document.getElementById('heroPrev')?.addEventListener('click', ()=> go(idx-1));
    document.getElementById('heroNext')?.addEventListener('click', ()=> go(idx+1));

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(!reduceMotion){
      let auto = setInterval(()=> go(idx+1), 5500);
      track.closest('.hero').addEventListener('mouseenter', ()=> clearInterval(auto));
      track.closest('.hero').addEventListener('mouseleave', ()=> auto = setInterval(()=> go(idx+1), 5500));
    }
  }

  /* ---------- countdown (moderate, no exaggeration) ---------- */
  function startCountdown(el, hours){
    if(!el) return;
    let remaining = hours*3600;
    const hEl = el.querySelector('[data-h]');
    const mEl = el.querySelector('[data-m]');
    const sEl = el.querySelector('[data-s]');
    function render(){
      const h = Math.floor(remaining/3600), m = Math.floor((remaining%3600)/60), s = remaining%60;
      if(hEl) hEl.textContent = String(h).padStart(2,'0');
      if(mEl) mEl.textContent = String(m).padStart(2,'0');
      if(sEl) sEl.textContent = String(s).padStart(2,'0');
    }
    render();
    setInterval(()=>{ remaining = remaining>0 ? remaining-1 : hours*3600; render(); }, 1000);
  }
  document.querySelectorAll('[data-countdown]').forEach(el=> startCountdown(el, parseFloat(el.dataset.countdown)));

});
