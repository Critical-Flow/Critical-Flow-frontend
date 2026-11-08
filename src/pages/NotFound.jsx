import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// 등록되지 않은 모든 경로에서 보여주는 404 페이지.
// 로그인 여부와 무관하게 쓰이므로 사이드바 없이 단독 화면으로 표시한다.
export default function NotFound() {
  const { isAuthenticated } = useAuth();
  const homePath = isAuthenticated ? '/dashboard' : '/';
  const homeLabel = isAuthenticated ? '대시보드로 돌아가기' : '홈으로 돌아가기';

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div className="empty-state" style={{ flex: 'none', width: '100%', maxWidth: '480px', marginBottom: 0 }}>
        <div className="empty-mascot">🧭</div>
        <h2>페이지를 찾을 수 없어요</h2>
        <p>주소가 잘못되었거나 삭제된 페이지예요.</p>
        <Link to={homePath} className="btn-primary-link">{homeLabel}</Link>
      </div>
    </div>
  );
}
