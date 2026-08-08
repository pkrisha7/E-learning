import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/Logo';

import SettingsDropdown from '../../components/SettingsDropdown';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
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
      axios.get(`${API}/courses/${id}`),
      user ? axios.get(`${API}/courses/my-enrollments`, authHeaders()).catch(() => ({ data: [] })) : Promise.resolve({ data: [] })
    ]).then(([courseRes, enrollRes]) => {
      setCourse(courseRes.data);
      setEnrolled(enrollRes.data.some(e => e.course?._id === id || e.course === id));
    }).finally(() => setLoading(false));
  }, [id, user]);

  const handleEnroll = async () => {
    if (!user) { navigate('/login'); return; }
    setEnrolling(true);
    try {
      if (course.isFree) {
        await axios.post(`${API}/courses/${id}/enroll`, {}, authHeaders());
        toast.success('Enrolled successfully!');
        setEnrolled(true);
      } else {
        const res = await axios.post(`${API}/payments/checkout/${id}`, {}, authHeaders());
        if (res.data.free) {
          toast.success('Enrolled successfully!');
          setEnrolled(true);
        } else if (res.data.url) {
          window.location.href = res.data.url;
        }
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Enrollment failed');
    } finally { setEnrolling(false); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"/>
    </div>
  );

  if (!course) return (
    <div className="min-h-screen flex items-center justify-center text-slate-400 bg-slate-50">Course not found</div>
  );

  return (
    <div className="min-h-screen page-theme-bg text-slate-900">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <Logo size="md" />

        <div className="flex gap-4 items-center">
          {user ? (
            <SettingsDropdown />
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors">Login</Link>
              <Link to="/register" className="text-sm bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-4 py-2 rounded-xl font-bold hover:shadow-md hover:shadow-sky-500/20 transition-all">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white py-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="flex flex-wrap gap-2.5 mb-4">
            <span className="text-xs font-bold bg-sky-500/30 text-sky-200 border border-sky-400/30 px-3 py-1 rounded-full">{course.category}</span>
            <span className="text-xs font-bold bg-slate-700/60 text-slate-300 px-3 py-1 rounded-full capitalize">{course.level}</span>
            {course.isFree && <span className="text-xs font-bold bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 px-3 py-1 rounded-full">Free</span>}
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 max-w-3xl leading-tight tracking-tight">{course.title}</h1>
          <p className="text-sky-100/80 max-w-3xl mb-6 text-base leading-relaxed">{course.description}</p>

          <div className="flex flex-wrap gap-6 text-xs md:text-sm font-medium text-sky-200/90 border-t border-slate-800/80 pt-4">
            <span>👨‍🏫 Instructor: <strong className="text-white font-bold">{course.instructor?.name}</strong></span>
            <span>📚 Lessons: <strong className="text-white font-bold">{course.lessons?.length || 0}</strong></span>
            <span>👥 Enrolled Students: <strong className="text-white font-bold">{course.enrolledCount || 0}</strong></span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left — Curriculum */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-7">
            <h2 className="text-xl font-extrabold text-slate-900 mb-5">Course Curriculum</h2>
            {course.lessons?.length === 0 ? (
              <p className="text-slate-400 text-sm italic">No lessons added yet.</p>
            ) : (
              <div className="space-y-3">
                {course.lessons?.map((lesson, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                      enrolled || lesson.freePreview
                        ? 'border-sky-200 bg-sky-50/50 cursor-pointer hover:bg-sky-100/60'
                        : 'border-slate-200/70 bg-slate-50/60'
                    }`}
                    onClick={() => {
                      if (enrolled || lesson.freePreview)
                        navigate(`/learn/${course._id}/lesson/${lesson._id}`);
                    }}
                  >
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                        enrolled ? 'bg-sky-500 text-white shadow-xs' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {enrolled ? '▶' : lesson.freePreview ? '▶' : '🔒'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{lesson.title}</p>
                      {lesson.description && (
                        <p className="text-xs text-slate-500 truncate mt-0.5">{lesson.description}</p>
                      )}
                    </div>

                    {lesson.freePreview && !enrolled && (
                      <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full shrink-0">Free Preview</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right — Enrollment Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sticky top-24">
            {course.thumbnail && (
              <img src={course.thumbnail} alt={course.title} className="w-full h-44 object-cover rounded-2xl mb-5"/>
            )}

            <div className="text-3xl font-extrabold text-slate-900 mb-1">
              {course.isFree ? 'Free' : `Rs. ${course.price.toLocaleString('en-IN')}`}
            </div>
            <p className="text-xs font-semibold text-slate-400 mb-6 uppercase tracking-wider">Full Lifetime Access Included</p>

            {enrolled ? (
              <button
                onClick={() => navigate(`/learn/${course._id}/lesson/${course.lessons?.[0]?._id}`)}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3.5 rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-emerald-500/25 transition-all mb-4"
              >
                Continue Learning →
              </button>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="w-full bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-600 text-white py-3.5 rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-sky-500/25 transition-all disabled:opacity-50 mb-4"
              >
                {enrolling ? 'Enrolling...' : course.isFree ? 'Enroll Free Now' : `Enroll for Rs. ${course.price.toLocaleString('en-IN')}`}
              </button>
            )}

            <div className="space-y-3 text-xs font-medium text-slate-600 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2.5"><span>📚</span> {course.lessons?.length || 0} Video Lessons</div>
              <div className="flex items-center gap-2.5"><span>🎯</span> <span className="capitalize">{course.level} Level</span></div>
              <div className="flex items-center gap-2.5"><span>♾️</span> Lifetime Access</div>
              <div className="flex items-center gap-2.5"><span>📱</span> Access on Mobile & Desktop</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}