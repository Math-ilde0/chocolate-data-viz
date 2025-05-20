export function setupChocolateProgressBar() {
    const scrollContainer = document.querySelector('.scroll-pages-container');
    const drop = document.getElementById('choco-drop');
  
    if (!scrollContainer || !drop) return;
  
    scrollContainer.addEventListener('scroll', () => {
      const scrollTop = scrollContainer.scrollTop;
      const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
      const scrollPercent = scrollTop / scrollHeight;
  
      drop.style.transform = `translateY(${scrollPercent * 100}vh)`;
    });
  }

  // Globe transition
// Nouvelle transition Flip entre le globe et le graphique
export function setupGlobeToChartTransition() {
  // Éléments concernés par la transition
  const section3 = document.querySelector('#section-3');
  const section4 = document.querySelector('#section-4');
  
  if (!section3 || !section4) return;
  
  // Observer pour déclencher la transition
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Lorsque section4 commence à entrer dans la vue
      if (entry.target === section4 && entry.isIntersecting) {
        // Animation de flip pour le globe (section3)
        const globe = document.querySelector('#viz-3');
        if (globe) {
          globe.style.transition = 'transform 1.2s cubic-bezier(.645,.045,.355,1)';
          globe.style.transformOrigin = 'center center';
          globe.style.transform = 'perspective(1500px) rotateX(90deg)';
          globe.style.opacity = '0';
        }
        
        // Animation de flip pour le graphique (section4)
        const chart = document.querySelector('#viz-4');
        if (chart) {
          // Appliquer l'animation de flip
          chart.style.transition = 'transform 1.2s cubic-bezier(.645,.045,.355,1), opacity 1.2s ease';
          chart.style.transformOrigin = 'center center';
          chart.style.opacity = '1';
          
          // Ajouter un délai pour commencer après la disparition du globe
          setTimeout(() => {
            chart.style.transform = 'perspective(1500px) rotateX(0deg)';
            chart.style.opacity = '1';
          }, 400);
        }
      }
      
      // Lorsqu'on remonte vers section3
      if (entry.target === section3 && entry.isIntersecting && window.scrollY < section4.offsetTop) {
        // Réinitialiser le globe
        const globe = document.querySelector('#viz-3');
        if (globe) {
          globe.style.transition = 'transform 1.2s cubic-bezier(.645,.045,.355,1), opacity 1s ease';
          globe.style.transform = 'perspective(1500px) rotateX(0deg)';
          globe.style.opacity = '1';
        }
        
        // Réinitialiser le graphique
        const chart = document.querySelector('#viz-4');
        if (chart) {
          chart.style.transition = 'transform 1.2s cubic-bezier(.645,.045,.355,1), opacity 1s ease';
          chart.style.transform = 'perspective(1500px) rotateX(90deg)';
          chart.style.opacity = '0';
        }
      }
    });
  }, { threshold: 0.3 });
  
  observer.observe(section3);
  observer.observe(section4);
  
  // Préparation initiale du graphique pour l'animation
  const targetChart = document.querySelector('#viz-4');
  if (targetChart) {
    targetChart.style.transform = 'perspective(1500px) rotateX(90deg)';
    targetChart.style.opacity = '0';
    targetChart.style.transformOrigin = 'center center';
    targetChart.style.transition = 'transform 1.2s cubic-bezier(.645,.045,.355,1), opacity 1.2s ease';
  }
  
  // Ajouter les styles CSS nécessaires
  const style = document.createElement('style');
  style.textContent = `
    #viz-3, #viz-4 {
      backface-visibility: hidden;
      transform-style: preserve-3d;
    }
  `;
  document.head.appendChild(style);
}

