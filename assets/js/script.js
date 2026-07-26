// ── IMAGE SOURCE (external file) ─────────────────
const profilePhoto = document.querySelector('.photo-frame img');
if (profilePhoto) {
  profilePhoto.src = 'assets/images/Nitesh_jamod_halfbody.webp';
}

// ── CLEAN SAME-PAGE NAVIGATION ─────────────────
function scrollToSectionWithoutHash(hash, smooth = true) {
  const target = document.querySelector(hash);
  if (!target) return;

  target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
  window.history.replaceState(null, '', window.location.pathname + window.location.search);
}

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    const hash = link.getAttribute('href');
    if (!hash || hash === '#') return;

    event.preventDefault();
    scrollToSectionWithoutHash(hash);
  });
});

if (window.location.hash) {
  const initialHash = window.location.hash;
  window.requestAnimationFrame(() => scrollToSectionWithoutHash(initialHash, false));
}

// ── READING PROGRESS ───────────────────────────
(function initReadingProgress(){
  const caseStudyPages = [
    'page-ai-pilot-case-study-final',
    'page-document-templates-case-study',
    'page-meeting-scheduler-case-study',
    'page-unified-inbox-v2'
  ];
  if (!caseStudyPages.some(pageClass => document.body.classList.contains(pageClass))) return;

  let progress = document.querySelector('.reading-progress');
  if (!progress) {
    progress = document.createElement('div');
    progress.className = 'reading-progress';
    progress.setAttribute('aria-hidden', 'true');
    document.body.prepend(progress);
  }

  let bar = progress.querySelector('.reading-progress-bar');
  if (!bar) {
    bar = document.createElement('div');
    bar.className = 'reading-progress-bar';
    progress.appendChild(bar);
  }

  let ticking = false;

  function update(){
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0;
    bar.style.width = pct + '%';
    ticking = false;
  }

  function requestUpdate(){
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  update();
})();

// ── CASE STUDY SIDE NAV ───────────────────────
(function initCaseSideNav(){
  const nav = document.querySelector('.case-side-nav');
  if (!nav) return;

  const links = Array.from(nav.querySelectorAll('a[href^="#"]'));
  const items = links
    .map(link => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) {
        link.hidden = true;
        return null;
      }
      target.style.scrollMarginTop = '120px';
      return { link, target };
    })
    .filter(Boolean);
  if (!items.length) return;

  function updateActive(){
    const current = items.reduce((active, item) => {
      const top = item.target.getBoundingClientRect().top;
      return top <= 150 ? item : active;
    }, items[0]);

    items.forEach(item => item.link.classList.toggle('is-active', item === current));
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  window.addEventListener('resize', updateActive);
  updateActive();
})();

// ── CURSOR ──────────────────────────────────────
let cur = document.getElementById('cur');
if (!cur) {
  cur = document.createElement('div');
  cur.id = 'cur';
  cur.className = 'cur';
  document.body.appendChild(cur);
}
let mx=0,my=0;
const trails = [];
for(let i=0;i<5;i++){
  const t=document.createElement('div');
  t.className='cur-trail';
  document.body.appendChild(t);
  trails.push({el:t,x:0,y:0});
}
document.addEventListener('mousemove',e=>{
  mx=e.clientX; my=e.clientY;
  cur.style.left=mx+'px'; cur.style.top=my+'px';
});
(function trailTick(){
  trails.forEach((t,i)=>{
    const prev = i===0?{x:mx,y:my}:trails[i-1];
    t.x+=(prev.x-t.x)*(0.35-i*0.04);
    t.y+=(prev.y-t.y)*(0.35-i*0.04);
    t.el.style.left=t.x+'px';
    t.el.style.top=t.y+'px';
    t.el.style.opacity=(1-i*.18)*.5+'';
    t.el.style.width=(6-i)+'px';
    t.el.style.height=(6-i)+'px';
  });
  requestAnimationFrame(trailTick);
})();
document.querySelectorAll('a,button,.sc,.sc-wrap,.real-screen,.graphic-wrap,.overview-cell,.challenge-card,.process-step,.persona-card,.ia-pillar,.ds-card,.outcome-card,.feat,.type,.pc,.oc-card,.ev-card,.arch-card,.feat-item,.wm-card,.flow-card,.unified-flow-card,.meeting-flow-card,.case-walkthrough-card,.case-decision-note,.meeting-walkthrough-card,.meeting-decision-note,.document-walkthrough-card,.document-decision-note').forEach(el=>{
  el.addEventListener('mouseenter',()=>cur.classList.add('big'));
  el.addEventListener('mouseleave',()=>cur.classList.remove('big'));
});

