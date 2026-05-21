import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Editor.css';
import MilkdownEditor from '../components/MilkdownEditor';
import {
  toggleStrongCommand,
  toggleEmphasisCommand,
  wrapInHeadingCommand,
  wrapInBlockquoteCommand,
  wrapInBulletListCommand,
  wrapInOrderedListCommand,
  toggleLinkCommand,
  insertImageCommand,
  toggleInlineCodeCommand,
  createCodeBlockCommand,
} from '@milkdown/preset-commonmark';

const INITIAL_MD = `# DFS와 BFS 정리

그래프 탐색의 두 가지 기본 알고리즘.

## DFS (깊이 우선 탐색)

스택 또는 재귀로 구현한다. 한 경로를 끝까지 파고든 뒤 되돌아온다.

\`\`\`python
def dfs(graph, v, visited):
    visited[v] = True
    for u in graph[v]:
        if not visited[u]:
            dfs(graph, u, visited)
\`\`\`

## BFS (너비 우선 탐색)

큐를 사용해 가까운 노드부터 방문한다. **최단 경로**(간선 가중치 동일) 탐색에 적합.

## 시간복잡도 비교

- 시간복잡도: \`O(V + E)\`
- 공간복잡도: \`O(V)\`
`;

export default function Editor() {
  const [lsideOpen, setLsideOpen] = useState(false);
  const [rsideOpen, setRsideOpen] = useState(false);
  const [viewMode, setViewMode] = useState('wysiwyg');
  const [remountKey, setRemountKey] = useState(0);
  const [md, setMd] = useState(INITIAL_MD);
  const [rsideMode, setRsideMode] = useState('tutor');
  const [isSaved, setIsSaved] = useState(false);
  const resizingRef = useRef(false);
  const milkdownRef = useRef(null);

  const cmd = (command, payload) => {
    milkdownRef.current?.callCommand(command, payload);
  };

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!resizingRef.current) return;
      const min = 350, max = 520;
      const next = Math.min(max, Math.max(min, window.innerWidth - e.clientX));
      document.documentElement.style.setProperty('--rside-width', `${next}px`);
    };
    const onMouseUp = () => {
      if (!resizingRef.current) return;
      resizingRef.current = false;
      document.body.style.cursor = '';
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const cycleView = () => {
    if (viewMode === 'wysiwyg') {
      setViewMode('raw');
    } else {
      setRemountKey((k) => k + 1);
      setViewMode('wysiwyg');
    }
  };

  const handleSave = () => {
    if (lsideOpen) setLsideOpen(false);
    setRsideOpen(true);
    setIsSaved(true);
    setTimeout(() => alert('💾 저장되었습니다'), 150);
  };

  const appClass = ['app', lsideOpen && 'l-open', rsideOpen && 'r-open']
    .filter(Boolean).join(' ');
  const wsClass = ['workspace', lsideOpen && 'l-open', rsideOpen && 'r-open']
    .filter(Boolean).join(' ');
  const rsideClass = ['rside', !rsideOpen && 'hidden', `mode-${rsideMode}`]
    .filter(Boolean).join(' ');

  return (
    <div className={appClass}>
      <div className="topbar">
        <div className="path">
          <span className="dir">📁 알고리즘</span>
          <span className="sep">/</span>
          <input type="text" defaultValue="DFS와 BFS 정리" />
          <span className="ext">.md</span>
        </div>
        <Link className="back" to="/directory">✕ 취소하고 돌아가기</Link>
      </div>

      <div className="toolbar">
        <button title="굵게" onClick={() => cmd(toggleStrongCommand)}><b>B</b></button>
        <button title="기울임" onClick={() => cmd(toggleEmphasisCommand)}><i>I</i></button>
        <button title="취소선" disabled><s>S</s></button>
        <span className="div" />
        <button title="제목 1" onClick={() => cmd(wrapInHeadingCommand, 1)}>H1</button>
        <button title="제목 2" onClick={() => cmd(wrapInHeadingCommand, 2)}>H2</button>
        <button title="인용" onClick={() => cmd(wrapInBlockquoteCommand)}>❝</button>
        <span className="div" />
        <button title="목록" onClick={() => cmd(wrapInBulletListCommand)}>• 목록</button>
        <button title="번호 목록" onClick={() => cmd(wrapInOrderedListCommand)}>1.</button>
        <button title="체크박스" disabled>☐</button>
        <span className="div" />
        <button title="링크" onClick={() => cmd(toggleLinkCommand)}>🔗</button>
        <button title="이미지" onClick={() => cmd(insertImageCommand)}>🖼</button>
        <button title="인라인 코드" onClick={() => cmd(toggleInlineCodeCommand)}>{'< >'}</button>
        <button title="코드 블록" onClick={() => cmd(createCodeBlockCommand)}>{'{ }'}</button>
      </div>

      <aside className={`lside${lsideOpen ? '' : ' hidden'}`}>
        <h4>📂 디렉토리</h4>
        <ul>
          <li className="active">📁 알고리즘</li>
          <li>📁 React</li>
          <li>📁 Python</li>
          <li>📁 자료구조</li>
        </ul>
        <h4 style={{ marginTop: '22px' }}>📄 파일</h4>
        <ul>
          <li className="active">DFS와 BFS 정리</li>
          <li>다익스트라</li>
          <li>이분 탐색</li>
          <li>+ 새 파일</li>
        </ul>
      </aside>

      <aside className={rsideClass}>
        <div
          className="rside-resizer"
          aria-hidden="true"
          onMouseDown={(e) => {
            e.preventDefault();
            resizingRef.current = true;
            document.body.style.cursor = 'ew-resize';
          }}
        />
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

        <section className="quiz-panel" aria-hidden={rsideMode !== 'quiz'}>
          <div className="qz-title">AI 퀴즈</div>
          <div className="qz-sub">노트 「DFS와 BFS 정리」 기반 자동 생성 문제</div>
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

        <section className="tutor-panel" aria-hidden={rsideMode !== 'tutor'}>
          <div className="tutor-head">
            <span className="title">AI Tutor</span>
            <span className="back-icon">‹</span>
          </div>
          <div className="chat-window">
            <div className="bubble left">
              Hello there? sup?
              <span className="time">19:30</span>
            </div>
            <div className="bubble right">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              <span className="time">19:30</span>
            </div>
            <div className="bubble right">
              PINGGG !!!
              <span className="time">19:32</span>
            </div>
          </div>
          <div className="chat-input">
            <input type="text" placeholder="type something" />
            <button type="button">↻</button>
          </div>
        </section>
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

      <div className="dock">
        <button
          className={lsideOpen ? 'on' : ''}
          onClick={() => setLsideOpen((v) => !v)}
          title="L 사이드바"
        ><span className="tip">L 사이드바</span></button>
        <button
          className={rsideOpen ? 'on' : ''}
          onClick={() => setRsideOpen((v) => !v)}
          title="R 사이드바"
          disabled={!isSaved}
        ><span className="tip">R 사이드바</span></button>
        <button
          className={viewMode === 'raw' ? 'on' : ''}
          onClick={cycleView}
          title="원본 마크다운 보기"
        ><span className="tip">원본 마크다운 보기</span></button>
        <button onClick={handleSave} title="저장">
          <span className="tip">저장 / 전송</span>
        </button>
      </div>
    </div>
  );
}
