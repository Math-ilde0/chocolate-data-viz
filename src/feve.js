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
    if (!container) return;
  
    data.forEach(item => {
      const bar = document.createElement('div');
      bar.className = 'bar';
      bar.setAttribute('data-tooltip', item.tooltip);
  
      const scale = item.value / 60000;
      const height = 100 + scale * 150;
  
      const img = document.createElement('img');
      img.src = 'public/assets/sac-feve-cacao.svg'; // chemin corrigé
      img.style.height = `${height}px`;
  
      const year = document.createElement('div');
      year.className = 'year';
      year.textContent = item.year;
  
      bar.appendChild(img);
      bar.appendChild(year);
      container.appendChild(bar);
    });
  }
  