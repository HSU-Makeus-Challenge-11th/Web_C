interface CheckResponse {
  available: boolean;
}

interface RatingResponse {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export type { CheckResponse, RatingResponse };
