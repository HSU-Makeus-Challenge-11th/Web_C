// 카드 크기는 목록 화면 한 곳에서만 쓰는 간단한 값이라 Web Storage를 직접 사용해요.
const CARD_SIZE_STORAGE_KEY = "umcine-card-size";

export const CARD_SIZES = ["large", "small"] as const;
export type CardSize = (typeof CARD_SIZES)[number];

function isCardSize(value: unknown): value is CardSize {
  return CARD_SIZES.includes(value as CardSize);
}

export function readCardSize(): CardSize {
  const storedValue = localStorage.getItem(CARD_SIZE_STORAGE_KEY);
  // 저장값이 없거나 개발자 도구에서 잘못 바뀌었으면 기본값을 사용해요.
  return isCardSize(storedValue) ? storedValue : "large";
}

export function saveCardSize(cardSize: CardSize) {
  localStorage.setItem(CARD_SIZE_STORAGE_KEY, cardSize);
}
