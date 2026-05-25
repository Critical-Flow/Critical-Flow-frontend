import { useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import PageHeader from '../components/PageHeader';
import NoteCard from '../components/NoteCard';
import FolderItem from '../components/FolderItem';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import useFetch from '../hooks/useFetch';
import useDebounce from '../hooks/useDebounce';
import { getNotes, getFolders, getTags } from '../services/notes';
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
            <PageHeader title="내 노트" sub={`총 ${totalCount}개의 노트`} />
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
            {(folders ?? []).map((folder) => (
              <FolderItem
                key={folder.id}
                icon={folder.icon}
                name={folder.name}
                count={folder.count}
                active={folderId === folder.id}
                onClick={() => setFolderId(folder.id)}
              />
            ))}
            <h4 style={{ marginTop: '24px' }}>태그</h4>
            {(tags ?? []).map((tag) => (
              <FolderItem key={tag} name={tag} />
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
                  <NoteCard
                    key={note.id}
                    id={note.id}
                    title={note.title}
                    tag={note.tags?.[0] ?? ''}
                    updatedAt={note.updatedAt}
                    readMinutes={note.readMinutes}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
