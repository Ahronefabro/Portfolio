export const categoryLabels = { web: 'Web', mobile: 'Mobile app', design: 'Design', school: 'School' };

const formatDate = (value) =>
  new Date(`${value}T00:00:00`).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

// One project on the public portfolio. `reveal` = fade in on scroll; otherwise it animates in after a filter click.
export default function ProjectCard({ project, reveal, delay = 0 }) {
  const tools = project.tech_stack.split(',').map((tool) => tool.trim()).filter(Boolean);

  return (
    <article
      data-reveal={reveal ? '' : undefined}
      style={{ '--d': `${delay}ms` }}
      className={`group flex flex-col overflow-hidden rounded-xl border border-ink/10 bg-white hover:-translate-y-1.5 hover:shadow-[6px_6px_0_0_var(--color-ink)] dark:border-chalk/10 dark:bg-white/5 dark:hover:shadow-[6px_6px_0_0_var(--color-ember)] ${reveal ? '' : 'filter-in'}`}
    >
      <div className="relative flex h-48 items-end overflow-hidden bg-ink p-5 dark:bg-chalk/10">
        <img
          src={project.image_url}
          alt={project.image_alt}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 size-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute inset-0 bg-linear-to-t from-ink/85 via-ink/20 to-transparent" aria-hidden="true" />
        <span className="relative font-mono text-5xl font-semibold text-paper transition-transform duration-500 group-hover:translate-x-3" aria-hidden="true">
          {String(project.display_order).padStart(2, '0')}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="font-mono text-xs uppercase tracking-wider text-accent dark:text-ember">
          {project.categories.map((c) => categoryLabels[c] ?? c).join(' · ')}
        </p>
        <h3 className="mt-2 text-xl font-bold">{project.title}</h3>
        <p className="mt-3 flex-1 text-ink/75 dark:text-chalk/75">{project.description}</p>

        <ul className="mt-4 flex flex-wrap gap-2 font-mono text-xs" aria-label="Tools used">
          {tools.map((tool) => (
            <li key={tool} className="rounded border border-ink/20 px-2 py-1 dark:border-chalk/20">{tool}</li>
          ))}
        </ul>

        <div className="mt-4 flex items-center justify-between font-mono text-xs text-ink/70 dark:text-chalk/70">
          <span>Completed {formatDate(project.date_completed)}</span>
          {project.project_url && (
            <a href={project.project_url} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-4 hover:no-underline dark:text-ember">
              View project<span className="sr-only"> {project.title} (opens in a new tab)</span> ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
