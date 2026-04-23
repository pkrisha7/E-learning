import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/stats', authHeaders())
      .then(res => setStats(res.data))
      .catch(() => {});
  }, []);

  const cards = [
    { label: 'Total Users',   value: stats?.users,       color: 'bg-purple-50 text-purple-700', icon: '👥' },
    { label: 'Total Courses', value: stats?.courses,     color: 'bg-blue-50 text-blue-700',     icon: '📚' },
    { label: 'Enrollments',   value: stats?.enrollments, color: 'bg-green-50 text-green-700',   icon: '🎓' },
    { label: 'Revenue (USD)', value: `$${stats?.revenue || 0}`, color: 'bg-amber-50 text-amber-700', icon: '💰' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-purple-600">LearnHub Admin</h1>
        <div className="flex items-center gap-4">
          <Link to="/courses" className="text-sm text-gray-500 hover:text-purple-600">View Site</Link>
          <span className="text-sm text-gray-400">|</span>
          <span className="text-sm text-gray-600">Hi, {user?.name}</span>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="text-sm text-red-400 hover:text-red-600 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-1">Dashboard</h2>
        <p className="text-gray-400 mb-8">Welcome back, {user?.name}</p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {cards.map(c => (
            <div key={c.label} className={`rounded-2xl p-5 ${c.color}`}>
              <div className="text-3xl mb-3">{c.icon}</div>
              <div className="text-3xl font-bold">{stats ? c.value : '—'}</div>
              <div className="text-sm mt-1 opacity-70">{c.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { to: '/admin/courses', icon: '📚', title: 'Manage Courses', desc: 'Add, edit, publish or delete courses', color: 'hover:border-purple-300 hover:bg-purple-50' },
            { to: '/admin/users',   icon: '👥', title: 'Manage Users',   desc: 'View all users and change roles',     color: 'hover:border-blue-300 hover:bg-blue-50' },
            { to: '/admin/quizzes', icon: '📝', title: 'Manage Quizzes', desc: 'Create and edit course quizzes',      color: 'hover:border-green-300 hover:bg-green-50' },
          ].map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`bg-white border border-gray-100 rounded-2xl p-6 shadow-sm transition group ${item.color}`}
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-purple-700 transition">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.desc}</p>
              <div className="mt-4 text-purple-500 text-sm font-medium group-hover:translate-x-1 transition-transform inline-block">
                Go →
              </div>
            </Link>
          ))}
        </div>

        {/* Recent activity placeholder */}
        <div className="mt-10 bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-semibold text-gray-700 mb-4">Getting Started</h3>
          <div className="space-y-3">
            {[
              { done: true,  text: 'Server & database connected' },
              { done: true,  text: 'Admin account created' },
              { done: false, text: 'Create your first course' },
              { done: false, text: 'Add lessons with video URLs' },
              { done: false, text: 'Create a quiz for your course' },
              { done: false, text: 'Publish course for students' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold
                  ${item.done ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  {item.done ? '✓' : '○'}
                </span>
                <span className={item.done ? 'text-gray-400 line-through' : 'text-gray-700'}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}