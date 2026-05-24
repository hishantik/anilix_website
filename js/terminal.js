/**
 * Terminal Demo Animation
 * Typewriter effect triggered by scroll
 */
export function initTerminal() {
  const terminalBody = document.getElementById('terminal-body');
  if (!terminalBody) return;

  const terminalLines = terminalBody.querySelectorAll('.terminal-line');

  ScrollTrigger.create({
    trigger: '.terminal-wrapper',
    start: 'top 70%',
    once: true,
    onEnter: () => {
      terminalLines.forEach((line) => {
        const delay = parseInt(line.dataset.delay) || 0;
        setTimeout(() => {
          line.classList.add('visible');
        }, delay);
      });
    }
  });
}
