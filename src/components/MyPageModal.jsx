import { useState, useEffect } from 'react';
import { useModal } from '../context/ModalContext';
import './MyPageModal.css';

function UserInfoTab() {
  return (
    <div className="mpm-content">
      <div className="mpm-row">
        <div className="mpm-row-label">사용자 정보</div>
        <div className="mpm-row-body">
          <span className="mpm-value">김영남</span>
          <button className="mpm-btn-sm">변경</button>
        </div>
      </div>
      <div className="mpm-row">
        <div className="mpm-row-label">github 계정</div>
        <div className="mpm-row-body">
          <span className="mpm-value">GitHub · @kimyoungnam</span>
          <span className="mpm-badge">● 연결됨</span>
        </div>
      </div>
      <div className="mpm-row">
        <div className="mpm-row-label">호칭 설정</div>
        <div className="mpm-row-body">
          <input
            type="text"
            className="mpm-input"
            defaultValue="김영남"
            placeholder="표시 이름을 입력하세요"
          />
          <button className="mpm-btn-sm">저장</button>
        </div>
      </div>
    </div>
  );
}

function InquiryTab() {
  const [inquiryType, setInquiryType] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (!inquiryType || !content.trim()) {
      alert('문의 유형과 내용을 입력해 주세요.');
      return;
    }
    alert('✅ 문의가 접수되었습니다.');
    setInquiryType('');
    setContent('');
  };

  return (
    <div className="mpm-content inquiry">
      <div className="mpm-section-title">문의사항</div>
      <div className="mpm-field">
        <label className="mpm-label">문의 유형</label>
        <select
          className="mpm-select"
          value={inquiryType}
          onChange={(e) => setInquiryType(e.target.value)}
        >
          <option value="">선택하세요</option>
          <option value="account">계정 문의</option>
          <option value="bug">버그 신고</option>
          <option value="feature">기능 제안</option>
          <option value="other">기타</option>
        </select>
      </div>
      <div className="mpm-field mpm-field-grow">
        <label className="mpm-label">내용</label>
        <textarea
          className="mpm-textarea"
          placeholder="문의 내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className="mpm-submit-row">
        <button className="mpm-btn-submit" onClick={handleSubmit}>제출</button>
      </div>
    </div>
  );
}

export default function MyPageModal() {
  const { myPageOpen, setMyPageOpen } = useModal();
  const [activeTab, setActiveTab] = useState('user');

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setMyPageOpen(false);
    };
    if (myPageOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [myPageOpen, setMyPageOpen]);

  if (!myPageOpen) return null;

  return (
    <div className="mpm-overlay" onClick={() => setMyPageOpen(false)}>
      <div className="mpm-modal" onClick={(e) => e.stopPropagation()}>

        {/* 헤더 */}
        <div className="mpm-header">
          <span>마이페이지</span>
          <button className="mpm-close" onClick={() => setMyPageOpen(false)}>✕</button>
        </div>

        {/* 바디 */}
        <div className="mpm-body">
          {/* 좌측 탭 사이드바 */}
          <aside className="mpm-sidebar">
            <div className="mpm-tabs">
              <button
                className={`mpm-tab${activeTab === 'user' ? ' active' : ''}`}
                onClick={() => setActiveTab('user')}
              >
                사용자정보
              </button>
              <button
                className={`mpm-tab${activeTab === 'inquiry' ? ' active' : ''}`}
                onClick={() => setActiveTab('inquiry')}
              >
                문의사항
              </button>
            </div>
            <button className="mpm-logout" onClick={() => setMyPageOpen(false)}>
              로그아웃
            </button>
          </aside>

          {/* 우측 컨텐츠 */}
          <main className="mpm-main">
            {activeTab === 'user' ? <UserInfoTab /> : <InquiryTab />}
          </main>
        </div>

      </div>
    </div>
  );
}
