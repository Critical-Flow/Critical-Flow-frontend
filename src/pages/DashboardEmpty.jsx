import { Link } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import './DashboardEmpty.css';

export default function DashboardEmpty() {
  return (
    <AppLayout isGuest>
      <div className="de-container">
        <div className="page-title">학습 통계</div>
        <div className="page-sub">최근 7일 학습 기록</div>
        <div className="empty-state">
          <div className="empty-mascot">💡</div>
          <h2>학습 내역이 없어요!</h2>
          <p>지금 바로 새로운 목표를 설정하고 학습을 시작해보세요.</p>
          <Link to="/create-empty" className="btn-primary-link">+ 첫 학습 생성하기</Link>
        </div>
      </div>
    </AppLayout>
  );
}
