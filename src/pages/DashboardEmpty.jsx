import { Link } from 'react-router-dom';
import Mascot from '../components/Mascot';
import AppLayout from '../components/AppLayout';
import PageHeader from '../components/PageHeader';
import './DashboardEmpty.css';

export default function DashboardEmpty() {
  return (
    <AppLayout isGuest>
      <div className="de-container">
        <PageHeader title="학습 통계" sub="최근 7일 학습 기록" />
        <div className="empty-state">
          <div className="empty-mascot empty-mascot--plain"><Mascot expression="default" size={88} /></div>
          <h2>학습 내역이 없어요!</h2>
          <p>지금 바로 새로운 목표를 설정하고 학습을 시작해보세요.</p>
          <Link to="/create-empty" className="btn-primary-link">+ 첫 학습 생성하기</Link>
        </div>
      </div>
    </AppLayout>
  );
}
