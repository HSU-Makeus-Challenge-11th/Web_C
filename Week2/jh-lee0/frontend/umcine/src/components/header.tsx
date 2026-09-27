function Header() {
  return (
    <header className="header">
      <div className="header__left">
        <div className="header__brand">
          <span className="header__mark">
            <img src="/icons/movie.svg" alt="" />
          </span>
          <span className="header__logo">UMCine</span>
        </div>
        <nav className="header__nav">
          <a href="#" className="is-active">
            영화
          </a>
          <a href="#">검색</a>
          <a href="#">내 정보</a>
        </nav>
      </div>
      <div className="header__actions">
        <button className="header__search" aria-label="영화 검색">
          <img src="/icons/search.svg" alt="" />
        </button>
        <button className="header__login">로그인</button>
      </div>
    </header>
  );
}

export default Header;