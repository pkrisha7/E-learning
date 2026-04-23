import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

import Login        from './pages/auth/Login';
import Register     from './pages/auth/Register';
import CourseList   from './pages/student/CourseList';
import CourseDetail from './pages/student/CourseDetail';
import VideoPlayer  from './pages/student/VideoPlayer';
import Dashboard    from './pages/student/Dashboard';
import QuizPage     from './pages/student/QuizPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCourses  from './pages/admin/ManageCourses';

const ProtectedRoute = ({ children, adminOnly }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/courses"  element={<CourseList />} />
          <Route path="/courses/:id" element={<CourseDetail />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/learn/:courseId/lesson/:lessonId" element={<ProtectedRoute><VideoPlayer /></ProtectedRoute>} />
          <Route path="/quiz/:courseId" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/courses" element={<ProtectedRoute adminOnly><ManageCourses /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/courses" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}