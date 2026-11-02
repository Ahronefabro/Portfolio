export const inputClass =
  'mt-2 w-full rounded-md border border-ink/20 bg-paper px-4 py-3 aria-[invalid=true]:border-red-700 dark:border-chalk/20 dark:bg-night dark:aria-[invalid=true]:border-red-400';

// A label, the input passed in as children, an optional hint, and the error message under it.
// The input should use id={id}, aria-invalid={!!error} and aria-describedby={`${id}-error`}.
export default function FormField({ id, label, error, hint, optional = false, children }) {
  return (
    <div>
      <label htmlFor={id} className="font-medium">
        {label} {optional && <span className="font-normal text-ink/60 dark:text-chalk/60">(optional)</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-sm text-ink/60 dark:text-chalk/60">{hint}</p>}
      <p id={`${id}-error`} className="mt-1 text-sm text-red-700 dark:text-red-400">{error}</p>
    </div>
  );
}
