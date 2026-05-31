import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { startConversation, sendTutorMessage } from '../services/tutor';

function makeMessage(role, content) {
  return { id: crypto.randomUUID(), role, content, timestamp: new Date().toISOString() };
}

// AI 튜터의 여러 대화를 관리한다.
// 대화 시작 시 백엔드에서 conversationId를 발급받고, 메시지 전송에 사용한다.
// 대화 목록은 세션 내 로컬 상태로 유지된다 (GET /api/v1/conversations 미지원).
export default function useTutorChat(noteId) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const isValidNoteId = noteId && noteId !== 'new';
  const active = conversations.find((c) => c.id === activeId);
  const messages = active?.messages ?? [];

  const appendToActive = useCallback((convId, message) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? {
              ...c,
              messages: [...c.messages, message],
              title: c.messages.filter((m) => m.role === 'user').length === 0 && message.role === 'user'
                ? message.content.slice(0, 20)
                : c.title,
              updatedAt: new Date().toISOString(),
            }
          : c,
      ),
    );
  }, []);

  const newConversation = useCallback(async () => {
    if (!isValidNoteId || !user?.userId) return;
    try {
      const conv = await startConversation({ noteId: Number(noteId), userId: user.userId });
      const localConv = {
        id: String(conv.conversationId),
        conversationId: conv.conversationId,
        title: '새 대화',
        messages: conv.firstQuestion ? [makeMessage('assistant', conv.firstQuestion)] : [],
        updatedAt: conv.createdAt,
      };
      setConversations((prev) => [localConv, ...prev]);
      setActiveId(localConv.id);
    } catch {
      const localConv = {
        id: crypto.randomUUID(),
        conversationId: null,
        title: '새 대화',
        messages: [makeMessage('assistant', '대화를 시작하지 못했어요. 잠시 후 다시 시도해주세요.')],
        updatedAt: new Date().toISOString(),
      };
      setConversations((prev) => [localConv, ...prev]);
      setActiveId(localConv.id);
    }
  }, [noteId, user?.userId, isValidNoteId]);

  // 유효한 노트에서 처음 열릴 때 자동으로 대화 시작
  useEffect(() => {
    if (isValidNoteId && user?.userId && conversations.length === 0) {
      newConversation();
    }
  }, [isValidNoteId, user?.userId]); // eslint-disable-line react-hooks/exhaustive-deps

  const send = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || isSending || !active) return;

      appendToActive(active.id, makeMessage('user', trimmed));
      setIsSending(true);
      try {
        if (active.conversationId) {
          const res = await sendTutorMessage(active.conversationId, trimmed);
          appendToActive(active.id, makeMessage('assistant', res.content));
        } else {
          appendToActive(active.id, makeMessage('assistant', '대화 세션이 없습니다. 새 대화를 시작해주세요.'));
        }
      } catch {
        appendToActive(active.id, makeMessage('assistant', '응답을 가져오지 못했어요. 잠시 후 다시 시도해주세요.'));
      } finally {
        setIsSending(false);
      }
    },
    [active, isSending, appendToActive],
  );

  const selectConversation = useCallback((id) => setActiveId(id), []);

  return { conversations, activeId, messages, isSending, send, newConversation, selectConversation };
}
