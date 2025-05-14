export function initFeves() {
  const data = [
    { year: 2000, value: 21989, tooltip: "En l’an 2000, la Suisse a importé 21 989 tonnes de cacao — soit 44 éléphants adultes." },
    { year: 2005, value: 32266, tooltip: "En 2005, 32 266 tonnes de cacao ont été importées, soit 65 pachydermes bien nourris." },
    { year: 2010, value: 41973, tooltip: "En 2010, ce sont 41 973 tonnes de cacao, équivalentes à 210 camions poids lourds." },
    { year: 2015, value: 41000, tooltip: "En 2015, la Suisse a importé 41 000 tonnes de cacao — soit 820 containers maritimes." },
    { year: 2020, value: 48670, tooltip: "En 2020, 48 670 tonnes de cacao ont été englouties — l’équivalent de 97 baleines bleues !" },
    { year: 2024, value: 58794, tooltip: "En 2024, la Suisse a importé 58 794 tonnes, soit 294 avions commerciaux remplis de fèves." }
  ];

  const container = document.getElementById('graph-container');
  if (!container || container.hasChildNodes()) return; // 🔒 Empêche les doublons

  data.forEach(item => {
    const bar = document.createElement('div');
    bar.className = 'bar';
    bar.setAttribute('data-tooltip', item.tooltip);

    const scale = item.value / 60000;
    const height = 100 + scale * 150;

    const img = document.createElement('img');
    img.src = 'public/assets/sac-feve-cacao.svg';
    img.style.height = `${height}px`;

    const year = document.createElement('div');
    year.className = 'year';
    year.textContent = item.year;

    bar.appendChild(img);
    bar.appendChild(year);
    container.appendChild(bar);
  });
}
export function animateViz2Titles() {
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
        { threshold: 0.5 }
      );
      observer.observe(document.querySelector('#viz-2'));
    });
  }
  
   export function animateViz2Bars() {
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

  
