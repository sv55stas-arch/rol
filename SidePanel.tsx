import { mazeTanksContent } from "../content";

export function SidePanel() {
  return (
    <aside className="panel">
      <section>
        <h2>Управление</h2>
        {mazeTanksContent.controls.map((control) => (
          <div key={control.player} className={`card ${control.className}`}>
            <strong>{control.player}</strong>
            {control.lines.map((line) => (
              <div key={line}>{line}</div>
            ))}
          </div>
        ))}
      </section>

      <section>
        <h2>Что изменено</h2>
        <ul>
          {mazeTanksContent.changes.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Если нужно дальше</h2>
        <ul>
          {mazeTanksContent.nextSteps.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
