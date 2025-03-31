/**
 * Script principal pour la gestion du scrollytelling et de l'interaction
 */

// Configuration globale
const config = {
    transitionDuration: 800,
    colors: {
        primary: "#5c3d2e",
        secondary: "#b85c38",
        accent: "#e0a458",
        highlight: "#cd5c5c",
        background: "#f9ecd9",
        scale: ["#5c3d2e", "#b85c38", "#e0a458", "#cd5c5c", "#b08968", "#704f32"]
    }
};

// État global
const state = {
    currentSection: 0,
    data: {},
    charts: [],
    isDataLoaded: false
};

// Initialisation
document.addEventListener('DOMContentLoaded', async () => {
    console.log("Initialisation de l'application...");
    
    // Afficher un loader pendant le chargement
    showLoader();
    
    try {
        // Chargement des données
        await loadAllData();
        state.isDataLoaded = true;
    } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        // Afficher un message d'erreur à l'utilisateur
        showErrorMessage("Impossible de charger les données. Veuillez rafraîchir la page ou réessayer plus tard.");
        return;
    }
    
    // Cacher le loader
    hideLoader();
    
    // Configuration du scrollytelling
    setupScrollTriggers();
    
    // Initialisation des visualisations
    initVisualizations();
    
    setupStepScrollTimeline();

    // Affichage de la première visualisation
    updateVisualization(1);
});

// Afficher un message d'erreur
function showErrorMessage(message) {
    hideLoader();
    
    const errorDiv = document.createElement('div');
    errorDiv.id = 'error-message';
    errorDiv.innerHTML = `
        <div class="error-content">
            <h3>Erreur</h3>
            <p>${message}</p>
            <button onclick="location.reload()">Réessayer</button>
        </div>
    `;
    
    // Style du message d'erreur
    errorDiv.style.position = 'fixed';
    errorDiv.style.top = '0';
    errorDiv.style.left = '0';
    errorDiv.style.width = '100%';
    errorDiv.style.height = '100%';
    errorDiv.style.backgroundColor = 'rgba(249, 236, 217, 0.9)';
    errorDiv.style.display = 'flex';
    errorDiv.style.justifyContent = 'center';
    errorDiv.style.alignItems = 'center';
    errorDiv.style.zIndex = '9999';
    
    // Style du contenu
    const errorContent = errorDiv.querySelector('.error-content');
    errorContent.style.backgroundColor = '#ffffff';
    errorContent.style.padding = '2rem';
    errorContent.style.borderRadius = '8px';
    errorContent.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
    errorContent.style.textAlign = 'center';
    
    // Style du bouton
    const button = errorDiv.querySelector('button');
    button.style.backgroundColor = config.colors.secondary;
    button.style.color = '#ffffff';
    button.style.border = 'none';
    button.style.padding = '0.5rem 1rem';
    button.style.borderRadius = '4px';
    button.style.marginTop = '1rem';
    button.style.cursor = 'pointer';
    
    // Ajout du message d'erreur au body
    document.body.appendChild(errorDiv);
}

