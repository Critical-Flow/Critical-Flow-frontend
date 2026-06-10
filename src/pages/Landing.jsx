import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import './Landing.css';

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M12 .5C5.73.5.99 5.24.99 11.51c0 4.85 3.14 8.96 7.5 10.41.55.1.75-.24.75-.53 0-.26-.01-.95-.01-1.86-3.05.66-3.69-1.47-3.69-1.47-.5-1.27-1.22-1.6-1.22-1.6-1-.68.07-.66.07-.66 1.1.08 1.68 1.13 1.68 1.13.98 1.68 2.57 1.19 3.2.91.1-.71.38-1.2.7-1.47-2.43-.28-4.99-1.22-4.99-5.43 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.4.11-2.92 0 0 .92-.3 3.02 1.13.88-.24 1.82-.36 2.76-.36.94 0 1.88.12 2.76.36 2.1-1.43 3.02-1.13 3.02-1.13.6 1.52.22 2.64.11 2.92.7.77 1.13 1.75 1.13 2.95 0 4.22-2.57 5.15-5.01 5.42.39.34.74 1.01.74 2.04 0 1.47-.01 2.66-.01 3.02 0 .29.2.64.76.53 4.36-1.45 7.49-5.56 7.49-10.41C23.01 5.24 18.27.5 12 .5z" />
  </svg>
);

export default function Landing() {
  return (
    <div className="landing">
      <div className="promo-bar">시대를 선도하는 AI 학습 도우미 — 마크다운 노트와 AI 피드백을 한 곳에서</div>

      <nav className="nav">
        <div className="nav-inner">
          <div className="logo">
            <div className="logo-mark">A</div>
            <span>AICE</span>
          </div>
          <div className="nav-menu">
            <a href="#about">소개</a>
            <a href="#features">기능</a>
            <a href="#how">방법</a>
          </div>
          <Link className="nav-cta" to="/login">
            <GitHubIcon />
            GitHub 로그인
          </Link>
        </div>
      </nav>

      <header className="hero">
        <div className="hero-inner">
          <div className="eyebrow">🎓 졸업 작품 프로젝트</div>
          <h1>마크다운으로 기록하고,<br /><span>AI와 함께 복습하세요</span></h1>
          <p className="sub">학습자 상태 인식 기반 AI 코딩 교육 도우미.<br />노트 작성부터 퀴즈 피드백, 학습 통계까지 한 번에.</p>
          <Link className="hero-cta" to="/login">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M12 .5C5.73.5.99 5.24.99 11.51c0 4.85 3.14 8.96 7.5 10.41.55.1.75-.24.75-.53 0-.26-.01-.95-.01-1.86-3.05.66-3.69-1.47-3.69-1.47-.5-1.27-1.22-1.6-1.22-1.6-1-.68.07-.66.07-.66 1.1.08 1.68 1.13 1.68 1.13.98 1.68 2.57 1.19 3.2.91.1-.71.38-1.2.7-1.47-2.43-.28-4.99-1.22-4.99-5.43 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.4.11-2.92 0 0 .92-.3 3.02 1.13.88-.24 1.82-.36 2.76-.36.94 0 1.88.12 2.76.36 2.1-1.43 3.02-1.13 3.02-1.13.6 1.52.22 2.64.11 2.92.7.77 1.13 1.75 1.13 2.95 0 4.22-2.57 5.15-5.01 5.42.39.34.74 1.01.74 2.04 0 1.47-.01 2.66-.01 3.02 0 .29.2.64.76.53 4.36-1.45 7.49-5.56 7.49-10.41C23.01 5.24 18.27.5 12 .5z" />
            </svg>
            GitHub으로 시작하기
          </Link>
        </div>
      </header>

      <section className="block about" id="about">
        <div className="container about-grid">
          <div className="about-card">
            <div className="tag">WHO WE ARE</div>
            <h2>누가 만들었나요?</h2>
            <p>영남대학교 컴퓨터공학과 학생들이 졸업 작품으로 만든 학습 플랫폼입니다.
              스스로 공부하며 느꼈던 불편함을 해결하기 위해, 학습자에게 가장 가까이 있는 우리가 직접 설계했습니다.</p>
          </div>
          <div className="about-card about-right">
            <div className="tag">ABOUT THE SERVICE</div>
            <h2>어떤 사이트인가요?</h2>
            <p>마크다운 노트 작성, AI 기반 퀴즈와 피드백, 학습 시간 통계 대시보드를 제공하는 통합 학습 도구입니다.
              IoT 기기와 연동되는 학습자 상태 인식 기능을 통해, 더 똑똑한 복습 사이클을 만들어 드립니다.</p>
          </div>
        </div>
      </section>

      <section className="block features" id="features">
        <div className="container">
          <div className="features-head">
            <div className="section-title">활용법</div>
            <div className="section-sub">목표를 세우고, 마크다운으로 기록하고, AI와 함께 복습하세요.</div>
          </div>
          <div className="feature-grid" id="how">
            <div className="feature">
              <div className="ico">📝</div>
              <h3>마크다운 노트</h3>
              <p>익숙한 마크다운 문법으로 빠르게 학습 내용을 정리하고, 디렉토리별로 체계적으로 관리하세요.</p>
            </div>
            <div className="feature">
              <div className="ico">🤖</div>
              <h3>AI 퀴즈 &amp; 피드백</h3>
              <p>작성한 노트를 기반으로 AI가 자동으로 퀴즈를 생성하고, 약점을 분석해 맞춤형 피드백을 드립니다.</p>
            </div>
            <div className="feature">
              <div className="ico">📊</div>
              <h3>학습 대시보드</h3>
              <p>일간 · 주간 · 월간 학습 시간을 시각화하여 학습 습관을 확인하고 꾸준한 복습을 도와드립니다.</p>
            </div>
          </div>
          <div className="features-cta-wrap">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a className="notion-link" href="#" target="_blank" rel="noopener noreferrer">
              📘 자세한 활용법 보러가기 (Notion)
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
