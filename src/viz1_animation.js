export function setupTimelineSlideIn() {
  // Remove all previous observers on these elements
  const etapes = document.querySelectorAll('#viz-1 .etape');
  console.log("Found etapes:", etapes.length);
  if (etapes.length === 0) return;
  
  // Force initial state reset
  etapes.forEach(etape => {
    etape.classList.remove('active');
    // Force browser reflow
    void etape.offsetWidth;
  });
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        console.log("Entry:", entry.target, "isIntersecting:", entry.isIntersecting);
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    },
    {
      root: null,
      rootMargin: "0px",
      threshold: 0.1
    }
  );
  
  etapes.forEach(etape => observer.observe(etape));
  console.log("Timeline animation setup complete");

  // Make sure viz-1 itself is visible
  document.querySelector('#viz-1')?.classList.add('visible');
}