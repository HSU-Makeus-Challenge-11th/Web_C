const BASE_URL = "http://localhost:3000";
const MEMBER_ID = 1;

export function createRating(data: {
  movieId: number;
  score: number;
  comment: string;
}) {
  return fetch(`${BASE_URL}/members/${MEMBER_ID}/ratings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function updateRating(
  ratingId: number,
  data: { score: number; comment: string },
) {
  return fetch(`${BASE_URL}/members/${MEMBER_ID}/ratings/${ratingId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

export function deleteRating(ratingId: number) {
  return fetch(`${BASE_URL}/members/${MEMBER_ID}/ratings/${ratingId}`, {
    method: "DELETE",
  });
}