// Afficher un loader pendant le chargement des données
function showLoader() {
    // Création d'un élément loader
    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="spinner"></div>
            <p>Chargement des données...</p>
        </div>
    `;
    
    // Style du loader
    loader.style.position = 'fixed';
    loader.style.top = '0';
    loader.style.left = '0';
    loader.style.width = '100%';
    loader.style.height = '100%';
    loader.style.backgroundColor = 'rgba(249, 236, 217, 0.9)';
    loader.style.display = 'flex';
    loader.style.justifyContent = 'center';
    loader.style.alignItems = 'center';
    loader.style.zIndex = '9999';
    
    // Style du spinner
    const spinner = loader.querySelector('.spinner');
    spinner.style.width = '50px';
    spinner.style.height = '50px';
    spinner.style.border = '5px solid #f3f3f3';
    spinner.style.borderTop = '5px solid ' + config.colors.secondary;
    spinner.style.borderRadius = '50%';
    spinner.style.animation = 'spin 1s linear infinite';
    
    // Ajouter l'animation CSS
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    // Ajout du loader au body
    document.body.appendChild(loader);
}

// Cacher le loader
function hideLoader() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.opacity = '0';
        loader.style.transition = 'opacity 0.5s ease';
        setTimeout(() => {
            loader.remove();
        }, 500);
    }
}

// Configuration du scrollytelling
function setupScrollTriggers() {
    const sections = document.querySelectorAll('.scroll-section');

    // Options pour l'Intersection Observer
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    // Créer un observer pour chaque section
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                
                // Vérifie si l'ID suit le format section-N
                const match = sectionId.match(/section-(\d+)/);
                if (!match) return;  // Ignore les sections comme l'intro

                const sectionNumber = parseInt(match[1]);

                // Mise à jour de la section active
                state.currentSection = sectionNumber;
                console.log(`Section active: ${sectionNumber}`);

                // Mise à jour de la visualisation
                updateVisualization(sectionNumber);

                // Animation du contenu
                animateContent(entry.target);
            }
        });
    }, options);

    // Observer chaque section
    sections.forEach(section => {
        observer.observe(section);
    });
}

function setupStepScrollTimeline() {
    const steps = document.querySelectorAll('#section-1 .scroll-page');
    const svg = d3.select("#timeline-svg");

    const height = document.querySelector("#viz-1").clientHeight;
    const width = document.querySelector("#viz-1").clientWidth;
    svg.attr("viewBox", `0 0 200 ${height}`)
       .attr("preserveAspectRatio", "xMidYMid meet");

    const points = steps.length;
    const stepHeight = height / points;
    const pathData = d3.range(points).map(i => [100, i * stepHeight + 50]);

    const lineGen = d3.line();
    svg.append("path")
        .attr("d", lineGen(pathData))
        .attr("stroke", "#8b5a2b")
        .attr("stroke-width", 4)
        .attr("fill", "none");

    const circles = svg.selectAll("circle")
        .data(pathData)
        .enter()
        .append("circle")
        .attr("cx", d => d[0])
        .attr("cy", d => d[1])
        .attr("r", 0)
        .attr("fill", "#e0a458");

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const el = entry.target;
            if (entry.isIntersecting) {
                el.classList.add("visible");
                const index = parseInt(el.dataset.step) - 1;

                svg.selectAll("circle")
                    .filter((d, i) => i === index)
                    .transition()
                    .duration(400)
                    .attr("r", 8);
            }
        });
    }, { threshold: 0.5 });

    steps.forEach(step => observer.observe(step));
}




// Animation du contenu lors du défilement
function animateContent(section) {
    // Animer les paragraphes avec un délai
    const paragraphs = section.querySelectorAll('.scroll-content p');
    paragraphs.forEach((p, index) => {
        p.classList.add('slide-in');
        setTimeout(() => {
            p.classList.add('visible');
        }, 100 * index);
    });
    
    // Animer le titre
    const title = section.querySelector('.scroll-content h2');
    if (title) {
        title.classList.add('fade-in');
        title.classList.add('visible');
    }
}

// Initialisation des visualisations
function initVisualizations() {
    if (!state.isDataLoaded) {
        console.error("Les données ne sont pas encore chargées");
        return;
    }
    
    console.log("Initialisation des visualisations...");
    
    
    // Récolte mondiale - Carte
    state.charts[2] = new WorldMapChart('#viz-2');
    
    // Évolution du volume de cacao - Graphique linéaire
    state.charts[3] = new LineChart('#viz-3');
    
    // Consommation mondiale et en Suisse - Graphique à barres
    state.charts[4] = new BarChart('#viz-4', state.data.consommation);
    
    // Marché du chocolat - Graphique en anneau
    state.charts[5] = new DonutChart('#viz-5');
    
    // Fabricants de chocolat - Graphique à bulles
    state.charts[6] = new BubbleChart('#viz-6', state.data.fabricants);
    
    // Proportion hommes/femmes - Graphique de répartition
    state.charts[7] = new GenderChart('#viz-7', state.data.fabricants);
    
    // Musées et fréquentation - Graphique à barres
    state.charts[8] = new BarChart('#viz-8', state.data.musees, 'Fréquentation des musées du chocolat en 2023', 'nom', 'visiteurs');
}

// Mise à jour de la visualisation active
function updateVisualization(sectionNumber) {
    if (!state.isDataLoaded || !state.charts[sectionNumber]) {
        console.warn(`Visualisation ${sectionNumber} non disponible`);
        return;
    }
    
    console.log(`Mise à jour de la visualisation ${sectionNumber}`);
    
    // Appeler la méthode update de la visualisation active
    state.charts[sectionNumber].update();
    
    // Pour le développement, afficher des données dans la console
    switch(sectionNumber) {
        case 1:
            console.log("Données historiques:", state.data.historique);
            break;
        case 4:
            console.log("Données de consommation:", state.data.consommation);
            break;
        case 6:
            console.log("Données des fabricants:", state.data.fabricants);
            break;
        case 8:
            console.log("Données des musées:", state.data.musees);
            break;
    }
}

// Gestion du redimensionnement de fenêtre
window.addEventListener('resize', debounce(() => {
    if (state.currentSection && state.charts[state.currentSection]) {
        state.charts[state.currentSection].resize();
    }
}, 250));

// Fonction utilitaire de debounce pour optimiser les événements fréquents
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}