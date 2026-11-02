import { useEffect, useRef } from 'react';

// Thin bar across the top that fills as you scroll down the page.
export default function ScrollProgress() {
  const barRef = useRef(null);

  useEffect(() => {
    function update() {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      barRef.current.style.transform = `scaleX(${progress})`;
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div
      ref={barRef}
      className="fixed left-0 top-0 z-50 h-1 w-full origin-left bg-accent dark:bg-ember"
      style={{ transform: 'scaleX(0)' }}
      aria-hidden="true"
    />
  );
}
