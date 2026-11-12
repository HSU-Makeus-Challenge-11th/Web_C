// 4.2 Network 패널 확인용 예제예요. main.tsx에 임시로 import해서 확인한 뒤 import를 지웠어요.
import { getMoviesWithFetch } from "../api/movies/get-movies-with-fetch";

getMoviesWithFetch(1)
  .then((response) => console.log(response.results))
  .catch((error) => console.error(error));
