import api from './api';

const USE_MOCK = import.meta.env.DEV;

export async function startSession(payload) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    return { sessionId: Date.now(), startedAt: new Date().toISOString() };
  }
  const { data } = await api.post('/api/sessions/start', payload);
  return data;
}

export async function endSession(sessionId, payload) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    return {
      sessionId,
      endedAt: new Date().toISOString(),
      durationMinutes: payload?.durationMinutes ?? 0,
    };
  }
  const { data } = await api.post(`/api/sessions/${sessionId}/end`, payload);
  return data;
}
