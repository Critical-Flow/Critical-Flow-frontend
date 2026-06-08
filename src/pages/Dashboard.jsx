import AppLayout from '../components/AppLayout';
import PageHeader from '../components/PageHeader';
import KpiCard from '../components/KpiCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import useFetch from '../hooks/useFetch';
import { useAuth } from '../context/AuthContext';
import { getSessions } from '../services/session';
import { getNotes, getFolders } from '../services/notes';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import './Dashboard.css';

const DAYS = ['일', '월', '화', '수', '목', '금', '토'];

const TOPIC_COLORS = ['#3EA990', '#4DBDA3', '#5aaa8e', '#7fbfb1', '#a0d4c8'];

const TOOLTIP_STYLE = {
  borderRadius: 8,
  border: '1px solid var(--line)',
  background: 'var(--bg-panel)',
  fontSize: 13,
};

function getStudyMinutes(session) {
  if (session.totalStudyMinutes != null) return session.totalStudyMinutes;
  if (session.startTime && session.endTime) {
    return Math.round((new Date(session.endTime) - new Date(session.startTime)) / 60000);
  }
  return 0;
}

function calcStats(sessions, notes, folders) {
  const totalMinutes = sessions.reduce((sum, s) => sum + getStudyMinutes(s), 0);
  const totalFocus = sessions.reduce((sum, s) => sum + (s.totalFocusMinutes ?? 0), 0);
  const focusRate = totalMinutes > 0 ? Math.round((totalFocus / totalMinutes) * 100) : 0;

  // 오늘의 집중도
  const todayStr = new Date().toDateString();
  const todaySessions = sessions.filter((s) => new Date(s.startTime).toDateString() === todayStr);
  const todayDrowsy = todaySessions.reduce((sum, s) => sum + (s.drowsyCount ?? 0), 0);
  const todayAbsent = todaySessions.reduce((sum, s) => sum + (s.absentCount ?? 0), 0);

  // 요일별 학습/집중 시간 (최근 7일)
  const now = new Date();
  const weekly = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (6 - i));
    const dayStr = d.toDateString();
    const daySessions = sessions.filter((s) => new Date(s.startTime).toDateString() === dayStr);
    const studyMin = daySessions.reduce((sum, s) => sum + getStudyMinutes(s), 0);
    const focusMin = daySessions.reduce((sum, s) => sum + (s.totalFocusMinutes ?? 0), 0);
    return {
      day: DAYS[d.getDay()],
      study: Math.round((studyMin / 60) * 10) / 10,
      focus: Math.round((focusMin / 60) * 10) / 10,
    };
  });

  // 주제별 비중 (카테고리별 노트 수)
  const noteList = notes ?? [];
  const folderList = folders ?? [];
  const categoryCounts = noteList.reduce((acc, note) => {
    acc[note.categoryId] = (acc[note.categoryId] ?? 0) + 1;
    return acc;
  }, {});
  const topics = folderList
    .filter((f) => categoryCounts[f.categoryId])
    .map((f) => ({ name: f.title, count: categoryCounts[f.categoryId] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
  const totalNotes = topics.reduce((sum, t) => sum + t.count, 0);
  const topicsWithPercent = topics.map((t) => ({
    ...t,
    percent: Math.round((t.count / totalNotes) * 100),
  }));

  return { totalMinutes, focusRate, todayDrowsy, todayAbsent, weekly, topics: topicsWithPercent };
}

function formatMinutes(minutes) {
  if (minutes < 60) return `${minutes}분`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}시간 ${m}분` : `${h}시간`;
}

export default function Dashboard() {
  const { user } = useAuth();
  const { data: sessions, loading: sLoading, error: sError, refetch: refetchSessions } = useFetch(getSessions);
  const { data: notes, loading: nLoading, error: nError, refetch: refetchNotes } = useFetch(
    () => getNotes({ userId: user?.userId }),
    [user?.userId],
  );
  const { data: folders, loading: fLoading, error: fError, refetch: refetchFolders } = useFetch(getFolders);

  const loading = sLoading || nLoading || fLoading;
  const error = sError || nError || fError;

  if (loading) {
    return (
      <AppLayout>
        <div className="dash-container"><Loading /></div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="dash-container">
          <ErrorMessage
              message="학습 통계를 불러오지 못했어요."
              onRetry={() => { refetchSessions(); refetchNotes(); refetchFolders(); }}
            />
        </div>
      </AppLayout>
    );
  }

  const { totalMinutes, focusRate, todayDrowsy, todayAbsent, weekly, topics } = calcStats(
    sessions ?? [],
    notes ?? [],
    folders ?? [],
  );

  return (
    <AppLayout>
      <div className="dash-container">
        <PageHeader title="학습 통계" sub="나의 학습 현황" />

        <div className="kpi-grid">
          <KpiCard label="총 학습 시간" value={formatMinutes(totalMinutes)} />
          <KpiCard label="평균 집중률" value={`${focusRate}%`} />
          <KpiCard label="작성한 노트" value={`${(notes ?? []).length}개`} />
          <KpiCard
            label="오늘의 집중도"
            value={todayDrowsy + todayAbsent === 0 ? '이탈 없음' : `졸음 ${todayDrowsy}회 / 부재 ${todayAbsent}회`}
          />
        </div>

        <div className="charts">
          <div className="chart-card">
            <h3>최근 7일 학습 시간</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={weekly} barCategoryGap="30%" barGap={4}>
                <defs>
                  <linearGradient id="studyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#A8E0CD" />
                    <stop offset="100%" stopColor="#3EA990" />
                  </linearGradient>
                  <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#7ec8e3" />
                    <stop offset="100%" stopColor="#3a8fb5" />
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
                  formatter={(value, name) => [`${value}h`, name === 'study' ? '학습 시간' : '집중 시간']}
                  contentStyle={TOOLTIP_STYLE}
                  cursor={false}
                />
                <Bar dataKey="study" fill="url(#studyGradient)" radius={[6, 6, 0, 0]} activeBar={false} />
                <Bar dataKey="focus" fill="url(#focusGradient)" radius={[6, 6, 0, 0]} activeBar={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>주제별 비중</h3>
            {topics.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'var(--sub)', padding: '60px 0', fontSize: '14px' }}>
                노트가 없어요.
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={topics}
                      dataKey="percent"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {topics.map((_, idx) => (
                        <Cell key={idx} fill={TOPIC_COLORS[idx % TOPIC_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${value}%`, name]}
                      contentStyle={TOOLTIP_STYLE}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="pie-legend">
                  {topics.map((topic, idx) => (
                    <div key={topic.name} className="pie-legend-item">
                      <span className="pie-legend-dot" style={{ backgroundColor: TOPIC_COLORS[idx % TOPIC_COLORS.length] }} />
                      <span className="pie-legend-label">{topic.name}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
