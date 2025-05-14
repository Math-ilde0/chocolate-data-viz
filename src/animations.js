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