import api from './api';

//MUCK 데이터용
//const USE_MOCK = import.meta.env.DEV;

//실제 서버 API용
const USE_MOCK = false;


const MOCK_USER = {
  id: 1,
  name: '김영남',
  username: 'kimyoungnam',
  avatarUrl: '',
  email: 'kimyoungnam@example.com',
};

export async function getMe() {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    return MOCK_USER;
  }
  const { data } = await api.get('/api/v1/users/me');
  return data;
}

export async function updateProfile(payload) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    return { ...MOCK_USER, ...payload };
  }
  const { data } = await api.patch('/api/v1/users/me/profile', payload);
  return data;
}

export async function logoutApi() {
  if (USE_MOCK) return { ok: true };
  await api.post('/api/v1/auth/logout');
  return { ok: true };
}

export async function deleteAccount() {
  if (USE_MOCK) return { ok: true };
  await api.delete('/api/v1/users/me');
  return { ok: true };
}
