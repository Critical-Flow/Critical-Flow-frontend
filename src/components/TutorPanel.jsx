import { useState, useRef, useEffect } from 'react';
import useTutorChat from '../hooks/useTutorChat';
import { formatTime, formatRelativeTime } from '../utils/date';

// AI 튜터 채팅 패널. VSCode Copilot처럼 한 패널 안에서
// '대화 화면(chat)'과 '대화 목록(list)'을 뷰 전환으로 오간다.
// 가장 최신 대화(conversationId 최대값)만 메시지 입력 가능, 이전 대화는 이력 조회만.
export default function TutorPanel({ noteId, hidden }) {
  const {
    conversations,
    activeId,
    messages,
    isSending,
    isLoadingMessages,
    mode,
    send,
    newConversation,
    selectConversation,
    removeConversation,
    continueLatest,
  } = useTutorChat(noteId);
  const [input, setInput] = useState('');
  const [view, setView] = useState('chat');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const active = conversations.find((c) => c.id === activeId);

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

  const handleDelete = (e, id) => {
    e.stopPropagation();
    removeConversation(id);
  };

  return (
    <section className="tutor-panel" aria-hidden={hidden}>
      <div className="tutor-head">
        {mode === 'ask' ? (
          <span className="tutor-icon-btn" />
        ) : view === 'chat' ? (
          <button type="button" className="tutor-icon-btn" onClick={() => setView('list')} title="대화 목록">☰</button>
        ) : (
          <button type="button" className="tutor-icon-btn" onClick={() => setView('chat')} title="뒤로">‹</button>
        )}
        <span className="title">{view === 'list' ? '대화 목록' : 'AI Tutor'}</span>
        <button type="button" className="tutor-icon-btn" onClick={handleNew} title="새 대화">+</button>
      </div>

      {mode === 'ask' ? (
        <div className="tutor-ask">
          <p className="tutor-ask-title">이전 대화가 있어요</p>
          <p className="tutor-ask-desc">이전 대화를 이어가시겠어요?</p>
          <div className="tutor-ask-actions">
            <button type="button" className="tutor-ask-btn primary" onClick={continueLatest}>
              이전 대화 계속하기
            </button>
            <button type="button" className="tutor-ask-btn ghost" onClick={handleNew}>
              새 대화 시작
            </button>
          </div>
        </div>
      ) : view === 'list' ? (
        <div className="conv-list">
          {conversations.map((c) => (
            <div
              key={c.id}
              className={`conv-item${c.id === activeId ? ' active' : ''}`}
              onClick={() => openConversation(c.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && openConversation(c.id)}
            >
              <div className="conv-info">
                <span className="conv-title">{c.title}</span>
                <div className="conv-meta">
                  {c.isLatest && <span className="conv-badge">활성</span>}
                  {c.updatedAt && <span className="conv-time">{formatRelativeTime(c.updatedAt)}</span>}
                </div>
              </div>
              <button
                type="button"
                className="tutor-icon-btn conv-delete"
                onClick={(e) => handleDelete(e, c.id)}
                title="대화 삭제"
              >×</button>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="chat-window">
            {isLoadingMessages ? (
              <p className="chat-empty">대화 불러오는 중…</p>
            ) : (
              <>
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
                <div ref={bottomRef} />
              </>
            )}
          </div>

          {active?.isLatest ? (
            <form className="chat-input" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="메시지를 입력하세요"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit" disabled={isSending || isLoadingMessages || !input.trim()}>↑</button>
            </form>
          ) : (
            <div className="chat-readonly">
              {!active
                ? '대화가 없어요. + 버튼으로 새 대화를 시작해보세요.'
                : '이전 대화 기록입니다. 새 대화를 시작하려면 + 를 눌러주세요.'}
            </div>
          )}
        </>
      )}
    </section>
  );
}
