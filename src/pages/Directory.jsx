import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import './Directory.css';

const notes = [
  { tag: '알고리즘', title: 'DFS와 BFS 정리', date: '2일 전', time: '12분' },
  { tag: 'React', title: 'useEffect 클린업', date: '어제', time: '8분' },
  { tag: 'Python', title: '리스트 컴프리헨션', date: '3일 전', time: '5분' },
  { tag: '자료구조', title: '해시 테이블', date: '5일 전', time: '15분' },
  { tag: '알고리즘', title: '다익스트라', date: '1주 전', time: '20분' },
  { tag: 'React', title: '상태 관리 비교', date: '1주 전', time: '10분' },
  { tag: '알고리즘', title: '이분 탐색', date: '1주 전', time: '7분' },
  { tag: 'Python', title: '데코레이터 패턴', date: '2주 전', time: '9분' },
  { tag: '자료구조', title: '트리 순회', date: '2주 전', time: '11분' },
  { tag: 'React', title: 'React Query', date: '2주 전', time: '14분' },
  { tag: 'Python', title: '제너레이터', date: '3주 전', time: '6분' },
  { tag: '알고리즘', title: '동적 프로그래밍', date: '3주 전', time: '18분' },
];

const folders = [
  { icon: '📚', name: '전체', count: 24, active: true },
  { icon: '💻', name: '알고리즘', count: 8 },
  { icon: '⚛️', name: 'React', count: 6 },
  { icon: '🐍', name: 'Python', count: 5 },
  { icon: '📦', name: '자료구조', count: 3 },
  { icon: '📁', name: '기타', count: 2 },
];

const tags = ['#복습필요', '#중요', '#시험범위'];

export default function Directory() {
  return (
    <AppLayout>
      <div className="dir-container">
        <div className="notes-head">
          <div>
            <div className="page-title">내 노트</div>
            <div className="page-sub">총 24개의 노트</div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input type="text" className="search-input" placeholder="🔍 노트 검색..." />
            <Link to="/editor" className="btn-primary-dir">+ 새 노트</Link>
          </div>
        </div>

        <div className="notes-layout">
          <aside className="folder-panel">
            <h4>폴더</h4>
            {folders.map(({ icon, name, count, active }) => (
              <div key={name} className={`folder-item${active ? ' active' : ''}`}>
                <span>{icon} {name}</span>
                <span className="folder-count">{count}</span>
              </div>
            ))}
            <h4 style={{ marginTop: '24px' }}>태그</h4>
            {tags.map((tag) => (
              <div key={tag} className="folder-item">
                <span>{tag}</span>
              </div>
            ))}
          </aside>

          <div className="notes-area">
            <div className="notes-grid">
              {notes.map(({ tag, title, date, time }) => (
                <Link to="/editor" className="note-card" key={title}>
                  <div className="note-icon">📄</div>
                  <span className="tag">{tag}</span>
                  <h3>{title}</h3>
                  <div className="meta">
                    <span>{date}</span>
                    <span>📖 {time}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
