import { mazeTanksContent } from "../content";

export function TopBar() {
  return (
    <div className="topbar">
      <div>
        <h1>{mazeTanksContent.title}</h1>
        <p className="subtitle">{mazeTanksContent.subtitle}</p>
        <div className="status" id="status">
          Загрузка...
        </div>
      </div>
      <div className="buttons">
        <button id="restartBtn" type="button">
          Новый матч
        </button>
        <button id="roundBtn" type="button">
          Новый раунд
        </button>
      </div>
    </div>
  );
}
