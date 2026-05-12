import AppLayout from '../components/AppLayout';
import './Dashboard.css';

const BAR_DATA = [
  { lbl: '월', val: '2.5h', h: 84 },
  { lbl: '화', val: '3.2h', h: 108 },
  { lbl: '수', val: '1.8h', h: 61 },
  { lbl: '목', val: '4.1h', h: 139 },
  { lbl: '금', val: '2.9h', h: 98 },
  { lbl: '토', val: '5.3h', h: 180 },
  { lbl: '일', val: '3.7h', h: 125 },
];

export default function Dashboard() {
  return (
    <AppLayout>
      <div className="dash-container">
        <div className="page-title">학습 통계</div>
        <div className="page-sub">최근 7일 학습 기록</div>

        <div className="kpi-grid">
          <div className="kpi">
            <div className="label">총 학습 시간</div>
            <div className="value">23.5h</div>
            <div className="delta up">▲ 12% vs 지난주</div>
          </div>
          <div className="kpi">
            <div className="label">작성한 노트</div>
            <div className="value">14개</div>
            <div className="delta up">▲ 4개</div>
          </div>
          <div className="kpi">
            <div className="label">퀴즈 정답률</div>
            <div className="value">78%</div>
            <div className="delta up">▲ 5%p</div>
          </div>
          <div className="kpi">
            <div className="label">연속 학습일</div>
            <div className="value">12일 🔥</div>
            <div className="delta up">목표까지 3일</div>
          </div>
        </div>

        <div className="charts">
          <div className="chart-card">
            <h3>요일별 학습 시간</h3>
            <div className="bar-chart">
              {BAR_DATA.map(({ lbl, val, h }) => (
                <div className="col" key={lbl}>
                  <div className="val">{val}</div>
                  <div className="bar" style={{ height: `${h}px` }} />
                  <div className="lbl">{lbl}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-card">
            <h3>주제별 비중</h3>
            <div className="donut">
              <svg viewBox="0 0 36 36" width="140" height="140">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#A8E0CD" strokeWidth="4"
                  strokeDasharray="40 100" strokeDashoffset="0" transform="rotate(-90 18 18)" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#3EA990" strokeWidth="4"
                  strokeDasharray="30 100" strokeDashoffset="-40" transform="rotate(-90 18 18)" />
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#4DBDA3" strokeWidth="4"
                  strokeDasharray="20 100" strokeDashoffset="-70" transform="rotate(-90 18 18)" />
              </svg>
              <div className="legend">
                <div><span className="dot" style={{ background: '#A8E0CD' }} />알고리즘 40%</div>
                <div><span className="dot" style={{ background: '#3EA990' }} />React 30%</div>
                <div><span className="dot" style={{ background: '#4DBDA3' }} />Python 20%</div>
                <div><span className="dot" style={{ background: '#e5e7eb' }} />기타 10%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
