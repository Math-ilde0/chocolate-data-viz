export function setupConsommationChart3D() {
    console.log("Application de l'effet 3D...");
    
    // Attendre plus longtemps pour s'assurer que le graphique est chargé
    setTimeout(() => {
      const vizElement = document.querySelector('#viz-4');
      
      if (!vizElement) {
        console.error("Élément #viz-4 introuvable dans le DOM");
        return;
      }
      
      console.log("Élément #viz-4 trouvé, application de l'effet 3D");
      
      try {
        // Ajouter un cadre autour sans transformer le contenu
        const frame = document.createElement('div');
        frame.className = 'chocolate-frame';
        frame.style.position = 'absolute';
        frame.style.top = '-2px';
        frame.style.left = '-2px';
        frame.style.right = '-2px';
        frame.style.bottom = '-2px';
        frame.style.border = '6px solid #5c3d2e';
        frame.style.borderRadius = '12px';
        frame.style.boxShadow = 'inset 0 0 10px rgba(92, 61, 46, 0.3)';
        frame.style.pointerEvents = 'none';
        frame.style.zIndex = '3';
        
        // Ajouter une ombre portée sans perspective
        const shadow = document.createElement('div');
        shadow.className = 'chocolate-shadow';
        shadow.style.position = 'absolute';
        shadow.style.bottom = '-25px';
        shadow.style.left = '10%';
        shadow.style.width = '80%';
        shadow.style.height = '20px';
        shadow.style.background = 'rgba(92, 61, 46, 0.3)';
        shadow.style.filter = 'blur(10px)';
        shadow.style.borderRadius = '50%';
        shadow.style.zIndex = '1';
        shadow.style.pointerEvents = 'none';
        
        // Ajouter les éléments au vizElement sans modifier sa structure
        vizElement.style.position = 'relative';
        vizElement.style.borderRadius = '8px';
        vizElement.style.overflow = 'hidden';
        vizElement.appendChild(frame);
        vizElement.appendChild(shadow);
        
        // Simple effet d'élévation au survol (sans rotation 3D)
        vizElement.addEventListener('mouseenter', () => {
          vizElement.style.transition = 'transform 0.3s ease-out, box-shadow 0.3s ease-out';
          vizElement.style.transform = 'translateY(-5px)';
          vizElement.style.boxShadow = '0 8px 15px rgba(92, 61, 46, 0.2)';
          shadow.style.opacity = '0.4';
        });
        
        vizElement.addEventListener('mouseleave', () => {
          vizElement.style.transform = 'translateY(0)';
          vizElement.style.boxShadow = 'none';
          shadow.style.opacity = '0.25';
        });
        
        console.log("Effet 3D appliqué avec succès");
      } catch (err) {
        console.error("Erreur lors de l'application de l'effet 3D:", err);
      }
    }, 3000); // Augmenter le délai à 3 secondes
  }