// ── PHOTO TILT ──────────────────────────────────
const frame = document.getElementById('photo-frame');
const heroRight = document.querySelector('.hero-right');
if(heroRight && frame){
  heroRight.addEventListener('mousemove',e=>{
    const r = heroRight.getBoundingClientRect();
    const x = ((e.clientX-r.left)/r.width-.5)*14;
    const y = ((e.clientY-r.top)/r.height-.5)*10;
    frame.style.transform = `rotate(${2+x*.3}deg) rotateX(${-y*.4}deg) rotateY(${x*.4}deg)`;
  });
  heroRight.addEventListener('mouseleave',()=>{
    frame.style.transform='rotate(2deg)';
  });
}

// ── SCROLL REVEAL ───────────────────────────────
const io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in'); });
},{threshold:0.08,rootMargin:'0px 0px -30px 0px'});
document.querySelectorAll('.rv,.flow-architecture').forEach(el=>io.observe(el));

// ── ABOUT CAROUSEL ──────────────────────────────
(function initAboutCarousel(){
  const carousel = document.querySelector('.about-carousel');
  if (!carousel) return;

  const dotsWrap = carousel.querySelector('.about-carousel-dots');
  const prev = carousel.querySelector('[data-about-carousel="prev"]');
  const next = carousel.querySelector('[data-about-carousel="next"]');
  const slides = Array.from(carousel.querySelectorAll('.about-carousel-slide'));
  if (!dotsWrap || !prev || !next || slides.length < 2) return;

  let index = 0;
  let timer;

  const dots = slides.map((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'about-carousel-dot';
    dot.setAttribute('aria-label', `Show image ${i + 1}`);
    dot.addEventListener('click', () => show(i));
    dotsWrap.appendChild(dot);
    return dot;
  });

  function show(nextIndex){
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === index));
  }

  function start(){
    timer = window.setInterval(() => show(index + 1), 4500);
  }

  prev.addEventListener('click', () => show(index - 1));
  next.addEventListener('click', () => show(index + 1));
  carousel.addEventListener('mouseenter', () => window.clearInterval(timer));
  carousel.addEventListener('mouseleave', start);

  show(0);
  start();
})();

// ── TICKER CLONE ────────────────────────────────
// already doubled in HTML for seamless loop

// ── SENTENCE CASE: HEADINGS & CTA BUTTONS ───────
(function applySentenceCase(){
  const preserved = new Map([
    ['ai','AI'], ['b2b','B2B'], ['ceo','CEO'], ['crm','CRM'], ['css','CSS'],
    ['figma','Figma'], ['figjam','FigJam'], ['html','HTML'], ['i','I'], ['linkedin','LinkedIn'],
    ['nj','NJ'], ['saas','SaaS'], ['salesmate','Salesmate'], ['skara','Skara'],
    ['sms','SMS'], ['storybook','Storybook'], ['tiktok','TikTok'], ['ui','UI'],
    ['ux','UX'], ['whatsapp','WhatsApp']
  ]);

  function convertElement(element){
    if (element.closest('[data-preserve-case]')) return;

    let sentenceStarted = false;
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      const original = node.nodeValue;
      let lastWordEnd = 0;
      node.nodeValue = original.replace(/[A-Za-z]+/g, (word, offset) => {
        const betweenWords = original.slice(lastWordEnd, offset);
        if (/[.!?]\s*$/.test(betweenWords)) sentenceStarted = false;
        const key = word.toLowerCase();
        const protectedWord = preserved.get(key);
        let result;
        if (protectedWord) {
          result = protectedWord;
        } else if (!sentenceStarted) {
          result = key.charAt(0).toUpperCase() + key.slice(1);
        } else {
          result = key;
        }
        sentenceStarted = true;
        lastWordEnd = offset + word.length;
        return result;
      });
    }
  }

  const selectors = [
    'h1','h2','h3',
    '.proj-title','.sk-title','.proc-title','.exp-role','.edu-deg',
    '.contact-heading','.contact-big','.section-title','.hero-title',
    '.persona-name','.ia-pillar-title','.solution-title','.arch-title',
    '.dec-title','.type-title',
    'button','.btn-primary','.btn-secondary','.nav-resume','.case-nav-resume',
    '.case-footer-resume','.footer-next','.fn'
  ].join(',');

  document.querySelectorAll(selectors).forEach(convertElement);
})();
