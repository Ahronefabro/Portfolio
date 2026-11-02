import { Head, Link, useForm } from '@inertiajs/react';
import FormField, { inputClass } from '../Components/FormField';

// Login for the project management pages. There is no sign-up: the account is made with "php artisan admin:create".
export default function Login() {
  const { data, setData, post, errors, processing } = useForm({ email: '', password: '' });

  function handleSubmit(e) {
    e.preventDefault();
    post('/login', { onError: () => setData('password', '') });
  }

  const a11y = (field) => ({
    id: field,
    'aria-invalid': errors[field] ? 'true' : 'false',
    'aria-describedby': `${field}-error`,
  });

  return (
    <>
      <Head title="Log in" />
      <main id="main" className="mx-auto max-w-md px-5 py-20">
        <p className="font-mono text-sm text-accent dark:text-ember">// manage</p>
        <h1 className="mt-2 mb-8 text-3xl font-bold tracking-tight sm:text-4xl">Log in</h1>

        <form onSubmit={handleSubmit} noValidate className="space-y-5 rounded-xl border border-ink/10 bg-white p-6 dark:border-chalk/10 dark:bg-white/5">
          <FormField id="email" label="Email" error={errors.email}>
            <input {...a11y('email')} type="email" autoComplete="username" autoFocus value={data.email} onChange={(e) => setData('email', e.target.value)} className={inputClass} />
          </FormField>
          <FormField id="password" label="Password" error={errors.password}>
            <input {...a11y('password')} type="password" autoComplete="current-password" value={data.password} onChange={(e) => setData('password', e.target.value)} className={inputClass} />
          </FormField>
          <button type="submit" disabled={processing} className="w-full rounded-md bg-accent px-6 py-3 font-medium text-white transition hover:bg-ink disabled:opacity-60 dark:bg-ember dark:text-night dark:hover:bg-chalk">
            {processing ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <p className="mt-6 text-sm"><Link href="/" className="underline underline-offset-4 hover:text-accent dark:hover:text-ember">Back to the portfolio</Link></p>
      </main>
    </>
  );
}
