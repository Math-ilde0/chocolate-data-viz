export function initMuseesVisualisation() {
    document.querySelectorAll('#viz-8 .musee').forEach(musee => {
        
      const nom = musee.dataset.nom;
      const visiteurs = parseInt(musee.dataset.visiteurs);
  
      const info = document.createElement('div');
      info.classList.add('info-bulle');
      info.textContent = `En 2022, ${visiteurs.toLocaleString('fr-CH')} visiteurs ont découvert le musée ${nom}.`;
      musee.appendChild(info);
  
      musee.addEventListener('mouseenter', () => {
        const pastilleContainer = musee.querySelector('.pastilles');
        pastilleContainer.innerHTML = '';
        info.style.opacity = '1';
  
        const nbBonshommes = Math.round(visiteurs / 10000);
  
        for (let i = 0; i < nbBonshommes; i++) {
          const bonhomme = document.createElement('img');
          bonhomme.src = 'public/assets/musee/homme.svg';
          bonhomme.classList.add('bonhomme');
          bonhomme.style.left = `${10 + Math.random() * 80}%`;
          bonhomme.style.bottom = `-40px`;
          bonhomme.style.animationDelay = `${i * 0.2}s`;
          pastilleContainer.appendChild(bonhomme);
        }
      });
  
      musee.addEventListener('mouseleave', () => {
        musee.querySelector('.pastilles').innerHTML = '';
        info.style.opacity = '0';
      });
    });
  }
  