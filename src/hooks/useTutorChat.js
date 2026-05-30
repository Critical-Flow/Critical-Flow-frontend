import { useState, useCallback } from 'react';
import { sendMessage } from '../services/tutor';

function createConversation() {
  return { id: crypto.randomUUID(), title: '새 대화', messages: [], updatedAt: new Date().toISOString() };
}

function makeMessage(role, content, timestamp) {
  return { id: crypto.randomUUID(), role, content, timestamp: timestamp ?? new Date().toISOString() };
}

// AI 튜터의 여러 대화를 관리한다.
// 하나의 활성 대화(activeId)에 메시지를 주고받고, 대화를 새로 만들거나 전환할 수 있다.
export default function useTutorChat(noteId) {
  const [conversations, setConversations] = useState(() => [createConversation()]);
  const [activeId, setActiveId] = useState(() => conversations[0].id);
  const [isSending, setIsSending] = useState(false);

  const active = conversations.find((c) => c.id === activeId);
  const messages = active?.messages ?? [];

  // 활성 대화에만 메시지를 덧붙인다. (첫 사용자 메시지면 제목도 갱신)
  const appendToActive = useCallback(
    (message, { asTitle = false } = {}) => {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeId
            ? {
                ...c,
                messages: [...c.messages, message],
                title: asTitle && c.messages.length === 0 ? message.content.slice(0, 20) : c.title,
                updatedAt: new Date().toISOString(),
              }
            : c,
        ),
      );
    },
    [activeId],
  );

  const send = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || isSending) return;

      appendToActive(makeMessage('user', trimmed), { asTitle: true });
      setIsSending(true);
      try {
        const res = await sendMessage(trimmed, { noteId });
        appendToActive(makeMessage('assistant', res.message, res.timestamp));
      } catch {
        appendToActive(makeMessage('assistant', '응답을 가져오지 못했어요. 잠시 후 다시 시도해주세요.'));
      } finally {
        setIsSending(false);
      }
    },
    [noteId, isSending, appendToActive],
  );

  const newConversation = useCallback(() => {
    const conv = createConversation();
    setConversations((prev) => [conv, ...prev]);
    setActiveId(conv.id);
  }, []);

  const selectConversation = useCallback((id) => setActiveId(id), []);

  return { conversations, activeId, messages, isSending, send, newConversation, selectConversation };
}
