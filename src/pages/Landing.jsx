import { useRef } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import TextType from '../components/reactbits/TextType';
import VariableProximity from '../components/reactbits/VariableProximity';
import ScrollFloat from '../components/reactbits/ScrollFloat';
import GlareHover from '../components/reactbits/GlareHover';
import Grainient from '../components/reactbits/Grainient';
import CardSwap, { Card } from '../components/reactbits/CardSwap';
import Carousel from '../components/reactbits/Carousel';
import './Landing.css';

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M12 .5C5.73.5.99 5.24.99 11.51c0 4.85 3.14 8.96 7.5 10.41.55.1.75-.24.75-.53 0-.26-.01-.95-.01-1.86-3.05.66-3.69-1.47-3.69-1.47-.5-1.27-1.22-1.6-1.22-1.6-1-.68.07-.66.07-.66 1.1.08 1.68 1.13 1.68 1.13.98 1.68 2.57 1.19 3.2.91.1-.71.38-1.2.7-1.47-2.43-.28-4.99-1.22-4.99-5.43 0-1.2.43-2.18 1.13-2.95-.11-.28-.49-1.4.11-2.92 0 0 .92-.3 3.02 1.13.88-.24 1.82-.36 2.76-.36.94 0 1.88.12 2.76.36 2.1-1.43 3.02-1.13 3.02-1.13.6 1.52.22 2.64.11 2.92.7.77 1.13 1.75 1.13 2.95 0 4.22-2.57 5.15-5.01 5.42.39.34.74 1.01.74 2.04 0 1.47-.01 2.66-.01 3.02 0 .29.2.64.76.53 4.36-1.45 7.49-5.56 7.49-10.41C23.01 5.24 18.27.5 12 .5z" />
  </svg>
);

const FEATURES = [
  {
    icon: '📝',
    title: '마크다운 노트',
    description: '익숙한 마크다운 문법으로 빠르게 학습 내용을 정리하고, 디렉토리별로 체계적으로 관리하세요.'
  },
  {
    icon: '🤖',
    title: 'AI 퀴즈 & 피드백',
    description: '작성한 노트를 기반으로 AI가 자동으로 퀴즈를 생성하고, 약점을 분석해 맞춤형 피드백을 드립니다.'
  },
  {
    icon: '📊',
    title: '학습 대시보드',
    description: '일간 · 주간 · 월간 학습 시간을 시각화하여 학습 습관을 확인하고 꾸준한 복습을 도와드립니다.'
  }
];

const CAROUSEL_ITEMS = FEATURES.map((feature, index) => ({
  id: index + 1,
  title: feature.title,
  description: feature.description,
  icon: <span className="carousel-icon-emoji">{feature.icon}</span>
}));

const ABOUT_SWAP_CARDS = [
  {
    icon: '🧩',
    title: '통합 학습 도구',
    description: '마크다운 노트, AI 퀴즈와 피드백, 학습 시간 통계 대시보드를 한 곳에서 제공합니다.'
  },
  {
    icon: '📡',
    title: '학습자 상태 인식',
    description: 'IoT 기기와 연동되는 학습자 상태 인식 기능으로 집중 상태를 파악합니다.'
  },
  {
    icon: '🔁',
    title: '똑똑한 복습 사이클',
    description: '인식된 상태를 바탕으로 더 똑똑한 복습 사이클을 만들어 드립니다.'
  }
];

const FEATURE_GLARE_PROPS = {
  className: 'feature',
  width: '100%',
  height: 'auto',
  background: '#fff',
  borderRadius: '18px',
  borderColor: 'transparent',
  glareColor: '#5CBD9E',
  glareOpacity: 0.25,
  glareAngle: -30,
  glareSize: 280,
  transitionDuration: 800
};

export default function Landing() {
  const featuresHeadRef = useRef(null);

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
        <div className="hero-bg" aria-hidden="true">
          <Grainient
            color1="#C4EEDD"
            color2="#5CBD9E"
            color3="#2E8A72"
            timeSpeed={0.25}
            warpStrength={1}
            warpFrequency={4}
            warpSpeed={1.5}
            grainAmount={0.06}
            contrast={1.3}
            zoom={0.9}
          />
        </div>
        <div className="hero-fade" aria-hidden="true" />
        <div className="hero-inner">
          <div className="eyebrow">🎓 졸업 작품 프로젝트</div>
          <h1>
            마크다운으로 기록하고,<br />
            <TextType
              as="span"
              text={['AI와 함께 복습하세요']}
              typingSpeed={80}
              deletingSpeed={40}
              pauseDuration={2500}
              cursorCharacter="|"
            />
          </h1>
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
          <div className="about-text">
            <div className="about-card">
              <div className="tag">WHO WE ARE</div>
              <ScrollFloat>누가 만들었나요?</ScrollFloat>
              <p>영남대학교 컴퓨터공학과 학생들이 졸업 작품으로 만든 학습 플랫폼입니다.
                스스로 공부하며 느꼈던 불편함을 해결하기 위해, 학습자에게 가장 가까이 있는 우리가 직접 설계했습니다.</p>
            </div>
            <div className="about-card">
              <div className="tag">ABOUT THE SERVICE</div>
              <ScrollFloat>어떤 사이트인가요?</ScrollFloat>
              <p>마크다운 노트 작성, AI 기반 퀴즈와 피드백, 학습 시간 통계 대시보드를 제공하는 통합 학습 도구입니다.
                IoT 기기와 연동되는 학습자 상태 인식 기능을 통해, 더 똑똑한 복습 사이클을 만들어 드립니다.</p>
            </div>
          </div>
          <div className="about-visual">
            <div className="about-swap">
              <CardSwap
                width={340}
                height={230}
                cardDistance={45}
                verticalDistance={55}
                delay={4000}
                skewAmount={4}
                pauseOnHover
              >
                {ABOUT_SWAP_CARDS.map(card => (
                  <Card key={card.title} customClass="about-swap-card">
                    <div className="swap-ico">{card.icon}</div>
                    <h4>{card.title}</h4>
                    <p>{card.description}</p>
                  </Card>
                ))}
              </CardSwap>
            </div>
          </div>
        </div>
      </section>

      <section className="block features" id="features">
        <div className="container">
          <div className="features-head" ref={featuresHeadRef}>
            <div className="tag">HOW TO USE</div>
            <ScrollFloat containerClassName="section-title">활용법</ScrollFloat>
            <div className="section-sub">
              <VariableProximity
                label="목표를 세우고, 마크다운으로 기록하고, AI와 함께 복습하세요."
                fromFontVariationSettings="'wght' 400"
                toFontVariationSettings="'wght' 800"
                containerRef={featuresHeadRef}
                radius={80}
                falloff="linear"
              />
            </div>
          </div>
          <div className="feature-grid" id="how">
            {FEATURES.map(feature => (
              <GlareHover key={feature.title} {...FEATURE_GLARE_PROPS}>
                <div className="ico">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </GlareHover>
            ))}
          </div>
          <div className="feature-carousel">
            <Carousel
              items={CAROUSEL_ITEMS}
              baseWidth={300}
              autoplay
              autoplayDelay={3500}
              pauseOnHover
              loop
            />
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
