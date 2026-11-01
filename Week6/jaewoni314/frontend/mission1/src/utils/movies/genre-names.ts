// 목록·검색 응답에는 장르 이름 없이 genre_ids만 와요. TMDB 영화 장르 ID를 한국어 이름으로 바꿔요.
const GENRE_NAMES: Record<number, string> = {
  28: "액션",
  12: "모험",
  16: "애니메이션",
  35: "코미디",
  80: "범죄",
  99: "다큐멘터리",
  18: "드라마",
  10751: "가족",
  14: "판타지",
  36: "역사",
  27: "공포",
  10402: "음악",
  9648: "미스터리",
  10749: "로맨스",
  878: "SF",
  10770: "TV 영화",
  53: "스릴러",
  10752: "전쟁",
  37: "서부",
};

export function getGenreNames(genreIds: number[]) {
  return genreIds
    .map((genreId) => GENRE_NAMES[genreId])
    .filter((name): name is string => Boolean(name));
}
