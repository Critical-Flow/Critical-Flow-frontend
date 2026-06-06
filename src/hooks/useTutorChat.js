import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getConversations,
  startConversation,
  getMessages,
  sendTutorMessage,
  deleteConversation,
} from '../services/tutor';

function makeMessage(role, content) {
  return { id: crypto.randomUUID(), role, content, timestamp: new Date().toISOString() };
}

function serverMessagesToLocal(serverMessages) {
  return serverMessages.map((m) => ({
    id: String(m.messageId),
    role: m.role.toLowerCase() === 'user' ? 'user' : 'assistant',
    content: m.content,
    timestamp: m.createdAt,
  }));
}

function deriveTitleFromMessages(messages) {
  const firstUser = messages.find((m) => m.role === 'user');
  return firstUser ? firstUser.content.slice(0, 20) : '이전 대화';
}

// conversationId가 가장 큰 것이 최신 대화 (메시지 입력 가능)
function markLatest(conversations) {
  if (conversations.length === 0) return conversations;
  const maxId = Math.max(...conversations.map((c) => c.conversationId ?? -1));
  return conversations.map((c) => ({ ...c, isLatest: c.conversationId === maxId }));
}

export default function useTutorChat(noteId) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  const isValidNoteId = noteId && noteId !== 'new';
  const active = conversations.find((c) => c.id === activeId);
  const messages = active?.messages ?? [];

  const appendToActive = useCallback((convId, message) => {
    setConversations((prev) =>
      prev.map((c) =>
        c.id === convId
          ? {
              ...c,
              messages: [...(c.messages ?? []), message],
              title:
                (c.messages ?? []).filter((m) => m.role === 'user').length === 0 && message.role === 'user'
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
        isLatest: true,
      };
      setConversations((prev) => markLatest([localConv, ...prev.map((c) => ({ ...c, isLatest: false }))]));
      setActiveId(localConv.id);
    } catch {
      const localConv = {
        id: crypto.randomUUID(),
        conversationId: null,
        title: '새 대화',
        messages: [makeMessage('assistant', '대화를 시작하지 못했어요. 잠시 후 다시 시도해주세요.')],
        updatedAt: new Date().toISOString(),
        isLatest: false,
      };
      setConversations((prev) => [localConv, ...prev]);
      setActiveId(localConv.id);
    }
  }, [noteId, user?.userId, isValidNoteId]);

  // 마운트 시 서버에서 현재 노트의 대화 목록 로드
  useEffect(() => {
    if (!isValidNoteId || !user?.userId) return;
    let cancelled = false;

    getConversations(user.userId, Number(noteId))
      .then((ids) => {
        if (cancelled) return;
        if (!ids || ids.length === 0) {
          newConversation();
          return;
        }
        const sorted = [...ids].sort((a, b) => b - a);
        const skeletons = markLatest(
          sorted.map((convId) => ({
            id: String(convId),
            conversationId: convId,
            title: '이전 대화',
            messages: null, // null = 아직 미로드
            updatedAt: null,
            isLatest: false,
          })),
        );
        setConversations(skeletons);
        setActiveId(String(sorted[0]));
      })
      .catch(() => {
        if (cancelled) return;
        newConversation();
      });

    return () => { cancelled = true; };
  }, [isValidNoteId, user?.userId]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectConversation = useCallback(
    async (id) => {
      setActiveId(id);
      const conv = conversations.find((c) => c.id === id);
      if (!conv || conv.messages !== null) return;

      setIsLoadingMessages(true);
      try {
        const serverMessages = await getMessages(conv.conversationId);
        const localMessages = serverMessagesToLocal(serverMessages);
        setConversations((prev) =>
          prev.map((c) =>
            c.id === id
              ? { ...c, messages: localMessages, title: deriveTitleFromMessages(localMessages) }
              : c,
          ),
        );
      } catch {
        setConversations((prev) =>
          prev.map((c) => (c.id === id ? { ...c, messages: [] } : c)),
        );
      } finally {
        setIsLoadingMessages(false);
      }
    },
    [conversations],
  );

  const removeConversation = useCallback(
    async (id) => {
      const conv = conversations.find((c) => c.id === id);
      if (!conv?.conversationId || !user?.userId) return;
      try {
        await deleteConversation(conv.conversationId, user.userId);
        setConversations((prev) => {
          const next = markLatest(prev.filter((c) => c.id !== id));
          if (activeId === id) setActiveId(next[0]?.id ?? null);
          return next;
        });
      } catch {
        // 삭제 실패 시 상태 유지
      }
    },
    [conversations, activeId, user?.userId],
  );

  const send = useCallback(
    async (text) => {
      const trimmed = text.trim();
      if (!trimmed || isSending || !active?.isLatest) return;

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

  return {
    conversations,
    activeId,
    messages,
    isSending,
    isLoadingMessages,
    send,
    newConversation,
    selectConversation,
    removeConversation,
  };
}
