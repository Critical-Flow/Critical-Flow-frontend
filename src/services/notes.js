import api from './api';

const USE_MOCK = import.meta.env.DEV;

const MOCK_NOTES = [
  { id: 1, folderId: 1, title: 'DFS와 BFS 정리', tags: ['알고리즘'], updatedAt: daysAgo(2), readMinutes: 12 },
  { id: 2, folderId: 2, title: 'useEffect 클린업', tags: ['React'], updatedAt: daysAgo(1), readMinutes: 8 },
  { id: 3, folderId: 3, title: '리스트 컴프리헨션', tags: ['Python'], updatedAt: daysAgo(3), readMinutes: 5 },
  { id: 4, folderId: 4, title: '해시 테이블', tags: ['자료구조'], updatedAt: daysAgo(5), readMinutes: 15 },
  { id: 5, folderId: 1, title: '다익스트라', tags: ['알고리즘'], updatedAt: daysAgo(7), readMinutes: 20 },
  { id: 6, folderId: 2, title: '상태 관리 비교', tags: ['React'], updatedAt: daysAgo(7), readMinutes: 10 },
  { id: 7, folderId: 1, title: '이분 탐색', tags: ['알고리즘'], updatedAt: daysAgo(8), readMinutes: 7 },
  { id: 8, folderId: 3, title: '데코레이터 패턴', tags: ['Python'], updatedAt: daysAgo(14), readMinutes: 9 },
  { id: 9, folderId: 4, title: '트리 순회', tags: ['자료구조'], updatedAt: daysAgo(14), readMinutes: 11 },
  { id: 10, folderId: 2, title: 'React Query', tags: ['React'], updatedAt: daysAgo(15), readMinutes: 14 },
  { id: 11, folderId: 3, title: '제너레이터', tags: ['Python'], updatedAt: daysAgo(21), readMinutes: 6 },
  { id: 12, folderId: 1, title: '동적 프로그래밍', tags: ['알고리즘'], updatedAt: daysAgo(21), readMinutes: 18 },
];

const MOCK_FOLDERS = [
  { id: 0, icon: '📚', name: '전체', count: 12 },
  { id: 1, icon: '💻', name: '알고리즘', count: 4 },
  { id: 2, icon: '⚛️', name: 'React', count: 3 },
  { id: 3, icon: '🐍', name: 'Python', count: 3 },
  { id: 4, icon: '📦', name: '자료구조', count: 2 },
];

const MOCK_TAGS = ['#복습필요', '#중요', '#시험범위'];

const MOCK_NOTE_DETAIL = `# DFS와 BFS 정리

그래프 탐색의 두 가지 기본 알고리즘.

## DFS (깊이 우선 탐색)

스택 또는 재귀로 구현한다. 한 경로를 끝까지 파고든 뒤 되돌아온다.

## BFS (너비 우선 탐색)

큐를 사용해 가까운 노드부터 방문한다.
`;

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export async function getNotes(params = {}) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    if (params.folderId && params.folderId !== 0) {
      return MOCK_NOTES.filter((n) => n.folderId === params.folderId);
    }
    return MOCK_NOTES;
  }
  const { data } = await api.get('/api/notes', { params });
  return data;
}

export async function getNote(id) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    const meta = MOCK_NOTES.find((n) => n.id === Number(id)) || MOCK_NOTES[0];
    return { ...meta, content: MOCK_NOTE_DETAIL };
  }
  const { data } = await api.get(`/api/notes/${id}`);
  return data;
}

export async function saveNote(note) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    return { id: note.id ?? Date.now(), ...note, updatedAt: new Date().toISOString() };
  }
  if (note.id) {
    const { data } = await api.put(`/api/notes/${note.id}`, note);
    return data;
  }
  const { data } = await api.post('/api/notes', note);
  return data;
}

export async function deleteNote(id) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 150));
    return { ok: true };
  }
  await api.delete(`/api/notes/${id}`);
  return { ok: true };
}

export async function getFolders() {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 150));
    return MOCK_FOLDERS;
  }
  const { data } = await api.get('/api/folders');
  return data;
}

export async function getTags() {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 150));
    return MOCK_TAGS;
  }
  const { data } = await api.get('/api/tags');
  return data;
}
