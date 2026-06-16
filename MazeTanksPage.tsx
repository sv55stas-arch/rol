import { useEffect } from "react";
import { GameArea } from "./components/GameArea";
import { SidePanel } from "./components/SidePanel";
import { TopBar } from "./components/TopBar";
import { initMazeTanks } from "./runtime/initMazeTanks";
import "./mazeTanks.css";

export function MazeTanksPage() {
  useEffect(() => {
    const app = initMazeTanks();
    return () => {
      app.destroy();
    };
  }, []);

  return (
    <div className="maze-tanks-app">
      <div className="page">
        <TopBar />

        <div className="layout">
          <GameArea />
          <SidePanel />
        </div>
      </div>
    </div>
  );
}
