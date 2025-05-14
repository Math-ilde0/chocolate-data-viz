/**
 * Script principal pour la gestion du scrollytelling et de l'interaction
 */

import { drawConsommationChart } from "./consommationChart.js";
import { loadAllData } from "./data_loader.js";
import { initMuseesVisualisation } from './musee.js';
import { setupChocolateProgressBar,  setupEtapeTimeline, setupIntroToTimelineTransition, setupScrollRevealTimeline, setupGlobeToChartTransition, setupGenreToMuseeTransition} from './animations.js';
import { initFeves } from './feve.js';
import { initCarousel } from './fabricants_marques.js';
import { initGenreIndustrie } from './genre_industrie.js';
import { setupConsommationChart3D } from './Transformation3d.js';
import { setupTimelineSlideIn } from './viz1_animation.js';
import { setupTimelineSlideIn } from './viz1_animation.js'; 
setupTimelineSlideIn();

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
    isDataLoaded: false,
    globeDrawn: false
};

// Initialisation

document.addEventListener('DOMContentLoaded', async () => {
    console.log("Initialisation de l'application...");

    showLoader();

    try {
        const loadedData = await loadAllData();
        console.log("Toutes les données chargées avec succès:", loadedData);
        state.data = loadedData;
        state.isDataLoaded = true;
    } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
        showErrorMessage("Impossible de charger les données. Veuillez rafraîchir la page ou réessayer plus tard.");
        return;
    }

    hideLoader();
    setupScrollTriggers();
    await initVisualizations();
    setupStepScrollTimeline();
    updateVisualization(1);
    setupChocolateProgressBar();
    setupEtapeTimeline();
    setupIntroToTimelineTransition();
    setupScrollRevealTimeline();
    setupGlobeToChartTransition();
    setupGenreToMuseeTransition();
    initFeves();
    initCarousel();
    initGenreIndustrie();

     // Ajouter l'effet 3D pour la section de consommation
     setupConsommationChart3D();
    
     // Ajouter des paillettes de chocolat qui tombent lors du scroll
     setupChocolateParticles();
});

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

    const errorContent = errorDiv.querySelector('.error-content');
    errorContent.style.backgroundColor = '#ffffff';
    errorContent.style.padding = '2rem';
    errorContent.style.borderRadius = '8px';
    errorContent.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
    errorContent.style.textAlign = 'center';

    const button = errorDiv.querySelector('button');
    button.style.backgroundColor = config.colors.secondary;
    button.style.color = '#ffffff';
    button.style.border = 'none';
    button.style.padding = '0.5rem 1rem';
    button.style.borderRadius = '4px';
    button.style.marginTop = '1rem';
    button.style.cursor = 'pointer';

    document.body.appendChild(errorDiv);
}

function showLoader() {
    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.innerHTML = `
        <div class="loader-content">
            <div class="spinner"></div>
            <p>Chargement des données...</p>
        </div>
    `;

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

    const spinner = loader.querySelector('.spinner');
    spinner.style.width = '50px';
    spinner.style.height = '50px';
    spinner.style.border = '5px solid #f3f3f3';
    spinner.style.borderTop = '5px solid ' + config.colors.secondary;
    spinner.style.borderRadius = '50%';
    spinner.style.animation = 'spin 1s linear infinite';

    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(loader);
}

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

function setupScrollTriggers() {
    const sections = document.querySelectorAll('.scroll-section');
    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                const match = sectionId.match(/section-(\d+)/);
                if (!match) return;

                const sectionNumber = parseInt(match[1]);
                state.currentSection = sectionNumber;
                console.log(`Section active: ${sectionNumber}`);

                updateVisualization(sectionNumber);
                animateContent(entry.target);
            }
        });
    }, options);

    sections.forEach(section => {
        observer.observe(section);
    });
}

