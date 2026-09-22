export default function Header() {
  return (
    <header className="header">
      <div className="header__inner">
        <a className="header__logo" href="/">
          <span className="icon icon--movie" aria-hidden="true" />
          UMCine
        </a>

        <nav className="header__nav" aria-label="주요 메뉴">
          <a className="header__link header__link--active" href="/" aria-current="page">
            영화
          </a>
          <a className="header__link" href="/">
            북마크
          </a>
        </nav>

        <div className="header__actions">
          <button type="button" className="header__icon-button" aria-label="영화 검색">
            <span className="icon icon--search" aria-hidden="true" />
          </button>
          <button type="button" className="header__icon-button" aria-label="내 정보">
            <span className="icon icon--person" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
