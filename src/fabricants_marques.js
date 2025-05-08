export const brands = [
  {
    name: "Cailler",
    description: "Première fabrique mécanisée de chocolat en Suisse",
    date: "1819",
    anecdote: "La recette secrète de Napoléon : François-Louis Cailler aurait appris les techniques de chocolat en Italie... mais c'est surtout son mariage avec la fille d'un épicier qui a lancé son empire !",
    logo: "public/assets/fabricants/Cailler.jpg"
  },
  {
    name: "Lindt",
    description: "Inventeur du chocolat fondant grâce au conchage",
    date: "1879",
    anecdote: "L'erreur géniale : Rodolphe Lindt a oublié sa machine en marche pendant 72h, créant le 1er chocolat qui fond dans la bouche.",
    logo: "public/assets/fabricants/Lindt.jpeg"
  },
  {
    name: "Milka",
    description: "À l'origine suisse (Suchard), célèbre pour son violet",
    date: "1901",
    anecdote: "La vache qui venait du ciel : Le violet a été choisi car c'était une couleur rare dans les pubs de l'époque. La vache est apparue en 1960.",
    logo: "public/assets/fabricants/Milka.png"
  },
  {
    name: "Toblerone",
    description: "Barre triangulaire inspirée des Alpes",
    date: "1908",
    anecdote: "Le logo caché : Jusqu'en 2018, un ours (symbole de Berne) était dissimulé dans la montagne du logo.",
    logo: "public/assets/fabricants/Toblerone.png"
  },
  {
    name: "Frey",
    description: "Marque phare de Migros, très populaire en Suisse",
    date: "1887",
    anecdote: "Le chocolat des soldats : Pendant la 2nde Guerre mondiale, Frey fournissait le chocolat de l'armée suisse.",
    logo: "public/assets/fabricants/Frey.png"
  },
  {
    name: "Suchard",
    description: "Inventeur de la tablette moderne",
    date: "1826",
    anecdote: "Le premier chocolat à message : Suchard a créé en 1880 les tablettes avec des mots doux (Tendresse, Amour).",
    logo: "public/assets/fabricants/Suchard.png"
  },
  {
    name: "Camille Bloch",
    description: "Fabricant des Ragusa et Torino",
    date: "1929",
    anecdote: "La véritable histoire du Ragusa : Créé en 1942, il devait s'appeler 'Vénus', mais le nom a été changé pour évoquer le sud (Lugano = 'Ragusa' en italien).",
    logo: "public/assets/fabricants/CamilleBloch.png"
  }
];

export function initCarousel() {
  const carousel = document.querySelector('.carousel');
  const brandName = document.querySelector('.brand-name');
  const creationDate = document.querySelector('.creation-date');
  const anecdote = document.querySelector('.anecdote');

  let currentIndex = 0;

  // Initialisation : créer les éléments une seule fois
  brands.forEach((brand) => {
    const logoDiv = document.createElement('div');
    logoDiv.className = "logo-item";
    const img = document.createElement('img');
    img.src = brand.logo;
    logoDiv.appendChild(img);
    carousel.appendChild(logoDiv);
  });

  const logoItems = document.querySelectorAll('.logo-item');

  function updateCarousel() {
    logoItems.forEach((logoDiv, index) => {
      logoDiv.classList.remove('active', 'prev', 'next');
      if (index === currentIndex) {
        logoDiv.classList.add('active');
      } else if (index === (currentIndex - 1 + brands.length) % brands.length) {
        logoDiv.classList.add('prev');
      } else if (index === (currentIndex + 1) % brands.length) {
        logoDiv.classList.add('next');
      }
    });

    brandName.textContent = brands[currentIndex].name;
    creationDate.textContent = `Fondée en ${brands[currentIndex].date}`;
    anecdote.textContent = brands[currentIndex].anecdote;
  }

  document.querySelector('.left').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + brands.length) % brands.length;
    updateCarousel();
  });

  document.querySelector('.right').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % brands.length;
    updateCarousel();
  });

  updateCarousel();
}
