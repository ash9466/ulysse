// Typewriter Effect
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.innerHTML = '';
  
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Menu mobile Tailwind
document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  
  function openMobileMenu() {
    console.log('Ouverture du menu mobile');
    
    // Afficher l'overlay et le menu
    mobileMenuOverlay.classList.remove('hidden');
    mobileMenuOverlay.style.display = 'block';
    
    // S'assurer que le menu est visible et opaque
    mobileMenu.style.display = 'block';
    mobileMenu.style.background = 'white';
    mobileMenu.style.opacity = '1';
    mobileMenu.style.visibility = 'visible';
    mobileMenu.classList.add('menu-open');
    
    // Animer l'ouverture
    setTimeout(() => {
      mobileMenu.classList.remove('translate-x-full');
      mobileMenu.classList.add('translate-x-0');
    }, 10);
    
    // Empêcher le zoom et le scroll sans remonter en haut
    const scrollY = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = `-${scrollY}px`;
    
    // Animate burger menu
    const spans = mobileMenuBtn.querySelectorAll('span');
    mobileMenuBtn.classList.add('open');
    spans[0].style.transform = 'rotate(45deg) translate(6px, 6px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(6px, -6px)';
    
    console.log('Menu mobile ouvert');
  }
  
  function closeMobileMenu() {
    console.log('Fermeture du menu mobile');
    
    // Animer la fermeture
    mobileMenu.classList.add('translate-x-full');
    mobileMenu.classList.remove('translate-x-0');
    mobileMenuOverlay.classList.add('hidden');
    
    // Cacher le menu après l'animation
    setTimeout(() => {
      mobileMenu.style.display = 'none';
      mobileMenuOverlay.style.display = 'none';
      mobileMenu.classList.remove('menu-open');
    }, 300);
    
    // Restaurer le scroll et la position
    const scrollY = document.body.style.top;
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
    
    // Reset burger menu
    const spans = mobileMenuBtn.querySelectorAll('span');
    mobileMenuBtn.classList.remove('open');
    spans[0].style.transform = 'none';
    spans[1].style.opacity = '1';
    spans[2].style.transform = 'none';
    
    console.log('Menu mobile fermé');
  }
  
  if (mobileMenuBtn && mobileMenu) {
    console.log('Menu mobile initialisé');
    
    // Ouvrir le menu
    mobileMenuBtn.addEventListener('click', () => {
      console.log('Bouton hamburger cliqué');
      openMobileMenu();
    });
    
    // Fermer avec le bouton X
    if (mobileMenuClose) {
      mobileMenuClose.addEventListener('click', closeMobileMenu);
    }
    
    // Fermer avec l'overlay
    if (mobileMenuOverlay) {
      mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    }
    
    // Fermer le menu au clic sur un lien
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
    
    // Fermer avec la touche Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !mobileMenu.classList.contains('translate-x-full')) {
        closeMobileMenu();
      }
    });
  }

  // Typewriter Effect pour le slogan
  const typewriterElement = document.getElementById('typewriter-text');
  if (typewriterElement) {
    setTimeout(() => {
      typeWriter(typewriterElement, 'Votre confort, notre engagement', 50);
    }, 200);
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

  // Fonction pour scroll smooth vers la section devis
  function scrollToDevis() {
    // Si on est sur la page d'accueil
    if (window.location.pathname === '/' || window.location.pathname.endsWith('index.html')) {
      const devisSection = document.getElementById('devis');
      if (devisSection) {
        // S'assurer que le mode devis est activé
        switchMode('devis');
        
        // Scroll smooth vers la section
        devisSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
        
        // Focus sur le premier champ du formulaire après le scroll
        setTimeout(() => {
          const firstInput = document.querySelector('#formulaire-devis input[type="text"]');
          if (firstInput) {
            firstInput.focus();
          }
        }, 1000);
      }
    } else {
      // Si on est sur une autre page, rediriger vers la page d'accueil avec l'ancre
      window.location.href = '../index.html#devis';
    }
  }

  // Rendre la fonction globale
  window.scrollToDevis = scrollToDevis;

  // Gérer le scroll vers la section devis si on arrive avec l'ancre #devis
  if (window.location.hash === '#devis') {
    // Attendre que la page soit chargée
    setTimeout(() => {
      const devisSection = document.getElementById('devis');
      if (devisSection) {
        // S'assurer que le mode devis est activé
        switchMode('devis');
        
        // Scroll smooth vers la section
        devisSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
        
        // Focus sur le premier champ du formulaire après le scroll
        setTimeout(() => {
          const firstInput = document.querySelector('#formulaire-devis input[type="text"]');
          if (firstInput) {
            firstInput.focus();
          }
        }, 1000);
      }
    }, 100);
  }

  // Carrousel d'avis interactif
  const avisCarousel = document.getElementById('avis-carousel');
  const avisIndicators = document.querySelectorAll('.avis-indicator');
  const prevBtn = document.getElementById('prev-avis');
  const nextBtn = document.getElementById('next-avis');
  let currentSlide = 0;
  let slideInterval;
  let isAutoPlaying = true;

  function showSlide(index) {
    if (!avisCarousel) return;
    
    const totalSlides = 4;
    
    // S'assurer que l'index est dans les limites
    if (index >= totalSlides) index = 0;
    if (index < 0) index = totalSlides - 1;
    
    // Calculer le déplacement en pourcentage (un avis à la fois)
    const slideWidth = 100;
    avisCarousel.style.transform = `translateX(-${index * slideWidth}%)`;
    
    // Mettre à jour les indicateurs
    avisIndicators.forEach((indicator, i) => {
      if (i === index) {
        indicator.classList.remove('bg-gray-300');
        indicator.classList.add('bg-accent');
        indicator.setAttribute('aria-current', 'true');
      } else {
        indicator.classList.remove('bg-accent');
        indicator.classList.add('bg-gray-300');
        indicator.removeAttribute('aria-current');
      }
    });
    
    currentSlide = index;
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  function startAutoSlide() {
    if (isAutoPlaying) {
      slideInterval = setInterval(nextSlide, 5000); // Change toutes les 5 secondes
    }
  }

  function stopAutoSlide() {
    if (slideInterval) {
      clearInterval(slideInterval);
    }
  }

  function toggleAutoPlay() {
    isAutoPlaying = !isAutoPlaying;
    if (isAutoPlaying) {
      startAutoSlide();
    } else {
      stopAutoSlide();
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

    // Gérer les boutons de navigation
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        stopAutoSlide();
        prevSlide();
        startAutoSlide();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        stopAutoSlide();
        nextSlide();
        startAutoSlide();
      });
    }

    // Gérer les boutons de navigation mobile - SUPPRIMÉ

    // Pause au survol (seulement sur desktop)
    if (window.innerWidth >= 768) {
      avisCarousel.addEventListener('mouseenter', stopAutoSlide);
      avisCarousel.addEventListener('mouseleave', startAutoSlide);
    }

    // Navigation au clavier
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        stopAutoSlide();
        prevSlide();
        startAutoSlide();
      } else if (e.key === 'ArrowRight') {
        stopAutoSlide();
        nextSlide();
        startAutoSlide();
      }
    });

    // Redimensionnement de la fenêtre
    window.addEventListener('resize', () => {
      showSlide(currentSlide);
    });

      // Démarrer l'auto-slide
  startAutoSlide();

  // Ajouter des styles CSS pour améliorer l'accessibilité
  const style = document.createElement('style');
  style.textContent = `
    .avis-indicator:focus {
      outline: 2px solid #f59e0b;
      outline-offset: 2px;
    }
    
    .mobile-nav-btn:focus {
      outline: 2px solid #f59e0b;
      outline-offset: 2px;
    }
    
    #prev-avis:focus,
    #next-avis:focus {
      outline: 2px solid #f59e0b;
      outline-offset: 2px;
    }
    
    .avis-slide {
      scroll-snap-align: start;
    }
    
    #avis-carousel {
      scroll-snap-type: x mandatory;
    }
  `;
  document.head.appendChild(style);
}
}); 