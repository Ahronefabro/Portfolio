import { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';

const linkClass = 'hover:text-accent aria-[current=true]:font-semibold aria-[current=true]:text-accent dark:hover:text-ember dark:aria-[current=true]:text-ember';

// Sticky top bar: logo, section links (highlighted while you scroll), theme toggle, mobile menu.
export default function Navbar({ links }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState(null);

  // Close the mobile menu with Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Highlight the link of the section in the middle of the screen
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur dark:border-chalk/10 dark:bg-night/90">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4" aria-label="Main">
        <a href="#home" className="font-mono text-sm font-semibold">My<span className="text-accent dark:text-ember"> Portfolio</span></a>

        <ul className="hidden gap-8 text-sm md:flex">
          {links.map((link) => (
            <li key={link.id}>
              <a href={`#${link.id}`} aria-current={active === link.id ? 'true' : undefined} className={linkClass}>{link.label}</a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-controls="mobile-menu"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="grid size-10 place-items-center rounded-md border border-ink/15 text-lg md:hidden dark:border-chalk/15"
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      <div id="mobile-menu" hidden={!menuOpen} className="border-t border-ink/10 md:hidden dark:border-chalk/10">
        <ul className="flex flex-col px-5 py-2 text-base">
          {links.map((link) => (
            <li key={link.id}>
              <a href={`#${link.id}`} onClick={() => setMenuOpen(false)} className="block py-3">{link.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
