import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import PageHeader from '../components/PageHeader';
import './DirectoryEmpty.css';

export default function DirectoryEmpty() {
  return (
    <AppLayout isGuest>
      <div className="dire-container">
        <div>
          <PageHeader title="내 노트" sub="총 0개의 노트" />
        </div>
        <div className="empty-state">
          <div className="empty-mascot">📁</div>
          <h2>작성된 노트가 없어요!</h2>
          <p>에디터를 열어 나만의 첫 마크다운 노트를 작성해 보세요.</p>
          <Link to="/editor/new" className="btn-primary-link">+ 새 노트 작성하기</Link>
        </div>
      </div>
    </AppLayout>
  );
}
