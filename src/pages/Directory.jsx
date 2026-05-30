import { useState } from 'react';
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
import { getNotes, getFolders, deleteCategory, updateCategory, deleteNote } from '../services/notes';
import './Directory.css';

export default function Directory() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [activeCategoryId, setActiveCategoryId] = useState(0);
  const [editingFolder, setEditingFolder] = useState(null);
  const debouncedSearch = useDebounce(search, 300);

  const {
    data: notes,
    loading: notesLoading,
    error: notesError,
    refetch: refetchNotes,
  } = useFetch(
    () => user?.userId ? getNotes({ userId: user.userId }) : Promise.resolve([]),
    [user?.userId],
  );

  const { data: categories, refetch: refetchFolders } = useFetch(getFolders, []);

  const allFolders = [
    { categoryId: 0, title: '전체', icon: '📚' },
    ...(categories ?? []).map((c) => ({ ...c, icon: '📁' })),
  ];

  const getCategoryTitle = (categoryId) =>
    categories?.find((c) => c.categoryId === categoryId)?.title ?? '';

  const folderNotes = (notes ?? []).filter(
    (note) => activeCategoryId === 0 || note.categoryId === activeCategoryId,
  );

  const filtered = folderNotes.filter((note) =>
    note.title.toLowerCase().includes(debouncedSearch.toLowerCase()),
  );

  const handleDeleteFolder = async (categoryId) => {
    if (!window.confirm('폴더를 삭제하시겠어요?')) return;
    try {
      await deleteCategory(categoryId);
      if (activeCategoryId === categoryId) setActiveCategoryId(0);
      refetchFolders();
    } catch {
      alert('삭제에 실패했어요.');
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('노트를 삭제하시겠어요?')) return;
    try {
      await deleteNote(noteId, user?.userId);
      refetchNotes();
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
            <PageHeader title="내 노트" sub={`총 ${folderNotes.length}개의 노트`} />
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
            {allFolders.map(({ categoryId, title, icon, description }) => (
              <FolderItem
                key={categoryId}
                icon={icon}
                name={title}
                active={activeCategoryId === categoryId}
                onClick={() => setActiveCategoryId(categoryId)}
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
              <div className="notes-grid">
                {filtered.map((note) => (
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
