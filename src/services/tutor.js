import api from './api';

//const USE_MOCK = import.meta.env.DEV;
const USE_MOCK = false;

export async function getConversations(userId, noteId) {
  const { data } = await api.get('/api/v1/conversations', { params: { userId, noteId } });
  return data; // number[]
}

export async function startConversation({ noteId, userId, type = 'QUESTION' }) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    return {
      conversationId: Date.now(),
      noteId,
      userId,
      type,
      createdAt: new Date().toISOString(),
      firstQuestion: '노트 내용에 대해 무엇이든 물어보세요.',
    };
  }
  const { data } = await api.post('/api/v1/conversations', { noteId, userId, type });
  return data;
}

export async function getMessages(conversationId) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    return [];
  }
  const { data } = await api.get(`/api/v1/conversations/${conversationId}/messages`);
  return data;
}

export async function sendTutorMessage(conversationId, userMessage) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 800));
    return { content: `(mock 응답) "${userMessage.slice(0, 30)}"에 대한 설명입니다.` };
  }
  const { data } = await api.post(`/api/v1/conversations/${conversationId}/messages`, { userMessage });
  return data;
}

export async function deleteConversation(conversationId, userId) {
  await api.delete(`/api/v1/conversations/${conversationId}`, { params: { userId } });
}
