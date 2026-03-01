/* oberstufe.site v3.5 – main.js */

// Scroll progress
(function(){
  const bar = document.getElementById('scrollProgress');
  if(!bar) return;
  window.addEventListener('scroll', ()=>{
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (window.scrollY / total * 100) + '%';
  }, {passive:true});
})();

// Mobile nav
(function(){
  const btn = document.getElementById('burgerBtn');
  const nav = document.getElementById('mobileNav');
  if(!btn || !nav) return;
  btn.addEventListener('click', ()=>{
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') nav.classList.remove('open'); });
})();

// Back to top
(function(){
  const btn = document.getElementById('toTop');
  if(!btn) return;
  window.addEventListener('scroll', ()=>{
    btn.classList.toggle('show', window.scrollY > 200);
  }, {passive:true});
  btn.addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'}));
})();

// FAQ accordion
document.querySelectorAll('.faq-q').forEach(q=>{
  q.addEventListener('click', ()=>{
    const item = q.parentElement;
    const open = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(i=>i.classList.remove('open'));
    if(!open) item.classList.add('open');
  });
});

// IntersectionObserver for cards
window.attachCardObserver = function(){
  const cards = document.querySelectorAll('.card');
  if(!cards.length) return;
  const io = new IntersectionObserver(entries=>{
    entries.forEach((entry, i)=>{
      if(entry.isIntersecting){
        entry.target.style.animationDelay = (i * 0.05) + 's';
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, {threshold:0.1});
  cards.forEach(c=>io.observe(c));
};

// Search
(function(){
  const input = document.getElementById('searchInput');
  if(!input) return;
  function norm(t){ return (t||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,''); }
  let timer;
  input.addEventListener('input', ()=>{
    clearTimeout(timer);
    timer = setTimeout(()=>{
      const q = norm(input.value);
      document.querySelectorAll('.card').forEach(c=>{
        c.style.display = norm(c.textContent).includes(q) ? '' : 'none';
      });
    }, 200);
  });
  document.addEventListener('keydown', e=>{
    if((e.metaKey||e.ctrlKey) && e.key==='k'){ e.preventDefault(); input.focus(); }
  });
})();

// Sort
(function(){
  const sel = document.getElementById('sortSelect');
  const grid = document.getElementById('cardGrid') || document.getElementById('pageGrid');
  if(!sel || !grid) return;
  sel.addEventListener('change', ()=>{
    const cards = Array.from(grid.querySelectorAll('.card'));
    if(sel.value === 'az'){
      cards.sort((a,b)=> a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent));
    } else if(sel.value === 'neu'){
      cards.sort((a,b)=> (b.dataset.created||'').localeCompare(a.dataset.created||''));
    }
    cards.forEach(c=>grid.appendChild(c));
  });
})();

// Card loader from cards.json
(function(){
  const grid = document.getElementById('cardGrid') || document.getElementById('pageGrid');
  const page = document.body.dataset.page;
  if(!grid || !page) return;

  function tagLabel(tag){ return tag==='sowi'?'SoWi': tag?tag.charAt(0).toUpperCase()+tag.slice(1):''; }
  function statusLabel(s){ return {fertig:'Fertig',in_arbeit:'In Arbeit',test:'Test',coming_soon:'Coming Soon'}[s]||s; }
  function bgLabel(tag){ const m={philosophie:'Ph',geschichte:'Ge',kunst:'Ku',physik:'Ph',chemie:'Ch',mathe:'Ma',erdkunde:'Ek',deutsch:'De',informatik:'It',sport:'Sp',sowi:'So'}; return m[tag]||''; }

  function cardHTML(c){
    const tag=(c.tag||'').toLowerCase();
    const authors = Array.isArray(c.authors)?c.authors.join(', '):(c.authors||'');
    const created = c.created_at||'';
    const isNew = created && (Date.now()-new Date(created).getTime()<1000*60*60*24*14);
    return `<div class="card card--${tag}" data-created="${created}">
      <div class="card-bar"></div>
      <div class="card-bg-label">${bgLabel(tag)}</div>
      ${isNew?'<div class="card-new-badge">Neu</div>':''}
      <div class="card-inner">
        <div class="card-meta">
          ${tag?`<span class="pill tag-${tag}">${tagLabel(tag)}</span>`:''}
          <span class="status status-${c.status}">${statusLabel(c.status)}</span>
        </div>
        <h3>${c.title||''}</h3>
        ${c.subtitle?`<p>${c.subtitle}</p>`:''}
        ${authors?`<p class="card-authors">${authors}</p>`:''}
      </div>
      <div class="card-foot">
        <a href="${c.url||'#'}" target="_blank" rel="noopener" class="btn-open">
          Öffnen
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </div>
    </div>`;
  }

  async function load(){
    try{
      const r = await fetch('/data/cards.json',{cache:'no-cache'});
      const d = await r.json();
      const cards = (d.cards||[]).filter(c=>c.is_published!==false && (c.page||'home')===page);
      grid.innerHTML = cards.length ? cards.map(cardHTML).join('') : '<p style="color:var(--muted);padding:20px 0">Keine Projekte vorhanden.</p>';
      if(window.attachCardObserver) window.attachCardObserver();
    }catch(e){
      console.error('Fehler beim Laden:', e);
    }
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', load);
  else load();
})();
