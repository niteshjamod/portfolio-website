// ── IMAGE SOURCE (external file) ─────────────────
const profilePhoto = document.querySelector('.photo-frame img');
if (profilePhoto) {
  profilePhoto.src = 'assets/images/Nitesh_jamod_halfbody.png';
}

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
document.querySelectorAll('a,button,.sc,.sc-wrap,.real-screen,.graphic-wrap,.overview-cell,.challenge-card,.process-step,.persona-card,.ia-pillar,.ds-card,.outcome-card,.feat,.type,.pc,.oc-card,.ev-card,.arch-card,.feat-item,.wm-card,.flow-card').forEach(el=>{
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
