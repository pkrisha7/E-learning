import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

export default function CourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse]       = useState(null);
  const [enrolled, setEnrolled]   = useState(false);
  const [loading, setLoading]     = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    Promise.all([
      axios.get(`http://localhost:5000/api/courses/${id}`),
      user ? axios.get('http://localhost:5000/api/courses/my-enrollments', authHeaders()).catch(() => ({ data: [] })) : Promise.resolve({ data: [] })
    ]).then(([courseRes, enrollRes]) => {
      setCourse(courseRes.data);
      setEnrolled(enrollRes.data.some(e => e.course?._id === id || e.course === id));
    }).finally(() => setLoading(false));
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) { navigate('/login'); return; }
    setEnrolling(true);
    try {
      await axios.post(`http://localhost:5000/api/courses/${id}/enroll`, {}, authHeaders());
      toast.success('Enrolled successfully!');
      setEnrolled(true);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Enrollment failed');
    } finally { setEnrolling(false); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"/>
    </div>
  );

  if (!course) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">Course not found</div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link to="/courses" className="text-xl font-bold text-purple-600">LearnHub</Link>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm text-gray-600 hover:text-purple-600">Dashboard</Link>
              <span className="text-sm font-medium text-gray-700">{user.name}</span>
            </>
          ) : (
            <>
              <Link to="/login"    className="text-sm text-gray-600 hover:text-purple-600">Login</Link>
              <Link to="/register" className="text-sm bg-purple-600 text-white px-4 py-1.5 rounded-lg hover:bg-purple-700">Sign up</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-br from-purple-700 to-indigo-800 text-white py-14 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full">{course.category}</span>
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full capitalize">{course.level}</span>
            {course.isFree && <span className="text-xs bg-green-400/30 px-3 py-1 rounded-full">Free</span>}
          </div>
          <h1 className="text-4xl font-bold mb-3 max-w-2xl">{course.title}</h1>
          <p className="text-purple-200 max-w-2xl mb-6">{course.description}</p>
          <div className="flex flex-wrap gap-6 text-sm text-purple-200">
            <span>👨‍🏫 {course.instructor?.name}</span>
            <span>📚 {course.lessons?.length || 0} lessons</span>
            <span>👥 {course.enrolledCount || 0} students</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left — Curriculum */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Course Curriculum</h2>
            {course.lessons?.length === 0 ? (
              <p className="text-gray-400 text-sm">No lessons added yet.</p>
            ) : (
              <div className="space-y-2">
                {course.lessons?.map((lesson, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition
                    ${enrolled || lesson.freePreview ? 'border-purple-100 bg-purple-50 cursor-pointer hover:bg-purple-100' : 'border-gray-100 bg-gray-50'}`}
                    onClick={() => {
                      if (enrolled) navigate(`/learn/${course._id}/lesson/${lesson._id}`);
                      else if (lesson.freePreview) navigate(`/learn/${course._id}/lesson/${lesson._id}`);
                    }}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0
                      ${enrolled ? 'bg-purple-200 text-purple-700' : 'bg-gray-200 text-gray-500'}`}>
                      {enrolled ? '▶' : lesson.freePreview ? '▶' : '🔒'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{lesson.title}</p>
                      {lesson.description && <p className="text-xs text-gray-400 truncate">{lesson.description}</p>}
                    </div>
                    {lesson.freePreview && !enrolled && (
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full shrink-0">Free</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right — Enrollment Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
            {course.thumbnail && (
              <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover rounded-xl mb-4"/>
            )}
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {course.isFree ? 'Free' : `$${course.price}`}
            </div>
            <p className="text-sm text-gray-400 mb-5">Full lifetime access</p>

            {enrolled ? (
              <button
                onClick={() => navigate(`/learn/${course._id}/lesson/${course.lessons?.[0]?._id}`)}
                className="w-full bg-green-500 text-white py-3 rounded-xl font-semibold hover:bg-green-600 transition mb-3"
              >
                Continue Learning →
              </button>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-50 mb-3"
              >
                {enrolling ? 'Enrolling...' : course.isFree ? 'Enroll Free' : `Enroll for $${course.price}`}
              </button>
            )}

            <div className="space-y-2 text-sm text-gray-500 mt-4">
              <div className="flex items-center gap-2"><span>📚</span> {course.lessons?.length || 0} lessons</div>
              <div className="flex items-center gap-2"><span>🎯</span> <span className="capitalize">{course.level} level</span></div>
              <div className="flex items-center gap-2"><span>♾️</span> Lifetime access</div>
              <div className="flex items-center gap-2"><span>📱</span> Access on any device</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}