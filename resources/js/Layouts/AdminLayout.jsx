import { Head, Link } from '@inertiajs/react';
import FlashMessage from '../Components/FlashMessage';
import ThemeToggle from '../Components/ThemeToggle';

// Frame around the project management pages: top bar, page heading, success message.
export default function AdminLayout({ title, actions = null, children }) {
  return (
    <>
      <Head title={title} />
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-white">Skip to content</a>
      <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur dark:border-chalk/10 dark:bg-night/90">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4" aria-label="Main">
          <Link href="/" className="font-mono text-sm font-semibold">My<span className="text-accent dark:text-ember"> Portfolio</span></Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/projects" className="hover:text-accent dark:hover:text-ember">Projects</Link>
            <Link href="/#projects" className="hover:text-accent dark:hover:text-ember">View site</Link>
            <Link href="/logout" method="post" as="button" className="hover:text-accent dark:hover:text-ember">Log out</Link>
            <ThemeToggle />
          </div>
        </nav>
      </header>

      <main id="main" className="mx-auto max-w-5xl px-5 py-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-sm text-accent dark:text-ember">// manage</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
          </div>
          {actions}
        </div>
        <FlashMessage />
        {children}
      </main>
    </>
  );
}
