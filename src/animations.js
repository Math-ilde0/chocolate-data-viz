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
  
  // Création du conteneur pour l'animation
  const transitionContainer = document.createElement('div');
  transitionContainer.className = 'genre-musee-transition';
  transitionContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 750;
    overflow: hidden;
    opacity: 0;
  `;
  document.body.appendChild(transitionContainer);
  
  // Observer pour déclencher la transition
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Lorsque section8 commence à entrer dans la vue
      if (entry.target === section8 && entry.isIntersecting) {
        // Rendre le conteneur visible
        transitionContainer.style.opacity = '1';
        
        // Effet "explosion" de chocolat
        createChocolateExplosion();
        
        // Animation d'entrée pour les musées
        const musees = document.querySelectorAll('#viz-8 .musee');
        musees.forEach((musee, index) => {
          musee.style.transition = 'transform 0.8s ease, opacity 0.8s ease';
          musee.style.transform = 'scale(0.5) translateY(50px)';
          musee.style.opacity = '0';
          
          setTimeout(() => {
            musee.style.transform = 'scale(1) translateY(0)';
            musee.style.opacity = '1';
          }, 200 + index * 200);
        });
        
        // Nettoyer après l'animation
        setTimeout(() => {
          transitionContainer.style.opacity = '0';
          setTimeout(() => {
            transitionContainer.innerHTML = '';
          }, 1000);
        }, 3000);
      }
      
      // Lorsqu'on remonte vers section7
      if (entry.target === section7 && entry.isIntersecting && window.scrollY < section8.offsetTop) {
        // Réinitialiser l'animation pour permettre de la rejouer
        const musees = document.querySelectorAll('#viz-8 .musee');
        musees.forEach(musee => {
          musee.style.transform = 'scale(0.5) translateY(50px)';
          musee.style.opacity = '0';
        });
      }
    });
  }, { threshold: 0.25 });
  
  observer.observe(section7);
  observer.observe(section8);
  
  // Préparation initiale des musées pour l'animation
  const musees = document.querySelectorAll('#viz-8 .musee');
  musees.forEach(musee => {
    musee.style.transform = 'scale(0.5) translateY(50px)';
    musee.style.opacity = '0';
    musee.style.transition = 'transform 0.8s ease, opacity 0.8s ease';
  });
  
  // Fonction pour créer l'effet d'explosion de chocolat
  function createChocolateExplosion() {
    // Créer des particules qui partent du centre de l'écran
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    // Créer différentes formes: gouttes, morceaux carrés, pépites
    const shapes = ['drop', 'chunk', 'chip'];
    
    // Générer 40 particules
    for (let i = 0; i < 40; i++) {
      const particle = document.createElement('div');
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      
      // Taille aléatoire avec variation selon la forme
      const size = shape === 'drop' ? 15 + Math.random() * 25 : 
                  shape === 'chunk' ? 10 + Math.random() * 15 : 
                  5 + Math.random() * 10;
      
      // Couleurs de chocolat aléatoires
      const colors = ['#5c3d2e', '#8b5a2b', '#b08968', '#cd853f', '#a0522d', '#4b3621'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      // Angle et distance aléatoires pour la dispersion
      const angle = Math.random() * Math.PI * 2;
      const distance = 50 + Math.random() * 350;
      const endX = centerX + Math.cos(angle) * distance;
      const endY = centerY + Math.sin(angle) * distance;
      
      // Durée d'animation aléatoire
      const duration = 0.8 + Math.random() * 1.2;
      const delay = Math.random() * 0.3;
      
      // Rotation aléatoire
      const rotation = -180 + Math.random() * 360;
      
      // Style selon la forme
      let shapeStyle = '';
      if (shape === 'drop') {
        shapeStyle = `
          border-radius: 40% 40% 50% 50%;
          transform-origin: center bottom;
        `;
      } else if (shape === 'chunk') {
        shapeStyle = `
          border-radius: 2px;
          transform: rotate(${Math.random() * 45}deg);
        `;
      } else { // chip
        shapeStyle = `
          border-radius: 50%;
          height: ${size/2}px;
        `;
      }
      
      // Appliquer le style à la particule
      particle.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        ${shapeStyle}
        top: ${centerY}px;
        left: ${centerX}px;
        transform: translate(-50%, -50%) scale(0);
        z-index: 760;
        filter: drop-shadow(0 3px 3px rgba(0,0,0,0.15));
        opacity: 0;
        transition: top ${duration}s cubic-bezier(.17,.67,.83,.97), 
                    left ${duration}s cubic-bezier(.17,.67,.83,.97), 
                    transform ${duration}s cubic-bezier(.17,.67,.83,.97),
                    opacity ${duration}s ease;
        transition-delay: ${delay}s;
      `;
      
      transitionContainer.appendChild(particle);
      
      // Démarrer l'animation après un court délai
      setTimeout(() => {
        particle.style.top = `${endY}px`;
        particle.style.left = `${endX}px`;
        particle.style.transform = `translate(-50%, -50%) scale(1) rotate(${rotation}deg)`;
        particle.style.opacity = '0.9';
        
        // Disparition progressive
        setTimeout(() => {
          particle.style.opacity = '0';
          setTimeout(() => particle.remove(), 500);
        }, duration * 800);
      }, 50);
    }
    
    // Ajouter un "flash" de chocolat au centre
    const flash = document.createElement('div');
    flash.style.cssText = `
      position: absolute;
      top: ${centerY}px;
      left: ${centerX}px;
      width: 100px;
      height: 100px;
      background: radial-gradient(circle, #5c3d2e 0%, transparent 70%);
      border-radius: 50%;
      transform: translate(-50%, -50%) scale(0);
      opacity: 0.8;
      z-index: 755;
      transition: transform 0.5s ease-out, opacity 0.8s ease-out;
    `;
    
    transitionContainer.appendChild(flash);
    
    setTimeout(() => {
      flash.style.transform = 'translate(-50%, -50%) scale(5)';
      flash.style.opacity = '0';
    }, 50);
  }
  
  // Ajouter le style CSS nécessaire
  const style = document.createElement('style');
  style.textContent = `
    @keyframes chocolateRotate {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .chocolate-particle {
      animation: chocolateRotate 2s infinite linear;
    }
    
    /* Style pour le titre de la section musées pendant la transition */
    #section-8 h2 {
      transition: transform 0.8s ease, opacity 0.8s ease;
      transform: translateY(0);
    }
    
    #section-8.entering h2 {
      animation: titleReveal 1s ease forwards;
    }
    
    @keyframes titleReveal {
      0% { transform: translateY(30px); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
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
  
  // Scroll to top when button is clicked
  backToTopButton.addEventListener('click', () => {
    scrollContainer.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  console.log("Back to top button setup completed");
}