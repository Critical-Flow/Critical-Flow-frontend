import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import './MyPage.css';

export default function MyPage() {
  return (
    <>
      <Sidebar />
      <div className="sidebar-layout">
        <div className="container">
          <div className="page-title">마이페이지</div>
          <div className="page-sub">계정과 학습 환경을 관리하세요</div>

          <div className="profile-layout">
            <aside className="profile-card">
              <div className="avatar">K</div>
              <h2>김영남</h2>
              <div className="email">kim@yu.ac.kr</div>
              <button className="btn btn-ghost" style={{ marginTop: '14px' }}>프로필 편집</button>
              <div className="profile-stats">
                <div><b>14</b>노트</div>
                <div><b>78%</b>정답률</div>
                <div><b>12</b>연속일</div>
              </div>
            </aside>

            <div className="settings">
              <div className="card">
                <h3>계정 정보</h3>
                <div className="field">
                  <div><div className="lbl">이름</div><div className="desc">김영남</div></div>
                  <button className="btn btn-ghost">변경</button>
                </div>
                <div className="field">
                  <div><div className="lbl">이메일</div><div className="desc">kim@yu.ac.kr</div></div>
                  <button className="btn btn-ghost">변경</button>
                </div>
                <div className="field">
                  <div><div className="lbl">연결된 계정</div><div className="desc">GitHub · @kimyoungnam</div></div>
                  <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: 700 }}>● 연결됨</span>
                </div>
              </div>

              <div className="card">
                <h3>알림 설정</h3>
                <div className="field">
                  <div><div className="lbl">학습 리마인더</div><div className="desc">매일 학습 시간을 알려드립니다</div></div>
                  <div className="toggle" />
                </div>
                <div className="field">
                  <div><div className="lbl">퀴즈 추천 알림</div><div className="desc">복습 타이밍에 맞춰 퀴즈를 추천</div></div>
                  <div className="toggle" />
                </div>
                <div className="field">
                  <div><div className="lbl">주간 리포트</div><div className="desc">매주 월요일 학습 요약 메일</div></div>
                  <div className="toggle off" />
                </div>
              </div>

              <div className="card">
                <h3>환경 설정</h3>
                <div className="field">
                  <div><div className="lbl">테마</div><div className="desc">밝은 테마 / 어두운 테마</div></div>
                  <select style={{ width: '140px' }}>
                    <option>라이트</option>
                    <option>다크</option>
                    <option>시스템</option>
                  </select>
                </div>
                <div className="field">
                  <div><div className="lbl">에디터 폰트</div><div className="desc">코드 블록 표시 폰트</div></div>
                  <select style={{ width: '140px' }}>
                    <option>JetBrains Mono</option>
                    <option>Consolas</option>
                    <option>D2Coding</option>
                  </select>
                </div>
              </div>

              <div className="card">
                <h3 className="danger">위험 구역</h3>
                <div className="field">
                  <div><div className="lbl">로그아웃</div><div className="desc">현재 기기에서 로그아웃</div></div>
                  <button className="btn btn-ghost">로그아웃</button>
                </div>
                <div className="field">
                  <div><div className="lbl danger">계정 삭제</div><div className="desc">모든 데이터가 영구 삭제됩니다</div></div>
                  <button className="btn btn-ghost" style={{ color: '#dc2626' }}>삭제</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
