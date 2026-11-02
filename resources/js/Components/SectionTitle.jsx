// The "03 / projects" label + big heading used at the top of every section.
export default function SectionTitle({ number, label, title, reveal = true }) {
  return (
    <div data-reveal={reveal ? '' : undefined}>
      <p className="font-mono text-sm text-accent dark:text-ember">{number} / {label}</p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
    </div>
  );
}
