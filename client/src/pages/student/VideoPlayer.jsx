import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Logo from '../../components/Logo';

const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

const getYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
  return match ? match[1] : null;
};

export default function VideoPlayer() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse]         = useState(null);
  const [current, setCurrent]       = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [completed, setCompleted]   = useState(false);

  useEffect(() => {
    Promise.all([
      axios.get(`http://localhost:5000/api/courses/${courseId}`),
      axios.get('http://localhost:5000/api/courses/my-enrollments', authHeaders()),
    ]).then(([courseRes, enrollRes]) => {
      const c = courseRes.data;
      setCourse(c);
      const lesson = c.lessons.find(l => l._id === lessonId) || c.lessons[0];
      setCurrent(lesson);
      const enroll = enrollRes.data.find(e =>
        e.course?._id === courseId || e.course === courseId
      );
      setEnrollment(enroll);
    }).catch(() => toast.error('Failed to load course'));
  }, [courseId, lessonId]);

  useEffect(() => {
    if (enrollment && current) {
      const done = enrollment.progress?.find(
        p => p.lessonId === current._id && p.completed
      );
      setCompleted(!!done);
    }
  }, [enrollment, current]);

  const markComplete = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/courses/${courseId}/progress/${current._id}`,
        {}, authHeaders()
      );
      setEnrollment(res.data);
      setCompleted(true);
      toast.success('Lesson marked complete! ✅');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to mark complete');
    }
  };

  const goToLesson = (lesson) => {
    setCurrent(lesson);
    navigate(`/learn/${courseId}/lesson/${lesson._id}`);
  };

  const nextLesson = () => {
    const idx = course.lessons.findIndex(l => l._id === current._id);
    if (idx < course.lessons.length - 1) {
      goToLesson(course.lessons[idx + 1]);
    } else {
      toast('You finished all lessons! 🎉 Take the course quiz to test your skills.');
      navigate(`/quiz/${courseId}`);
    }
  };

  const completedIds = new Set(
    enrollment?.progress?.filter(p => p.completed).map(p => p.lessonId) || []
  );
  const progress = course
    ? Math.round((completedIds.size / course.lessons.length) * 100)
    : 0;

  if (!course || !current) return (
    <div className="flex items-center justify-center h-screen bg-slate-950 text-white">
      <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"/>
    </div>
  );

  const youtubeId = getYouTubeId(current.videoUrl);

  return (
    <div className="flex h-screen bg-slate-950 text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 bg-slate-900 flex flex-col shrink-0 border-r border-slate-800">
        <div className="p-5 border-b border-slate-800">
          <div className="mb-3">
            <Logo size="sm" variant="dark" />
          </div>
          <Link to="/dashboard" className="text-sky-400 text-xs font-semibold hover:underline block mb-2">
            ← Back to Dashboard
          </Link>
          <h2 className="font-bold text-sm text-slate-100 truncate">{course.title}</h2>
          <div className="mt-3">
            <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
              <span>Overall Progress</span>
              <span className="text-sky-400">{progress}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-sky-500 to-cyan-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Lesson list */}
        <div className="overflow-y-auto flex-1 py-2">
          {course.lessons.map((lesson, i) => {
            const isDone    = completedIds.has(lesson._id);
            const isCurrent = current._id === lesson._id;
            return (
              <button
                key={lesson._id}
                onClick={() => goToLesson(lesson)}
                className={`w-full text-left px-4 py-3.5 text-xs font-medium transition-all flex items-start gap-3 ${
                  isCurrent
                    ? 'bg-sky-500/15 border-l-4 border-sky-400 text-white'
                    : 'hover:bg-slate-800/60 border-l-4 border-transparent text-slate-400'
                }`}
              >
                <span
                  className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[11px] shrink-0 font-bold ${
                    isDone
                      ? 'bg-emerald-500 text-white shadow-xs'
                      : isCurrent
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isDone ? '✓' : i + 1}
                </span>
                <span className={`truncate leading-5 font-semibold ${isCurrent ? 'text-white' : 'text-slate-300'}`}>
                  {lesson.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quiz button */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() => navigate(`/quiz/${courseId}`)}
            className="w-full bg-gradient-to-r from-sky-500 to-cyan-500 text-white py-3 rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
          >
            📝 Take Course Quiz
          </button>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
        {/* Video Player Box */}
        <div className="w-full bg-black flex items-center justify-center" style={{ aspectRatio: '16/9', maxHeight: '72vh' }}>
          {youtubeId ? (
            <iframe
              key={current._id}
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&rel=0&modestbranding=1`}
              title={current.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ width: '100%', height: '100%' }}
            />
          ) : current.videoUrl ? (
            <video
              key={current._id}
              src={current.videoUrl}
              controls
              className="w-full h-full"
              onEnded={markComplete}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500">
              <div className="text-center">
                <div className="text-5xl mb-3">🎬</div>
                <p className="text-slate-400 font-medium">No video content configured for this lesson</p>
              </div>
            </div>
          )}
        </div>

        {/* Lesson Info Header & Controls */}
        <div className="flex-1 overflow-y-auto bg-slate-950 p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap max-w-6xl mx-auto">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-white mb-2 truncate">{current.title}</h1>
              {current.description && (
                <p className="text-slate-400 text-sm leading-relaxed max-w-3xl">{current.description}</p>
              )}
            </div>

            <div className="flex gap-3 shrink-0 flex-wrap">
              {completed ? (
                <span className="bg-emerald-950/60 text-emerald-400 px-4 py-2.5 rounded-xl text-xs font-bold border border-emerald-800/80 flex items-center gap-1.5">
                  ✅ Completed
                </span>
              ) : (
                <button
                  onClick={markComplete}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  ✓ Mark Complete
                </button>
              )}

              <button
                onClick={nextLesson}
                className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:shadow-md hover:shadow-cyan-500/20 transition-all"
              >
                Next Lesson →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}