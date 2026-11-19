import Sidebar from './Sidebar';
import Footer from './Footer';
import ForestBackground from './ForestBackground';
import './AppLayout.css';

export default function AppLayout({ children, isGuest = false }) {
  return (
    <div className="app-layout">
      <Sidebar isGuest={isGuest} />
      <main className="main-content">
        <div className="main-body">
          <ForestBackground height={180} />
          {children}
        </div>
        <Footer />
      </main>
    </div>
  );
}
