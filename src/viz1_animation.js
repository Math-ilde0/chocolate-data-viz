// src/viz1_animation.js

export function setupTimelineSlideIn() {
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
        root: null, // viewport
        threshold: 0.3,
      }
    );
  
    etapes.forEach((etape) => observer.observe(etape));
  }
  
  // Appel automatique si tu veux que ça s'active direct au chargement du fichier
  // document.addEventListener('DOMContentLoaded', setupTimelineSlideIn);