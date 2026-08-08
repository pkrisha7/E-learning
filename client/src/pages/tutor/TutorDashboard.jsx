import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import Logo from '../../components/Logo';
import SettingsDropdown from '../../components/SettingsDropdown';

const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

export default function TutorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/courses', authHeaders())
      .then(res => {
        const myCourses = res.data.filter(c => c.instructor?._id === user?.id || c.instructor === user?.id);
        setCourses(myCourses);
      })
      .finally(() => setLoading(false));
  }, []);

  const isNewUser = sessionStorage.getItem('isNewUser') === 'true';

  return (
    <div className="min-h-screen page-theme-bg text-slate-900">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Logo size="md" />
          <span className="bg-cyan-100 text-cyan-700 border border-cyan-200 text-xs font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Instructor Portal
          </span>
        </div>
        <SettingsDropdown />
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-sky-600 via-cyan-500 to-indigo-600 rounded-3xl p-8 md:p-10 text-white shadow-xl shadow-sky-500/15 mb-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-2">
              {isNewUser
                ? `Welcome, let's get started, Instructor ${user?.name?.split(' ')[0]}! 👨‍🏫`
                : `Welcome back, Instructor ${user?.name?.split(' ')[0]}! 👨‍🏫`}
            </h2>
            <p className="text-sky-100 text-base md:text-lg">
              You have <strong className="text-white font-bold">{courses.length}</strong> active course{courses.length !== 1 ? 's' : ''} under management.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-10">
          {[
            { label: 'My Courses',     value: courses.length,                                         icon: '📚', bg: 'bg-sky-50 border-sky-100 text-sky-700' },
            { label: 'Published',      value: courses.filter(c => c.isPublished).length,              icon: '✅', bg: 'bg-emerald-50 border-emerald-100 text-emerald-700' },
            { label: 'Total Students', value: courses.reduce((a, c) => a + (c.enrolledCount || 0), 0), icon: '👥', bg: 'bg-cyan-50 border-cyan-100 text-cyan-700' },
          ].map(s => (
            <div key={s.label} className={`rounded-3xl p-6 border shadow-xs ${s.bg}`}>
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="text-3xl font-extrabold">{s.value}</div>
              <div className="text-xs font-semibold uppercase tracking-wider opacity-75 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { to: '/tutor/courses', icon: '📚', title: 'Course Studio',  desc: 'Create, edit & publish video course content' },
            { to: '/tutor/quizzes', icon: '📝', title: 'Quiz Builder',   desc: 'Design quizzes & assessment questions' },
            { to: '/courses',       icon: '🌐', title: 'Catalog Preview', desc: 'Browse live course listing' },
          ].map(item => (
            <Link
              key={item.to}
              to={item.to}
              className="bg-white border border-slate-200/80 rounded-3xl p-7 shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="text-4xl mb-3 p-3 bg-slate-50 w-fit rounded-2xl border border-slate-100 group-hover:scale-110 transition-transform">{item.icon}</div>
                <h3 className="font-extrabold text-slate-900 text-base mb-1 group-hover:text-sky-600 transition-colors">{item.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
              <div className="mt-5 text-sky-600 font-bold text-xs group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Open Studio →
              </div>
            </Link>
          ))}
        </div>

        {/* My Courses */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xl font-extrabold text-slate-900">Your Created Courses</h3>
          <Link to="/tutor/courses" className="text-sky-600 font-bold text-xs hover:underline">
            + Create New Course
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1,2].map(i => <div key={i} className="bg-slate-200 rounded-2xl h-20 animate-pulse"/>)}
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-10 text-center shadow-xs">
            <div className="text-6xl mb-3">📚</div>
            <p className="text-slate-800 font-bold text-lg mb-1">No courses authored yet</p>
            <p className="text-slate-400 text-xs mb-6">Share your knowledge with thousands of students by launching your first course.</p>
            <Link
              to="/tutor/courses"
              className="bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-600 text-white px-7 py-3 rounded-2xl font-bold text-xs hover:shadow-lg transition-all"
            >
              Launch First Course
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {courses.map(course => (
              <div key={course._id} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex items-center justify-between gap-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} className="w-16 h-12 rounded-xl object-cover border border-slate-100"/>
                  ) : (
                    <div className="w-16 h-12 rounded-xl bg-gradient-to-tr from-sky-100 to-cyan-100 flex items-center justify-center text-2xl">📚</div>
                  )}
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">{course.title}</h4>
                    <p className="text-xs font-medium text-slate-400">{course.lessons?.length || 0} Lessons · {course.enrolledCount || 0} Students Enrolled</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs px-3 py-1 rounded-full font-extrabold ${
                    course.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {course.isPublished ? 'Published' : 'Draft'}
                  </span>
                  <Link
                    to="/tutor/courses"
                    className="text-xs font-bold border border-sky-200 text-sky-600 px-4 py-1.5 rounded-full hover:bg-sky-50 transition-colors"
                  >
                    Edit Course
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}