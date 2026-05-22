import api from './api';

const USE_MOCK = import.meta.env.DEV;

const MOCK_QUIZ = {
  id: 1,
  noteId: 1,
  questions: [
    {
      id: 1,
      tag: '개념 이해',
      question: 'Q4. 다음 중 BFS(너비 우선 탐색)에 대한 설명으로 옳은 것은?',
      choices: [
        '스택을 이용해 구현하며, 가장 최근 방문한 노드부터 탐색한다.',
        '큐를 이용해 구현하며, 간선 가중치가 동일할 때 최단 경로를 보장한다.',
        '음수 가중치 그래프에서도 항상 최단 경로를 찾을 수 있다.',
        '시간복잡도는 항상 O(V²)이다.',
      ],
      answerIndex: 1,
      explanation:
        'BFS는 큐(FIFO)를 사용해 가까운 노드부터 탐색하며, 동일 가중치에서 최단 경로를 보장합니다.',
    },
  ],
};

export async function generateQuiz(noteId) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 500));
    return { ...MOCK_QUIZ, noteId };
  }
  const { data } = await api.post('/api/quiz/generate', { noteId });
  return data;
}

export async function submitAnswer(quizId, questionId, choiceIndex) {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 200));
    const q = MOCK_QUIZ.questions.find((it) => it.id === questionId);
    return {
      correct: q?.answerIndex === choiceIndex,
      explanation: q?.explanation ?? '',
    };
  }
  const { data } = await api.post(`/api/quiz/${quizId}/answer`, { questionId, choiceIndex });
  return data;
}
