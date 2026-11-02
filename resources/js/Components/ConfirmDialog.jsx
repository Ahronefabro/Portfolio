import { useEffect, useRef } from 'react';

// "Are you sure?" pop-up shown before a record is deleted.
// Uses the native <dialog> element, so Escape and focus trapping work for free.
export default function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', processing = false, onConfirm, onCancel }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onCancel={(e) => { e.preventDefault(); onCancel(); }}
      aria-labelledby="confirm-title"
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-xl border border-ink/15 bg-paper p-6 text-ink shadow-[6px_6px_0_0_var(--color-ink)] backdrop:bg-ink/60 dark:border-chalk/15 dark:bg-night dark:text-chalk dark:shadow-[6px_6px_0_0_var(--color-ember)]"
    >
      <h2 id="confirm-title" className="text-xl font-bold">{title}</h2>
      <p className="mt-3 text-ink/75 dark:text-chalk/75">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" onClick={onCancel} autoFocus className="rounded-md border border-ink/20 px-4 py-2 font-medium hover:border-ink dark:border-chalk/20 dark:hover:border-chalk">
          Cancel
        </button>
        <button type="button" onClick={onConfirm} disabled={processing} className="rounded-md bg-red-700 px-4 py-2 font-medium text-white hover:bg-red-800 disabled:opacity-60 dark:bg-red-500 dark:text-night dark:hover:bg-red-400">
          {processing ? 'Deleting…' : confirmLabel}
        </button>
      </div>
    </dialog>
  );
}
