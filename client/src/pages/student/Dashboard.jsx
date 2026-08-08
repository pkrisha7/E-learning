import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import Logo from '../../components/Logo';
import SettingsDropdown from '../../components/SettingsDropdown';

const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/courses/my-enrollments', authHeaders())
      .then(res => setEnrollments(res.data))
      .catch(() => setEnrollments([]))
      .finally(() => setLoading(false));
  }, []);

  const isNewUser = sessionStorage.getItem('isNewUser') === 'true';

  return (
    <div className="min-h-screen page-theme-bg text-slate-900">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <Logo size="md" />
        <SettingsDropdown />
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Welcome Hero Card */}
        <div className="bg-gradient-to-r from-sky-600 via-cyan-500 to-indigo-600 rounded-3xl p-8 md:p-10 text-white shadow-xl shadow-sky-500/15 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-2">
              {isNewUser
                ? `Welcome, let's get started, ${user?.name?.split(' ')[0]}! 👋`
                : `Welcome back, ${user?.name?.split(' ')[0]}! 👋`}
            </h2>
            <p className="text-sky-100 text-base md:text-lg">
              You have <strong className="text-white font-bold">{enrollments.length}</strong> active course{enrollments.length !== 1 ? 's' : ''} in progress. Keep up the momentum!
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
          {[
            { label: 'Enrolled',    value: enrollments.length,                                   icon: '📚', bg: 'bg-sky-50 border-sky-100 text-sky-700' },
            { label: 'Completed',   value: enrollments.filter(e => e.completedAt).length,         icon: '✅', bg: 'bg-emerald-50 border-emerald-100 text-emerald-700' },
            { label: 'In Progress', value: enrollments.filter(e => !e.completedAt).length,        icon: '▶️', bg: 'bg-cyan-50 border-cyan-100 text-cyan-700' },
            { label: 'Certificates',value: enrollments.filter(e => e.certificate).length,        icon: '🎓', bg: 'bg-indigo-50 border-indigo-100 text-indigo-700' },
          ].map(s => (
            <div key={s.label} className={`rounded-2xl p-5 border shadow-xs ${s.bg}`}>
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-3xl font-extrabold">{s.value}</div>
              <div className="text-xs font-semibold uppercase tracking-wider opacity-75 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* My Courses */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-extrabold text-slate-900">My Courses</h3>
          <Link to="/courses" className="text-sky-600 hover:text-sky-700 font-bold text-sm transition-colors">
            Explore All Courses →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="bg-slate-200 rounded-2xl h-60 animate-pulse"/>)}
          </div>
        ) : enrollments.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-slate-800 text-xl font-bold mb-2">No enrolled courses yet</p>
            <p className="text-slate-500 text-sm mb-6 max-w-sm mx-auto">Discover top-rated video courses and start building your future skills today.</p>
            <Link to="/courses" className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-7 py-3.5 rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-sky-500/25 transition-all">
              Browse Course Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map(({ course, progress, completedAt, _id }) => {
              const total     = course?.lessons?.length || 0;
              const completed = progress?.filter(p => p.completed).length || 0;
              const pct       = total > 0 ? Math.round((completed / total) * 100) : 0;
              return (
                <div key={_id} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col justify-between">
                  <div>
                    {course?.thumbnail ? (
                      <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"/>
                    ) : (
                      <div className="w-full h-40 bg-gradient-to-tr from-sky-100 to-cyan-100 flex items-center justify-center text-4xl">📚</div>
                    )}
                    <div className="p-5">
                      <h4 className="font-bold text-slate-900 text-base mb-1 line-clamp-1 group-hover:text-sky-600 transition-colors">{course?.title}</h4>
                      <p className="text-xs text-slate-400 font-medium mb-4">{course?.lessons?.length || 0} Lessons</p>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5">
                          <span>Overall Progress</span>
                          <span className="text-sky-600">{pct}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div className="bg-gradient-to-r from-sky-500 to-cyan-400 h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%` }}/>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 pb-5">
                    {completedAt ? (
                      <span className="w-full block text-center text-xs bg-emerald-100 text-emerald-700 py-2.5 rounded-xl font-bold">
                        ✅ Course Completed
                      </span>
                    ) : (
                      <Link
                        to={`/learn/${course?._id}/lesson/${course?.lessons?.[0]?._id}`}
                        className="block text-center bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-600 text-white py-2.5 rounded-xl text-sm font-bold hover:shadow-md hover:shadow-sky-500/25 transition-all"
                      >
                        {pct > 0 ? 'Continue Lesson →' : 'Start Learning →'}
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}