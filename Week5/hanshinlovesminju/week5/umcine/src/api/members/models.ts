type AvailabilityResponse = {
  available: boolean;
};

type RatingResponse = {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
};

export type { AvailabilityResponse, RatingResponse };
