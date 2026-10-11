// models.ts
interface CheckResponse {
  available: boolean;
}

interface Rating {
  ratingId: number;
  movieId: number;
  score: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
}

export type { CheckResponse, Rating };