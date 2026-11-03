import { useForm } from '@inertiajs/react';
import ProjectForm from '../../Components/ProjectForm';
import AdminLayout from '../../Layouts/AdminLayout';

export default function Create({ categories, nextOrder }) {
  const form = useForm({
    title: '',
    categories: [],
    description: '',
    tech_stack: '',
    project_url: '',
    image: null,
    image_alt: '',
    date_completed: '',
    display_order: nextOrder,
    repository_url: '', // Added repository_url to the form state
  });

  // forceFormData: send as multipart so the image file is included
  const submit = () => form.post('/projects', { forceFormData: true, preserveScroll: true });

  return (
    <AdminLayout title="Add project">
      <ProjectForm form={form} categories={categories} onSubmit={submit} submitLabel="Save project" />
    </AdminLayout>
  );
}
