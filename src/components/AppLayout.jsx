import Sidebar from './Sidebar';
import Footer from './Footer';
import './AppLayout.css';

export default function AppLayout({ children, isGuest = false }) {
  return (
    <div className="app-layout">
      <Sidebar isGuest={isGuest} />
      <main className="main-content">
        {children}
        <Footer />
      </main>
    </div>
  );
}
