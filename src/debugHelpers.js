/**
 * Utilitaire de débogage pour aider avec les problèmes de chargement
 */

export function initDebugHelper() {
    const debugContainer = document.createElement('div');
    debugContainer.id = 'debug-helper';
    
    // Styles pour le conteneur
    debugContainer.style.position = 'fixed';
    debugContainer.style.bottom = '10px';
    debugContainer.style.right = '10px';
    debugContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    debugContainer.style.color = '#fff';
    debugContainer.style.padding = '10px';
    debugContainer.style.borderRadius = '5px';
    debugContainer.style.fontSize = '12px';
    debugContainer.style.fontFamily = 'monospace';
    debugContainer.style.zIndex = '9999';
    debugContainer.style.maxWidth = '400px';
    debugContainer.style.maxHeight = '200px';
    debugContainer.style.overflow = 'auto';
    
    // Ajouter un bouton pour masquer/afficher
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Debug';
    toggleButton.style.position = 'fixed';
    toggleButton.style.bottom = '10px';
    toggleButton.style.right = '10px';
    toggleButton.style.backgroundColor = '#5c3d2e';
    toggleButton.style.color = '#fff';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '5px';
    toggleButton.style.padding = '5px 10px';
    toggleButton.style.zIndex = '10000';
    
    let isVisible = false;
    debugContainer.style.display = 'none';
    
    toggleButton.addEventListener('click', () => {
      isVisible = !isVisible;
      debugContainer.style.display = isVisible ? 'block' : 'none';
      toggleButton.textContent = isVisible ? 'Cacher' : 'Debug';
    });
    
    document.body.appendChild(toggleButton);
    document.body.appendChild(debugContainer);
    
    // Fonction pour ajouter des infos de débogage
    function logDebug(message) {
      const logItem = document.createElement('div');
      logItem.textContent = message;
      logItem.style.borderBottom = '1px solid rgba(255, 255, 255, 0.2)';
      logItem.style.paddingBottom = '5px';
      logItem.style.marginBottom = '5px';
      debugContainer.appendChild(logItem);
      
      // Auto-scroll vers le bas
      debugContainer.scrollTop = debugContainer.scrollHeight;
      
      // Limiter le nombre d'éléments
      if (debugContainer.children.length > 20) {
        debugContainer.removeChild(debugContainer.firstChild);
      }
    }
    
    // Afficher des informations basiques
    const baseUrl = window.location.origin + window.location.pathname;
    const isGitHubPages = window.location.hostname.includes('github.io');
    const basePath = isGitHubPages ? '/chocolate-data-viz' : '';
    
    logDebug(`URL: ${baseUrl}`);
    logDebug(`Est sur GitHub Pages: ${isGitHubPages}`);
    logDebug(`Chemin de base: ${basePath}`);
    
    // Intercepter les erreurs pour les afficher dans notre conteneur
    const originalConsoleError = console.error;
    console.error = function() {
      // Appeler la fonction originale
      originalConsoleError.apply(console, arguments);
      
      // Ajouter au notre débug
      const errorMsg = Array.from(arguments).join(' ');
      logDebug(`ERREUR: ${errorMsg}`);
    };
    
    // Intercepter aussi les avertissements
    const originalConsoleWarn = console.warn;
    console.warn = function() {
      // Appeler la fonction originale
      originalConsoleWarn.apply(console, arguments);
      
      // Ajouter au notre débug
      const warnMsg = Array.from(arguments).join(' ');
      logDebug(`AVERTISSEMENT: ${warnMsg}`);
    };
    
    // Renvoyer la fonction logDebug pour l'utiliser ailleurs
    return logDebug;
  }