export default function Header() {
  return (
    <header className="header">
      <div className="brand-row">
        <a className="brand" href="/">
          <span className="brand-mark">
            <span className="icon icon-movie" />
          </span>
          <span className="brand-name">UMCine</span>
        </a>
        <nav className="main-nav">
          <a className="nav-link nav-link-active" href="/">영화</a>
          <a className="nav-link" href="/">검색</a>
          <a className="nav-link" href="/">내 정보</a>
        </nav>
      </div>
      <div className="top-actions">
        <button className="search-btn" type="button" aria-label="영화 검색">
          <span className="icon icon-search" />
        </button>
        <button className="login-btn" type="button">로그인</button>
      </div>
    </header>
  );
}