// Ajout de l'animation entre la visualisation des genres et les musées du chocolat
export function setupGenreToMuseeTransition() {
  // Éléments concernés par la transition
  const section7 = document.querySelector('#section-7');
  const section8 = document.querySelector('#section-8');
  
  if (!section7 || !section8) return;

  // Variable pour suivre l'état de la transition
  let isTransitioning = false;
  
  // Créer le conteneur de transition pour l'effet blink
  const transitionContainer = document.createElement('div');
  transitionContainer.className = 'blink-transition';
  document.body.appendChild(transitionContainer);
  
  // Préparer les musées pour l'animation
  const musees = document.querySelectorAll('#viz-8 .musee');
  musees.forEach(musee => {
    musee.style.transform = 'scale(0.5) translateY(50px)';
    musee.style.opacity = '0';
    musee.style.transition = 'transform 0.8s ease, opacity 0.8s ease';
  });
  
  // Observer pour déclencher la transition
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Si on entre dans section 8 et qu'on n'est pas déjà en transition
      if (entry.target === section8 && entry.isIntersecting && !isTransitioning) {
        triggerBlinkTransition();
      }
    });
  }, { threshold: 0.1 });
  
  observer.observe(section8);
  
  // Observer pour réinitialiser l'animation quand on remonte
  const resetObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Si on remonte vers section7
      if (entry.target === section7 && entry.isIntersecting && window.scrollY < section8.offsetTop) {
        // Réinitialiser l'animation pour permettre de la rejouer
        musees.forEach(musee => {
          musee.style.transform = 'scale(0.5) translateY(50px)';
          musee.style.opacity = '0';
        });
      }
    });
  }, { threshold: 0.5 });
  
  resetObserver.observe(section7);
  
  // Fonction pour déclencher la transition blink
  function triggerBlinkTransition() {
    if (isTransitioning) return;
    isTransitioning = true;
    
    // 1. Empêcher temporairement le défilement
    document.body.style.overflow = 'hidden';
    
    // 2. Activer l'effet de transition blink
    transitionContainer.classList.add('active');
    
    // 3. Au milieu de l'animation (quand l'écran est le plus sombre), passer à la section suivante
    setTimeout(() => {
      // Défiler programmatiquement vers la section 8 - sans animation pour éviter le "saut"
      section8.scrollIntoView({ behavior: 'auto' });
      
      // 4. Animer l'entrée des musées de façon séquentielle
      musees.forEach((musee, index) => {
        setTimeout(() => {
          musee.style.transform = 'scale(1) translateY(0)';
          musee.style.opacity = '1';
        }, 100 + index * 200); // Délai progressif pour chaque musée
      });
      
      // 5. Finir l'animation et réactiver le défilement
      setTimeout(() => {
        document.body.style.overflow = '';
        transitionContainer.classList.remove('active');
        isTransitioning = false;
      }, 1000);
    }, 600); // Milliseconde 600 = milieu de l'animation blink d'une durée de 1.2s
  }
}

// intro button 
export function setupIntroClickNavigation() {
  const startButton = document.getElementById('start-exploration');
  const scrollContainer = document.querySelector('.scroll-pages-container');
  
  // Prevent scrolling initially
  scrollContainer.style.overflowY = 'hidden';
  
  // Add click handler
  startButton.addEventListener('click', () => {
    // Enable scrolling
    scrollContainer.style.overflowY = 'scroll';
    
    // Scroll to the next section
    document.getElementById('viz-1').scrollIntoView({ 
      behavior: 'smooth' 
    });
    
    // Add pointer cursor to indicate it's clickable
    startButton.style.cursor = 'pointer';
  });
}


//Back button 
export function setupBackToTopButton() {
  const backToTopButton = document.getElementById('back-to-top');
  const scrollContainer = document.querySelector('.scroll-pages-container');
  
  if (!backToTopButton || !scrollContainer) {
    console.error("Back to top button or scroll container not found");
    return;
  }
  
  console.log("Back to top button setup started");
  
  // Show button when near bottom of page
  scrollContainer.addEventListener('scroll', () => {
    const scrollHeight = scrollContainer.scrollHeight;
    const scrollTop = scrollContainer.scrollTop;
    const clientHeight = scrollContainer.clientHeight;
    
    // Show button when user has scrolled 80% of the way down
    if (scrollTop + clientHeight > scrollHeight * 0.8) {
      backToTopButton.classList.add('visible');
      console.log("Button should be visible now");
    } else {
      backToTopButton.classList.remove('visible');
    }
  });
  
  // Rafraîchir la page et revenir au début quand le bouton est cliqué
  backToTopButton.addEventListener('click', () => {
    // Utiliser cette méthode pour s'assurer que la page revienne au début après le rechargement
    window.location.href = window.location.pathname;
    
    // Alternative: forcer un rechargement complet de la page (sans utiliser le cache)
    // window.location.reload(true);
  });
  
  console.log("Back to top button setup completed");
}