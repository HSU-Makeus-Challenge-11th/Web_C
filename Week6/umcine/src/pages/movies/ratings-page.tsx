import { useEffect, useState } from "react";
import {
  createRating,
  updateRating,
  deleteRating,
} from "../../api/movies/ratings";

interface RatingItem {
  id?: number;
  ratingId?: number;
  movieId?: number;
  movie_id?: number;
  score: number;
  comment?: string;
}

export function RatingsPage() {
  const [ratings, setRatings] = useState<RatingItem[]>([]);
  const [movieId, setMovieId] = useState("");
  const [score, setScore] = useState("");
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    fetch("http://localhost:3000/members/1/ratings")
      .then((res) => {
        if (!res.ok) throw new Error("관람평 조회 실패");
        return res.json();
      })
      .then((data: RatingItem[]) => setRatings(data))
      .catch(() => setMessage("관람평을 불러오지 못했습니다."));
  }, [refresh]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    try {
      const res =
        editingId === null
          ? await createRating({
              movieId: Number(movieId),
              score: Number(score),
              comment,
            })
          : await updateRating(editingId, {
              score: Number(score),
              comment,
            });

      if (!res.ok) {
        const error = await res.json().catch(() => null);
        throw new Error(error?.message ?? `요청 실패 (${res.status})`);
      }

      setMessage(
        editingId === null
          ? "관람평을 등록했습니다."
          : "관람평을 수정했습니다.",
      );
      setMovieId("");
      setScore("");
      setComment("");
      setEditingId(null);
      setRefresh((value) => value + 1);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "요청 실패");
    }
  }

  function handleEdit(rating: RatingItem) {
    const id = rating.id ?? rating.ratingId;

    if (id === undefined) {
      setMessage("관람평 ID를 찾을 수 없습니다.");
      return;
    }

    setEditingId(id);
    setMovieId(String(rating.movieId ?? rating.movie_id ?? ""));
    setScore(String(rating.score));
    setComment(rating.comment ?? "");
    setMessage("");
  }

  async function handleDelete(rating: RatingItem) {
    const id = rating.id ?? rating.ratingId;

    if (id === undefined) {
      setMessage("관람평 ID를 찾을 수 없습니다.");
      return;
    }

    if (!window.confirm("이 관람평을 삭제할까요?")) return;

    try {
      const res = await deleteRating(id);

      if (!res.ok) throw new Error(`삭제 실패 (${res.status})`);

      setMessage("관람평을 삭제했습니다.");

      if (editingId === id) {
        setEditingId(null);
        setMovieId("");
        setScore("");
        setComment("");
      }

      setRefresh((value) => value + 1);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "삭제 실패");
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-5 py-10">
      <h1 className="mb-8 text-center text-3xl font-extrabold text-gray-900">
        영화 관객평
      </h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <h2 className="text-xl font-bold text-gray-900">
          {editingId === null ? "관람평 등록" : "관람평 수정"}
        </h2>

        <input
          type="text"
          inputMode="numeric"
          placeholder="영화 ID"
          value={movieId}
          onChange={(e) => {
            if (/^\d*$/.test(e.target.value)) {
              setMovieId(e.target.value);
            }
          }}
          required
          disabled={editingId !== null}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
        />

        <input
          type="text"
          inputMode="numeric"
          placeholder="별점 (5점 만점)"
          value={score}
          onChange={(e) => {
            if (/^\d*$/.test(e.target.value)) {
              setScore(e.target.value);
            }
          }}
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <textarea
          placeholder="관람평을 입력하세요."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            {editingId === null ? "등록하기" : "수정하기"}
          </button>

          {editingId !== null && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setMovieId("");
                setScore("");
                setComment("");
                setMessage("");
              }}
              className="rounded-lg border border-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50"
            >
              취소
            </button>
          )}
        </div>

        {message && (
          <p className="text-sm text-gray-600" role="status">
            {message}
          </p>
        )}
      </form>

      <div className="space-y-4">
        {ratings.length === 0 ? (
          <p className="py-8 text-center text-gray-500">
            등록된 관람평이 없습니다.
          </p>
        ) : (
          ratings.map((rating, index) => (
            <div
              key={rating.id ?? rating.ratingId ?? index}
              className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  영화 ID: {rating.movieId ?? rating.movie_id ?? "-"}
                </span>
                <span className="font-bold text-amber-500">
                  ★ {rating.score}점
                </span>
              </div>

              <p className="whitespace-pre-wrap text-gray-800">
                {rating.comment || "리뷰 없음"}
              </p>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => handleEdit(rating)}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  수정
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(rating)}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                >
                  삭제
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
