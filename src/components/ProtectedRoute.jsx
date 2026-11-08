import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  // 로그인 페이지가 "로그인이 필요해 이동됨" 안내를 띄울 수 있도록 state로 사유를 넘긴다.
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ reason: 'auth-required' }} />;
  return children;
}
