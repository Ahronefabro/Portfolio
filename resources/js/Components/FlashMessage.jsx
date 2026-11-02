import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

// Shows the controller's ->with('success', ...) message after create, update and delete.
export default function FlashMessage() {
  const { flash } = usePage().props;
  const [visible, setVisible] = useState(Boolean(flash.success));

  // Show it again whenever a new message arrives
  useEffect(() => { setVisible(Boolean(flash.success)); }, [flash]);

  if (!visible) return null;

  return (
    <div role="status" className="mb-6 flex items-start justify-between gap-4 rounded-md border border-green-700 bg-green-50 p-4 text-green-800 dark:border-green-400 dark:bg-green-950 dark:text-green-200">
      <p>{flash.success}</p>
      <button type="button" onClick={() => setVisible(false)} aria-label="Dismiss message" className="font-mono">✕</button>
    </div>
  );
}
