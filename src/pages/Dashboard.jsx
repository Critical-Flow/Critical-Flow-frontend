import AppLayout from '../components/AppLayout';
import PageHeader from '../components/PageHeader';
import KpiCard from '../components/KpiCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import useFetch from '../hooks/useFetch';
import { getStats } from '../services/dashboard';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import './Dashboard.css';

const TOPIC_COLOR_MAP = {
  '알고리즘': '#3EA990',
  'React':    '#4DBDA3',
  'Python':   '#5aaa8e',
  '기타':     '#7fbfb1',
};
const getTopicColor = (name) => TOPIC_COLOR_MAP[name] ?? '#3EA990';

const TOOLTIP_STYLE = {
  borderRadius: 8,
  border: '1px solid var(--line)',
  background: 'var(--bg-panel)',
  fontSize: 13,
};

export default function Dashboard() {
  const { data, loading, error, refetch } = useFetch(getStats);

  if (loading) {
    return (
      <AppLayout>
        <div className="dash-container"><Loading /></div>
      </AppLayout>
    );
  }

  if (error || !data) {
    return (
      <AppLayout>
        <div className="dash-container">
          <ErrorMessage message="학습 통계를 불러오지 못했어요." onRetry={refetch} />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="dash-container">
        <PageHeader title="학습 통계" sub="최근 7일 학습 기록" />

        <div className="kpi-grid">
          <KpiCard label="총 학습 시간" value={`${data.totalHours}h`} delta={`▲ ${data.totalHoursDelta}% vs 지난주`} />
          <KpiCard label="작성한 노트" value={`${data.noteCount}개`} delta={`▲ ${data.noteCountDelta}개`} />
          <KpiCard label="퀴즈 정답률" value={`${data.quizAccuracy}%`} delta={`▲ ${data.quizAccuracyDelta}%p`} />
          <KpiCard label="연속 학습일" value={`${data.streakDays}일 🔥`} delta={`목표까지 ${data.streakGoalGap}일`} />
        </div>

        <div className="charts">
          <div className="chart-card">
            <h3>요일별 학습 시간</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={data.weekly} barCategoryGap="35%">
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#A8E0CD" />
                    <stop offset="100%" stopColor="#3EA990" />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'var(--sub)', fontWeight: 600 }}
                />
                <YAxis hide />
                <Tooltip
                  formatter={(value) => [`${value}h`, '학습 시간']}
                  contentStyle={TOOLTIP_STYLE}
                  cursor={false}
                />
                <Bar dataKey="hours" fill="url(#barGradient)" radius={[8, 8, 0, 0]} activeBar={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>주제별 비중</h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={data.topics}
                  dataKey="percent"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {data.topics.map((topic, idx) => (
                    <Cell key={idx} fill={getTopicColor(topic.name)} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value}%`, '비중']}
                  contentStyle={TOOLTIP_STYLE}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="pie-legend">
              {data.topics.map((topic) => (
                <div key={topic.name} className="pie-legend-item">
                  <span className="pie-legend-dot" style={{ backgroundColor: getTopicColor(topic.name) }} />
                  <span className="pie-legend-label">{topic.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
