export interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RatingResponse {
  isSuccess: boolean;
  code: string;
  message: string;
  result: Rating;
}
