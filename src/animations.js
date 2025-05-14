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

  export function setupEtapeTimeline() {
    const etapes = document.querySelectorAll('#viz-1 .etape');
    if (etapes.length === 0) return;
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      {
        root: document.querySelector('.timeline-slides'),
        threshold: 0.6,
      }
    );
  
    etapes.forEach((etape) => observer.observe(etape));
  }
  
  
  export function setupIntroToTimelineTransition() {
    const section = document.querySelector('#viz-1');
    if (!section) return;
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section.classList.add('visible');
          }
        });
      },
      { threshold: 0.2 }
    );
  
    observer.observe(section);
  }
  
  export function setupScrollRevealTimeline() {
    const target = document.querySelector('#viz-1');
    if (!target) return;
  
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          target.classList.add('visible');
        }
      },
      {
        root: null,
        threshold: 0.05, // dès qu'on commence à apercevoir la section
      }
    );
  
    observer.observe(target);
  }
  
  document.addEventListener('mousemove', (e) => {
    const cursor = document.getElementById('circularcursor');
    if (cursor) {
      cursor.style.left = `${e.pageX - 10}px`; // -10 pour bien centrer le curseur
      cursor.style.top = `${e.pageY - 10}px`;
    }
  });
   

  // Globe transition
  export function setupGlobeToChartTransition() {
  // Éléments concernés par la transition
  const section3 = document.querySelector('#section-3');
  const section4 = document.querySelector('#section-4');
  
  if (!section3 || !section4) return;
  
  // Création du conteneur pour l'animation
  const transitionContainer = document.createElement('div');
  transitionContainer.className = 'globe-chart-transition';
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
      // Lorsque section4 commence à entrer dans la vue
      if (entry.target === section4 && entry.isIntersecting) {
        // Effet de chocolat qui coule du globe vers le graphique
        transitionContainer.style.opacity = '1';
        
        // Créer les gouttes de chocolat
        for (let i = 0; i < 20; i++) {
          createChocolateDrop(i);
        }
        
        // Animation globe qui rétrécit
        if (document.querySelector('#viz-3 svg')) {
          document.querySelector('#viz-3 svg').style.transition = 'transform 1.2s cubic-bezier(.17,.67,.83,.67)';
          document.querySelector('#viz-3 svg').style.transform = 'scale(0.8) translateY(10%)';
        }
        
        // Animation graphique qui apparaît
        const targetChart = document.querySelector('#viz-4');
        if (targetChart) {
          targetChart.style.transition = 'transform 1.5s ease, opacity 1.5s ease';
          targetChart.style.transform = 'translateY(0) scale(1)';
          targetChart.style.opacity = '1';
        }
        
        // Nettoyer après l'animation
        setTimeout(() => {
          transitionContainer.style.opacity = '0';
          setTimeout(() => {
            transitionContainer.innerHTML = '';
          }, 1000);
        }, 3000);
      }
      
      // Lorsqu'on remonte vers section3
      if (entry.target === section3 && entry.isIntersecting && window.scrollY < section4.offsetTop) {
        // Réinitialiser le globe
        if (document.querySelector('#viz-3 svg')) {
          document.querySelector('#viz-3 svg').style.transform = 'scale(1) translateY(0)';
        }
        
        // Réinitialiser le graphique
        const targetChart = document.querySelector('#viz-4');
        if (targetChart) {
          targetChart.style.transform = 'translateY(50px) scale(0.9)';
          targetChart.style.opacity = '0.5';
        }
      }
    });
  }, { threshold: 0.2 });
  
  observer.observe(section3);
  observer.observe(section4);
  
  // Préparation initiale du graphique pour l'animation
  const targetChart = document.querySelector('#viz-4');
  if (targetChart) {
    targetChart.style.transform = 'translateY(50px) scale(0.9)';
    targetChart.style.opacity = '0.5';
    targetChart.style.transition = 'transform 1.5s ease, opacity 1.5s ease';
  }
  
  // Fonction pour créer une goutte de chocolat qui tombe
  function createChocolateDrop(index) {
    const drop = document.createElement('div');
    drop.className = 'chocolate-transition-drop';
    
    // Position de départ basée sur le globe
    const globeRect = section3.getBoundingClientRect();
    const chartRect = section4.getBoundingClientRect();
    
    // Paramètres aléatoires pour l'animation
    const delay = index * 0.15;
    const duration = 1.5 + Math.random() * 1;
    const size = 10 + Math.random() * 25;
    const startX = globeRect.left + (Math.random() * globeRect.width);
    const endX = chartRect.left + (Math.random() * chartRect.width);
    
    // Style de la goutte
    drop.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size * 1.2}px;
      background-color: #5c3d2e;
      border-radius: 40% 40% 50% 50%;
      top: ${globeRect.bottom - size}px;
      left: ${startX}px;
      transform-origin: center bottom;
      z-index: 760;
      filter: drop-shadow(0 3px 3px rgba(0,0,0,0.2));
      opacity: 0;
    `;
    
    transitionContainer.appendChild(drop);
    
    // Animation de la goutte
    setTimeout(() => {
      drop.style.transition = `top ${duration}s cubic-bezier(.17,.67,.83,.97), 
                              left ${duration}s cubic-bezier(.45,.05,.55,.95), 
                              opacity ${duration}s ease,
                              transform ${duration}s ease-in`;
      drop.style.top = `${chartRect.top}px`;
      drop.style.left = `${endX}px`;
      drop.style.opacity = '0.8';
      drop.style.transform = 'scale(1.2) rotate(5deg)';
      
      // Disparition à la fin
      setTimeout(() => {
        drop.style.opacity = '0';
        drop.style.transform = 'scale(0) rotate(15deg)';
        setTimeout(() => drop.remove(), 500);
      }, duration * 900);
    }, delay * 1000);
  }
  
  // Ajouter le style CSS nécessaire
  const style = document.createElement('style');
  style.textContent = `
    @keyframes drip {
      0% { border-radius: 40% 40% 50% 50%; }
      50% { border-radius: 30% 30% 60% 60%; }
      100% { border-radius: 40% 40% 50% 50%; }
    }
    
    .chocolate-transition-drop {
      animation: drip 1s infinite alternate;
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