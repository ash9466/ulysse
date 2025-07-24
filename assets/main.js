// Menu burger responsive
const menuToggle = document.createElement('div');
menuToggle.className = 'menu-toggle';
menuToggle.innerHTML = '<span></span><span></span><span></span>';

document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('nav');
  const ul = nav.querySelector('ul');
  nav.appendChild(menuToggle);

  menuToggle.addEventListener('click', () => {
    ul.classList.toggle('open');
    menuToggle.classList.toggle('open');
  });

  // Fermer le menu au clic sur un lien
  ul.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      ul.classList.remove('open');
      menuToggle.classList.remove('open');
    });
  });

  // Apparition au scroll
  const appearEls = document.querySelectorAll('.appear');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  appearEls.forEach(el => observer.observe(el));

  // Gestion des popups modales prestations
  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', e => {
      const key = btn.getAttribute('data-modal');
      const modal = document.getElementById('modal-' + key);
      if (modal) {
        modal.style.display = 'flex';
        setTimeout(() => modal.querySelector('.modal').focus(), 10);
      }
    });
  });
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', e => {
      btn.closest('.modal-overlay').style.display = 'none';
    });
  });
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.style.display = 'none';
    });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.style.display = 'none';
      });
    }
  });

  // Effet trainée souris global
  let trail = document.createElement('div');
  trail.className = 'cursor-trail';
  document.body.appendChild(trail);
  document.addEventListener('mousemove', e => {
    trail.style.left = (e.clientX - 11) + 'px';
    trail.style.top = (e.clientY - 11) + 'px';
    trail.style.opacity = 0.6;
  });
  document.addEventListener('mouseleave', () => { trail.style.opacity = 0; });

  // Carrousel d'avis navigation
  const avisCarousel = document.querySelector('.avis-carousel');
  if (avisCarousel) {
    const cards = avisCarousel.querySelectorAll('.avis-card');
    let idx = 0;
    const prevBtn = document.querySelector('.avis-carousel-btn.prev');
    const nextBtn = document.querySelector('.avis-carousel-btn.next');
    function scrollToCard(i) {
      if (!cards[i]) return;
      cards[i].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
    if (prevBtn) prevBtn.addEventListener('click', () => { idx = Math.max(0, idx-1); scrollToCard(idx); });
    if (nextBtn) nextBtn.addEventListener('click', () => { idx = Math.min(cards.length-1, idx+1); scrollToCard(idx); });
    avisCarousel.addEventListener('scroll', () => {
      let minDist = Infinity, minIdx = 0;
      cards.forEach((card, i) => {
        const rect = card.getBoundingClientRect();
        const dist = Math.abs(rect.left + rect.width/2 - window.innerWidth/2);
        if (dist < minDist) { minDist = dist; minIdx = i; }
      });
      idx = minIdx;
    });
  }
}); 