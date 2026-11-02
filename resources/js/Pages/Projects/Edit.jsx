import { useForm } from '@inertiajs/react';
import ProjectForm from '../../Components/ProjectForm';
import AdminLayout from '../../Layouts/AdminLayout';

export default function Edit({ project, categories }) {
  const form = useForm({
    title: project.title,
    categories: project.categories,
    description: project.description,
    tech_stack: project.tech_stack,
    project_url: project.project_url ?? '',
    image: null, // empty = keep the current image
    image_alt: project.image_alt,
    date_completed: project.date_completed,
    display_order: project.display_order,
  });

  // Browsers can't send files with a real PUT request, so this POSTs with _method=put
  // and Laravel treats it as PUT (it still reaches ProjectController@update).
  const submit = () => {
    form.transform((data) => ({ ...data, _method: 'put' }));
    form.post(`/projects/${project.id}`, { forceFormData: true, preserveScroll: true });
  };

  return (
    <AdminLayout title={`Edit "${project.title}"`}>
      <ProjectForm form={form} categories={categories} onSubmit={submit} submitLabel="Save changes" currentImageUrl={project.image_url} />
    </AdminLayout>
  );
}
