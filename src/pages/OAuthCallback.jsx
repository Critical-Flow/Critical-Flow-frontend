import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMe } from '../services/auth';
import { setItem, STORAGE_KEYS } from '../utils/storage';
import Loading from '../components/Loading';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    setItem(STORAGE_KEYS.ACCESS_TOKEN, token);

    getMe()
      .then((user) => {
        login(token, user);
        navigate('/dashboard', { replace: true });
      })
      .catch(() => {
        navigate('/login', { replace: true });
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return <Loading fullPage message="로그인 중..." />;
}
