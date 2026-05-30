import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Editor.css';
import MilkdownEditor from '../components/MilkdownEditor';
import EditorToolbar from '../components/EditorToolbar';
import EditorDock from '../components/EditorDock';
import TutorPanel from '../components/TutorPanel';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import useFetch from '../hooks/useFetch';
import useToggle from '../hooks/useToggle';
import useResizable from '../hooks/useResizable';
import { getNote, saveNote, getFolders, getNotes } from '../services/notes';
import { startSession, endSession } from '../services/session';

export default function Editor() {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isNew = noteId === 'new';

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
  const folderNotes = (allNotes ?? []).filter(
    (n) => n.categoryId === note?.categoryId,
  );

  const [lsideOpen, lside] = useToggle(false);
  const [rsideOpen, rside] = useToggle(false);
  const [viewMode, setViewMode] = useState('wysiwyg');
  const [remountKey, setRemountKey] = useState(0);
  const [md, setMd] = useState('');
  const [title, setTitle] = useState('');
  // 현재는 AI 튜터 패널만 사용한다. 퀴즈 패널을 다시 쓰려면 setter를 복구하고
  // 아래 mode-switch 전환 버튼 주석을 해제하면 된다.
  const [rsideMode] = useState('tutor');
  const [isSaved, setIsSaved] = useState(false);
  const [isLearning, setIsLearning] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const milkdownRef = useRef(null);
  const { startResize } = useResizable({ cssVar: '--rside-width', min: 350, max: 520 });

  useEffect(() => {
    if (note) {
      setMd(note.content ?? '');
      setTitle(note.title ?? '');
      setRemountKey((k) => k + 1);
    } else if (isNew) {
      setMd('');
      setTitle('');
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
    try {
      const payload = {
        noteId: isNew ? undefined : Number(noteId),
        title,
        content: md,
        categoryId: note?.categoryId ?? 0,
        sessionId: sessionId ?? 0,
      };
      const saved = await saveNote(payload, user?.userId);
      if (lsideOpen) lside.off();
      rside.on();
      setIsSaved(true);
      setTimeout(() => alert('💾 저장되었습니다'), 150);
      if (isNew && saved?.noteId) {
        navigate(`/editor/${saved.noteId}`, { replace: true });
      }
    } catch {
      alert('저장에 실패했어요. 잠시 후 다시 시도해주세요.');
    }
  };

  const handleLearningToggle = async () => {
    try {
      if (!isLearning) {
        const { sessionId: sid } = await startSession();
        setSessionId(sid);
        setIsLearning(true);
      } else {
        if (sessionId) await endSession(sessionId);
        setSessionId(null);
        setIsLearning(false);
      }
    } catch {
      alert('학습 세션 상태를 변경하지 못했어요.');
    }
  };

  const appClass = ['app', lsideOpen && 'l-open', rsideOpen && 'r-open']
    .filter(Boolean).join(' ');
  const wsClass = ['workspace', lsideOpen && 'l-open', rsideOpen && 'r-open']
    .filter(Boolean).join(' ');
  const rsideClass = ['rside', !rsideOpen && 'hidden', `mode-${rsideMode}`]
    .filter(Boolean).join(' ');

  if (noteLoading && !isNew) {
    return <div className="app"><Loading fullPage /></div>;
  }

  if (noteError) {
    return (
      <div className="app">
        <ErrorMessage message="노트를 불러오지 못했어요." onRetry={refetchNote} />
      </div>
    );
  }

  const noteFolder = folders?.find((f) => f.categoryId === note?.categoryId);
  const folderLabel = noteFolder ? `📁 ${noteFolder.title}` : '📁';

  return (
    <div className={appClass}>
      <div className="topbar">
        <div className="path">
          <span className="dir">{folderLabel}</span>
          <span className="sep">/</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
          />
          <span className="ext">.md</span>
        </div>
        <Link className="back" to="/directory">✕ 취소하고 돌아가기</Link>
      </div>

      <EditorToolbar onCommand={handleCommand} />

      <aside className={`lside${lsideOpen ? '' : ' hidden'}`}>
        <h4>📂 디렉토리</h4>
        <ul>
          {(folders ?? []).map((f) => (
            <li key={f.categoryId} className={f.categoryId === note?.categoryId ? 'active' : ''}>
              📁 {f.title}
            </li>
          ))}
        </ul>
        <h4 style={{ marginTop: '22px' }}>📄 파일</h4>
        <ul>
          {(folderNotes ?? []).map((n) => (
            <li key={n.noteId} className={n.noteId === Number(noteId) ? 'active' : ''}>
              {n.title}
            </li>
          ))}
          <li>+ 새 파일</li>
        </ul>
      </aside>

      <aside className={rsideClass}>
        <div
          className="rside-resizer"
          aria-hidden="true"
          onMouseDown={startResize}
        />
        {/* 퀴즈/AI 튜터 전환 버튼 — 현재는 AI 튜터만 사용하므로 숨김 (복구 시 setRsideMode도 복구)
        <div className="mode-switch">
          <div className="mode-toggle" role="tablist" aria-label="오른쪽 패널 모드">
            <button
              type="button"
              role="tab"
              aria-selected={rsideMode === 'quiz'}
              className={rsideMode === 'quiz' ? 'active' : ''}
              onClick={() => setRsideMode('quiz')}
            >퀴즈</button>
            <button
              type="button"
              role="tab"
              aria-selected={rsideMode === 'tutor'}
              className={rsideMode === 'tutor' ? 'active' : ''}
              onClick={() => setRsideMode('tutor')}
            >AI 튜터</button>
          </div>
        </div>
        */}

        <section className="quiz-panel" aria-hidden={rsideMode !== 'quiz'}>
          <div className="qz-title">AI 퀴즈</div>
          <div className="qz-sub">노트 「{title || '제목 없음'}」 기반 자동 생성 문제</div>
          <div className="qz-progress"><span /></div>
          <div className="qz-meta"><span>4 / 10 문제</span><span>⏱ 02:34</span></div>
          <div className="qz-card">
            <div className="qz-tag">개념 이해</div>
            <div className="qz-text">Q4. 다음 중 BFS(너비 우선 탐색)에 대한 설명으로 옳은 것은?</div>
            <div className="qz-choice"><div className="idx">1</div><div>스택을 이용해 구현하며, 가장 최근 방문한 노드부터 탐색한다.</div></div>
            <div className="qz-choice active"><div className="idx">2</div><div>큐를 이용해 구현하며, 간선 가중치가 동일할 때 최단 경로를 보장한다.</div></div>
            <div className="qz-choice"><div className="idx">3</div><div>음수 가중치 그래프에서도 항상 최단 경로를 찾을 수 있다.</div></div>
            <div className="qz-choice"><div className="idx">4</div><div>시간복잡도는 항상 O(V²)이다.</div></div>
          </div>
          <div className="qz-feedback">
            <strong>정답입니다!</strong>
            <p>BFS는 큐(FIFO)를 사용해 가까운 노드부터 탐색하며, 동일 가중치에서 최단 경로를 보장합니다.</p>
          </div>
          <div className="qz-actions">
            <div className="qz-btn ghost">이전 문제</div>
            <div className="qz-btn primary">다음 문제</div>
          </div>
        </section>

        <TutorPanel noteId={noteId} hidden={rsideMode !== 'tutor'} />
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
      </div>

      <EditorDock
        lsideOpen={lsideOpen}
        rsideOpen={rsideOpen}
        rsideDisabled={!isSaved}
        saveDisabled={!md.trim()}
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
