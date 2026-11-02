import { useEffect, useState } from "react";
import "../../App.css";

interface RatingItem {
  id?: number;
  movieId?: number;
  movie_id?: number;
  score: number;
  comment?: string;
}

export function RatingsPage() {
  const [ratings, setRatings] = useState<RatingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    async function fetchRatings() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        // 상대경로 '/ratings' 대신 전체 백엔드 URL 'http://localhost:3000/ratings' 입력
        const res = await fetch("http://localhost:3000/ratings");

        if (!res.ok) {
          throw new Error(`HTTP 오류: ${res.status}`);
        }

        const data: RatingItem[] = await res.json();
        if (!ignore) {
          setRatings(data);
        }
      } catch (error) {
        if (!ignore) {
          const message =
            error instanceof Error ? error.message : "알 수 없는 오류";
          setErrorMessage(`관객평 조회 실패: ${message}`);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    fetchRatings();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
        영화 관객평
      </h1>

      {isLoading && (
        <p className="text-center text-gray-500 py-10">
          관객평을 불러오는 중...
        </p>
      )}

      {!isLoading && errorMessage && (
        <p className="text-center text-red-500 py-10 font-medium">
          {errorMessage}
        </p>
      )}

      {!isLoading && !errorMessage && ratings.length === 0 && (
        <p className="text-center text-gray-500 py-10">
          등록된 관객평이 없습니다.
        </p>
      )}

      {!isLoading && !errorMessage && ratings.length > 0 && (
        <div className="flex flex-col gap-4">
          {ratings.map((rating, index) => {
            const movieId = rating.movieId ?? rating.movie_id;
            const comment = rating.comment ?? "리뷰 없음";

            return (
              <div
                key={rating.id ?? index}
                className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-2"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 font-medium">
                    영화 ID: {movieId}
                  </span>
                  <span className="text-amber-500 font-bold">
                    ★ {rating.score}점
                  </span>
                </div>
                <p className="text-gray-800 text-base leading-relaxed">
                  {comment}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
