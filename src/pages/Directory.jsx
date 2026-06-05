import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../components/AppLayout';
import PageHeader from '../components/PageHeader';
import NoteCard from '../components/NoteCard';
import FolderItem from '../components/FolderItem';
import EditFolderModal from '../components/EditFolderModal';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import useFetch from '../hooks/useFetch';
import useDebounce from '../hooks/useDebounce';
import { getNotes, getNotesByCategory, getFolders, deleteCategory, updateCategory, deleteNote } from '../services/notes';
import './Directory.css';

const PAGE_SIZE = 12;

export default function Directory() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState(0);
  const [editingFolder, setEditingFolder] = useState(null);
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);

  const [currentNotes, setCurrentNotes] = useState([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [notesError, setNotesError] = useState(null);
  const cacheRef = useRef(new Map()); // categoryId → notes[]

  const loadNotes = useCallback(async (categoryId) => {
    if (!user?.userId) return;
    if (cacheRef.current.has(categoryId)) {
      setCurrentNotes(cacheRef.current.get(categoryId));
      return;
    }
    setNotesLoading(true);
    setNotesError(null);
    try {
      const data = categoryId === 0
        ? await getNotes({ userId: user.userId })
        : await getNotesByCategory(categoryId);
      cacheRef.current.set(categoryId, data);
      setCurrentNotes(data);
    } catch (e) {
      setNotesError(e);
    } finally {
      setNotesLoading(false);
    }
  }, [user?.userId]);

  useEffect(() => {
    loadNotes(activeCategoryId);
  }, [activeCategoryId, loadNotes]);

  const refetchNotes = useCallback(() => {
    cacheRef.current.clear();
    loadNotes(activeCategoryId);
  }, [activeCategoryId, loadNotes]);

  const { data: categories, refetch: refetchFolders } = useFetch(getFolders, []);

  const allFolders = [
    { categoryId: 0, title: '전체', icon: '📚' },
    ...(categories ?? []).map((c) => ({ ...c, icon: '📁' })),
  ];

  const getCategoryTitle = (categoryId) =>
    categories?.find((c) => c.categoryId === categoryId)?.title ?? '';

  const filtered = currentNotes.filter((note) =>
    note.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDeleteFolder = async (categoryId) => {
    if (!window.confirm('폴더를 삭제하시겠어요?')) return;
    try {
      await deleteCategory(categoryId);
      cacheRef.current.clear();
      if (activeCategoryId === categoryId) setActiveCategoryId(0);
      else loadNotes(activeCategoryId);
      refetchFolders();
    } catch {
      alert('삭제에 실패했어요.');
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('노트를 삭제하시겠어요?')) return;
    try {
      await deleteNote(noteId, user?.userId);
      await refetchNotes();
      if (paginated.length === 1 && page > 1) setPage((p) => p - 1);
    } catch {
      alert('삭제에 실패했어요.');
    }
  };

  const handleEditSave = async ({ title, description }) => {
    try {
      await updateCategory(editingFolder.categoryId, { title, description });
      setEditingFolder(null);
      refetchFolders();
    } catch {
      alert('수정에 실패했어요.');
    }
  };

  return (
    <AppLayout>
      <div className="dir-container">
        <div className="notes-head">
          <div>
            <PageHeader title="내 노트" sub={`총 ${filtered.length}개의 노트`} />
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <input
              type="text"
              className="search-input"
              placeholder="🔍 노트 검색..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
            {activeCategoryId === 0 ? (
              <button
                type="button"
                className="btn-primary-dir"
                onClick={() => alert('폴더를 선택한 후 노트를 생성해주세요.')}
              >+ 새 노트</button>
            ) : (
              <Link to={`/editor/new?categoryId=${activeCategoryId}`} className="btn-primary-dir">+ 새 노트</Link>
            )}
          </div>
        </div>

        <div className="notes-layout">
          <aside className="folder-panel">
            <h4>폴더</h4>
            {allFolders.map(({ categoryId, title, icon, description }) => (
              <FolderItem
                key={categoryId}
                icon={icon}
                name={title}
                active={activeCategoryId === categoryId}
                onClick={() => { setActiveCategoryId(categoryId); setPage(1); }}
                onEdit={categoryId !== 0 ? () => setEditingFolder({ categoryId, title, description }) : undefined}
                onDelete={categoryId !== 0 ? () => handleDeleteFolder(categoryId) : undefined}
              />
            ))}
          </aside>

          <div className="notes-area">
            {notesLoading && <Loading />}
            {notesError && !notesLoading && (
              <ErrorMessage message="노트를 불러오지 못했어요." onRetry={refetchNotes} />
            )}
            {!notesLoading && !notesError && (
              <>
                <div className="notes-grid">
                  {paginated.map((note) => (
                    <NoteCard
                      key={note.noteId}
                      id={note.noteId}
                      title={note.title}
                      tag={getCategoryTitle(note.categoryId)}
                      updatedAt={note.updatedAt}
                      readMinutes={note.readMinutes}
                      onDelete={() => handleDeleteNote(note.noteId)}
                    />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="page-btn"
                      onClick={() => setPage((p) => p - 1)}
                      disabled={page === 1}
                    >‹</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        className={`page-btn${p === page ? ' active' : ''}`}
                        onClick={() => setPage(p)}
                      >{p}</button>
                    ))}
                    <button
                      className="page-btn"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page === totalPages}
                    >›</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {editingFolder && (
        <EditFolderModal
          folder={editingFolder}
          onSave={handleEditSave}
          onClose={() => setEditingFolder(null)}
        />
      )}
    </AppLayout>
  );
}
