const intakeSteps = [
  "Send chunk 1 from app.txt",
  "I split code by responsibility",
  "I wire imports and clean types",
  "We build after each major batch",
];

export function ChunkInbox() {
  return (
    <section className="space-y-4 border border-zinc-800 bg-zinc-900/50 p-6">
      <h2 className="text-xl font-medium text-zinc-100">Chunk intake</h2>
      <p className="text-zinc-400">
        Paste the next part exactly as-is. I will keep names, logic, and styles, then distribute it across files.
      </p>
      <ol className="space-y-2 text-sm text-zinc-300">
        {intakeSteps.map((step, index) => (
          <li key={step} className="flex items-center gap-3">
            <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center border border-zinc-700 text-xs text-zinc-400">
              {index + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>
    </section>
  );
}
