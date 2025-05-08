export function drawConsommationChart(containerId, csvPath = "/data/comparaison_ventes_exportations_chocolat.csv") {
  console.log("Drawing chart for", containerId, "with data from", csvPath);
  
  // Vérifier si le conteneur existe
  const container = document.querySelector(containerId);
  if (!container) {
    console.error(`Le conteneur ${containerId} n'existe pas dans le DOM`);
    return;
  }
  
  // Vider le contenu
  d3.select(containerId).html("");
  
  const width = 1000;
  const height = 550;
  const margin = { top: 70, right: 50, bottom: 50, left: 60 };
  
  // Variables pour le contrôle de l'animation
  let animationTimer; // Pour stocker le timer d'animation
  let isAnimationRunning = false; // Pour éviter de lancer plusieurs animations simultanées

  const svg = d3.select(containerId)
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("width", "100%")
    .attr("height", "100%");
  
  // Afficher un message de chargement
  svg.append("text")
    .attr("x", width/2)
    .attr("y", height/2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Chargement des données...");
  
  // Chemins vers les images de plaques de chocolat
  const brunImgPath = "/assets/blond.png"; 
  const blondImgPath = "/assets/brun.png";
  
  // Essayer d'abord avec le chemin fourni
  d3.csv(csvPath)
    .then(processData)
    .catch(error => {
      console.error("Erreur lors du chargement du CSV avec le chemin fourni:", error);
      console.log("Tentative avec un chemin alternatif...");
      
      // Essayer avec un chemin alternatif (sans le préfixe "public")
      const alternativePath = csvPath.replace("public/", "");
      d3.csv(alternativePath)
        .then(processData)
        .catch(error2 => {
          console.error("Échec du chargement avec le chemin alternatif:", error2);
          
          // Dernier essai avec un autre chemin
          const lastAttemptPath = csvPath.startsWith("/") ? csvPath.substring(1) : "/" + csvPath;
          d3.csv(lastAttemptPath)
            .then(processData)
            .catch(finalError => {
              console.error("Tous les essais de chargement du CSV ont échoué:", finalError);
              
              // Utiliser des données factices pour au moins montrer le graphique
              const mockData = [
                {"Année": 2017, "Ventes en Suisse (t)": 54208.5, "Exportations (t)": 127874.7},
                {"Année": 2018, "Ventes en Suisse (t)": 52363.7, "Exportations (t)": 140564},
                {"Année": 2019, "Ventes en Suisse (t)": 58280, "Exportations (t)": 141928.7},
                {"Année": 2020, "Ventes en Suisse (t)": 54294.8, "Exportations (t)": 125679.1},
                {"Année": 2021, "Ventes en Suisse (t)": 57890.9, "Exportations (t)": 139209.2},
                {"Année": 2022, "Ventes en Suisse (t)": 55567, "Exportations (t)": 150780.4},
                {"Année": 2023, "Ventes en Suisse (t)": 57291.2, "Exportations (t)": 150515.9}
              ];
              
              processData(mockData);
            });
        });
    });
  
  function processData(data) {
    console.log("Données CSV chargées:", data);
    
    // Supprimer le message de chargement
    svg.selectAll("text").remove();
    
    // Vérifier que les données sont correctes
    if (!data || data.length === 0) {
      console.error("Données CSV vides ou incorrectes");
      return;
    }
    
    // Vérifier les noms de colonnes dans le premier élément
    const firstRow = data[0];
    console.log("Colonnes dans le CSV:", Object.keys(firstRow));
    
    // Vérifier si nous avons les colonnes attendues ou les colonnes avec les noms français
    const hasExpectedColumns = 'year' in firstRow && 'suisse' in firstRow && 'export' in firstRow;
    const hasFrenchColumns = 'Année' in firstRow && 'Ventes en Suisse (t)' in firstRow && 'Exportations (t)' in firstRow;
    
    if (!hasExpectedColumns && !hasFrenchColumns) {
      console.error("Structure CSV incorrecte. Colonnes requises non trouvées.");
      return;
    }
    
    // Convertir les données en mappant les noms de colonnes
    const cleanData = data.map(d => {
      return {
        year: +(d.year || d['Année'] || 0),
        suisse: +(d.suisse || d['Ventes en Suisse (t)'] || 0),
        export: +(d.export || d['Exportations (t)'] || 0)
      };
    }).filter(d => d.year !== 0); // Filtrer les lignes avec une année invalide
    
    console.log("Données nettoyées:", cleanData);
    
    if (cleanData.length === 0) {
      console.error("Aucune donnée valide après nettoyage");
      return;
    }
    
    // Échelles
    const x = d3.scaleBand()
      .domain(cleanData.map(d => d.year))
      .range([margin.left, width - margin.right])
      .padding(0.2);
      
    const barWidth = x.bandwidth() / 2 - 5;
    
    const y = d3.scaleLinear()
      .domain([0, d3.max(cleanData, d => Math.max(d.suisse, d.export)) * 1.05])
      .nice()
      .range([height - margin.bottom, margin.top]);
  
    // Axes
    svg.append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .style("font-size", "12px");
  
    svg.append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(y))
      .style("font-size", "12px");
  
    // Ajouter un groupe de filtres pour les ombres
    const defs = svg.append("defs");
    
    // Filtre d'ombre pour les images de chocolat
    const filter = defs.append("filter")
      .attr("id", "drop-shadow")
      .attr("height", "130%");
    
    filter.append("feGaussianBlur")
      .attr("in", "SourceAlpha")
      .attr("stdDeviation", 1)
      .attr("result", "blur");
    
    filter.append("feOffset")
      .attr("in", "blur")
      .attr("dx", 1)
      .attr("dy", 1)
      .attr("result", "offsetBlur");
    
    const feComponentTransfer = filter.append("feComponentTransfer")
      .attr("in", "offsetBlur")
      .attr("result", "offsetBlur");
    
    feComponentTransfer.append("feFuncA")
      .attr("type", "linear")
      .attr("slope", 0.3);
    
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode")
      .attr("in", "offsetBlur");
    feMerge.append("feMergeNode")
      .attr("in", "SourceGraphic");
      
    // Définir la taille des images de chocolat
    const chocolateImgWidth = barWidth;
    const chocolateImgHeight = 25; // Hauteur de chaque tablette de chocolat
    const chocolateStackOverlap = 5; // Chevauchement entre tablettes pour effet d'empilement
    
    // Stocker les références aux groupes pour l'animation périodique
    const suisseGroups = [];
    const exportGroups = [];
    
    // Barres empilées de chocolat
    cleanData.forEach((d, i) => {
      // Créer le groupe pour la barre Suisse
      const suisseGroup = svg.append("g")
        .attr("class", "suisse-bar-group");
      
      suisseGroups.push(suisseGroup);
      
      // Calculer le nombre de tablettes à empiler pour la barre Suisse
      const suisseBarHeight = height - margin.bottom - y(d.suisse);
      const chocolateStackHeightEffective = chocolateImgHeight - chocolateStackOverlap;
      const suisseChocolateCount = Math.max(
        1, 
        Math.ceil(suisseBarHeight / chocolateStackHeightEffective)
      );
      
      // Créer un clip-path pour limiter les tablettes à la hauteur de la barre
      defs.append("clipPath")
        .attr("id", `clip-suisse-${i}`)
        .append("rect")
        .attr("x", x(d.year))
        .attr("y", y(d.suisse))
        .attr("width", barWidth)
        .attr("height", suisseBarHeight);
      
      // Fond de la barre Suisse
      suisseGroup.append("rect")
        .attr("class", "bar-background")
        .attr("x", x(d.year))
        .attr("y", height - margin.bottom)
        .attr("width", barWidth)
        .attr("height", 0)
        .attr("fill", "#b67a55")
        .attr("rx", 3)
        .attr("ry", 3)
        .transition()
        .delay(i * 100)
        .duration(1000)
        .attr("y", y(d.suisse))
        .attr("height", suisseBarHeight)
        .ease(d3.easeBounceOut);
      
      // Créer un conteneur pour les tablettes de chocolat (Suisse) avec clip-path
      const suisseChocolateContainer = suisseGroup.append("g")
        .attr("class", "chocolate-container")
        .attr("clip-path", `url(#clip-suisse-${i})`);
        
      // Empiler les tablettes de chocolat pour la barre Suisse
      for (let j = 0; j < suisseChocolateCount; j++) {
        const yPos = height - margin.bottom - (j * (chocolateImgHeight - chocolateStackOverlap));
        suisseChocolateContainer.append("image")
          .attr("class", "chocolate-piece")
          .attr("href", brunImgPath)
          .attr("x", x(d.year))
          .attr("y", yPos)
          .attr("width", barWidth)
          .attr("height", chocolateImgHeight)
          .attr("opacity", 0)
          .style("filter", "url(#drop-shadow)")
          .transition()
          .delay(i * 100 + 500 + j * 50)
          .duration(300)
          .attr("opacity", 1);
      }
      
      // Valeur Suisse
      suisseGroup.append("text")
        .attr("class", "value-text")
        .attr("x", x(d.year) + barWidth/2)
        .attr("y", y(d.suisse) - 10)
        .attr("text-anchor", "middle")
        .attr("opacity", 0)
        .style("font-weight", "bold")
        .style("font-size", "10px")
        .style("fill", "#5c3d2e")
        .text(Math.round(d.suisse/1000) + "K")
        .transition()
        .delay(i * 100 + 600)
        .duration(500)
        .attr("opacity", 1);
      
      // Créer le groupe pour la barre Export
      const exportGroup = svg.append("g")
        .attr("class", "export-bar-group");
      
      exportGroups.push(exportGroup);
      
      // Calculer le nombre de tablettes à empiler pour la barre Export
      const exportBarHeight = height - margin.bottom - y(d.export);
      const exportChocolateCount = Math.max(
        1, 
        Math.ceil(exportBarHeight / chocolateStackHeightEffective)
      );
      
      // Créer un clip-path pour limiter les tablettes à la hauteur de la barre
      defs.append("clipPath")
        .attr("id", `clip-export-${i}`)
        .append("rect")
        .attr("x", x(d.year) + barWidth + 10)
        .attr("y", y(d.export))
        .attr("width", barWidth)
        .attr("height", exportBarHeight);
      
      // Fond de la barre Export
      exportGroup.append("rect")
        .attr("class", "bar-background")
        .attr("x", x(d.year) + barWidth + 10)
        .attr("y", height - margin.bottom)
        .attr("width", barWidth)
        .attr("height", 0)
        .attr("fill", "#5e3d38")
        .attr("rx", 3)
        .attr("ry", 3)
        .transition()
        .delay(i * 100 + 150)
        .duration(1000)
        .attr("y", y(d.export))
        .attr("height", exportBarHeight)
        .ease(d3.easeBounceOut);
      
      // Créer un conteneur pour les tablettes de chocolat (Export) avec clip-path
      const exportChocolateContainer = exportGroup.append("g")
        .attr("class", "chocolate-container")
        .attr("clip-path", `url(#clip-export-${i})`);
        
      // Empiler les tablettes de chocolat pour la barre Export
      for (let j = 0; j < exportChocolateCount; j++) {
        const yPos = height - margin.bottom - (j * (chocolateImgHeight - chocolateStackOverlap));
        exportChocolateContainer.append("image")
          .attr("class", "chocolate-piece")
          .attr("href", blondImgPath)
          .attr("x", x(d.year) + barWidth + 10)
          .attr("y", yPos)
          .attr("width", barWidth)
          .attr("height", chocolateImgHeight)
          .attr("opacity", 0)
          .style("filter", "url(#drop-shadow)")
          .transition()
          .delay(i * 100 + 650 + j * 30)
          .duration(300)
          .attr("opacity", 1);
      }
      
      // Valeur Export
      exportGroup.append("text")
        .attr("class", "value-text")
        .attr("x", x(d.year) + barWidth*1.5 + 10)
        .attr("y", y(d.export) - 10)
        .attr("text-anchor", "middle")
        .attr("opacity", 0)
        .style("font-weight", "bold")
        .style("font-size", "10px")
        .style("fill", "#5c3d2e")
        .text(Math.round(d.export/1000) + "K")
        .transition()
        .delay(i * 100 + 750)
        .duration(500)
        .attr("opacity", 1);
    });
  
    // Titre
    svg.append("text")
      .attr("x", width/2)
      .attr("y", margin.top/2)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .style("font-weight", "bold")
      .text("Comparaison des ventes de chocolat : Suisse vs Exportation");
  
    // Légende
    const legend = svg.append("g")
      .attr("transform", `translate(${width/2 - 100}, ${margin.top + 1})`);
  
    legend.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", "#b67a55");
  
    legend.append("text")
      .attr("x", 30)
      .attr("y", 15)
      .text("Suisse")
      .style("font-size", "14px");
  
    legend.append("rect")
      .attr("x", 140)
      .attr("y", 0)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", "#5e3d38");
  
    legend.append("text")
      .attr("x", 170)
      .attr("y", 15)
      .text("Exportation")
      .style("font-size", "14px");
    
    console.log("Graphique généré avec succès");
    
    // Animation qui se répète toutes les 10 secondes
    function startPeriodicAnimation() {
      if (isAnimationRunning) return;
      
      animationTimer = setInterval(() => {
        runAnimation();
      }, 10000); // 10 secondes entre chaque cycle d'animation
      
      // Lancer la première animation après un délai initial
      setTimeout(() => {
        runAnimation();
      }, 5000); // 5 secondes après le chargement initial
    }
    
    function runAnimation() {
      isAnimationRunning = true;
      
      // Fonction pour animer les tablettes d'un groupe
      function animateGroup(groups, delay = 0) {
        groups.forEach((group, i) => {
          // Récupérer toutes les tablettes du groupe
          const chocolatePieces = group.selectAll(".chocolate-piece");
          
          // Faire disparaître les tablettes
          chocolatePieces
            .transition()
            .delay(delay + i * 50)
            .duration(500)
            .attr("opacity", 0)
            .transition() // Attendre un peu
            .delay(500)
            .duration(0)
            .attr("transform", "translateY(20px)") // Déplacer les tablettes vers le bas
            .transition() // Puis les faire réapparaître
            .delay(200)
            .duration(500)
            .attr("transform", "translateY(0)") // Remonter à la position originale
            .attr("opacity", 1);
          
          // Faire pulser le fond de la barre
          group.select(".bar-background")
            .transition()
            .delay(delay + i * 50)
            .duration(400)
            .attr("fill-opacity", 0.6)
            .transition()
            .duration(400)
            .attr("fill-opacity", 1);
          
          // Faire clignoter le texte
          group.select(".value-text")
            .transition()
            .delay(delay + i * 50 + 200)
            .duration(300)
            .attr("opacity", 0.5)
            .attr("font-size", "12px")
            .transition()
            .duration(300)
            .attr("opacity", 1)
            .attr("font-size", "10px");
        });
      }
      
      // Animer d'abord les barres Suisse, puis les barres Export avec un léger décalage
      animateGroup(suisseGroups);
      animateGroup(exportGroups, 1000);
      
      // Libérer le flag d'animation après la fin de l'animation
      setTimeout(() => {
        isAnimationRunning = false;
      }, 3000); // Durée totale approximative de l'animation
    }
    
    // Démarrer l'animation périodique
    startPeriodicAnimation();
    
    // Nettoyer l'animation lorsque le conteneur est retiré du DOM
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.removedNodes) {
          mutation.removedNodes.forEach(node => {
            if (node === container || node.contains(container)) {
              clearInterval(animationTimer);
              observer.disconnect();
            }
          });
        }
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
  }
}