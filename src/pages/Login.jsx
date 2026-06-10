import { Link } from 'react-router-dom';
import './Login.css';

const GITHUB_OAUTH_URL = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/github`;

export default function Login() {
  return (
    <>
      <div className="login-wrap">
        <div className="login-card">
          <div className="login-logo-mark">A</div>
          <h1>다시 오신 걸 환영해요</h1>
          <p>GitHub 계정으로 간편하게 시작하세요.</p>
          <a href={GITHUB_OAUTH_URL} className="gh-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .5C5.73.5.99 5.24.99 11.51c0 4.85 3.14 8.96 7.5 10.41.55.1.75-.24.75-.53 0-.26-.01-.95-.01-1.86-3.05.66-3.69-1.47-3.69-1.47-.5-1.27-1.22-1.6-1.22-1.6-1-.68.07-.66.07-.66 1.1.08 1.68 1.13 1.68 1.13.98 1.68 2.57 1.19 3.2.91.1-.71.38-1.2.7-1.47-2.43-.28-4.99-1.22-4.99-5.43 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.4.11-2.92 0 0 .92-.3 3.02 1.13.88-.24 1.82-.36 2.76-.36.94 0 1.88.12 2.76.36 2.1-1.43 3.02-1.13 3.02-1.13.6 1.52.22 2.64.11 2.92.7.77 1.13 1.75 1.13 2.95 0 4.22-2.57 5.15-5.01 5.42.39.34.74 1.01.74 2.04 0 1.47-.01 2.66-.01 3.02 0 .29.2.64.76.53 4.36-1.45 7.49-5.56 7.49-10.41C23.01 5.24 18.27.5 12 .5z" />
            </svg>
            GitHub으로 계속하기
          </a>
          <div className="divider">또는</div>
          <Link to="/dashboard-empty" className="btn-ghost">
            게스트로 둘러보기
          </Link>
        </div>
      </div>
      <footer className="login-footer">
        <div className="row">
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href="#">이용약관</a>
          {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
          <a href="#">개인정보처리방침</a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
        <div>© 2026 Project AICE — 영남대학교 컴퓨터공학과 졸업작품</div>
      </footer>
    </>
  );
}
