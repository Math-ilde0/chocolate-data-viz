/**
 * Gestion dynamique des chemins pour le déploiement GitHub Pages
 * Ce fichier résout les problèmes de chemin relatif en détectant 
 * l'environnement de déploiement
 */

// Détecte si nous sommes sur GitHub Pages
const isGitHubPages = window.location.hostname.includes('github.io');

// Récupère le chemin de base pour les imports
export function getBasePath() {
  if (isGitHubPages) {
    // Sur GitHub Pages, le chemin de base est '/chocolate-data-viz/'
    return '/chocolate-data-viz';
  }
  // En développement local, le chemin de base est vide
  return '';
}

// Fonction pour construire un chemin correct avec le chemin de base
export function buildPath(path) {
  const basePath = getBasePath();
  
  // Si le chemin commence déjà par '/', on enlève ce slash
  const cleanPath = path.startsWith('./') ? path.substring(2) : 
                    path.startsWith('/') ? path.substring(1) : path;
  
  return `${basePath}/${cleanPath}`;
}

// Fonction pour charger un fichier CSV avec le chemin correct
export async function loadCSV(csvPath) {
  try {
    const fullPath = buildPath(csvPath);
    console.log(`Tentative de chargement du CSV depuis: ${fullPath}`);
    return await d3.csv(fullPath);
  } catch (error) {
    console.error(`Erreur lors du chargement du CSV: ${csvPath}`, error);
    throw error;
  }
}