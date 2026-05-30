import { useState } from 'react';
import useTutorChat from '../hooks/useTutorChat';
import { formatTime, formatRelativeTime } from '../utils/date';

// AI 튜터 채팅 패널. VSCode Copilot처럼 한 패널 안에서
// '대화 화면(chat)'과 '대화 목록(list)'을 뷰 전환으로 오간다.
export default function TutorPanel({ noteId, hidden }) {
  const { conversations, activeId, messages, isSending, send, newConversation, selectConversation } =
    useTutorChat(noteId);
  const [input, setInput] = useState('');
  const [view, setView] = useState('chat'); // 'chat' | 'list'

  const handleSubmit = (e) => {
    e.preventDefault();
    send(input);
    setInput('');
  };

  const openConversation = (id) => {
    selectConversation(id);
    setView('chat');
  };

  const handleNew = () => {
    newConversation();
    setView('chat');
  };

  return (
    <section className="tutor-panel" aria-hidden={hidden}>
      <div className="tutor-head">
        {view === 'chat' ? (
          <button type="button" className="tutor-icon-btn" onClick={() => setView('list')} title="대화 목록">☰</button>
        ) : (
          <button type="button" className="tutor-icon-btn" onClick={() => setView('chat')} title="뒤로">‹</button>
        )}
        <span className="title">{view === 'list' ? '대화 목록' : 'AI Tutor'}</span>
        <button type="button" className="tutor-icon-btn" onClick={handleNew} title="새 대화">+</button>
      </div>

      {view === 'list' ? (
        <div className="conv-list">
          {conversations.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`conv-item${c.id === activeId ? ' active' : ''}`}
              onClick={() => openConversation(c.id)}
            >
              <span className="conv-title">{c.title}</span>
              <span className="conv-time">{formatRelativeTime(c.updatedAt)}</span>
            </button>
          ))}
        </div>
      ) : (
        <>
          <div className="chat-window">
            {messages.length === 0 && !isSending && (
              <p className="chat-empty">노트 내용에 대해 무엇이든 물어보세요.</p>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`bubble ${m.role === 'user' ? 'right' : 'left'}`}>
                {m.content}
                <span className="time">{formatTime(m.timestamp)}</span>
              </div>
            ))}
            {isSending && <div className="bubble left">답변 작성 중…</div>}
          </div>
          <form className="chat-input" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="메시지를 입력하세요"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" disabled={isSending || !input.trim()}>↑</button>
          </form>
        </>
      )}
    </section>
  );
}
