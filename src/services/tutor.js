import api from './api';

const USE_MOCK = import.meta.env.DEV;

export async function sendMessage(message, context = {}) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 800));
    return {
      role: 'assistant',
      message: `(mock 응답) "${message.slice(0, 30)}"에 대한 설명을 준비 중입니다.`,
      timestamp: new Date().toISOString(),
    };
  }
  const { data } = await api.post('/api/tutor/chat', { message, context });
  return data;
}
