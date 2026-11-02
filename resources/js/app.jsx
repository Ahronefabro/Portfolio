import '../css/app.css';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

createInertiaApp({
  title: (title) => (title ? `${title} | Ahrone B. Fabro` : 'Ahrone B. Fabro | Portfolio'),

  // "Projects/Edit" -> ./Pages/Projects/Edit.jsx
  resolve: (name) => {
    const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
    return pages[`./Pages/${name}.jsx`];
  },

  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },

  progress: { color: '#c2410c' },
});
