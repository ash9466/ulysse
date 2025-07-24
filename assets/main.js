// Menu mobile Tailwind
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      // Toggle menu visibility
      mobileMenu.classList.toggle('translate-x-full');
      mobileMenu.classList.toggle('translate-x-0');
      
      // Animate burger menu
      const spans = mobileMenuBtn.querySelectorAll('span');
      mobileMenuBtn.classList.toggle('open');
      
      if (mobileMenuBtn.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
      } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      }
    });
    
    // Fermer le menu au clic sur un lien
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('translate-x-full');
        mobileMenu.classList.remove('translate-x-0');
        mobileMenuBtn.classList.remove('open');
        
        const spans = mobileMenuBtn.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
      });
    });
  }

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
  
  // Fonction globale pour ouvrir les modales
  window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = 'flex';
      setTimeout(() => modal.querySelector('.modal').focus(), 10);
    }
  };
  
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

  // Effet trainée souris global - SUPPRIMÉ

  // Gestion du slider de budget
  const budgetSlider = document.getElementById('budget-slider');
  const budgetDisplay = document.getElementById('budget-display');
  
  if (budgetSlider && budgetDisplay) {
    // Mise à jour de la valeur par défaut
    budgetDisplay.textContent = '1 000€';
    
    budgetSlider.addEventListener('input', function() {
      const value = parseInt(this.value);
      budgetDisplay.textContent = value.toLocaleString('fr-FR') + '€';
    });
  }

  // Navigation entre devis et contact dans la même section
  function switchMode(mode) {
    const modeDevis = document.getElementById('mode-devis');
    const modeContact = document.getElementById('mode-contact');
    const btnDevis = document.getElementById('btn-devis');
    const btnContact = document.getElementById('btn-contact');
    
    if (mode === 'devis') {
      // Afficher le mode devis
      modeDevis.classList.remove('hidden');
      modeContact.classList.add('hidden');
      
      // Changer l'apparence des boutons
      btnDevis.classList.add('bg-accent', 'text-black');
      btnDevis.classList.remove('text-white', 'hover:bg-white/20');
      btnContact.classList.remove('bg-accent', 'text-black');
      btnContact.classList.add('text-white', 'hover:bg-white/20');
    } else if (mode === 'contact') {
      // Afficher le mode contact
      modeDevis.classList.add('hidden');
      modeContact.classList.remove('hidden');
      
      // Changer l'apparence des boutons
      btnContact.classList.add('bg-accent', 'text-black');
      btnContact.classList.remove('text-white', 'hover:bg-white/20');
      btnDevis.classList.remove('bg-accent', 'text-black');
      btnDevis.classList.add('text-white', 'hover:bg-white/20');
    }
  }

  // Navigation entre devis et contact
  function scrollToSection(sectionId) {
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  // Rendre les fonctions globales
  window.switchMode = switchMode;
  window.scrollToSection = scrollToSection;

  // Carrousel d'avis
  const avisCarousel = document.getElementById('avis-carousel');
  const avisIndicators = document.querySelectorAll('.avis-indicator');
  let currentSlide = 0;
  let slideInterval;

  function showSlide(index) {
    if (!avisCarousel) return;
    
    const visibleSlides = getVisibleSlides();
    const totalSlides = 4;
    const maxIndex = Math.max(0, totalSlides - visibleSlides);
    
    // S'assurer que l'index est dans les limites
    if (index > maxIndex) index = 0;
    if (index < 0) index = maxIndex;
    
    // Calculer le déplacement en pourcentage
    const slideWidth = 100 / visibleSlides;
    avisCarousel.style.transform = `translateX(-${index * slideWidth}%)`;
    
    // Mettre à jour les indicateurs
    avisIndicators.forEach((indicator, i) => {
      if (i === index) {
        indicator.classList.remove('bg-gray-300');
        indicator.classList.add('bg-accent');
      } else {
        indicator.classList.remove('bg-accent');
        indicator.classList.add('bg-gray-300');
      }
    });
    
    currentSlide = index;
  }

  function getVisibleSlides() {
    if (window.innerWidth >= 1024) return 3; // lg
    if (window.innerWidth >= 768) return 2;  // md
    return 1; // sm
  }

  function nextSlide() {
    const visibleSlides = getVisibleSlides();
    const maxIndex = Math.max(0, 4 - visibleSlides);
    currentSlide = (currentSlide + 1) > maxIndex ? 0 : currentSlide + 1;
    showSlide(currentSlide);
  }

  function startAutoSlide() {
    slideInterval = setInterval(nextSlide, 4000); // Change toutes les 4 secondes
  }

  function stopAutoSlide() {
    if (slideInterval) {
      clearInterval(slideInterval);
    }
  }

  // Initialiser le carrousel
  if (avisCarousel) {
    // Gérer les clics sur les indicateurs
    avisIndicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        stopAutoSlide();
        showSlide(index);
        startAutoSlide();
      });
    });

    // Pause au survol
    avisCarousel.addEventListener('mouseenter', stopAutoSlide);
    avisCarousel.addEventListener('mouseleave', startAutoSlide);

    // Redimensionnement de la fenêtre
    window.addEventListener('resize', () => {
      showSlide(currentSlide);
    });

    // Démarrer l'auto-slide
    startAutoSlide();
  }
}); 