import { useEffect, useRef, useState } from 'react';
import FormField, { inputClass } from './FormField';

// Each dot-separated part must be non-empty, so "a@b..com" fails
const emailPattern = /^[^\s@.]+(\.[^\s@.]+)*@[^\s@.]+(\.[^\s@.]+)*\.[^\s@.]{2,}$/;
const empty = { name: '', email: '', message: '' };

function readDraft() {
  try {
    const draft = JSON.parse(localStorage.getItem('contact-draft')) || {};
    return Object.fromEntries(Object.keys(empty).map((k) => [k, typeof draft[k] === 'string' ? draft[k] : '']));
  } catch (err) {
    return empty; // No draft, or one that can't be read: start with an empty form
  }
}

// Front-end-only contact form, plus my unique feature: the draft is autosaved to localStorage
// so a refresh or an accidental tab close doesn't wipe a half-written message.
export default function ContactForm() {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [draftRestored, setDraftRestored] = useState(false);
  const refs = { name: useRef(null), email: useRef(null), message: useRef(null) };

  // On load, put the saved draft back into the fields
  useEffect(() => {
    const draft = readDraft();
    if (Object.values(draft).some(Boolean)) {
      setValues(draft);
      setDraftRestored(true);
    }
  }, []);

  function saveDraft(next) {
    try {
      localStorage.setItem('contact-draft', JSON.stringify(next));
    } catch (err) {
      // Storage blocked: the form still works, the draft just won't be remembered
    }
  }

  function removeDraft() {
    try { localStorage.removeItem('contact-draft'); } catch (err) {}
    setDraftRestored(false);
  }

  function change(field, value) {
    const next = { ...values, [field]: value };
    setValues(next);
    saveDraft(next);
  }

  function clearDraft() {
    setValues(empty);
    removeDraft();
    refs.name.current.focus();
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSuccess('');

    const name = values.name.trim();
    const email = values.email.trim();
    const message = values.message.trim();

    const found = {
      name: name ? '' : 'Please enter your name.',
      email: !email ? 'Please enter your email.'
        : emailPattern.test(email) ? '' : 'Please enter a valid email, like name@example.com.',
      message: message.length >= 10 ? '' : 'Your message should be at least 10 characters.',
    };
    setErrors(found);

    const firstInvalid = Object.keys(found).find((field) => found[field]);
    if (firstInvalid) {
      refs[firstInvalid].current.focus();
      return;
    }

    setSuccess(`Thanks, ${name}! Your message was submitted.`);
    setValues(empty);
    removeDraft();
  }

  const a11y = (field) => ({
    id: field,
    ref: refs[field],
    'aria-invalid': errors[field] ? 'true' : 'false',
    'aria-describedby': `${field}-error`,
  });

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 rounded-xl border border-ink/10 bg-white p-6 dark:border-chalk/10 dark:bg-white/5">
      {draftRestored && (
        <p role="status" className="font-mono text-sm text-ink/70 dark:text-chalk/70">
          Draft restored from your last visit.{' '}
          <button type="button" onClick={clearDraft} className="text-accent underline underline-offset-4 hover:no-underline dark:text-ember">Clear draft</button>
        </p>
      )}
      <FormField id="name" label="Name" error={errors.name}>
        <input {...a11y('name')} name="name" type="text" autoComplete="name" required value={values.name} onChange={(e) => change('name', e.target.value)} className={inputClass} />
      </FormField>
      <FormField id="email" label="Email" error={errors.email}>
        <input {...a11y('email')} name="email" type="email" autoComplete="email" required value={values.email} onChange={(e) => change('email', e.target.value)} className={inputClass} />
      </FormField>
      <FormField id="message" label="Message" error={errors.message}>
        <textarea {...a11y('message')} name="message" rows={5} required value={values.message} onChange={(e) => change('message', e.target.value)} className={inputClass} />
      </FormField>
      <button type="submit" className="w-full rounded-md bg-accent px-6 py-3 font-medium text-white transition hover:bg-ink dark:bg-ember dark:text-night dark:hover:bg-chalk">Send message</button>
      {success && (
        <p role="status" className="rounded-md border border-green-700 bg-green-50 p-4 text-green-800 dark:border-green-400 dark:bg-green-950 dark:text-green-200">{success}</p>
      )}
    </form>
  );
}
