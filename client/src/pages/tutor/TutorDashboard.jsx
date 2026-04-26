import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

export default function TutorDashboard() {
  const { user, logout } = useAuth();
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

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">L</div>
          <span className="text-xl font-bold text-gray-900">LearnHub</span>
          <span className="ml-2 text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-medium">Tutor</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Hi, {user?.name}</span>
          <button onClick={() => { logout(); navigate('/login'); }}
            className="text-sm text-red-400 hover:text-red-600">Logout</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white mb-10">
          <h2 className="text-3xl font-bold mb-1">Welcome, {user?.name?.split(' ')[0]}! 👋</h2>
          <p className="text-purple-200">You have {courses.length} course{courses.length !== 1 ? 's' : ''} published.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {[
            { label: 'My Courses',    value: courses.length,                                         icon: '📚', color: 'bg-purple-50 text-purple-700' },
            { label: 'Published',     value: courses.filter(c => c.isPublished).length,              icon: '✅', color: 'bg-green-50 text-green-700' },
            { label: 'Total Students',value: courses.reduce((a, c) => a + (c.enrolledCount || 0), 0), icon: '👥', color: 'bg-blue-50 text-blue-700' },
          ].map(s => (
            <div key={s.label} className={`rounded-2xl p-5 ${s.color}`}>
              <div className="text-2xl mb-2">{s.icon}</div>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-sm opacity-70 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { to: '/tutor/courses', icon: '📚', title: 'Manage My Courses', desc: 'Create, edit and publish your courses' },
            { to: '/tutor/quizzes', icon: '📝', title: 'Manage Quizzes',    desc: 'Add quizzes to your courses' },
            { to: '/courses',       icon: '🌐', title: 'View All Courses',  desc: 'See all courses on the platform' },
          ].map(item => (
            <Link key={item.to} to={item.to}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition group">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition">{item.title}</h3>
              <p className="text-sm text-gray-400 mt-1">{item.desc}</p>
              <div className="mt-4 text-purple-500 text-sm font-medium">Go →</div>
            </Link>
          ))}
        </div>

        {/* My courses list */}
        <h3 className="text-xl font-bold text-gray-900 mb-4">My Courses</h3>
        {loading ? (
          <div className="space-y-3">
            {[1,2].map(i => <div key={i} className="bg-gray-200 rounded-2xl h-20 animate-pulse"/>)}
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center shadow-sm">
            <div className="text-5xl mb-3">📚</div>
            <p className="text-gray-500 mb-4">You haven't created any courses yet</p>
            <Link to="/tutor/courses"
              className="bg-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-purple-700 transition">
              Create First Course
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {courses.map(course => (
              <div key={course._id} className="bg-white rounded-2xl shadow-sm p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {course.thumbnail
                    ? <img src={course.thumbnail} className="w-14 h-10 rounded-lg object-cover"/>
                    : <div className="w-14 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-xl">📚</div>
                  }
                  <div>
                    <h4 className="font-semibold text-gray-900">{course.title}</h4>
                    <p className="text-sm text-gray-400">{course.lessons?.length || 0} lessons · {course.enrolledCount || 0} students</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium
                    ${course.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {course.isPublished ? 'Published' : 'Draft'}
                  </span>
                  <Link to="/tutor/courses"
                    className="text-xs border border-purple-200 text-purple-600 px-3 py-1.5 rounded-full hover:bg-purple-50 transition">
                    Edit
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