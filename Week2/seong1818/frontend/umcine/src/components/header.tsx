export function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="brand" href="#top" aria-label="UMCine 홈">
          <img src="/icons/movie.svg" alt="" />
          <span>UMCine</span>
        </a>

        <nav className="primary-nav" aria-label="주요 메뉴">
          <a href="#movies" aria-current="page">
            영화
          </a>
          <a href="#reviews">리뷰</a>
          <a href="#my-page">내 정보</a>
        </nav>

        <div className="header-actions">
          <button className="search-button" type="button" aria-label="영화 검색">
            <img src="/icons/search.svg" alt="" />
          </button>
          <button className="login-button" type="button">
            로그인
          </button>
        </div>
      </div>
    </header>
  )
}
