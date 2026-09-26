export default function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <div className="left-section">
          <div className="logo">
            <img src="/public/icon/movie.svg" alt="" className="logo-icon"/>
            <span className="logo-text">UMCine</span>
          </div>
          <nav className="nav">
            <a href="#" className="nav-item active">영화</a>
            <a href="#" className="nav-item">검색</a>
            <a href="#" className="nav-item">내 정보</a>
          </nav>
        </div>
        <div className="right-section">
          <button className="search-btn" aria-label="검색">
            <img src="/public/icon/search.svg" alt="검색 아이콘" />
          </button>
          <button className="login-btn">로그인</button>
        </div>
      </div>
    </header>
  );
}