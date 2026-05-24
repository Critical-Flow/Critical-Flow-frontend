import api from './api';

const USE_MOCK = import.meta.env.DEV;

const MOCK_STATS = {
  totalHours: 23.5,
  totalHoursDelta: 12,
  noteCount: 14,
  noteCountDelta: 4,
  quizAccuracy: 78,
  quizAccuracyDelta: 5,
  streakDays: 12,
  streakGoalGap: 3,
  weekly: [
    { day: '월', hours: 2.5 },
    { day: '화', hours: 3.2 },
    { day: '수', hours: 1.8 },
    { day: '목', hours: 4.1 },
    { day: '금', hours: 2.9 },
    { day: '토', hours: 5.3 },
    { day: '일', hours: 3.7 },
  ],
  topics: [
    { name: '알고리즘', percent: 40 },
    { name: 'React', percent: 30 },
    { name: 'Python', percent: 20 },
    { name: '기타', percent: 10 },
  ],
};

export async function getStats() {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 300));
    return MOCK_STATS;
  }
  const { data } = await api.get('/api/dashboard/stats');
  return data;
}
