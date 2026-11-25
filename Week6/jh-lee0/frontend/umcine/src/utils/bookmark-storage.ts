// 로컬 스토리지에 저장할 Key 이름을 상수로 고정함
const BOOKMARK_STORAGE_KEY = "umcine-bookmarks";


// 로컬 스토리지에서 북마크 ID 배열을 읽어오는 함수 (저장소에서 안전하게 조회)
export function readBookmarkIds(): number[] {
  // 1. Key 이름으로 로컬 스토리지에 저장된 JSON 문자열을 가져옴
  const storedValue = localStorage.getItem(BOOKMARK_STORAGE_KEY);
  
  // 2. 저장된 데이터가 없으면(null) 빈 배열 반환
  if (!storedValue) return [];

  try {
    // 3. 가져온 JSON 문자열을 원래 자바스크립트 데이터로 역직렬화 (JSON -> 데이터)
    const parsedValue: unknown = JSON.parse(storedValue);
    
    // 4. 역직렬화된 결과가 배열 형태가 아니면 빈 배열 반환 (방어 코드)
    if (!Array.isArray(parsedValue)) return [];

    // 5. 배열 안의 값 중 '양의 정수인 숫자 ID'만 걸러내어 반환 (타입 검증)
    return parsedValue.filter(
      (movieId): movieId is number =>
        typeof movieId === "number" &&
        Number.isInteger(movieId) &&
        movieId > 0,
    );
  } catch {
    // 6. JSON.parse 도중 형식이 깨져 에러가 나면 앱이 터지지 않게 빈 배열 반환
    return [];
  }
}