import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

import Login           from './pages/auth/Login';
import Register        from './pages/auth/Register';
import ForgotPassword  from './pages/auth/ForgotPassword';
import CourseList      from './pages/student/CourseList';
import CourseDetail    from './pages/student/CourseDetail';
import VideoPlayer     from './pages/student/VideoPlayer';
import Dashboard       from './pages/student/Dashboard';
import QuizPage        from './pages/student/QuizPage';
import Profile         from './pages/student/Profile';
import AdminDashboard  from './pages/admin/AdminDashboard';
import ManageCourses   from './pages/admin/ManageCourses';
import ManageUsers     from './pages/admin/ManageUsers';
import ManageQuizzes   from './pages/admin/ManageQuizzes';

const ProtectedRoute = ({ children, adminOnly }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          {/* Public */}
          <Route path="/login"           element={<Login />} />
          <Route path="/register"        element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/courses"         element={<CourseList />} />
          <Route path="/courses/:id"     element={<CourseDetail />} />

          {/* Student protected */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile"   element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/learn/:courseId/lesson/:lessonId" element={<ProtectedRoute><VideoPlayer /></ProtectedRoute>} />
          <Route path="/quiz/:courseId" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />

          {/* Admin protected */}
          <Route path="/admin"          element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/courses"  element={<ProtectedRoute adminOnly><ManageCourses /></ProtectedRoute>} />
          <Route path="/admin/users"    element={<ProtectedRoute adminOnly><ManageUsers /></ProtectedRoute>} />
          <Route path="/admin/quizzes"  element={<ProtectedRoute adminOnly><ManageQuizzes /></ProtectedRoute>} />

          {/* Redirects */}
          <Route path="/"  element={<Navigate to="/courses" />} />
          <Route path="*"  element={<Navigate to="/courses" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}