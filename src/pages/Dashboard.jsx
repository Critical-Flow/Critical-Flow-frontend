import AppLayout from '../components/AppLayout';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import useFetch from '../hooks/useFetch';
import { getStats } from '../services/dashboard';
import './Dashboard.css';

const TOPIC_COLORS = ['#A8E0CD', '#3EA990', '#4DBDA3', '#e5e7eb'];

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

  let donutOffset = 0;

  return (
    <AppLayout>
      <div className="dash-container">
        <div className="page-title">학습 통계</div>
        <div className="page-sub">최근 7일 학습 기록</div>

        <div className="kpi-grid">
          <div className="kpi">
            <div className="label">총 학습 시간</div>
            <div className="value">{data.totalHours}h</div>
            <div className="delta up">▲ {data.totalHoursDelta}% vs 지난주</div>
          </div>
          <div className="kpi">
            <div className="label">작성한 노트</div>
            <div className="value">{data.noteCount}개</div>
            <div className="delta up">▲ {data.noteCountDelta}개</div>
          </div>
          <div className="kpi">
            <div className="label">퀴즈 정답률</div>
            <div className="value">{data.quizAccuracy}%</div>
            <div className="delta up">▲ {data.quizAccuracyDelta}%p</div>
          </div>
          <div className="kpi">
            <div className="label">연속 학습일</div>
            <div className="value">{data.streakDays}일 🔥</div>
            <div className="delta up">목표까지 {data.streakGoalGap}일</div>
          </div>
        </div>

        <div className="charts">
          <div className="chart-card">
            <h3>요일별 학습 시간</h3>
            <div className="bar-chart">
              {data.weekly.map(({ day, hours }) => (
                <div className="col" key={day}>
                  <div className="val">{hours}h</div>
                  <div className="bar" style={{ height: `${Math.round(hours * 34)}px` }} />
                  <div className="lbl">{day}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-card">
            <h3>주제별 비중</h3>
            <div className="donut">
              <svg viewBox="0 0 36 36" width="140" height="140">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                {data.topics.map(({ name, percent }, idx) => {
                  const dashArray = `${percent} 100`;
                  const dashOffset = -donutOffset;
                  donutOffset += percent;
                  return (
                    <circle
                      key={name}
                      cx="18" cy="18" r="15.9"
                      fill="none"
                      stroke={TOPIC_COLORS[idx % TOPIC_COLORS.length]}
                      strokeWidth="4"
                      strokeDasharray={dashArray}
                      strokeDashoffset={dashOffset}
                      transform="rotate(-90 18 18)"
                    />
                  );
                })}
              </svg>
              <div className="legend">
                {data.topics.map(({ name, percent }, idx) => (
                  <div key={name}>
                    <span className="dot" style={{ background: TOPIC_COLORS[idx % TOPIC_COLORS.length] }} />
                    {name} {percent}%
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
