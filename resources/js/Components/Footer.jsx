export default function Footer() {
  return (
    <footer className="border-t border-ink/10 dark:border-chalk/10">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 font-mono text-xs text-ink/70 sm:flex-row sm:justify-between dark:text-chalk/70">
        <p>© 2026 Ahrone B. Fabro · Built with Laravel, Inertia, React &amp; Tailwind CSS</p>
        <p>Fonts: Space Grotesk &amp; JetBrains Mono (Google Fonts)</p>
      </div>
    </footer>
  );
}
