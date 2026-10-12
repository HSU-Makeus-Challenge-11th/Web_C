export default function Header() {
  return (
    <header className="header">
      <div className="inner header__inner">
        <div className="header__left">
          <a href="/" className="header__logo">
            <span className="header__logo-icon">
              <img src="/icons/movie.svg" alt="" />
            </span>
            UMCine
          </a>

          <nav className="header__nav">
            <a href="/" className="header__nav-link active">
              영화
            </a>
            <a href="/" className="header__nav-link">
              검색
            </a>
            <a href="/" className="header__nav-link">
              내 정보
            </a>
          </nav>
        </div>

        <div className="header__right">
          <button type="button" className="header__search" aria-label="검색">
            <img src="/icons/search.svg" alt="" />
          </button>
          <button type="button" className="header__login">
            로그인
          </button>
        </div>
      </div>
    </header>
  );
}
