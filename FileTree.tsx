import type { PlannedFile } from "../types/project";

type FileTreeProps = {
  files: PlannedFile[];
};

export function FileTree({ files }: FileTreeProps) {
  return (
    <section className="space-y-4 border border-zinc-800 bg-zinc-900/50 p-6">
      <h2 className="text-xl font-medium text-zinc-100">Planned file structure</h2>
      <ul className="space-y-3">
        {files.map((file) => (
          <li key={file.path} className="grid gap-1 border-b border-zinc-800 pb-3 last:border-b-0 last:pb-0 md:grid-cols-[1.2fr_1fr_auto] md:items-center md:gap-4">
            <code className="text-sm text-zinc-200">{file.path}</code>
            <p className="text-sm text-zinc-400">{file.note}</p>
            <span
              className={`w-fit border px-2 py-1 text-xs uppercase tracking-wide ${
                file.status === "ready"
                  ? "border-emerald-500/50 text-emerald-300"
                  : "border-amber-500/50 text-amber-300"
              }`}
            >
              {file.status}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
