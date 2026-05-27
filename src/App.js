import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ModalProvider } from './context/ModalContext';
import { AuthProvider } from './context/AuthContext';
import MyPageModal from './components/MyPageModal';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DashboardEmpty from './pages/DashboardEmpty';
import Directory from './pages/Directory';
import DirectoryEmpty from './pages/DirectoryEmpty';
import Editor from './pages/Editor';
import Create from './pages/Create';
import Quiz from './pages/Quiz';
import './styles/global.css';

export default function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard-empty" element={<DashboardEmpty />} />
            <Route path="/directory" element={<Directory />} />
            <Route path="/directory-empty" element={<DirectoryEmpty />} />
            <Route path="/editor/:noteId" element={<Editor />} />
            <Route path="/create" element={<Create />} />
            <Route path="/create-empty" element={<Create isGuest />} />
            <Route path="/quiz/:noteId" element={<Quiz />} />
          </Routes>
          <MyPageModal />
        </BrowserRouter>
      </ModalProvider>
    </AuthProvider>
  );
}
