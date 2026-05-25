/**
 * Terminal Demo — video autoplay on scroll
 */
export function initTerminal() {
  const video = document.getElementById('demo-video');
  if (!video) return;

  // Attempt autoplay immediately in case already in view
  video.play().catch(() => {});

  // Use IntersectionObserver as fallback for scroll-triggered play
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        video.play().catch(() => {});
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(video);
}
