// src/viz2_animation.js

function animateViz2Titles() {
    return new Promise((resolve) => {
      const titles = document.querySelectorAll('#viz-2 .viz2-animate-title');
      if (!titles.length) {
        resolve();
        return;
      }
  
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              titles.forEach((el, i) => {
                setTimeout(() => {
                  el.classList.add('visible');
                  // Quand le dernier titre/paragraphe est visible, on résout la promesse
                  if (i === titles.length - 1) {
                    setTimeout(resolve, 800); // attendre la fin de la transition
                  }
                }, i * 300);
              });
              obs.disconnect();
            }
          });
        },
        { threshold: 0.3 }
      );
      observer.observe(document.querySelector('#viz-2'));
    });
  }
  
  function animateViz2Bars() {
    const bars = document.querySelectorAll('#graph-container .bar');
    if (!bars.length) return;
  
    bars.forEach(bar => bar.classList.remove('visible')); // reset au cas où
  
    bars.forEach((bar, i) => {
      setTimeout(() => bar.classList.add('visible'), i * 180);
    });
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    animateViz2Titles().then(() => {
      animateViz2Bars();
    });
  });