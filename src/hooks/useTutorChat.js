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
    timestamp: m.createdAt ?? m.timestamp ?? null,
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
  const [mode, setMode] = useState('chat'); // 'ask' = 계속/새로 선택 대기, 'chat' = 채팅 화면

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
      setMode('chat');
    } catch (e) {
      const code = e.response?.data?.code;
      const errorMsg =
        code === 'CONVERSATION_NOTE_NOT_FOUND' ? '노트를 찾을 수 없어요.' :
        code === 'AI_RESPONSE_FAILED' ? 'AI 응답에 실패했어요. 잠시 후 다시 시도해주세요.' :
        '대화를 시작하지 못했어요. 잠시 후 다시 시도해주세요.';
      const localConv = {
        id: crypto.randomUUID(),
        conversationId: null,
        title: '새 대화',
        messages: [makeMessage('assistant', errorMsg)],
        updatedAt: new Date().toISOString(),
        isLatest: false,
      };
      setConversations((prev) => [localConv, ...prev]);
      setActiveId(localConv.id);
      setMode('chat');
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
        setMode('ask');
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
      setMode('chat');
      const conv = conversations.find((c) => c.id === id);
      if (!conv || conv.messages !== null) return;

      setIsLoadingMessages(true);
      try {
        const serverMessages = await getMessages(conv.conversationId);
        const localMessages = serverMessagesToLocal(serverMessages);
        const lastTimestamp = localMessages[localMessages.length - 1]?.timestamp ?? null;
        setConversations((prev) =>
          prev.map((c) =>
            c.id === id
              ? {
                  ...c,
                  messages: localMessages,
                  title: deriveTitleFromMessages(localMessages),
                  updatedAt: c.updatedAt ?? lastTimestamp,
                }
              : c,
          ),
        );
      } catch (e) {
        const errorMessage =
          e.response?.data?.code === 'CONVERSATION_NOT_FOUND'
            ? '대화를 찾을 수 없어요. 삭제된 대화일 수 있어요.'
            : '대화를 불러오지 못했어요. 잠시 후 다시 시도해주세요.';
        setConversations((prev) =>
          prev.map((c) =>
            c.id === id ? { ...c, messages: [makeMessage('assistant', errorMessage)] } : c,
          ),
        );
      } finally {
        setIsLoadingMessages(false);
      }
    },
    [conversations],
  );

  const continueLatest = useCallback(() => {
    setMode('chat');
    if (activeId) selectConversation(activeId);
  }, [activeId, selectConversation]);

  const removeConversation = useCallback(
    async (id) => {
      const conv = conversations.find((c) => c.id === id);
      if (!conv?.conversationId || !user?.userId) return;
      try {
        await deleteConversation(conv.conversationId, user.userId);
      } catch (e) {
        if (e.response?.data?.code !== 'CONVERSATION_NOT_FOUND') return;
      }
      setConversations((prev) => {
        const next = markLatest(prev.filter((c) => c.id !== id));
        if (activeId === id) setActiveId(next[0]?.id ?? null);
        return next;
      });
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
      } catch (e) {
        const code = e.response?.data?.code;
        const errorMsg =
          code === 'CONVERSATION_NOT_FOUND' ? '대화를 찾을 수 없어요. 새 대화를 시작해주세요.' :
          code === 'AI_RESPONSE_FAILED' ? 'AI 응답에 실패했어요. 잠시 후 다시 시도해주세요.' :
          '응답을 가져오지 못했어요. 잠시 후 다시 시도해주세요.';
        appendToActive(active.id, makeMessage('assistant', errorMsg));
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
    mode,
    send,
    newConversation,
    selectConversation,
    removeConversation,
    continueLatest,
  };
}
