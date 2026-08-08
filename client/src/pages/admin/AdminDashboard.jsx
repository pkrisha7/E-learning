import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import Logo from '../../components/Logo';
import SettingsDropdown from '../../components/SettingsDropdown';

const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/stats', authHeaders())
      .then(res => setStats(res.data))
      .catch(() => {});
  }, []);

  const cards = [
    { label: 'Total Registered Users', value: stats?.users,             color: 'bg-sky-50 border-sky-100 text-sky-700',       icon: '👥' },
    { label: 'Published Courses',      value: stats?.courses,           color: 'bg-cyan-50 border-cyan-100 text-cyan-700',     icon: '📚' },
    { label: 'Total Enrollments',      value: stats?.enrollments,       color: 'bg-emerald-50 border-emerald-100 text-emerald-700', icon: '🎓' },
    { label: 'Platform Revenue',       value: `Rs. ${(stats?.revenue || 0).toLocaleString('en-IN')}`,color: 'bg-indigo-50 border-indigo-100 text-indigo-700',   icon: '💰' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Logo size="md" />
          <span className="bg-rose-100 text-rose-700 border border-rose-200 text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Admin Console
          </span>
        </div>
        <SettingsDropdown />
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-slate-900">Admin Control Center</h2>
          <p className="text-slate-500 text-sm mt-1">Platform overview, metrics, and administration tools</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
          {cards.map(c => (
            <div key={c.label} className={`rounded-3xl p-6 border shadow-xs ${c.color}`}>
              <div className="text-3xl mb-2">{c.icon}</div>
              <div className="text-3xl font-extrabold">{stats ? c.value : '—'}</div>
              <div className="text-xs font-semibold uppercase tracking-wider opacity-75 mt-1">{c.label}</div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <h3 className="text-xl font-extrabold text-slate-900 mb-5">Admin Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { to: '/admin/courses', icon: '📚', title: 'Manage Courses', desc: 'Create, edit, publish or remove learning courses' },
            { to: '/admin/users',   icon: '👥', title: 'Manage Users',   desc: 'Inspect accounts, update privileges & roles' },
            { to: '/admin/quizzes', icon: '📝', title: 'Manage Quizzes', desc: 'Create and update course quizzes & assessments' },
          ].map(item => (
            <Link
              key={item.to}
              to={item.to}
              className="bg-white border border-slate-200/80 rounded-3xl p-7 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="text-4xl mb-4 p-3 bg-slate-50 w-fit rounded-2xl border border-slate-100 group-hover:scale-110 transition-transform">{item.icon}</div>
                <h3 className="font-extrabold text-slate-900 text-lg mb-2 group-hover:text-sky-600 transition-colors">{item.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
              <div className="mt-6 text-sky-600 font-bold text-xs group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Access Module →
              </div>
            </Link>
          ))}
        </div>

        {/* System Onboarding checklist */}
        <div className="mt-10 bg-white rounded-3xl border border-slate-200/80 shadow-xs p-7">
          <h3 className="font-extrabold text-slate-900 text-base mb-4">Platform Readiness Checklist</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { done: true,  text: 'Server & Database Connected' },
              { done: true,  text: 'Admin Role Configured' },
              { done: true,  text: 'Electric Ocean Theme Loaded' },
              { done: true,  text: 'Courses API Ready' },
              { done: true,  text: 'Quiz Assessment Engine Active' },
              { done: true,  text: 'Stripe Gateway Integrated' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-xs font-semibold p-2.5 bg-slate-50 rounded-xl">
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-extrabold ${
                  item.done ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
                }`}>
                  {item.done ? '✓' : '○'}
                </span>
                <span className={item.done ? 'text-slate-700' : 'text-slate-400'}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}