import api from './api';

const USE_MOCK = import.meta.env.DEV;

export async function startSession() {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    return { sessionId: Date.now(), startTime: new Date().toISOString() };
  }
  const { data } = await api.post('/api/v1/sessions');
  return data;
}

export async function endSession(sessionId) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    return { sessionId, endTime: new Date().toISOString() };
  }
  const { data } = await api.post(`/api/v1/sessions/${sessionId}/end`);
  return data;
}
