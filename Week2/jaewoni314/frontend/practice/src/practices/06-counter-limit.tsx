import { useState } from "react";

const MIN_COUNT = 0;
const MAX_COUNT = 5;

export default function CounterLimit() {
  const [count, setCount] = useState(0);

  return (
    <main>
      <h1>카운터</h1>
      <p>현재 값: {count}</p>
      <button
        onClick={() => setCount((current) => Math.min(current + 1, MAX_COUNT))}
        disabled={count === MAX_COUNT}
      >
        +1
      </button>
      <button
        onClick={() => setCount((current) => Math.max(current - 1, MIN_COUNT))}
        disabled={count === MIN_COUNT}
      >
        -1
      </button>
      <button onClick={() => setCount(MIN_COUNT)}>초기화</button>
    </main>
  );
}
