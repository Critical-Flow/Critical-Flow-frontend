import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ModalProvider } from './context/ModalContext';
import { AuthProvider } from './context/AuthContext';
import MyPageModal from './components/MyPageModal';
import ErrorBoundary from './components/ErrorBoundary';
import Loading from './components/Loading';
import Landing from './pages/Landing';
import './styles/global.css';

// 라우트 단위 코드 스플리팅 — 진입점(Landing) 외 페이지는 지연 로딩한다.
// 특히 Milkdown이 포함된 Editor 번들을 초기 로드에서 분리하는 효과가 크다.
const Login = lazy(() => import('./pages/Login'));
const OAuthCallback = lazy(() => import('./pages/OAuthCallback'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const DashboardEmpty = lazy(() => import('./pages/DashboardEmpty'));
const Directory = lazy(() => import('./pages/Directory'));
const DirectoryEmpty = lazy(() => import('./pages/DirectoryEmpty'));
const Editor = lazy(() => import('./pages/Editor'));
const Create = lazy(() => import('./pages/Create'));
const Quiz = lazy(() => import('./pages/Quiz'));

// 경로가 바뀌면 key로 ErrorBoundary를 재마운트해, 이전 페이지의 에러 상태를
// 새 페이지로 끌고 가지 않고 자동으로 회복한다.
function AppRoutes() {
  const location = useLocation();
  return (
    <ErrorBoundary key={location.pathname}>
      <Suspense fallback={<Loading fullPage />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard-empty" element={<DashboardEmpty />} />
          <Route path="/directory" element={<Directory />} />
          <Route path="/directory-empty" element={<DirectoryEmpty />} />
          <Route path="/editor/:noteId" element={<Editor />} />
          <Route path="/create" element={<Create />} />
          <Route path="/create-empty" element={<Create isGuest />} />
          <Route path="/quiz/:noteId" element={<Quiz />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <BrowserRouter>
          <AppRoutes />
          <MyPageModal />
        </BrowserRouter>
      </ModalProvider>
    </AuthProvider>
  );
}
