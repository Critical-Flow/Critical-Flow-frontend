import api from './api';

//const USE_MOCK = import.meta.env.DEV;
const USE_MOCK = false;

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

const MOCK_NOTES = [
  { noteId: 1, categoryId: 1, title: 'DFS와 BFS 정리', updatedAt: daysAgo(2), readMinutes: 12 },
  { noteId: 2, categoryId: 2, title: 'useEffect 클린업', updatedAt: daysAgo(1), readMinutes: 8 },
  { noteId: 3, categoryId: 3, title: '리스트 컴프리헨션', updatedAt: daysAgo(3), readMinutes: 5 },
  { noteId: 4, categoryId: 4, title: '해시 테이블', updatedAt: daysAgo(5), readMinutes: 15 },
  { noteId: 5, categoryId: 1, title: '다익스트라', updatedAt: daysAgo(7), readMinutes: 20 },
  { noteId: 6, categoryId: 2, title: '상태 관리 비교', updatedAt: daysAgo(7), readMinutes: 10 },
  { noteId: 7, categoryId: 1, title: '이분 탐색', updatedAt: daysAgo(8), readMinutes: 7 },
  { noteId: 8, categoryId: 3, title: '데코레이터 패턴', updatedAt: daysAgo(14), readMinutes: 9 },
  { noteId: 9, categoryId: 4, title: '트리 순회', updatedAt: daysAgo(14), readMinutes: 11 },
  { noteId: 10, categoryId: 2, title: 'React Query', updatedAt: daysAgo(15), readMinutes: 14 },
  { noteId: 11, categoryId: 3, title: '제너레이터', updatedAt: daysAgo(21), readMinutes: 6 },
  { noteId: 12, categoryId: 1, title: '동적 프로그래밍', updatedAt: daysAgo(21), readMinutes: 18 },
];

const MOCK_FOLDERS = [
  { categoryId: 1, title: '알고리즘', description: '' },
  { categoryId: 2, title: 'React', description: '' },
  { categoryId: 3, title: 'Python', description: '' },
  { categoryId: 4, title: '자료구조', description: '' },
];

const MOCK_NOTE_DETAIL = `# DFS와 BFS 정리

그래프 탐색의 두 가지 기본 알고리즘.

## DFS (깊이 우선 탐색)

스택 또는 재귀로 구현한다. 한 경로를 끝까지 파고든 뒤 되돌아온다.

## BFS (너비 우선 탐색)

큐를 사용해 가까운 노드부터 방문한다.
`;

export async function getNotes(params = {}) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    return MOCK_NOTES;
  }
  const { data } = await api.get('/api/notes', { params });
  return data;
}

export async function getNote(noteId, userId) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    const meta = MOCK_NOTES.find((n) => n.noteId === Number(noteId)) ?? MOCK_NOTES[0];
    return { ...meta, content: MOCK_NOTE_DETAIL };
  }
  const { data } = await api.get(`/api/notes/${noteId}`, { params: { userId } });
  return data;
}

export async function saveNote(note, userId) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    return { noteId: note.noteId ?? Date.now(), ...note, updatedAt: new Date().toISOString() };
  }
  const { noteId, ...body } = note;
  if (noteId) {
    const { data } = await api.put(`/api/notes/${noteId}`, body, { params: { userId } });
    return data;
  }
  const { data } = await api.post('/api/notes', body, { params: { userId } });
  return data;
}

export async function deleteNote(noteId, userId) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 150));
    return { ok: true };
  }
  await api.delete(`/api/notes/${noteId}`, { params: { userId } });
  return { ok: true };
}

export async function getFolders() {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 150));
    return MOCK_FOLDERS;
  }
  const { data } = await api.get('/api/v1/categories');
  return data;
}

export async function createCategory({ title, description }) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    return { categoryId: Date.now(), title, description, createdAt: new Date().toISOString() };
  }
  const { data } = await api.post('/api/v1/categories', { title, description });
  return data;
}

export async function updateCategory(categoryId, payload) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    return { categoryId, ...payload };
  }
  const { data } = await api.patch(`/api/v1/categories/${categoryId}`, payload);
  return data;
}

export async function deleteCategory(categoryId) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 150));
    return { ok: true };
  }
  await api.delete(`/api/v1/categories/${categoryId}`);
  return { ok: true };
}

export async function getNotesByCategory(categoryId) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    return MOCK_NOTES.filter((n) => n.categoryId === categoryId);
  }
  const { data } = await api.get(`/api/v1/categories/${categoryId}/notes`);
  return data;
}

export async function reembedNotes() {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    return { ok: true };
  }
  const { data } = await api.post('/api/notes/reembed');
  return data;
}
