import { useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import useFetch from '../hooks/useFetch';
import useDebounce from '../hooks/useDebounce';
import { getNotes, getFolders, getTags } from '../services/notes';
import { formatRelativeTime, formatDuration } from '../utils/date';
import './Directory.css';

export default function Directory() {
  const [search, setSearch] = useState('');
  const [folderId, setFolderId] = useState(0);
  const debouncedSearch = useDebounce(search, 300);

  const {
    data: notes,
    loading: notesLoading,
    error: notesError,
    refetch: refetchNotes,
  } = useFetch(
    () => getNotes({ folderId, search: debouncedSearch }),
    [folderId, debouncedSearch],
  );

  const { data: folders } = useFetch(getFolders);
  const { data: tags } = useFetch(getTags);

  const filteredNotes = debouncedSearch
    ? (notes ?? []).filter((n) => n.title.toLowerCase().includes(debouncedSearch.toLowerCase()))
    : (notes ?? []);

  const totalCount = folders?.find((f) => f.id === 0)?.count ?? notes?.length ?? 0;

  return (
    <AppLayout>
      <div className="dir-container">
        <div className="notes-head">
          <div>
            <div className="page-title">내 노트</div>
            <div className="page-sub">총 {totalCount}개의 노트</div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input
              type="text"
              className="search-input"
              placeholder="🔍 노트 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Link to="/editor/new" className="btn-primary-dir">+ 새 노트</Link>
          </div>
        </div>

        <div className="notes-layout">
          <aside className="folder-panel">
            <h4>폴더</h4>
            {(folders ?? []).map(({ id, icon, name, count }) => (
              <div
                key={id}
                className={`folder-item${folderId === id ? ' active' : ''}`}
                onClick={() => setFolderId(id)}
                style={{ cursor: 'pointer' }}
              >
                <span>{icon} {name}</span>
                <span className="folder-count">{count}</span>
              </div>
            ))}
            <h4 style={{ marginTop: '24px' }}>태그</h4>
            {(tags ?? []).map((tag) => (
              <div key={tag} className="folder-item">
                <span>{tag}</span>
              </div>
            ))}
          </aside>

          <div className="notes-area">
            {notesLoading && <Loading />}
            {notesError && !notesLoading && (
              <ErrorMessage message="노트를 불러오지 못했어요." onRetry={refetchNotes} />
            )}
            {!notesLoading && !notesError && (
              <div className="notes-grid">
                {filteredNotes.map((note) => (
                  <Link to={`/editor/${note.id}`} className="note-card" key={note.id}>
                    <div className="note-icon">📄</div>
                    <span className="tag">{note.tags?.[0] ?? ''}</span>
                    <h3>{note.title}</h3>
                    <div className="meta">
                      <span>{formatRelativeTime(note.updatedAt)}</span>
                      <span>📖 {formatDuration(note.readMinutes)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
