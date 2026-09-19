export default function MovieInfoCard() {
  const movieTitle = "오디세이";
  const genre = "모험";
  const releaseDate = "2026.08.05";

  return (
    <article className="movie-card">
      <h1>{movieTitle}</h1>
      <p>장르: {genre}</p>
      <p>개봉일: {releaseDate}</p>
    </article>
  );
}
