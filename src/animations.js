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
  