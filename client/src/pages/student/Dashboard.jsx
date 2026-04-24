import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/courses/my-enrollments', authHeaders())
      .then(res => setEnrollments(res.data))
      .catch(() => setEnrollments([]))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-purple-600">LearnHub</h1>
        <div className="flex items-center gap-5">
          <Link to="/courses" className="text-sm text-gray-600 hover:text-purple-600">Browse Courses</Link>
          <Link to="/profile" className="text-sm text-gray-600 hover:text-purple-600">Profile</Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="text-sm text-purple-600 font-medium hover:underline">Admin Panel</Link>
          )}
          <button onClick={handleLogout} className="text-sm text-red-400 hover:text-red-600 transition">Logout</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white mb-10">
          <h2 className="text-3xl font-bold mb-1">Welcome back, {user?.name?.split(' ')[0]}! 👋</h2>
          <p className="text-purple-200">You have {enrollments.length} course{enrollments.length !== 1 ? 's' : ''} in progress.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Enrolled',   value: enrollments.length,                                    icon: '📚', color: 'bg-purple-50 text-purple-700' },
            { label: 'Completed',  value: enrollments.filter(e => e.completedAt).length,          icon: '✅', color: 'bg-green-50 text-green-700' },
            { label: 'In Progress',value: enrollments.filter(e => !e.completedAt).length,         icon: '▶️', color: 'bg-blue-50 text-blue-700' },
            { label: 'Certificates',value: enrollments.filter(e => e.certificate).length,         icon: '🎓', color: 'bg-amber-50 text-amber-700' },
          ].map(s => (
            <div key={s.label} className={`rounded-2xl p-5 ${s.color}`}>
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-sm opacity-70 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* My Courses */}
        <h3 className="text-xl font-bold text-gray-900 mb-4">My Courses</h3>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="bg-gray-200 rounded-2xl h-52 animate-pulse"/>)}
          </div>
        ) : enrollments.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <div className="text-5xl mb-4">📚</div>
            <p className="text-gray-500 text-lg mb-2">No courses yet</p>
            <p className="text-gray-400 text-sm mb-6">Start learning by browsing our course catalog</p>
            <Link to="/courses" className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition">
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map(({ course, progress, completedAt, _id }) => {
              const total     = course?.lessons?.length || 0;
              const completed = progress?.filter(p => p.completed).length || 0;
              const pct       = total > 0 ? Math.round((completed / total) * 100) : 0;
              return (
                <div key={_id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition">
                  {course?.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-36 object-cover"/>
                  ) : (
                    <div className="w-full h-36 bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-4xl">📚</div>
                  )}
                  <div className="p-5">
                    <h4 className="font-semibold text-gray-900 mb-1 truncate">{course?.title}</h4>
                    <p className="text-xs text-gray-400 mb-3">{course?.lessons?.length || 0} lessons</p>

                    {/* Progress bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Progress</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }}/>
                      </div>
                    </div>

                    {completedAt ? (
                      <span className="inline-block text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full font-medium">
                        ✅ Completed
                      </span>
                    ) : (
                      <Link
                        to={`/learn/${course?._id}/lesson/${course?.lessons?.[0]?._id}`}
                        className="block text-center bg-purple-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-purple-700 transition"
                      >
                        {pct > 0 ? 'Continue' : 'Start Learning'}
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Browse more */}
        <div className="mt-10 text-center">
          <Link to="/courses" className="text-purple-600 font-medium hover:underline text-sm">
            Browse more courses →
          </Link>
        </div>
      </div>
    </div>
  );
}