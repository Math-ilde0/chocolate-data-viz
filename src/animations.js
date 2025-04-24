export function setupChocolateProgressBar() {
    const scrollContainer = document.querySelector('.scroll-pages-container');
    const drop = document.getElementById('choco-drop');
  
    if (!scrollContainer || !drop) return;
  
    scrollContainer.addEventListener('scroll', () => {
      const scrollTop = scrollContainer.scrollTop;
      const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
      const scrollPercent = scrollTop / scrollHeight;
  
      drop.style.transform = `translateY(${scrollPercent * 100}vh)`;
    });
  }
  