function setupStepScrollTimeline() {
    const steps = document.querySelectorAll('#section-1 .scroll-page');
    const svg = d3.select("#timeline-svg");

    const height = document.querySelector("#viz-1")?.clientHeight || 600;
    const width = document.querySelector("#viz-1")?.clientWidth || 200;
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

    svg.selectAll("circle")
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

function animateContent(section) {
    const paragraphs = section.querySelectorAll('.scroll-content p');
    paragraphs.forEach((p, index) => {
        p.classList.add('slide-in');
        setTimeout(() => {
            p.classList.add('visible');
        }, 100 * index);
    });

    const title = section.querySelector('.scroll-content h2');
    if (title) {
        title.classList.add('fade-in');
        title.classList.add('visible');
    }
}

// Fonction pour ajouter des particules de "paillettes de chocolat" pendant le scroll
function setupChocolateParticles() {
    const container = document.createElement('div');
    container.className = 'chocolate-particles-container';
    container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 100;
        overflow: hidden;
    `;
    document.body.appendChild(container);
    
    // Variable pour suivre le dernier défilement
    let lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    let scrollTimeout;
    
    // Fonction pour créer une particule
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'chocolate-particle';
        
        // Taille et opacité aléatoires
        const size = 3 + Math.random() * 5;
        const opacity = 0.3 + Math.random() * 0.5;
        
        // Couleur aléatoire de chocolat
        const colors = ['#5c3d2e', '#8b5a2b', '#b08968', '#cd853f', '#a0522d'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Position aléatoire en haut de l'écran
        const leftPos = Math.random() * 100;
        
        // Style CSS
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background-color: ${color};
            border-radius: 50%;
            top: -10px;
            left: ${leftPos}%;
            opacity: ${opacity};
            pointer-events: none;
            transform: translateY(0);
            animation: fallAndFade ${4 + Math.random() * 6}s linear forwards;
        `;
        
        container.appendChild(particle);
        
        // Supprimer la particule après l'animation
        setTimeout(() => {
            particle.remove();
        }, 10000);
    }
    
    // Ajouter les styles d'animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fallAndFade {
            0% { 
                transform: translateY(0) rotate(0deg); 
                opacity: 0;
            }
            10% {
                opacity: var(--opacity, 0.5);
            }
            85% {
                opacity: var(--opacity, 0.5);
            }
            100% { 
                transform: translateY(120vh) rotate(360deg); 
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Événement de défilement
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollDelta = Math.abs(scrollTop - lastScrollTop);
        
        // Créer des particules en fonction de la vitesse de défilement
        if (scrollDelta > 15) {
            // Plus le défilement est rapide, plus on crée de particules
            const particleCount = Math.min(5, Math.floor(scrollDelta / 30));
            
            for (let i = 0; i < particleCount; i++) {
                createParticle();
            }
        }
        
        lastScrollTop = scrollTop;
        
        // Réinitialiser le timeout pour faire tomber quelques particules même en défilement lent
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (Math.random() > 0.7) {
                createParticle();
            }
        }, 200);
    });
}

async function initVisualizations() {
    if (!state.isDataLoaded) {
        console.error("Les données ne sont pas encore chargées");
        return;
    }

    console.log("Initialisation des visualisations...");

    // Section 4 – 🌍 Globe interactif + Consommation
    if (!state.globeDrawn) {
        import("./globe.js").then(({ drawGlobe }) => {
            drawGlobe("#viz-3");
            state.globeDrawn = true;
        });
    }
    drawConsommationChart("#viz-4", "public/data/comparaison_ventes_exportations_chocolat.csv");
    const museeElements = document.querySelectorAll('#section-8 .musee');
if (museeElements.length > 0) {
    initMuseesVisualisation();
}

      
}


function updateVisualization(sectionNumber) {
    console.log(`Mise à jour de la visualisation ${sectionNumber}`);
}

window.addEventListener('resize', debounce(() => {
    if (state.currentSection && state.charts[state.currentSection]?.resize) {
        state.charts[state.currentSection].resize();
    }
}, 250));

function debounce(func, wait) {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}
