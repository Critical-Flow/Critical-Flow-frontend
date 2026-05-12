import './Footer.css';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="row">
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a href="#">이용약관</a>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a href="#">개인정보처리방침</a>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
      </div>
      <div>© 2026 MarkLearn — 영남대학교 컴퓨터공학과 졸업작품</div>
    </footer>
  );
}
