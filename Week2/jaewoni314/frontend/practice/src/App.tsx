import { useState } from "react";
import FirstScreen from "./practices/01-first-screen";
import MovieInfoCard from "./practices/02-movie-info-card";
import ComponentTree from "./practices/03-component-tree";
import MovieCardPropsPractice from "./practices/04-movie-card-props";
import MovieList from "./practices/05-movie-list";
import CounterLimit from "./practices/06-counter-limit";
import BookmarkState from "./practices/07-bookmark-state";
import StudyModePractice from "./practices/08-study-mode-context";

const practices = [
  { id: 1, title: "1. 첫 화면 바꾸기", Component: FirstScreen },
  { id: 2, title: "2. 영화 정보 카드", Component: MovieInfoCard },
  { id: 3, title: "3. 컴포넌트로 나누기", Component: ComponentTree },
  { id: 4, title: "4. 영화 카드 재사용", Component: MovieCardPropsPractice },
  { id: 5, title: "5. 영화 목록 렌더링", Component: MovieList },
  { id: 6, title: "6. 카운터 제한", Component: CounterLimit },
  { id: 7, title: "7. 북마크 상태 분리", Component: BookmarkState },
  { id: 8, title: "8. 학습 모드 Context", Component: StudyModePractice },
];

export default function App() {
  const [selectedId, setSelectedId] = useState(practices[practices.length - 1].id);
  const selected = practices.find((practice) => practice.id === selectedId) ?? practices[0];

  return (
    <>
      <nav>
        {practices.map((practice) => (
          <button
            key={practice.id}
            type="button"
            aria-pressed={practice.id === selectedId}
            onClick={() => setSelectedId(practice.id)}
          >
            {practice.title}
          </button>
        ))}
      </nav>
      <hr />
      <selected.Component />
    </>
  );
}
