import { createContext, useContext, useState } from "react";

type StudyMode = "focus" | "break";

const StudyModeContext = createContext<StudyMode>("focus");

function StudyModeStatus() {
  const mode = useContext(StudyModeContext);

  return (
    <p>현재 모드: {mode === "focus" ? "집중 모드" : "휴식 모드"}</p>
  );
}

function StudyPanel() {
  return (
    <section>
      <h2>학습 패널</h2>
      <StudyModeStatus />
    </section>
  );
}

export default function StudyModePractice() {
  const [mode, setMode] = useState<StudyMode>("focus");

  function handleToggleMode() {
    setMode((currentMode) =>
      currentMode === "focus" ? "break" : "focus",
    );
  }

  return (
    <StudyModeContext value={mode}>
      <main>
        <h1>학습 모드</h1>
        <StudyPanel />
        <button type="button" onClick={handleToggleMode}>
          모드 바꾸기
        </button>
      </main>
    </StudyModeContext>
  );
}
