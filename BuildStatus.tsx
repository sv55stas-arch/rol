const checks = [
  "Base Vite + React + Tailwind app is running",
  "Migration folder structure is drafted",
  "Ready to map incoming app.txt chunks",
];

export function BuildStatus() {
  return (
    <section className="space-y-4 border border-zinc-800 bg-zinc-900/50 p-6">
      <h2 className="text-xl font-medium text-zinc-100">Status</h2>
      <ul className="space-y-3 text-sm text-zinc-300">
        {checks.map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400" />
            {item}
          </li>
        ))}
      </ul>
      <p className="text-sm text-zinc-500">Next action: send part 1 of app.txt.</p>
    </section>
  );
}
