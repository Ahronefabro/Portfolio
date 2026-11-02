import { Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import FormField, { inputClass } from './FormField';
import { categoryLabels } from './ProjectCard';

// The project form used by both Create and Edit.
// `form` is the object from Inertia's useForm(); it keeps the typed values when validation fails.
export default function ProjectForm({ form, categories, onSubmit, submitLabel, currentImageUrl = null }) {
  const { data, setData, errors, processing } = form;
  const [preview, setPreview] = useState(null);
  const formRef = useRef(null);

  // After a failed save, jump to the first problem: the submit button is far below the top fields.
  // Centered because a plain focus() can leave the field hidden behind the sticky header.
  useEffect(() => {
    const firstInvalid = formRef.current.querySelector('[aria-invalid="true"]');
    if (!firstInvalid) return;
    firstInvalid.focus({ preventScroll: true });
    firstInvalid.scrollIntoView({ block: 'center' });
  }, [errors]);

  // Show a preview of a newly picked image
  useEffect(() => {
    if (!(data.image instanceof File)) return setPreview(null);
    const url = URL.createObjectURL(data.image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [data.image]);

  function toggleCategory(category) {
    setData('categories', data.categories.includes(category)
      ? data.categories.filter((c) => c !== category)
      : [...data.categories, category]);
  }

  // Laravel reports problems with one checkbox as "categories.0", "categories.1", ...
  const categoryError = errors.categories
    ?? Object.entries(errors).find(([key]) => key.startsWith('categories.'))?.[1];

  // Shared props that connect each input to its error message
  const a11y = (field) => ({
    id: field,
    'aria-invalid': errors[field] ? 'true' : 'false',
    'aria-describedby': `${field}-error`,
  });

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit();
  }

  return (
    // noValidate: let Laravel do the checking so its error messages are the ones shown
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-5 rounded-xl border border-ink/10 bg-white p-6 dark:border-chalk/10 dark:bg-white/5">
      <FormField id="title" label="Title" error={errors.title}>
        <input {...a11y('title')} type="text" value={data.title} onChange={(e) => setData('title', e.target.value)} className={inputClass} />
      </FormField>

      <fieldset aria-describedby="categories-error">
        <legend className="font-medium">Categories</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center gap-2 rounded-full border border-ink/20 px-4 py-2 text-sm has-checked:border-ink has-checked:bg-ink has-checked:text-paper dark:border-chalk/20 dark:has-checked:border-chalk dark:has-checked:bg-chalk dark:has-checked:text-night">
              <input type="checkbox" aria-invalid={categoryError ? 'true' : 'false'} checked={data.categories.includes(category)} onChange={() => toggleCategory(category)} className="accent-accent" />
              {categoryLabels[category] ?? category}
            </label>
          ))}
        </div>
        <p id="categories-error" className="mt-1 text-sm text-red-700 dark:text-red-400">{categoryError}</p>
      </fieldset>

      <FormField id="description" label="Description" error={errors.description} hint={`${data.description.length} / 300 characters`}>
        <textarea {...a11y('description')} rows={4} value={data.description} onChange={(e) => setData('description', e.target.value)} className={inputClass} />
      </FormField>

      <FormField id="tech_stack" label="Tools used" error={errors.tech_stack} hint="Separate with commas, e.g. Figma, Flutter">
        <input {...a11y('tech_stack')} type="text" value={data.tech_stack} onChange={(e) => setData('tech_stack', e.target.value)} className={inputClass} />
      </FormField>

      <FormField id="project_url" label="Project link" optional error={errors.project_url}>
        <input {...a11y('project_url')} type="url" placeholder="https://" value={data.project_url ?? ''} onChange={(e) => setData('project_url', e.target.value)} className={inputClass} />
      </FormField>

      <FormField id="image" label="Cover image" optional={Boolean(currentImageUrl)} error={errors.image}
        hint={currentImageUrl ? 'JPG, PNG or WEBP, up to 2 MB. Leave empty to keep the current image.' : 'JPG, PNG or WEBP, up to 2 MB.'}>
        <input {...a11y('image')} type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setData('image', e.target.files[0] ?? null)}
          className={`${inputClass} file:mr-4 file:rounded file:border-0 file:bg-ink file:px-3 file:py-1 file:text-paper dark:file:bg-chalk dark:file:text-night`} />
        {(preview || currentImageUrl) && (
          <img src={preview ?? currentImageUrl} alt={preview ? 'Preview of the new image' : 'Current image'} className="mt-3 h-32 rounded-md border border-ink/10 object-cover dark:border-chalk/10" />
        )}
      </FormField>

      <FormField id="image_alt" label="Image description (alt text)" error={errors.image_alt} hint="What the image shows, for visitors using a screen reader.">
        <input {...a11y('image_alt')} type="text" value={data.image_alt} onChange={(e) => setData('image_alt', e.target.value)} className={inputClass} />
      </FormField>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="date_completed" label="Date completed" error={errors.date_completed}>
          <input {...a11y('date_completed')} type="date" value={data.date_completed} onChange={(e) => setData('date_completed', e.target.value)} className={inputClass} />
        </FormField>
        <FormField id="display_order" label="Display order" error={errors.display_order} hint="1 shows first.">
          <input {...a11y('display_order')} type="number" value={data.display_order} onChange={(e) => setData('display_order', e.target.value)} className={inputClass} />
        </FormField>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button type="submit" disabled={processing} className="rounded-md bg-accent px-6 py-3 font-medium text-white transition hover:bg-ink disabled:opacity-60 dark:bg-ember dark:text-night dark:hover:bg-chalk">
          {processing ? 'Saving…' : submitLabel}
        </button>
        <Link href="/projects" className="rounded-md border border-ink/20 px-6 py-3 font-medium hover:border-ink dark:border-chalk/20 dark:hover:border-chalk">Cancel</Link>
      </div>
    </form>
  );
}
