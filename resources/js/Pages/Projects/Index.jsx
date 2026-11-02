import { Link, router } from '@inertiajs/react';
import { useState } from 'react';
import ConfirmDialog from '../../Components/ConfirmDialog';
import { categoryLabels } from '../../Components/ProjectCard';
import AdminLayout from '../../Layouts/AdminLayout';

const btn = 'rounded-md border border-ink/20 px-3 py-1.5 text-sm font-medium hover:border-ink dark:border-chalk/20 dark:hover:border-chalk';

// List of every project, with Edit and Delete for each.
export default function Index({ projects }) {
  const [toDelete, setToDelete] = useState(null); // the project waiting for confirmation
  const [deleting, setDeleting] = useState(false);

  function confirmDelete() {
    router.delete(`/projects/${toDelete.id}`, {
      preserveScroll: true,
      onStart: () => setDeleting(true),
      onFinish: () => { setDeleting(false); setToDelete(null); },
    });
  }

  return (
    <AdminLayout
      title="Projects"
      actions={
        <Link href="/projects/create" className="rounded-md bg-accent px-5 py-3 font-medium text-white transition hover:bg-ink dark:bg-ember dark:text-night dark:hover:bg-chalk">
          + Add project
        </Link>
      }
    >
      {projects.length === 0 ? (
        <p className="rounded-xl border border-dashed border-ink/20 p-10 text-center text-ink/70 dark:border-chalk/20 dark:text-chalk/70">
          No projects yet. <Link href="/projects/create" className="text-accent underline dark:text-ember">Add your first one.</Link>
        </p>
      ) : (
        <ul className="space-y-4">
          {projects.map((project) => (
            <li key={project.id} className="flex flex-col gap-4 rounded-xl border border-ink/10 bg-white p-4 sm:flex-row sm:items-center dark:border-chalk/10 dark:bg-white/5">
              <img src={project.image_url} alt="" className="h-20 w-full rounded-md object-cover object-top sm:w-32" />
              <div className="min-w-0 flex-1">
                <p className="font-mono text-xs uppercase tracking-wider text-accent dark:text-ember">
                  #{project.display_order} · {project.categories.map((c) => categoryLabels[c] ?? c).join(' · ')}
                </p>
                <h2 className="mt-1 text-lg font-bold">{project.title}</h2>
                <p className="truncate text-sm text-ink/70 dark:text-chalk/70">{project.description}</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/projects/${project.id}/edit`} className={btn}>Edit<span className="sr-only"> {project.title}</span></Link>
                <button type="button" onClick={() => setToDelete(project)} className={`${btn} text-red-700 hover:border-red-700 dark:text-red-400 dark:hover:border-red-400`}>
                  Delete<span className="sr-only"> {project.title}</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={toDelete !== null}
        title="Delete this project?"
        message={toDelete ? `"${toDelete.title}" and its image will be removed from your portfolio. This cannot be undone.` : ''}
        processing={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </AdminLayout>
  );
}
