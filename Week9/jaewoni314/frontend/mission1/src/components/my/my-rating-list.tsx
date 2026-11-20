import { useQueries, useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { movieQueries } from "../../api/movies/movie-queries";
import { ratingQueries } from "../../api/ratings/rating-queries";
import { useMyMemberId } from "../../hooks/ratings/use-rating-mutations";
import { getApiErrorMessage } from "../../utils/get-api-error-message";
import { RatingStars } from "../ratings/rating-stars";

// 마이페이지의 "내가 남긴 평점" (GET /members/{memberId}/ratings)
// 영화 상세의 "내 평점"과 같은 key라서, 상세에서 평점을 바꾸면 여기도 다시 조회된 목록이 보여요.
export function MyRatingList() {
  const memberId = useMyMemberId();
  const ratingsQuery = useQuery({ ...ratingQueries.byMember(memberId ?? 0), enabled: memberId !== null });
  const ratings = ratingsQuery.data ?? [];
  const movieDetailQueries = useQueries({
    queries: ratings.map((rating) => movieQueries.detail(rating.movieId)),
  });

  return (
    <section className="mt-10" aria-labelledby="ratings-title">
      <h2 id="ratings-title" className="text-xl font-bold">
        내가 남긴 평점 <span className="text-muted">{ratingsQuery.isSuccess ? ratings.length : ""}</span>
      </h2>

      {ratingsQuery.isLoading && <p className="mt-4 text-sm text-muted">평점을 불러오는 중이에요.</p>}
      {ratingsQuery.isError && (
        <p className="mt-4 text-sm text-red-400" role="alert">
          {getApiErrorMessage(ratingsQuery.error, "평점을 불러오지 못했어요.")}
        </p>
      )}
      {ratingsQuery.isSuccess && ratings.length === 0 && (
        <p className="mt-4 rounded-xl border border-line px-6 py-8 text-center text-sm text-muted">
          아직 남긴 평점이 없어요. 영화 상세 화면에서 평점을 남겨 보세요.
        </p>
      )}

      {ratings.length > 0 && (
        <ul className="mt-4 flex flex-col gap-3">
          {ratings.map((rating, index) => (
            <li key={rating.ratingId} className="rounded-xl border border-line px-5 py-4">
              <div className="flex flex-wrap items-baseline gap-3">
                <Link
                  to="/movies/$movieId"
                  params={{ movieId: String(rating.movieId) }}
                  className="font-semibold hover:text-accent"
                >
                  {movieDetailQueries[index]?.data?.title ?? `영화 #${rating.movieId}`}
                </Link>
                <RatingStars score={rating.score} />
              </div>
              {rating.comment && <p className="mt-1.5 break-all text-sm leading-[1.6]">{rating.comment}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
