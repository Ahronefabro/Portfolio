import { useState } from 'react';
import ProjectCard from './ProjectCard';
import SectionTitle from './SectionTitle';

const filters = ['all', 'web', 'mobile', 'design', 'school'];
const filterBtnClass = 'rounded-full border border-ink/20 px-4 py-2 text-sm capitalize transition aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-paper dark:border-chalk/20 dark:aria-pressed:border-chalk dark:aria-pressed:bg-chalk dark:aria-pressed:text-night';

// "Things I've built": the filter buttons and the project cards from the database.
export default function ProjectsSection({ projects }) {
  const [filter, setFilter] = useState('all');
  const [hasFiltered, setHasFiltered] = useState(false);

  const visible = filter === 'all' ? projects : projects.filter((p) => p.categories.includes(filter));

  function choose(value) {
    setFilter(value);
    setHasFiltered(true);
  }

  const status = visible.length === 0
    ? (filter === 'all' ? 'No projects yet.' : `No ${filter} projects yet.`)
    : `Showing ${visible.length} ${filter === 'all' ? '' : filter + ' '}project${visible.length === 1 ? '' : 's'}.`;

  return (
    <section id="projects" className="scroll-mt-20 border-b border-ink/10 dark:border-chalk/10">
      <div className="mx-auto max-w-6xl px-5 py-24">
        <SectionTitle number="03" label="projects" title="Things I've built" />

        <div data-reveal="" className="mt-8 flex flex-wrap gap-2" role="group" aria-label="Filter projects by category">
          {filters.map((value) => (
            <button key={value} type="button" onClick={() => choose(value)} aria-pressed={filter === value} className={filterBtnClass}>
              {value}
            </button>
          ))}
        </div>
        <p aria-live="polite" className="mt-4 font-mono text-sm text-ink/70 dark:text-chalk/70">{status}</p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((project, i) => (
            // A new key after each filter click re-mounts the card so its entrance animation plays again
            <ProjectCard
              key={hasFiltered ? `${filter}-${project.id}` : project.id}
              project={project}
              reveal={!hasFiltered}
              delay={i * 120}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
