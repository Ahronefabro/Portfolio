import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function saveTheme(value) {
  try {
    localStorage.setItem('theme', value);
  } catch (err) {
    // Storage blocked: the theme still switches, it just won't be remembered
  }
}

// Dark / light switch. The starting theme is set in app.blade.php before the page paints.
export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));
  const btnRef = useRef(null);

  function applyTheme(dark) {
    document.documentElement.classList.toggle('dark', dark);
    setIsDark(dark);
  }

  function toggle() {
    const goDark = !isDark;
    saveTheme(goDark ? 'dark' : 'light');

    // Instant switch if the browser has no View Transitions or the user prefers less motion
    if (!document.startViewTransition || reduceMotion()) {
      applyTheme(goDark);
      return;
    }

    // Circle reveal that grows out of the toggle button
    const rect = btnRef.current.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    const transition = document.startViewTransition(() => flushSync(() => applyTheme(goDark)));
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 650, easing: 'cubic-bezier(.65, 0, .35, 1)', pseudoElement: '::view-transition-new(root)' },
      );
    }).catch(() => {});
  }

  // If the visitor never picked a theme, follow their device setting live
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    function onChange(event) {
      let saved = null;
      try { saved = localStorage.getItem('theme'); } catch (err) {}
      if (!saved) applyTheme(event.matches);
    }
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="grid size-10 place-items-center rounded-md border border-ink/15 text-lg hover:border-ink dark:border-chalk/15 dark:hover:border-chalk"
    >
      {isDark ? '☀' : '☾'}
    </button>
  );
}
