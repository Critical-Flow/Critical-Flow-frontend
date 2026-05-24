import api from './api';

const USE_MOCK = import.meta.env.DEV;

const MOCK_USER = {
  id: 1,
  name: '김영남',
  username: 'kimyoungnam',
  avatarUrl: '',
  email: 'kimyoungnam@example.com',
};

export async function loginWithGithub(code) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    return { token: `mock-token-${Date.now()}`, user: MOCK_USER };
  }
  const { data } = await api.post('/api/auth/github', { code });
  return data;
}

export async function getMe() {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    return MOCK_USER;
  }
  const { data } = await api.get('/api/auth/me');
  return data;
}

export async function updateProfile(payload) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    return { ...MOCK_USER, ...payload };
  }
  const { data } = await api.patch('/api/auth/me', payload);
  return data;
}

export async function logoutApi() {
  if (USE_MOCK) return { ok: true };
  await api.post('/api/auth/logout');
  return { ok: true };
}
