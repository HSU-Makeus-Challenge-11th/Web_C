function getMovieTitle(): Promise<string> {
  return Promise.resolve("인셉션");
}

function loadWithThen() {
  return getMovieTitle()
    .then((title) => console.log(`.then(): ${title}`))
    .catch((error) => console.error(error));
}

async function loadWithAsyncAwait() {
  try {
    const title = await getMovieTitle(); // 여기서 "인셉션" 이 title에 할당됨! (await의 효과)
    console.log(`async/await: ${title}`);
  } catch (error) {
    console.error(error);
  }
}

loadWithThen();
loadWithAsyncAwait();