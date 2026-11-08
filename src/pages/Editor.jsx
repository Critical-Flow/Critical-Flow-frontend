import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams, useLocation } from 'react-router-dom';
import { Folder, FolderOpen, Files, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Editor.css';
import MilkdownEditor from '../components/MilkdownEditor';
import EditorToolbar from '../components/EditorToolbar';
import EditorDock from '../components/EditorDock';
import TutorPanel from '../components/TutorPanel';
import FocusMonitor from '../components/FocusMonitor';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import useFetch from '../hooks/useFetch';
import useToggle from '../hooks/useToggle';
import useResizable from '../hooks/useResizable';
import useFocusMonitor from '../hooks/useFocusMonitor';
import { getNote, saveNote, getFolders, getNotes } from '../services/notes';
import { startSession, endSession } from '../services/session';

// 노트 본문 글자수 제한 (공백 포함)
const MAX_CHARS = 2000;

export default function Editor() {
  const { noteId } = useParams();
  const [searchParams] = useSearchParams();
  const { state: locationState } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isNew = noteId === 'new';
  const newCategoryId = isNew ? Number(searchParams.get('categoryId') ?? 0) : 0;

  const {
    data: note,
    loading: noteLoading,
    error: noteError,
    refetch: refetchNote,
  } = useFetch(
    () => (isNew ? Promise.resolve(null) : getNote(noteId, user?.userId)),
    [noteId, isNew, user?.userId],
  );

  const { data: folders } = useFetch(getFolders);
  const { data: allNotes } = useFetch(
    () => user?.userId ? getNotes({ userId: user.userId }) : Promise.resolve([]),
    [user?.userId],
  );

  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  // noteId가 바뀌면 선택 카테고리 리셋 (URL 직접 변경 대응)
  useEffect(() => {
    setSelectedCategoryId(null);
  }, [noteId]);

  // 노트 로드 완료 후 해당 카테고리로 초기화 (새 노트는 URL의 categoryId 사용)
  useEffect(() => {
    if (selectedCategoryId !== null) return;
    if (isNew && newCategoryId) {
      setSelectedCategoryId(newCategoryId);
    } else if (note?.categoryId) {
      setSelectedCategoryId(note.categoryId);
    }
  }, [note?.categoryId, isNew, newCategoryId, selectedCategoryId]);

  const folderNotes = (allNotes ?? []).filter(
    (n) => n.categoryId === (selectedCategoryId ?? note?.categoryId),
  );

  const [lsideOpen, lside] = useToggle(false);
  const [rsideOpen, rside] = useToggle(locationState?.openRside ?? false);
  const [viewMode, setViewMode] = useState('wysiwyg');
  const [remountKey, setRemountKey] = useState(0);
  const [md, setMd] = useState('');
  const [title, setTitle] = useState('');
  const [isSaved, setIsSaved] = useState(!isNew);
  const [isLearning, setIsLearning] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const { videoRef, start: startMonitor, stop: stopMonitor, currentState, isMonitoring } = useFocusMonitor();

  const isLearningRef = useRef(false);
  const sessionIdRef = useRef(null);
  useEffect(() => { isLearningRef.current = isLearning; }, [isLearning]);
  useEffect(() => { sessionIdRef.current = sessionId; }, [sessionId]);

  // 새로고침/탭 닫기 시 학습 중 경고
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isLearningRef.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // 언마운트 시 학습 세션 자동 종료
  useEffect(() => {
    return () => {
      if (isLearningRef.current && sessionIdRef.current) {
        stopMonitor().catch(() => {});
        endSession(sessionIdRef.current).catch(() => {});
      }
    };
  }, [stopMonitor]);
  const milkdownRef = useRef(null);
  const savedRef = useRef({ md: '', title: '' });
  const { startResize } = useResizable({ cssVar: '--rside-width', min: 350, max: 520 });

  useEffect(() => {
    if (note) {
      const content = note.content ?? '';
      const noteTitle = note.title ?? '';
      setMd(content);
      setTitle(noteTitle);
      savedRef.current = { md: content, title: noteTitle };
      setRemountKey((k) => k + 1);
    } else if (isNew) {
      setMd('');
      setTitle('');
      savedRef.current = { md: '', title: '' };
    }
  }, [note, isNew]);

  const handleCommand = (command, payload) => {
    milkdownRef.current?.callCommand(command, payload);
  };

  const cycleView = () => {
    if (viewMode === 'wysiwyg') {
      setViewMode('raw');
    } else {
      setRemountKey((k) => k + 1);
      setViewMode('wysiwyg');
    }
  };

  const handleSave = async () => {
    const categoryId = note?.categoryId ?? newCategoryId;
    if (!categoryId) {
      alert('폴더를 선택한 후 노트를 저장해주세요.');
      return;
    }
    try {
      const payload = {
        noteId: isNew ? undefined : Number(noteId),
        title,
        content: md,
        categoryId,
        sessionId: sessionId ?? 0,
      };
      const saved = await saveNote(payload, user?.userId);
      savedRef.current = { md, title };
      if (lsideOpen) lside.off();
      rside.on();
      setIsSaved(true);
      setTimeout(() => alert('저장되었습니다'), 150);
      if (isNew && saved?.noteId) {
        navigate(`/editor/${saved.noteId}`, { replace: true, state: { openRside: true } });
      }
    } catch (e) {
      const code = e.response?.data?.code;
      if (code === 'NOTE_ACCESS_DENIED') {
        alert('이 노트에 접근 권한이 없어요.');
      } else if (code === 'NOTE_TITLE_REQUIRED') {
        alert('제목을 입력해주세요.');
      } else {
        alert('저장에 실패했어요. 잠시 후 다시 시도해주세요.');
      }
    }
  };

  const handleLearningToggle = async () => {
    try {
      if (!isLearning) {
        const { sessionId: sid } = await startSession();
        setSessionId(sid);
        setIsLearning(true);
        try {
          await startMonitor();
        } catch {
          // vision/웹캠 연결 실패해도 학습 세션은 유지
        }
      } else {
        await stopMonitor();
        if (sessionId) await endSession(sessionId);
        setSessionId(null);
        setIsLearning(false);
      }
    } catch (e) {
      const code = e.response?.data?.code;
      if (code === 'SESSION_ALREADY_ENDED' || code === 'SESSION_NOT_FOUND') {
        await stopMonitor();
        setSessionId(null);
        setIsLearning(false);
      } else {
        alert('학습 세션 상태를 변경하지 못했어요.');
      }
    }
  };

  const appClass = ['app', lsideOpen && 'l-open', rsideOpen && 'r-open']
    .filter(Boolean).join(' ');
  const wsClass = ['workspace', lsideOpen && 'l-open', rsideOpen && 'r-open']
    .filter(Boolean).join(' ');
  const rsideClass = ['rside', !rsideOpen && 'hidden']
    .filter(Boolean).join(' ');

  const hasUnsavedChanges = md !== savedRef.current.md || title !== savedRef.current.title;

  const handleNavigateToNote = (targetNoteId) => {
    if (targetNoteId === Number(noteId)) return;
    if (isLearning && !window.confirm('학습 세션이 진행 중이에요. 이동하면 세션이 종료됩니다. 이동하시겠어요?')) return;
    if (hasUnsavedChanges && !window.confirm('저장하지 않은 내용이 있어요. 이동하시겠어요?')) return;
    navigate(`/editor/${targetNoteId}`);
  };

  // 본문 글자수(공백 포함) — raw/WYSIWYG 모두 md를 공유하므로 md.length로 통일 측정
  const charCount = md.length;
  const isOverLimit = charCount > MAX_CHARS;

  if (noteLoading && !isNew) {
    return <div className="app"><Loading fullPage /></div>;
  }

  if (noteError) {
    const code = noteError.response?.data?.code;
    const message =
      code === 'NOTE_ACCESS_DENIED' ? '이 노트에 접근 권한이 없어요.' :
      code === 'NOTE_NOT_FOUND' ? '노트를 찾을 수 없어요.' :
      '노트를 불러오지 못했어요.';
    const onRetry = (code === 'NOTE_ACCESS_DENIED' || code === 'NOTE_NOT_FOUND') ? undefined : refetchNote;
    return (
      <div className="app">
        <ErrorMessage
          message={message}
          onRetry={onRetry}
          onAction={code === 'NOTE_NOT_FOUND' ? () => navigate('/directory') : undefined}
          actionLabel={code === 'NOTE_NOT_FOUND' ? '디렉토리로 돌아가기' : undefined}
        />
      </div>
    );
  }

  const noteFolder = folders?.find((f) => f.categoryId === note?.categoryId);

  return (
    <div className={appClass}>
      <div className="topbar">
        <div className="path">
          <span className="dir">
            <Folder size={16} aria-hidden="true" />
            {noteFolder?.title}
          </span>
          <span className="sep">/</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
          />
          <span className="ext">.md</span>
        </div>
        <button
          type="button"
          className="back"
          onClick={() => {
            if (isLearning && !window.confirm('학습 세션이 진행 중이에요. 나가면 세션이 종료됩니다. 나가시겠어요?')) return;
            if (hasUnsavedChanges && !window.confirm('저장하지 않은 내용이 있어요. 나가시겠어요?')) return;
            navigate('/directory');
          }}
        ><X size={16} aria-hidden="true" />취소하고 돌아가기</button>
      </div>

      <EditorToolbar onCommand={handleCommand} />

      <aside className={`lside${lsideOpen ? '' : ' hidden'}`}>
        <h4><FolderOpen size={14} aria-hidden="true" />디렉토리</h4>
        <ul>
          {(folders ?? []).map((f) => (
            <li
              key={f.categoryId}
              className={f.categoryId === selectedCategoryId ? 'active' : ''}
              onClick={() => setSelectedCategoryId(f.categoryId)}
              style={{ cursor: 'pointer' }}
            >
              <Folder size={16} aria-hidden="true" />{f.title}
            </li>
          ))}
        </ul>
        <h4 style={{ marginTop: '22px' }}><Files size={14} aria-hidden="true" />파일</h4>
        <ul>
          {(folderNotes ?? []).map((n) => (
            <li
              key={n.noteId}
              className={n.noteId === Number(noteId) ? 'active' : ''}
              onClick={() => handleNavigateToNote(n.noteId)}
              style={{ cursor: n.noteId === Number(noteId) ? 'default' : 'pointer' }}
            >
              {n.title}
            </li>
          ))}
        </ul>
      </aside>

      <aside className={rsideClass}>
        <div
          className="rside-resizer"
          aria-hidden="true"
          onMouseDown={startResize}
        />
        <TutorPanel noteId={noteId} />
      </aside>

      <div className={wsClass}>
        <div className="editor-area">
          {viewMode === 'raw' ? (
            <textarea
              className="raw-textarea"
              spellCheck={false}
              value={md}
              onChange={(e) => setMd(e.target.value)}
            />
          ) : (
            <MilkdownEditor key={remountKey} ref={milkdownRef} value={md} onChange={setMd} />
          )}
        </div>
        <div className={`char-counter${isOverLimit ? ' over' : ''}`}>
          {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()}
        </div>
      </div>

      {isLearning && isMonitoring && <FocusMonitor videoRef={videoRef} currentState={currentState} />}

      <EditorDock
        lsideOpen={lsideOpen}
        rsideOpen={rsideOpen}
        rsideDisabled={!isSaved}
        saveDisabledReason={
          !title.trim() ? '제목을 입력해주세요' :
          !md.trim() ? '본문을 입력해주세요' :
          isOverLimit ? `본문은 최대 ${MAX_CHARS.toLocaleString()}자까지 저장할 수 있어요` :
          null
        }
        viewMode={viewMode}
        isLearning={isLearning}
        onToggleLside={lside.toggle}
        onToggleRside={rside.toggle}
        onCycleView={cycleView}
        onSave={handleSave}
        onToggleLearning={handleLearningToggle}
      />
    </div>
  );
}
