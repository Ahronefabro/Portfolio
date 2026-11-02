import { useEffect } from 'react';

// Fades [data-reveal] elements up the first time they scroll into view.
// Pass deps so newly rendered elements (e.g. project cards) are picked up too.
export default function useScrollReveal(deps = []) {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.setAttribute('data-revealed', '');
          observer.unobserve(entry.target); // animate only once
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('[data-reveal]:not([data-revealed])').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
}
