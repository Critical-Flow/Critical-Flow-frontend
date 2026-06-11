import { Link, useLocation } from 'react-router-dom';
import { useModal } from '../context/ModalContext';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

export default function Sidebar({ isGuest = false }) {
  const { pathname } = useLocation();
  const { setMyPageOpen } = useModal();
  const { user } = useAuth();

  const dashPath = isGuest ? '/dashboard-empty' : '/dashboard';
  const createPath = isGuest ? '/create-empty' : '/create';
  const dirPath = isGuest ? '/directory-empty' : '/directory';

  const active = (paths) => {
    const arr = Array.isArray(paths) ? paths : [paths];
    return arr.some((p) => pathname === p) ? 'active' : '';
  };

  return (
    <aside className="sidebar">
      <Link className="brand" to={dashPath}>
        <div className="s-logo">A</div>
        <span>AICE</span>
      </Link>
      <nav>
        <Link to={dashPath} className={active(['/dashboard', '/dashboard-empty'])}>📊 대시보드</Link>
        <Link to={createPath} className={active(['/create', '/create-empty'])}>✏️ 학습 생성</Link>
        <Link to={dirPath} className={active(['/directory', '/directory-empty'])}>📝 노트</Link>
      </nav>
      <div className="s-bottom">
        <div className="s-user">{user?.name ?? '게스트'}</div>
        {user?.affiliation && <div className="s-affiliation">{user.affiliation}</div>}
        <button className="s-mypage-btn" onClick={() => setMyPageOpen(true)}>
          👤 마이페이지
        </button>
      </div>
    </aside>
  );
}
