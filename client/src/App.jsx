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
import TutorDashboard  from './pages/tutor/TutorDashboard';
import Landing         from './pages/Landing';
import PaymentSuccess  from './pages/PaymentSuccess';

const ProtectedRoute = ({ children, adminOnly, tutorOnly }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" />;
  if (tutorOnly && user.role !== 'instructor' && user.role !== 'admin')
    return <Navigate to="/dashboard" />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          {/* Public */}
          <Route path="/"              element={<Landing />} />
          <Route path="/login"         element={<Login />} />
          <Route path="/register"      element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/courses"       element={<CourseList />} />
          <Route path="/courses/:id"   element={<CourseDetail />} />

          {/* Student */}
          <Route path="/dashboard"     element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/profile"       element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
          <Route path="/learn/:courseId/lesson/:lessonId" element={<ProtectedRoute><VideoPlayer /></ProtectedRoute>} />
          <Route path="/quiz/:courseId" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />

          {/* Tutor */}
          <Route path="/tutor"         element={<ProtectedRoute tutorOnly><TutorDashboard /></ProtectedRoute>} />
          <Route path="/tutor/courses" element={<ProtectedRoute tutorOnly><ManageCourses /></ProtectedRoute>} />
          <Route path="/tutor/quizzes" element={<ProtectedRoute tutorOnly><ManageQuizzes /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin"         element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/courses" element={<ProtectedRoute adminOnly><ManageCourses /></ProtectedRoute>} />
          <Route path="/admin/users"   element={<ProtectedRoute adminOnly><ManageUsers /></ProtectedRoute>} />
          <Route path="/admin/quizzes" element={<ProtectedRoute adminOnly><ManageQuizzes /></ProtectedRoute>} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/courses" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}