import { getMoviesWithFetch } from "../api/movies/get-movies-with-fetch";
import { tmdbConfigError } from "../config/env";

const requestButton = document.querySelector<HTMLButtonElement>("#request-movies")!;
const statusElement = document.querySelector<HTMLParagraphElement>("#request-status")!;
const responseElement = document.querySelector<HTMLPreElement>("#response-body")!;

async function runFetchExample() {
  requestButton.disabled = true;
  statusElement.setAttribute("role", "status");
  statusElement.textContent = "인기 영화를 요청하는 중이에요.";
  responseElement.textContent = "";

  try {
    if (tmdbConfigError) throw new Error(tmdbConfigError);

    const response = await getMoviesWithFetch(1);
    statusElement.textContent =
      `요청 성공: ${response.page}페이지, 영화 ${response.results.length}편을 받았어요.`;
    responseElement.textContent = JSON.stringify(response, null, 2);
    console.info("[순수 fetch] 인기 영화 응답", response);
  } catch (error) {
    statusElement.setAttribute("role", "alert");
    statusElement.textContent = error instanceof Error
      ? error.message
      : "인기 영화 요청에 실패했어요.";
    responseElement.textContent = "Network 패널에서 요청 URL과 상태 코드를 확인해 주세요.";
  } finally {
    requestButton.disabled = false;
  }
}

requestButton.addEventListener("click", () => { void runFetchExample(); });
