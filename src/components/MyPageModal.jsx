import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../context/ModalContext';
import { useAuth } from '../context/AuthContext';
import { logoutApi, updateProfile, deleteAccount } from '../services/auth';
import { reembedNotes } from '../services/notes';
import './MyPageModal.css';

function UserInfoTab({ user, onProfileUpdated, onSessionExpired }) {
  const [affiliation, setAffiliation] = useState(user?.affiliation ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [isReembedding, setIsReembedding] = useState(false);

  const handleReembed = async () => {
    setIsReembedding(true);
    try {
      await reembedNotes();
      alert('✅ DB 복구가 완료되었습니다.');
    } catch {
      alert('복구에 실패했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsReembedding(false);
    }
  };

  const githubLabel = user ? `GitHub · @${user.name}` : 'GitHub · 미연결';
  const isLinked = Boolean(user);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated = await updateProfile({ affiliation });
      onProfileUpdated(updated);
      alert('✅ 저장되었습니다.');
    } catch (e) {
      if (e.response?.data?.code === 'USER_NOT_FOUND') {
        alert('사용자 정보를 찾을 수 없어요. 다시 로그인해주세요.');
        onSessionExpired();
      } else {
        alert('저장에 실패했어요. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mpm-content">
      <div className="mpm-row">
        <div className="mpm-row-label">사용자 정보</div>
        <div className="mpm-row-body">
          <span className="mpm-value">{user?.name ?? '게스트'}</span>
        </div>
      </div>
      <div className="mpm-row">
        <div className="mpm-row-label">github 계정</div>
        <div className="mpm-row-body">
          <span className="mpm-value">{githubLabel}</span>
          <span className="mpm-badge">{isLinked ? '● 연결됨' : '○ 미연결'}</span>
        </div>
      </div>
      <div className="mpm-row">
        <div className="mpm-row-label">소속 설정</div>
        <div className="mpm-row-body">
          <input
            type="text"
            className="mpm-input"
            value={affiliation}
            onChange={(e) => setAffiliation(e.target.value)}
            placeholder="소속을 입력하세요"
          />
          <button className="mpm-btn-sm" onClick={handleSave} disabled={isSaving}>
            {isSaving ? '저장 중' : '저장'}
          </button>
        </div>
      </div>
      <div className="mpm-row">
        <div className="mpm-row-label">DB 복구</div>
        <div className="mpm-row-body">
          <span className="mpm-value" style={{ fontSize: '13px', color: 'var(--sub)' }}>DB가 꼬일 경우 누르세요</span>
          <button className="mpm-btn-sm" onClick={handleReembed} disabled={isReembedding}>
            {isReembedding ? '복구 중...' : '복구'}
          </button>
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
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('user');

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') setMyPageOpen(false);
    };
    if (myPageOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [myPageOpen, setMyPageOpen]);

  if (!myPageOpen) return null;

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {
      // 서버 로그아웃 실패해도 로컬 상태는 초기화
    }
    logout();
    setMyPageOpen(false);
    navigate('/');
  };

  const handleSessionExpired = () => {
    logout();
    setMyPageOpen(false);
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('정말 탈퇴하시겠어요? 모든 데이터가 삭제됩니다.')) return;
    try {
      await deleteAccount();
      logout();
      setMyPageOpen(false);
      navigate('/');
    } catch (e) {
      if (e.response?.data?.code === 'USER_NOT_FOUND') {
        logout();
        setMyPageOpen(false);
        navigate('/');
      } else {
        alert('탈퇴에 실패했어요. 잠시 후 다시 시도해주세요.');
      }
    }
  };

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
            <button className="mpm-logout" onClick={handleLogout}>
              로그아웃
            </button>
          </aside>

          {/* 우측 컨텐츠 */}
          <main className="mpm-main">
            {activeTab === 'user' ? (
              <>
                <UserInfoTab user={user} onProfileUpdated={updateUser} onSessionExpired={handleSessionExpired} />
                <div className="mpm-danger-zone">
                  <button className="mpm-btn-danger" onClick={handleDeleteAccount}>회원 탈퇴</button>
                </div>
              </>
            ) : (
              <InquiryTab />
            )}
          </main>
        </div>

      </div>
    </div>
  );
}
