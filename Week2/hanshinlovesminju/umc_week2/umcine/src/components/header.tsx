import "./header.css";

function Header() {
  return (
    <header className="header">
      <div className="header__left">
        <div className="header__logo">
          <img src="/icons/movie.svg" alt="" />
          <span>UMCine</span>
        </div>
        <nav className="header__nav">
          <a href="/">영화</a>
          <a href="/">검색</a>
          <a href="/">내정보</a>
        </nav>
      </div>
      <div className="header__right">
        <button type="button" className="header__search-btn">
          <img src="/icons/search.svg" alt="검색" />
        </button>
        <button type="button" className="header__login-btn">
          로그인
        </button>
      </div>
    </header>
  );
}

export default Header;